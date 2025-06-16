require('dotenv').config();

module.exports = {
  sergas: {
    checkInterval: parseInt(process.env.CHECK_INTERVAL_MINUTES) || 15,
    doctorsToMonitor: process.env.DOCTORS_TO_MONITOR ? 
      process.env.DOCTORS_TO_MONITOR.split(',').map(d => d.trim()) : []
  },
  
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    from: process.env.FROM_EMAIL,
    admins: process.env.ADMIN_EMAILS ?
      process.env.ADMIN_EMAILS.split(',').map(email => email.trim()) : [],
    users: process.env.USER_EMAILS ?
      process.env.USER_EMAILS.split(',').map(email => email.trim()) : []
  }
};