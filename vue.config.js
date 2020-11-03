module.exports = {
    devServer: {
        open: true, //是否自动弹出浏览器页面
        proxy: 'http://localhost:3000',
    }
}