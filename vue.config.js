const path = require('path');
module.exports = {
    // 默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/。
    publicPath: process.env.NODE_ENV === 'production' ? '' : '/', //
    // eslint-loader 是否在保存的时候检查
    lintOnSave: process.env.NODE_ENV === 'development',
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: true,
    // 构建时开启多进程处理 babel 编译.该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
    parallel: require('os').cpus().length > 1,
    /* webpack-dev-server 相关配置 */
    devServer: {
        // 设置热替换
        disableHostCheck: true,//webpack4.0 开启热更新
        /* 自动打开浏览器 */
        open: true,
        /* 设置为0.0.0.0则所有的地址均能访问 */
        host: '0.0.0.0',
        port: 8066,
        /*todo 是否开启https*/
        https: false,
        hotOnly: false,
        /* 使用代理 todo 目前可用于区分车厂和云端
        * 后台配置了允许跨域时的配置步骤（侧重接口问题处理）
        * 后台未设置允许跨域请求时（侧重路径问题处理）
        * */
        proxy: {
            '/car1': {
                /* 目标代理服务器地址 */
                target: 'http://yun/',
                /* 允许跨域 */
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '/test': '/car1'
                },
            },
            '/car2': {
                /* 目标代理服务器地址 */
                target: 'http://yun/',
                /* 允许跨域 */
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '/test': '/car2'
                },
            },
        },
    },
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
    }
}
