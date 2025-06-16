const nodemailer = require('nodemailer');
const config = require('../config/config');
const log = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport(config.email.smtp);
  }

  async sendDoctorAvailableNotification(cupoInfo) {
    const mailOptions = {
      from: config.email.from,
      to: config.email.users.join(', '),
      subject: `🩺 CUPO DISPONIBLE: ${cupoInfo.name} - Estado: ${cupoInfo.estado}`,
      html: `
        <h2>¡El cupo ha cambiado de estado!</h2>
        <p><strong>Doctor:</strong> ${cupoInfo.name}</p>
        <p><strong>Cupo ID:</strong> ${cupoInfo.cupoId}</p>
        <p><strong>Estado actual:</strong> <span style="color: green; font-weight: bold;">${cupoInfo.estado}</span></p>
        <p><strong>Tiempo de comprobación:</strong> ${new Date().toLocaleString('es-ES')}</p>
        <br>
        <p><a href="${cupoInfo.url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ver en SERGAS</a></p>
        <br>
        <p style="color: #666; font-size: 12px;">Accede al enlace para más información sobre el cupo.</p>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      log.info(`Email sent successfully to: ${config.email.users.join(', ')}`);
      return true;
    } catch (error) {
      log.error(`Failed to send email: ${error.message}`);
      return false;
    }
  }

  async sendStartupNotification(doctorsToMonitor) {
    const doctorsList = doctorsToMonitor.map(id => `• Cupo ID: ${id}`).join('\n');
    
    const mailOptions = {
      from: config.email.from,
      to: config.email.admins.join(', '),
      subject: `🚀 Monitor SERGAS Iniciado - López Pan`,
      html: `
        <h2>🩺 Monitor SERGAS Activado</h2>
        <p>El sistema de monitoreo de cupos del SERGAS ha sido iniciado correctamente.</p>
        
        <h3>📋 Cupos monitoreados:</h3>
        <ul>
          ${doctorsToMonitor.map(id => `<li>Cupo ID: <strong>${id}</strong></li>`).join('')}
        </ul>
        
        <h3>⚙️ Configuración:</h3>
        <p><strong>Intervalo de verificación:</strong> ${config.sergas.checkInterval} minutos</p>
        <p><strong>Fecha de inicio:</strong> ${new Date().toLocaleString('es-ES')}</p>
        
        <h3>📧 Notificaciones:</h3>
        <p>Recibirás un email automáticamente cuando:</p>
        <ul>
          <li>✅ Un cupo cambie de estado (ej: de PECHADO a LIBRE)</li>
          <li>📱 Se detecte cualquier cambio en el estado de los cupos</li>
        </ul>
        
        <br>
        <p style="color: #28a745; font-weight: bold;">🟢 El monitor está ahora ACTIVO y funcionando</p>
        <p style="color: #666; font-size: 12px;">Este sistema monitoreará automáticamente los cupos del SERGAS y te notificará de cualquier cambio.</p>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      log.success(`Email de inicio enviado correctamente a: ${config.email.admins.join(', ')}`);
      return true;
    } catch (error) {
      log.error(`Error al enviar email de inicio: ${error.message}`);
      return false;
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      log.info('Email service connection verified');
      return true;
    } catch (error) {
      log.error(`Email service connection failed: ${error.message}`);
      return false;
    }
  }
}

module.exports = EmailService;