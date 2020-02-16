// eslint-disable-next-line
import {UserLayout, BasicLayout, RouteView, BlankLayout, PageView} from '@/layouts'
import {bxAnaalyse} from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {title: '首页'},
    redirect: '/analysis',
    children: [
      // dashboard
      {
        path: '/analysis',
        name: 'dashboard',
        component: () => import('@/views/dashboard/Analysis'),
        meta: {title: '仪表盘', keepAlive: false, permission: ['dashboard'], icon: bxAnaalyse}
      },
      {
        path: '/table-list/:pageNo([1-9]\\d*)?',
        name: 'TableListWrapper',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/TableList'),
        meta: {title: '药店填报信息表', keepAlive: false, permission: ['table'], icon: 'table'}
      },
      {
        path: '/district-list',
        name: 'DistrictListWrapper',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/DistrictList'),
        meta: {title: '药店填报区域统计表', keepAlive: true, permission: ['table'], icon: 'calendar'}
      },
      {
        path: '/street-list/:pageNo([1-9]\\d*)?',
        name: 'StreetListWrapper',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/StreetList'),
        meta: {title: '街道填报信息表', keepAlive: false, permission: ['table'], icon: 'table'}
      },
      {
        path: '/street-district-list/:pageNo([1-9]\\d*)?',
        name: 'StreetDistrictListWrapper',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/StreetDistrictList'),
        meta: {title: '街道填报区域统计表', keepAlive: false, permission: ['table'], icon: 'table'}
      },
      {
        path: '/appointment-list',
        name: 'AppointmentListWrapper',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/AppointmentList'),
        meta: {title: '预约销售统计表', keepAlive: true, permission: ['table'], icon: 'calendar'}
      },
      {
        path: '/report-list',
        name: 'ReportListWrapper',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/reportList'),
        meta: {title: '配送企业提货表', keepAlive: true, permission: ['table'], icon: 'calendar'}
      },
      {
        path: '/distribution-list',
        name: 'DistributionListWrapper',
        hideChildrenInMenu: true, // 强制显示 MenuItem 而不是 SubMenu
        component: () => import('@/views/list/DistributionList'),
        meta: {title: '药店分发表', keepAlive: true, permission: ['table'], icon: 'calendar'}
      },
      // profile
      {
        path: '/profile',
        name: 'profile',
        hidden: true,
        component: RouteView,
        redirect: '/profile/basic',
        meta: {title: '详情页', icon: 'profile', permission: ['profile']},
        children: [
          {
            path: '/profile/basic',
            name: 'ProfileBasic',
            component: () => import('@/views/profile/basic/basic'),
            meta: {title: '药店填报信息详情页', permission: ['profile']}
          },
          {
            path: '/profile/streetInfo',
            name: 'ProfileStreetInfo',
            component: () => import('@/views/profile/basic/StreetInfo'),
            meta: {title: '街道填报信息详情页', permission: ['profile']}
          },
          {
            path: '/profile/report',
            name: 'weeklyReport',
            component: () => import('@/views/profile/report/weeklyReport'),
            meta: {title: '每周报表', permission: ['profile']}
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: '/user/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
