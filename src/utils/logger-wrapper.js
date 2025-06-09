// This is a wrapper around the logger to ensure it's always available
let logger = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
  log: console.log
};

export default logger;

// Try to load the real logger
import('../utils/logger.js')
  .then(module => {
    logger = module.default;
  })
  .catch(err => {
    console.warn('Using console as fallback logger:', err.message);
  });
