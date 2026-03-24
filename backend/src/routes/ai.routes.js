/**
 * AI Proxy Routes - /api/ai/*
 * Proxy seguro para APIs de IA (las keys nunca se exponen al frontend)
 */
const express = require('express');
const router = express.Router();
const axios = require('axios');
const rateLimit = require('express-rate-limit');

// Rate limit para uso de IA (evitar costos excesivos)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 30,
  message: { error: 'Límite de uso de IA alcanzado. Intenta en una hora.' },
});

/**
 * POST /api/ai/gemini
 * Proxy seguro para Gemini API
 */
router.post('/gemini', aiLimiter, async (req, res) => {
  try {
    const { prompt, systemPrompt, model = 'gemini-1.5-flash' } = req.body;

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'tu_gemini_api_key_aqui') {
      return res.status(503).json({ error: 'Servicio de IA no configurado. Agrega GEMINI_API_KEY al .env del backend.' });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es requerido' });
    }

    const combinedPrompt = systemPrompt ? `${systemPrompt}\n\n---\n\n${prompt}` : prompt;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts: [{ text: combinedPrompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 8000 },
      },
      { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
    );

    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!text) {
      return res.status(502).json({ error: 'Gemini no devolvió contenido' });
    }

    res.json({ success: true, text, model, provider: 'gemini' });
  } catch (err) {
    console.error('Error en proxy Gemini:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    res.status(status).json({ error: err.response?.data?.error?.message || 'Error al contactar Gemini' });
  }
});

/**
 * POST /api/ai/openai
 * Proxy seguro para OpenAI API
 */
router.post('/openai', aiLimiter, async (req, res) => {
  try {
    const { messages, model = 'gpt-3.5-turbo', systemPrompt, userMessage, maxTokens = 500 } = req.body;

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'tu_openai_api_key_aqui') {
      return res.status(503).json({ error: 'OpenAI no está configurado. Agrega OPENAI_API_KEY al .env del backend.' });
    }

    // Construir mensajes
    let chatMessages = messages || [];
    if (systemPrompt && chatMessages.length === 0) {
      chatMessages = [{ role: 'system', content: systemPrompt }];
      if (userMessage) chatMessages.push({ role: 'user', content: userMessage });
    }

    if (chatMessages.length === 0) {
      return res.status(400).json({ error: 'Se requieren messages o systemPrompt + userMessage' });
    }

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      { model, messages: chatMessages, max_tokens: maxTokens, temperature: 0.7 },
      {
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        timeout: 30000,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content || '';
    res.json({ success: true, text, model, provider: 'openai' });
  } catch (err) {
    console.error('Error en proxy OpenAI:', err.response?.data || err.message);
    const status = err.response?.status || 500;
    res.status(status).json({ error: err.response?.data?.error?.message || 'Error al contactar OpenAI' });
  }
});

/**
 * POST /api/ai/deepseek
 * Proxy seguro para DeepSeek API
 */
router.post('/deepseek', aiLimiter, async (req, res) => {
  try {
    const { systemPrompt, userMessage, model = 'deepseek-chat' } = req.body;

    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
    if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === 'tu_deepseek_api_key_aqui') {
      return res.status(503).json({ error: 'DeepSeek no está configurado. Agrega DEEPSEEK_API_KEY al .env del backend.' });
    }
    if (!userMessage) return res.status(400).json({ error: 'userMessage es requerido' });

    const messages = [];
    if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
    messages.push({ role: 'user', content: userMessage });

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      { model, messages, temperature: 0.3, max_tokens: 4000 },
      {
        headers: { Authorization: `Bearer ${DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' },
        timeout: 45000,
      }
    );

    const text = response.data?.choices?.[0]?.message?.content || '';
    res.json({ success: true, text, model, provider: 'deepseek' });
  } catch (err) {
    console.error('Error en proxy DeepSeek:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: 'Error al contactar DeepSeek' });
  }
});

/**
 * GET /api/ai/status
 * Verificar qué proveedores están configurados
 */
router.get('/status', async (req, res) => {
  res.json({
    success: true,
    providers: {
      gemini: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'tu_gemini_api_key_aqui'),
      geminiChatbot: !!(process.env.GEMINI_CHATBOT_API_KEY && process.env.GEMINI_CHATBOT_API_KEY !== 'tu_gemini_chatbot_api_key_aqui'),
      openai: !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'tu_openai_api_key_aqui'),
      deepseek: !!(process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== 'tu_deepseek_api_key_aqui'),
    },
  });
});

module.exports = router;
