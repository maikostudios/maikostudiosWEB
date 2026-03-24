/**
 * Chatbot Routes - /api/chatbot/*
 * MaikoBot - conversaciones con IA
 */
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, requireAdmin } = require('../middlewares/auth.middleware');

const prisma = new PrismaClient();

const MAX_STRIKES = 5;
const MAX_AI_RESPONSES = 20;

/**
 * POST /api/chatbot/conversation
 * Iniciar nueva conversación
 */
router.post('/conversation', async (req, res) => {
  try {
    const { visitorName } = req.body;

    if (!visitorName || visitorName.trim().length < 2) {
      return res.status(400).json({ error: 'Nombre inválido. Ingresa al menos 2 caracteres.' });
    }

    const cleanName = visitorName.trim().substring(0, 100);
    const hora = new Date().getHours();
    let saludo = '¡Hola!';
    if (hora < 12) saludo = '¡Buenos días!';
    else if (hora < 20) saludo = '¡Buenas tardes!';
    else saludo = '¡Buenas noches!';

    const welcomeMessage = `${saludo}, ${cleanName}! 👋 Soy MaikoBot, el asistente virtual de Maikostudios.\n\nPuedo contarte sobre nuestros servicios, precios y proyectos. ¿En qué puedo ayudarte hoy?`;

    const conversation = await prisma.chatbotConversation.create({
      data: {
        visitorName: cleanName,
        status: 'active',
        strikesRemaining: MAX_STRIKES,
        aiResponsesUsed: 0,
        conversationLog: [
          { role: 'bot', content: welcomeMessage, timestamp: new Date().toISOString() },
        ],
        metadata: { startedAt: new Date().toISOString() },
      },
    });

    res.status(201).json({
      success: true,
      conversationId: conversation.id,
      welcomeMessage,
      visitorName: cleanName,
    });
  } catch (err) {
    console.error('Error al crear conversación:', err);
    res.status(500).json({ error: 'Error al crear conversación' });
  }
});

/**
 * POST /api/chatbot/message
 * Enviar mensaje en una conversación existente
 */
router.post('/message', async (req, res) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({ error: 'conversationId y message son requeridos' });
    }

    const conversation = await prisma.chatbotConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversación no encontrada' });
    }

    if (conversation.status === 'finished' || conversation.status === 'blocked') {
      return res.status(400).json({ error: 'Esta conversación ha finalizado' });
    }

    // Verificar strikes
    if (conversation.strikesRemaining <= 0) {
      return res.json({
        success: true,
        response: '⚠️ Lo siento, no hemos podido comunicarnos bien. Contáctanos directamente:\n📱 WhatsApp: +56 9 2064 8446\n✉️ Email: contacto@maikostudios.com',
        status: 'finished',
      });
    }

    // Obtener respuesta de IA desde el backend
    const botResponse = await getBotResponse(message, conversation);

    // Actualizar log de conversación
    const currentLog = Array.isArray(conversation.conversationLog) ? conversation.conversationLog : [];
    const updatedLog = [
      ...currentLog,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'bot', content: botResponse.text, timestamp: new Date().toISOString() },
    ];

    // Actualizar conversación en BD
    const updates = {
      conversationLog: updatedLog,
      aiResponsesUsed: conversation.aiResponsesUsed + 1,
      strikesRemaining: botResponse.deductStrike
        ? conversation.strikesRemaining - 1
        : conversation.strikesRemaining,
      updatedAt: new Date(),
    };

    // Capturar datos de contacto si el usuario los proporcionó
    if (botResponse.phone) updates.phone = botResponse.phone;
    if (botResponse.email) updates.email = botResponse.email;
    if (botResponse.finished) updates.status = 'finished';
    if (botResponse.derivedToHuman) updates.derivedToHuman = true;

    await prisma.chatbotConversation.update({
      where: { id: conversationId },
      data: updates,
    });

    res.json({
      success: true,
      response: botResponse.text,
      status: botResponse.finished ? 'finished' : 'active',
      strikesRemaining: updates.strikesRemaining,
    });
  } catch (err) {
    console.error('Error al procesar mensaje del chatbot:', err);
    res.status(500).json({ error: 'Error al procesar mensaje' });
  }
});

/**
 * GET /api/chatbot/conversations
 * Listar conversaciones (admin)
 */
router.get('/conversations', authenticate, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = status ? { status } : {};

    const [conversations, total] = await Promise.all([
      prisma.chatbotConversation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
        select: {
          id: true, visitorName: true, phone: true, email: true,
          country: true, status: true, strikesRemaining: true,
          aiResponsesUsed: true, derivedToHuman: true, createdAt: true, updatedAt: true,
        },
      }),
      prisma.chatbotConversation.count({ where }),
    ]);

    res.json({
      success: true,
      data: conversations,
      pagination: { page: parseInt(page), limit: parseInt(limit), total },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener conversaciones' });
  }
});

/**
 * GET /api/chatbot/conversations/:id
 * Detalle de conversación con log completo (admin)
 */
router.get('/conversations/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const conversation = await prisma.chatbotConversation.findUnique({
      where: { id: req.params.id },
    });
    if (!conversation) return res.status(404).json({ error: 'Conversación no encontrada' });
    res.json({ success: true, data: conversation });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener conversación' });
  }
});

// ========================
// Helper: Obtener respuesta del bot
// ========================
async function getBotResponse(message, conversation) {
  const GEMINI_API_KEY = process.env.GEMINI_CHATBOT_API_KEY || process.env.GEMINI_API_KEY;
  const messageLower = message.toLowerCase();

  // Detección de temas ofensivos
  const OFFENSIVE = ['fuck', 'shit', 'mierda', 'puta', 'weon', 'ctm', 'conchatumadre'];
  if (OFFENSIVE.some(w => messageLower.includes(w))) {
    return { text: '⚠️ Por favor mantengamos una conversación respetuosa. ¿En qué puedo ayudarte con nuestros servicios?', deductStrike: true };
  }

  // Detección de información de contacto
  const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
  const phoneRegex = /(?:\+?56|0)?[9][0-9]{8}/;

  if (emailRegex.test(message)) {
    const email = message.match(emailRegex)?.[0];
    return {
      text: `¡Gracias! 📧 Guardé tu email. También puedes contactarnos directamente por WhatsApp: +56 9 2064 8446\n\n¿En qué puedo ayudarte sobre nuestros servicios?`,
      email,
    };
  }

  if (phoneRegex.test(message.replace(/[\s\-\(\)]/g, ''))) {
    const phone = message.match(phoneRegex)?.[0];
    return {
      text: `¡Perfecto! 📱 Guardé tu número. ¿Sobre qué quieres saber de Maikostudios?`,
      phone,
    };
  }

  // Si hay Gemini, usarlo
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'tu_gemini_chatbot_api_key_aqui') {
    try {
      const axios = require('axios');
      const systemContext = `Eres MaikoBot, asistente virtual de Maikostudios (agencia de desarrollo web en Chile).
Servicios: desarrollo web, apps móviles, consultoría TI, automatización con IA, chatbots.
Contacto: +56920648446, contacto@maikostudios.com.
RESPONDE SOLO SOBRE MAIKOSTUDIOS. Si preguntan otra cosa, redirige amablemente.
Sé profesional, amigable, usa emojis moderadamente, responde en español.`;

      const resp = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        { contents: [{ role: 'user', parts: [{ text: `${systemContext}\n\nUsuario: ${message}` }] }] },
        { timeout: 15000 }
      );
      const text = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (text) return { text };
    } catch (err) {
      console.error('Gemini chatbot error:', err.message);
    }
  }

  // Fallback sin IA
  return getFallbackResponse(messageLower);
}

function getFallbackResponse(msg) {
  if (msg.includes('precio') || msg.includes('costo') || msg.includes('cuanto')) {
    return { text: '💰 Tenemos packs desde $290.000 CLP y planes mensuales desde $49.000 CLP. Visita maikostudios.com/precios para ver todos los detalles o escríbenos al +56 9 2064 8446.' };
  }
  if (msg.includes('servicio') || msg.includes('qué hacen') || msg.includes('que hacen')) {
    return { text: '🚀 Ofrecemos: Desarrollo web a medida, apps móviles, consultoría TI, automatización con IA, chatbots, y soporte técnico. ¿Te interesa alguno en particular?' };
  }
  if (msg.includes('contacto') || msg.includes('whatsapp') || msg.includes('hablar') || msg.includes('llamar')) {
    return { text: '📱 Puedes contactarnos:\n- WhatsApp: +56 9 2064 8446\n- Email: contacto@maikostudios.com\n- O llena el formulario de contacto en nuestra web.' };
  }
  return { text: '¡Hola! 👋 Soy MaikoBot. Puedo contarte sobre nuestros servicios de desarrollo web, precios, o conectarte con nuestro equipo. ¿Qué necesitas?' };
}

module.exports = router;
