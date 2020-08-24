import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import website from '@/config/website';
import 'nprogress/nprogress.css' // progress bar style
import { Base64 } from 'js-base64';
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    config.headers['Authorization'] = `Basic ${Base64.encode("saber:saber_secret")}`;

    //如果是get请求，需要在参数中添加时间戳，防止浏览器取缓存数据
    if (config && config.method && config.method == 'get') {
      var params = config.params;
      if (params) {//如果参数不为空，直接在参数中新增一个时间戳
        params.r = new Date().getTime();
      } else {//如果参数为空，新增一个时间戳的参数
        params = { r: new Date().getTime() };
      }
      config.params = params;
    }

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Chain-Auth'] = 'bearer ' + store.getters.token // 让每个请求携带token--['Authorization']为自定义key 请根据实际情况自行修改

      //config.headers['X-Token'] = getToken() // 原来的代码，上面几行代码，在源代码中就是被注释掉的
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response
    const headers = response.headers
    NProgress.done();

    const status = res.data.code || 200
    const statusWhiteList = website.statusWhiteList || [];

    if ( res.data.msg  == "请求未授权" ){
      res.data.msg = "请登录系统";
    }
    const message = res.data.msg || '未知错误';
    //如果在白名单里则自行catch逻辑处理
    if (statusWhiteList.includes(status)) return Promise.reject(res);
    //如果是401则跳转到登录页面
    if (status === 401) {
      store.dispatch('FedLogOut').then(() =>
        router.push({ path: '/login' }));
    }
    //else
    if (status !== 200) {
      Message({
        message: message,
        type: 'error'
      })
      return Promise.reject(new Error(message))
    } else {
      if(headers['content-type']==='application/vnd.ms-excel;charset=UTF-8'){
        return res.data;
      }
      return res;
    }
  },
  error => {
    NProgress.done();
    let code,msg;
    //console.log("------------------")
    // console.log(error.response.data)
    // const headers = error.response.headers
    if(error.response.data instanceof ArrayBuffer){
      const info = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(error.response.data)))
      code = info.code;
      msg = info.msg;
    }else if(typeof error.response.data == "string"){
      code = error.response.status
      msg = error.response.data
    }else{
      code = error.response.data.code
      msg= error.response.data.msg
    }
    Message({
      message: "错误信息：【"+code+"】"+msg,
      type: 'error'
    })
    return Promise.reject(new Error(error));
  }
)

export default service
