const CompressionWebpackPlugin = require("compression-webpack-plugin");
const zopfli = require("@gfx/zopfli");
const BrotliPlugin = require("brotli-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

const isProd = ["production", "prod"].includes(process.env.NODE_ENV);

const externals = {
    vue: "Vue",
    "vue-router": "VueRouter",
    axios: "axios",
    "element-ui": "ELEMENT",
};

const cdn = {
    // 开发环境
    dev: {
        css: [],
        js: []
    },
    // 生产环境
    production: {
        css: [
            "https://cdn.jsdelivr.net/npm/element-ui@2.14.0/lib/theme-chalk/index.css"
        ],
        js: [
            "https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js",
            "https://cdn.jsdelivr.net/npm/vue-router@3.2.0/dist/vue-router.min.js",
            "https://cdn.jsdelivr.net/npm/axios@0.21.0/dist/axios.min.js",
            "https://cdn.jsdelivr.net/npm/element-ui@2.14.0/lib/index.js"
        ]
    }
};

module.exports = {
    devServer: {
        proxy: 'http://localhost:3000'
    },
    productionSourceMap: false,
    lintOnSave: false,
    publicPath: isProd ? "./" : "/",
    configureWebpack: config => {
        const plugins = [];
        if (isProd) {
            // 为生产环境修改配置...
            //externals里的模块不打包
            Object.assign(config, {
                externals: externals
            });
            plugins.push(
                new CompressionWebpackPlugin({
                    algorithm(input, compressionOptions, callback) {
                        return zopfli.gzip(input, compressionOptions, callback);
                    },
                    compressionOptions: {
                        numiterations: 15
                    },
                    minRatio: 0.99,
                    test: productionGzipExtensions
                })
            );
            plugins.push(
                new BrotliPlugin({
                    test: productionGzipExtensions,
                    minRatio: 0.99
                })
            );
        } else {
            // 为开发环境修改配置...
        }
        config.plugins = [...config.plugins, ...plugins];
    },
    chainWebpack: config => {
        // 对vue-cli内部的 webpack 配置进行更细粒度的修改
        config.plugin("html").tap(args => {
            // console.log("config", config);
            // console.log("args", args);
            if (isProd) {
                args[0].cdn = cdn.production;
            } else {
                args[0].cdn = cdn.dev;
            }
            return args;
        });
    }
};
