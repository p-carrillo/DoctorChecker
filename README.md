# SERGAS Doctor Availability Checker

A Node.js application that monitors doctor availability on the SERGAS (Galician Health Service) website and sends email notifications when specific doctors become available for appointments. Mainly developed to test NodeJs and make some Vivecoding on the way.

## Features

- 🔍 Monitors specific doctors on the SERGAS website
- 📧 Sends email notifications when doctors become available
- 🕐 Configurable check intervals
- 📊 Comprehensive logging
- 🐳 Docker support for easy deployment
- 🔒 Secure configuration with environment variables

## Prerequisites

- Node.js 18+ or Docker
- Gmail account (or other SMTP server) for email notifications
- Doctor URL on to SERGAS website

## Quick Start with Docker

1. Clone the repository:
```bash
git clone <your-repo-url>
cd DoctorChecker
```

2. Create your environment file:
```bash
cp .env.example .env
```

3. Edit `.env` with your configuration:
```bash
nano .env
```

4. Build and run with Docker Compose:
```bash
docker-compose up -d
```

## Manual Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (see Configuration section)

3. Run the application:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Configuration

Create a `.env` file based on `.env.example` and configure the following variables:

### SERGAS Configuration
- `SERGAS_BASE_URL`: Base URL for SERGAS website (default: https://www.sergas.es)
- `CHECK_INTERVAL_MINUTES`: How often to check for availability (default: 15 minutes)
- `DOCTORS_TO_MONITOR`: Comma-separated list of doctor names or IDs to monitor

### Email Configuration
- `SMTP_HOST`: SMTP server hostname (default: smtp.gmail.com)
- `SMTP_PORT`: SMTP server port (default: 587)
- `SMTP_SECURE`: Use SSL/TLS (default: false)
- `SMTP_USER`: Your email address
- `SMTP_PASS`: Your email password or app password
- `ADMIN_EMAILS`: Comma separated emails that will receive the startup notification
- `USER_EMAILS`: Comma separated emails that will receive doctor status updates
- `FROM_EMAIL`: Email address for sending notifications

### Gmail Setup
For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an "App Password" for this application
3. Use the app password in `SMTP_PASS`

## Docker Commands

Build the image:
```bash
docker build -t doctor-checker .
```

Run with docker-compose:
```bash
docker-compose up -d
```

View logs:
```bash
docker-compose logs -f
```

Stop the application:
```bash
docker-compose down
```

## Customization

### Adding New Doctors
Edit the `DOCTORS_TO_MONITOR` environment variable:
```
DOCTORS_TO_MONITOR=Dr. García,Dr. López,Dr. Martínez
```

### Adjusting Check Frequency
Modify `CHECK_INTERVAL_MINUTES` in your `.env` file:
```
CHECK_INTERVAL_MINUTES=10
```

### SERGAS Website Integration
The application includes placeholder code for SERGAS website integration. You'll need to:

1. Analyze the actual SERGAS website structure
2. Update the selectors in `src/services/sergasService.js`
3. Modify the `parseDoctorInfo` method to match the website's HTML structure

## Logs

Logs are stored in the `logs/` directory and also displayed in the console. The application logs:
- Doctor availability checks
- Email notifications sent
- Errors and warnings
- Application startup/shutdown events

## Troubleshooting

### Email Issues
- Verify SMTP credentials
- Check if 2FA is enabled (use app password for Gmail)
- Ensure firewall allows SMTP connections

### SERGAS Website Issues
- The website structure may change, requiring updates to selectors
- Rate limiting may occur with frequent requests
- Consider using proxy rotation for production use

### Docker Issues
- Ensure Docker and Docker Compose are installed
- Check that ports are not in use
- Verify environment file is properly configured

## Development

Run tests:
```bash
npm test
```

Run in development mode:
```bash
npm run dev
```

## Security Considerations

- Never commit `.env` files to version control
- Use app passwords instead of main account passwords
- Consider rate limiting to respect SERGAS servers
- Monitor logs for suspicious activity

## License

ISC License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues related to:
- SERGAS website changes: Update the selectors in the service
- Email configuration: Check your SMTP settings
- Docker deployment: Verify your docker-compose configuration