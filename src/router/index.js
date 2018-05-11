import Vue from 'vue'
import Router from 'vue-router'

import ComponentsList from '@/views/custom-components/index'
import TableExt from '@/views/custom-components/table-ext'
import Timer from '@/views/custom-components/timer'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/components',
      name: 'Index'
    },
    {
      path: '/components',
      redirect: '/components/table-ext',
      name: 'ComponentsList',
      component: ComponentsList,
      children: [{
        path: 'table-ext',
        name: 'table扩展',
        component: TableExt
      }, {
        path: 'timer',
        name: '正向计时器',
        component: Timer
      }]
    }
  ]
})
