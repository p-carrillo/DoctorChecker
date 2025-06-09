const cron = require('node-cron');
const config = require('./config/config');
const EmailService = require('./services/emailService');
const SergasService = require('./services/sergasService');

// Simple logger
const log = {
  info: (msg) => console.log(`[${new Date().toLocaleTimeString('es-ES')}] ${msg}`),
  error: (msg) => console.error(`[${new Date().toLocaleTimeString('es-ES')}] ❌ ${msg}`),
  success: (msg) => console.log(`[${new Date().toLocaleTimeString('es-ES')}] ✅ ${msg}`)
};

class DoctorChecker {
  constructor() {
    this.emailService = new EmailService();
    this.sergasService = new SergasService();
    this.isRunning = false;
  }

  async start() {
    log.info('Iniciando SERGAS Monitor');
    
    // Validate email configuration first
    const emailConnectionOk = await this.emailService.testConnection();
    
    if (!emailConnectionOk) {
      log.error('Conexión email fallida');
      process.exit(1);
    }
    
    log.success('Email conectado');
    
    // Validate configuration
    if (!config.sergas.doctorsToMonitor.length) {
      log.error('No hay cupos configurados');
      process.exit(1);
    }

    log.info(`Monitoreando: ${config.sergas.doctorsToMonitor.join(', ')} | Intervalo: ${config.sergas.checkInterval}min`);
    log.info(`Emails: ${config.email.to.join(', ')}`);

    // Send startup notification email
    const startupEmailSent = await this.emailService.sendStartupNotification(config.sergas.doctorsToMonitor);
    
    if (startupEmailSent) {
      log.success('Email de inicio enviado');
    }

    // Start the cron job
    this.startScheduledChecks();
    
    // Perform initial check
    await this.checkCupos();

    this.isRunning = true;
    log.success('Monitor activo');
  }

  startScheduledChecks() {
    const cronPattern = `*/${config.sergas.checkInterval} * * * *`;
    
    cron.schedule(cronPattern, async () => {
      if (this.isRunning) {
        await this.checkCupos();
      }
    });
  }

  async checkCupos() {
    try {
      const availableCupos = await this.sergasService.checkAllMonitoredCupos();
      
      if (availableCupos.length > 0) {
        for (const cupo of availableCupos) {
          log.success(`CAMBIO DETECTADO: ${cupo.name} - ${cupo.estado}`);
          
          const emailSent = await this.emailService.sendDoctorAvailableNotification(cupo);
          
          if (emailSent) {
            log.success('Email notificación enviado');
          } else {
            log.error('Error enviando email');
          }
        }
      }
      
    } catch (error) {
      log.error(`Error verificación: ${error.message}`);
    }
  }

  async stop() {
    log.info('Deteniendo SERGAS Cupo Checker application');
    this.isRunning = false;
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  log.info('Received SIGINT, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  log.info('Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

// Start the application
const app = new DoctorChecker();
app.start().catch(error => {
  log.error('Failed to start application:', error.message);
  process.exit(1);
});