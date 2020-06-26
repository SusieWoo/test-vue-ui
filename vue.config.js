const path = require('path');
const name = 'Vue Typescript Test';
module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/', // TODO
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
    css:{
        sourceMap:true,
        extract:false
    },
    chainWebpack: config => {
        // 修复HMR
        config.resolve.symlinks(true);
    }
}
