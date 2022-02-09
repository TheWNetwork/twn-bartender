module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps : [
        {
            name      : 'TWNBartender',
            script    : './handler.js',
            watch     : true,
            env: {
            },
        },
    ],
};
