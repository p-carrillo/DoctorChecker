require('dotenv').config();
const EmailService = require('./src/services/emailService');
const log = require('./src/utils/logger');

async function testEmail() {
  log.info('🧪 Iniciando prueba de envío de email a múltiples destinatarios...');
  
  const emailService = new EmailService();
  
  // Primero verificamos la conexión
  log.info('📡 Verificando conexión SMTP...');
  const connectionOk = await emailService.testConnection();
  
  if (!connectionOk) {
    log.error('❌ Error: No se pudo conectar al servidor SMTP');
    return;
  }

  log.success('✅ Conexión SMTP exitosa');
  
  // Ahora enviamos un email de prueba
  log.info('📧 Enviando email de prueba a múltiples destinatarios...');
  
  const testCupoInfo = {
    name: 'Dr. Test - Email Múltiple',
    cupoId: 'TEST123',
    estado: 'DISPONIBLE - PRUEBA MÚLTIPLE',
    url: 'https://www.sergas.es'
  };
  
  const emailSent = await emailService.sendDoctorAvailableNotification(testCupoInfo);
  
  if (emailSent) {
    log.success('✅ Email de prueba enviado correctamente a múltiples destinatarios!');
  } else {
    log.error('❌ Error al enviar el email de prueba');
  }
}

// Ejecutar la prueba
testEmail().catch(err => log.error(err.message));
