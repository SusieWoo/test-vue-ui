const path = require('path')
const name = 'Vue Typescript Test'
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/', // TODO: Remember to change this to fit your need
    lintOnSave: process.env.NODE_ENV === 'development',
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [
                path.resolve(__dirname, 'src/styles/_variables.scss'),
                path.resolve(__dirname, 'src/styles/_mixins.scss')
            ]
        }
    },
    pwa: {
        name: name
    }
};
