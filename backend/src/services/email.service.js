/**
 * Email Service - Nodemailer
 * Envío real de notificaciones por email
 */
const nodemailer = require('nodemailer');

// Crear transporter (se reutiliza)
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const config = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  // Solo crear transporter si hay credenciales
  if (!config.auth.user || !config.auth.pass || config.auth.pass === 'tu_app_password_gmail_aqui') {
    console.log('⚠️  SMTP no configurado. Emails deshabilitados. Configura SMTP_USER y SMTP_PASSWORD en .env');
    return null;
  }

  transporter = nodemailer.createTransport(config);
  return transporter;
}

/**
 * Envía notificación de nuevo mensaje de contacto al admin
 */
async function sendContactNotification(message) {
  const t = getTransporter();
  if (!t) return { success: false, reason: 'SMTP not configured' };

  const adminEmail = process.env.EMAIL_ADMIN || 'maikostudios@gmail.com';
  const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  .container { max-width: 600px; background: white; border-radius: 12px; padding: 30px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  .header { background: #121212; color: white; padding: 20px; border-radius: 8px; margin-bottom: 25px; }
  .header h1 { margin: 0; font-size: 22px; color: #00cccc; }
  .field { margin-bottom: 15px; }
  .label { font-weight: bold; color: #555; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
  .value { background: #f9f9f9; padding: 12px; border-radius: 6px; border-left: 3px solid #00cccc; margin-top: 5px; }
  .message-box { background: #f0f8f8; padding: 15px; border-radius: 8px; border: 1px solid #00cccc; white-space: pre-wrap; }
  .footer { margin-top: 25px; color: #999; font-size: 12px; text-align: center; }
  .btn { display: inline-block; background: #00cccc; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 15px; }
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>📩 Nuevo Mensaje de Contacto</h1>
      <p style="margin: 5px 0 0; color: #ccc; font-size: 13px;">MaikoStudios — ${new Date().toLocaleString('es-CL')}</p>
    </div>
    
    <div class="field">
      <div class="label">Nombre</div>
      <div class="value">${escapeHtml(message.name)}</div>
    </div>
    
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:${escapeHtml(message.email)}">${escapeHtml(message.email)}</a></div>
    </div>
    
    ${message.phone ? `<div class="field"><div class="label">Teléfono</div><div class="value">${escapeHtml(message.phone)}</div></div>` : ''}
    ${message.company ? `<div class="field"><div class="label">Empresa</div><div class="value">${escapeHtml(message.company)}</div></div>` : ''}
    ${message.subject ? `<div class="field"><div class="label">Asunto</div><div class="value">${escapeHtml(message.subject)}</div></div>` : ''}
    
    <div class="field">
      <div class="label">Mensaje</div>
      <div class="message-box">${escapeHtml(message.message)}</div>
    </div>
    
    <div style="text-align: center;">
      <a href="mailto:${escapeHtml(message.email)}?subject=RE: ${escapeHtml(message.subject || 'Tu consulta en MaikoStudios')}" class="btn">
        ✉️ Responder directamente
      </a>
    </div>
    
    <div class="footer">
      Mensaje #${message.id} — Fuente: ${message.source || 'web_form'} — MaikoStudios Backend v1.0
    </div>
  </div>
</body>
</html>`;

  try {
    await t.sendMail({
      from: `"MaikoStudios Web" <${fromEmail}>`,
      to: adminEmail,
      subject: `🔔 Nuevo contacto: ${message.name} — ${message.subject || 'Sin asunto'}`,
      html,
      replyTo: message.email,
    });
    console.log(`✅ Email de notificación enviado a ${adminEmail}`);
    return { success: true };
  } catch (err) {
    console.error('❌ Error enviando email:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Envía email de confirmación al contacto
 */
async function sendContactConfirmation(message) {
  const t = getTransporter();
  if (!t) return { success: false, reason: 'SMTP not configured' };

  const fromEmail = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
  <div style="max-width: 600px; background: white; border-radius: 12px; padding: 30px; margin: 0 auto;">
    <div style="background: #121212; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 25px;">
      <h1 style="color: #00cccc; margin: 0;">MaikoStudios</h1>
    </div>
    <h2>¡Hola, ${escapeHtml(message.name)}! 👋</h2>
    <p>Recibimos tu mensaje y te responderemos a la brevedad posible.</p>
    <p><strong>Tu mensaje:</strong></p>
    <div style="background: #f0f8f8; padding: 15px; border-radius: 8px; border-left: 3px solid #00cccc;">${escapeHtml(message.message)}</div>
    <p style="margin-top: 20px;">Mientras tanto, puedes contactarnos directamente:<br>
    📱 <a href="https://wa.me/56920648446">WhatsApp: +56 9 2064 8446</a><br>
    🌐 <a href="https://maikostudios.com">maikostudios.com</a></p>
    <p style="color: #999; font-size: 12px; margin-top: 25px;">— El equipo de MaikoStudios, Temuco, Chile</p>
  </div>
</body></html>`;

  try {
    await t.sendMail({
      from: `"MaikoStudios" <${fromEmail}>`,
      to: message.email,
      subject: '✅ Recibimos tu mensaje — MaikoStudios',
      html,
    });
    return { success: true };
  } catch (err) {
    console.error('Error enviando confirmación:', err.message);
    return { success: false, error: err.message };
  }
}

// Escapa caracteres HTML para evitar XSS en emails
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = { sendContactNotification, sendContactConfirmation };
