module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: process.env.NODE_ENV === 'development',
    productionSourceMap: false,
    chainWebpack(config) {
        config
            .when(process.env.NODE_ENV === 'production',
                config => {
                    config.set('externals', {
                        'vue': 'Vue',
                        'vue-router': 'VueRouter',
                        'axios': 'axios'
                    })
                    config.optimization.runtimeChunk('single')
                }
            )
    }
}
