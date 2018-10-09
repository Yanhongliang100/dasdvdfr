import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'

/** note: submenu only apppear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/authredirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '系统首页',
        meta: { title: '系统首页', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

  /** When your routing table is too long, you can split it into small modules**/

  {
    path: '/help',
    component: Layout,
    redirect: 'demandCheckList',
    name: '爱心帮扶管理',
    meta: { title: '爱心帮扶', icon: 'example' },
    children: [
      {
        path: 'demandCheckList',
        component: () => import('@/views/help/demandCheckList'), // Parent router-view
        name: 'demandCheckList',
        meta: { title: '待审核需求' }
      },
      {
        path: 'demandManagerList',
        name: 'demandManagerList',
        component: () => import('@/views/help/demandManagerList'),
        meta: { title: '我管理的需求' }
      },
      {
        path: 'demandDetail:id',
        name: 'demandDetail',
        component: () => import('@/views/help/demandDetail'),
        meta: { title: '需求详情' },
        hidden: true
      }
    ]
  },
  {
    path: '/poor',
    component: Layout,
    children: [
      {
        path: 'poorList',
        name: 'poorList',
        component: () => import('@/views/poor/poorList'),
        meta: { title: '受助人管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/manager',
    component: Layout,
    redirect: 'managerList',
    name: 'manager',
    meta: {
      title: '扶贫干部管理',
      icon: 'nested'
    },
    children: [
      {
        path: 'managerList',
        component: () => import('@/views/manager/managerList'), // Parent router-view
        name: 'managerList',
        meta: { title: '扶贫干部管理' }
      },
      {
        path: 'managerCheckList',
        component: () => import('@/views/manager/managerCheckList'),
        name: 'managerCheckList',
        meta: { title: '扶贫干部审核' }
      }
    ]
  },

  {
    path: '/signIn',
    component: Layout,
    redirect: 'signIn',
    name: 'signIn',
    meta: {
      title: '注册',
      icon: 'nested'
    },
    children: [
      {
        path: 'signIn',
        component: () => import('@/views/signIn/signIn'), // Parent router-view
        name: 'signIn',
        meta: { title: '注册' }
      },
      {
        path: 'commit',
        component: () => import('@/views/signIn/commit'),
        name: 'commit',
        meta: { title: '提交完成' }
      },
      {
        path: 'noPass',
        component: () => import('@/views/signIn/noPass'),
        name: 'noPass',
        meta: { title: '审核不通过' }
      },
      {
        path: 'applyFor',
        component: () => import('@/views/signIn/applyFor'),
        name: 'applyFor',
        meta: { title: '申请' }
      }
    ]
  },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/errorPage/401'),
  //       name: 'Page401',
  //       meta: { title: 'page401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/errorPage/404'),
  //       name: 'Page404',
  //       meta: { title: 'page404', noCache: true }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/error-log',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/errorLog/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'errorLog', icon: 'bug' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/exportExcel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'exportExcel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/selectExcel'),
  //       name: 'EelectExcel',
  //       meta: { title: 'selectExcel' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/uploadExcel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'uploadExcel' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   meta: { title: 'zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'exportZip' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'clipboardDemo', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/i18n-demo/index'),
  //       name: 'I18n',
  //       meta: { title: 'i18n', icon: 'international' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'externalLink', icon: 'link' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]
