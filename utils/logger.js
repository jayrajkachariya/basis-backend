const log4js = require('log4js');
log4js.configure({
    appenders: {
        console: { type: 'console' },
        FILE: { type: 'file', filename: 'server.log' },
    },
    categories: {
        development: { appenders: ['console'], level: 'info' },
        production: { appenders: ['FILE'], level: 'info' },
        default: { appenders: ['console'], level: 'info' },
    },
});

const logger = process.env.NODE_ENV === 'production' ?
    log4js.getLogger('production') :
    log4js.getLogger('development');

// const logger = log4js.getLogger('DEV');

module.exports = logger;
