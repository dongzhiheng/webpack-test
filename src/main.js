// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import loading from '@/components/Loading/loading.vue'
import navbar from '@/components/Navbar/navbar.vue';
import router from './router'
import ElementUI from 'element-ui'
import _ from 'lodash'
import VueHighcharts from 'vue-highcharts';


//ele 公共样式
import 'element-ui/lib/theme-default/index.css'
//引入公用样式
import './assets/css/index.scss'
import './assets/css/_mixin.scss'
import './assets/css/base.scss'

Vue.config.productionTip = false;
const components = [loading,navbar];
components.map(component => {
    Vue.component(component.name, component);
  });
Vue.use(ElementUI);
Vue.use(VueHighcharts);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App,loading}
})
