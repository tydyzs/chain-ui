import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../public/cdn/iconfont/iconfont.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import Blob from '../public/Blob.js' // download excel

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 导入 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 引入echarts
import echarts from 'echarts'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.use(VueQuillEditor)

// Vue.use(Blob)
// 全局挂载echarts
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

// 数字千分位过滤器
Vue.filter('NumFormat', function (value) {
  if (!value) return '0.00';
  var intPart = Number(value).toFixed(0); //获取整数部分
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
  var floatPart = ".00"; //预定义小数部分
  var value2Array = value.split(".");
  //=2表示数据有小数位
  if (value2Array.length == 2) {
    floatPart = value2Array[1].toString(); //拿到小数部分
    if (floatPart.length == 1) { //补0,实际上用不着
      return intPartFormat + "." + floatPart + '0';
    } else {
      return intPartFormat + "." + floatPart;
    }
  } else {
    return intPartFormat + floatPart;
  }
})

// 不带小数点数字千分位过滤器
Vue.filter('NumsFormat', function (value) {
  if (!value) return '0.00';
  var intPart = Number(value).toFixed(0); //获取整数部分
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //
  return intPartFormat
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
