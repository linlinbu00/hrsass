import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives/index' // 一次性引入所有的指令
import Component from '@/components'
// 所有的过滤器进行注册
import * as filters from '@/filters/index'
import Print from 'vue-print-nb'
Vue.use(Print)
for (const filtersKey in filters) {
  Vue.filter(filtersKey, filters[filtersKey])
}
Vue.use(Component) // 注册自己的插件

/**
 * {
 * imgError:{inserted(){}}
 * },
 * {
 * focus:{inserted(){}}
 * }
 *   ============={key:{}}
 */
console.log(directives)
for (const key in directives) {
  // 遍历并将所有的指令都注册进去
  Vue.directive(key, directives[key])
}
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
