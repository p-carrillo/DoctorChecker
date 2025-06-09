require('dotenv').config();
const EmailService = require('./src/services/emailService');

async function testEmail() {
  console.log('🧪 Iniciando prueba de envío de email a múltiples destinatarios...');
  
  const emailService = new EmailService();
  
  // Primero verificamos la conexión
  console.log('📡 Verificando conexión SMTP...');
  const connectionOk = await emailService.testConnection();
  
  if (!connectionOk) {
    console.log('❌ Error: No se pudo conectar al servidor SMTP');
    return;
  }
  
  console.log('✅ Conexión SMTP exitosa');
  
  // Ahora enviamos un email de prueba
  console.log('📧 Enviando email de prueba a múltiples destinatarios...');
  
  const testCupoInfo = {
    name: 'Dr. Test - Email Múltiple',
    cupoId: 'TEST123',
    estado: 'DISPONIBLE - PRUEBA MÚLTIPLE',
    url: 'https://www.sergas.es'
  };
  
  const emailSent = await emailService.sendDoctorAvailableNotification(testCupoInfo);
  
  if (emailSent) {
    console.log('✅ Email de prueba enviado correctamente a múltiples destinatarios!');
  } else {
    console.log('❌ Error al enviar el email de prueba');
  }
}

// Ejecutar la prueba
testEmail().catch(console.error);