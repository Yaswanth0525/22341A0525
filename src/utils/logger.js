import axios from 'axios';

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

const sendLog = async (level, packageName, message) => {
  try {
    const logData = {
      stack: 'frontend',
      level: level.toLowerCase(),
      package: packageName,
      message,
    };
    await axios.post(LOG_API_URL, logData);
  } catch (error) {
    console.error('Logging failed:', error);
  }
};

export default {
  debug: (p, m) => sendLog('debug', p, m),
  info: (p, m) => sendLog('info', p, m),
  warn: (p, m) => sendLog('warn', p, m),
  error: (p, m) => sendLog('error', p, m),
  fatal: (p, m) => sendLog('fatal', p, m),
};
