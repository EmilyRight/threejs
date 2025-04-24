const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');
const { internalIpV4 } = require('internal-ip');
const portFinderSync = require('portfinder-sync');

const infoColor = (_message) => {
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`;
};

module.exports = merge(commonConfiguration, {
    mode: 'development',
    devServer: {
        host: '0.0.0.0',
        port: portFinderSync.getPort(8080),
        static: {
            directory: './dist',
            watch: true,
        },
        open: true,
        server: {
            type: 'http',
        },
        allowedHosts: 'all',
        client: {
            overlay: true,
            logging: 'none',
        },
        // Вместо after используем onListening
        onListening: async function (devServer) {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            const port = devServer.server.address().port;
            const isHttps = devServer.options.server?.type === 'https' ? 's' : '';

            // Используем асинхронный API для internal-ip в новых версиях
            const localIp = (await internalIpV4()) || 'localhost';
            const domain1 = `http${isHttps}://${localIp}:${port}`;
            const domain2 = `http${isHttps}://localhost:${port}`;

            console.log(
                `Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`
            );
        },
    },
});
