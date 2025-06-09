const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config/config');

// Simple logger
const log = {
  info: (msg) => console.log(`[${new Date().toLocaleTimeString('es-ES')}] ${msg}`),
  error: (msg) => console.error(`[${new Date().toLocaleTimeString('es-ES')}] ❌ ${msg}`),
  success: (msg) => console.log(`[${new Date().toLocaleTimeString('es-ES')}] ✅ ${msg}`)
};

class SergasService {
  constructor() {
    this.lastCheckedStatus = new Map();
  }

  async checkCupoStatus(cupoId) {
    try {
      const url = `https://tsinternet.sergas.es/TSInternet/ConsultaHorariosMedicos.servlet?CUPO=${cupoId}`;
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Mobile Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3'
        },
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      const doctorInfo = this.parseDoctorInfo($, cupoId);
      
      if (doctorInfo) {
        const currentStatus = doctorInfo.estado;
        const previousStatus = this.lastCheckedStatus.get(cupoId);
        
        this.lastCheckedStatus.set(cupoId, currentStatus);
        
        // Check if status changed
        if (currentStatus !== previousStatus && previousStatus !== undefined) {
          log.success(`Cupo ${cupoId}: ${previousStatus} → ${currentStatus}`);
          return doctorInfo;
        }
        
        // Only log first check or when different from PECHADO
        if (previousStatus === undefined) {
          log.info(`Cupo ${cupoId}: ${doctorInfo.name} - ${currentStatus}`);
        }
      }
      
      return null;
    } catch (error) {
      log.error(`Cupo ${cupoId}: ${error.message}`);
      return null;
    }
  }

  parseDoctorInfo($, cupoId) {
    try {
      // Extract doctor name from input field
      const doctorName = $('input[name="nomemedico"]').val() || 'Unknown Doctor';
      
      // Extract cupo status - look for input fields that contain the status
      let estado = 'UNKNOWN';
      
      // Find all input fields and look for one that contains status keywords
      $('input[type="text"]').each((i, element) => {
        const value = $(element).val();
        if (value && (value === 'PECHADO' || value === 'ABERTO' || value === 'LIBRE' || value === 'DISPONIBLE')) {
          estado = value.trim();
          return false; // break the loop
        }
      });
      
      // If not found, try to find by context (looking for text near "Estado do cupo:")
      if (estado === 'UNKNOWN') {
        const bodyText = $('body').text();
        const estadoMatch = bodyText.match(/Estado\s+do\s+cupo:\s*([A-ZÁÉÍÓÚÑ]+)/i);
        if (estadoMatch) {
          estado = estadoMatch[1].trim();
        }
      }
      
      console.log(`Parsed doctor info - Name: ${doctorName}, Estado: ${estado}`);
      
      return {
        cupoId,
        name: doctorName,
        estado,
        isAvailable: estado !== 'PECHADO',
        url: `https://tsinternet.sergas.es/TSInternet/ConsultaHorariosMedicos.servlet?CUPO=${cupoId}`
      };
      
    } catch (error) {
      console.error('Error parsing doctor info:', error.message);
      return null;
    }
  }

  async checkAllMonitoredCupos() {
    const availableCupos = [];
    
    for (const cupoId of config.sergas.doctorsToMonitor) {
      console.log(`Checking cupo: ${cupoId}`);
      
      const cupoInfo = await this.checkCupoStatus(cupoId);
      if (cupoInfo) {
        availableCupos.push(cupoInfo);
      }
      
      // Add delay between requests to be respectful to the server
      await this.delay(3000);
    }
    
    return availableCupos;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = SergasService;