import axios from "axios";

// 创建一个axios实例
const instance = axios.create({
    baseURL: "http://localhost:3000" || process.env.API_URL,
    timeout: 30000
});

// 给实例添加一个setToken方法，用于登录后将最新token动态添加到header，同时将token保存在sessionStorage中
instance.setToken = token => {
    console.log("设置新 token")
    instance.defaults.headers.Authorization = "Bearer " + token;
    window.sessionStorage.setItem("accessToken", token);
};

function refreshToken() {
    // instance是当前request.js中已创建的axios实例
    console.log("请求刷新 token")
    return instance.post("/token", {token: window.sessionStorage.getItem("refreshToken")}).then(res => res);
}

// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let retryRequests = [];
// 请求后拦截 axios.interceptors.request.use()
instance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response.status === 401) {
            // config是为请求提供的配置信息
            const config = error.response.config;
            if (!isRefreshing) {
                isRefreshing = true;
                return refreshToken().then(res => {
                    const {accessToken} = res.data;
                    console.log("获取 token 成功")
                    instance.setToken(accessToken);
                    config.headers.Authorization = "Bearer " + accessToken;
                    // 注意： 原请求已经将baseURL进行拼接，此处不要重复拼接
                    config.baseURL = "";
                    // 将队列中的请求进行重试
                    retryRequests.forEach(cb => cb(accessToken));
                    retryRequests = [];
                    return instance(config);
                }).catch(res => {
                    console.error("刷新 token 失败", res);
                    window.location.href = "/";
                }).finally(() => {
                    // 保证下次刷新能够正常进入
                    isRefreshing = false;
                });
            } else {
                // 正在刷新token，将返回一个未执行resolve的promise
                console.log("正在刷新token，将返回一个未执行resolve的promise")
                return new Promise(resolve => {
                    // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                    retryRequests.push(token => {
                        config.baseURL = "";
                        config.headers.Authorization = "Bearer " + token;
                        resolve(instance(config));
                    });
                });
            }
        }
        return Promise.reject(error);
    }
);

instance.interceptors.request.use(config => {
    config.headers.Authorization = "Bearer " + window.sessionStorage.getItem("accessToken")
    return config;
}, function (error) {
    return Promise.reject(error)
});

export default instance;