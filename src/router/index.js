import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {
        title: '首页',
        icon: 'dashboard',
        affix: true
      }
    }]
  },
  // 机构视图
  {
    path: '/organization',
    component: Layout,
    name: '/organization',
    hidden: true,
    children: [{
      path: 'index',
      name: '机构视图',
      component: () => import('@/views/360view/organization/index'),
      meta: {
        title: '机构视图',
        // icon: 'dashboard',
        affix: false
      }
    }]
  },
  // 限额台账
  {
    path: '/quotaLedger',
    component: Layout,
    name: '/quotaLedger',
    hidden: true,
    children: [{
      path: 'index',
      name: '限额台账',
      component: () => import('@/views/quota/quotaLedger/index'),
      meta: {
        title: '限额台账',
        // icon: 'dashboard',
        affix: false
      }
    }]
  },
  {
    path: '/corporate',
    component: Layout,
    name: '/corporate',
    children: [{
      path: 'corporateView',
      name: 'corporateView',
      hidden: true,
      component: () => import('@/views/ledger/corporate/corporateView'),
      meta: {
        title: '公司客户视图页面',
        affix: false,
        noCache: true
      }
    }, {
      path: 'corporateInfo',
      name: 'corporateInfo',
      hidden: true,
      component: () => import('@/views/ledger/corporate/corporateInfo'),
      meta: {
        title: '公司客户详情信息',
        affix: false,
        noCache: true
      }
    }, {
      path: 'corporateMsg',
      name: 'corporateMsg',
      hidden: true,
      component: () => import('@/views/ledger/corporate/corporateMsg'),
      meta: {
        title: '公司客户额度详情',
        affix: false,
        noCache: true
      }
    }]
  },
  {
    path: '/individual',
    component: Layout,
    name: '/individual',
    children: [{
      path: 'individualView',
      name: 'individualView',
      hidden: true,
      component: () => import('@/views/ledger/individual/individualView'),
      meta: {
        title: '个人客户视图页面',
        affix: false,
        noCache: true
      }
    }, {
      path: 'individualInfo',
      name: 'individualInfo',
      hidden: true,
      component: () => import('@/views/ledger/individual/individualInfo'),
      meta: {
        title: '个人客户详情信息',
        affix: false,
        noCache: true
      }
    }, {
      path: 'individualMsg',
      name: 'individualMsg',
      hidden: true,
      component: () => import('@/views/ledger/individual/individualMsg'),
      meta: {
        title: '个人客户额度详情',
        affix: false,
        noCache: true
      }
    }]
  },
  {
    path: '/group',
    component: Layout,
    name: '/group',
    children: [{
      path: 'groupView',
      name: 'groupView',
      hidden: true,
      component: () => import('@/views/ledger/group/groupView'),
      meta: {
        title: '集团客户视图页面',
        affix: false,
        noCache: true
      }
    }, {
      path: 'relation',
      name: 'relation',
      hidden: true,
      component: () => import('@/views/ledger/group/relation'),
      meta: {
        title: '关联关系',
        affix: false,
        noCache: true
      }
    }]
  },
  {
    path: '/same',
    component: Layout,
    name: '/same',
    children: [{
      path: 'sameView',
      name: 'sameView',
      hidden: true,
      component: () => import('@/views/ledger/same/sameView'),
      meta: {
        title: '同业客户视图页面',
        affix: false,
        noCache: true
      }
    }, {
      path: 'sameInfo',
      name: 'sameInfo',
      hidden: true,
      component: () => import('@/views/ledger/same/sameInfo'),
      meta: {
        title: '同业客户详情信息',
        affix: false,
        noCache: true
      }
    }, {
      path: 'sameMsg',
      name: 'sameMsg',
      hidden: true,
      component: () => import('@/views/ledger/same/sameMsg'),
      meta: {
        title: '同业客户额度详情',
        affix: false,
        noCache: true
      }
    }]
  },
  {
    path: '/guarantee',
    component: Layout,
    name: '/guarantee',
    children: [
      {
        path: 'guaranteeMsg',
        name: 'guaranteeMsg',
        hidden: true,
        component: () => import('@/views/ledger/guarantee/guaranteeMsg'),
        meta: {
          title: '担保台账详情页面',
          affix: false,
          noCache: true
        }
      }, {
        path: 'guaranteeView',
        name: 'guaranteeView',
        hidden: true,
        component: () => import('@/views/ledger/guarantee/guaranteeView'),
        meta: {
          title: '担保台账视图页面',
          affix: false,
          noCache: true
        }
      },
      {
        path: 'peerDetail',
        name: 'peerDetail',
        hidden: true,
        component: () => import('@/views/ledger/detail/peerDetail'),
        meta: {
          title: '业务产品凭证详情',
          affix: false,
          noCache: true
        }
      }
    ]
  },
  //限额预警
  {
    path: '/warning',
    component: Layout,
    name: '/warning',
    children: [{
      path: 'index',
      name: '限额预警页面',
      hidden: true,
      component: () => import('@/views/quota/warning/index'),
      meta: {
        title: '限额预警页面',
        affix: false,
        noCache: true
      }
    },{
      path: 'warningMsg',
      name: '预警详情',
      hidden: true,
      component: () => import('@/views/quota/warning/warningMsg'),
      meta: {
        title: '预警详情',
        affix: false,
        noCache: true
      }
    },{
      path: 'warningMsgPlus',
      name: '限额详情',
      hidden: true,
      component: () => import('@/views/quota/warning/warningMsgPlus'),
      meta: {
        title: '限额详情',
        affix: false,
        noCache: true
      }
    },{
      path: 'historyMsg',
      name: '历史记录',
      hidden: true,
      component: () => import('@/views/quota/warning/historyMsg'),
      meta: {
        title: '历史记录',
        affix: false,
        noCache: true
      }
    }]
  },
  //第三方
  {
    path: '/thirdparty',
    component: Layout,
    name: '/thirdparty',
    children: [
      {
        path: 'thirdpartyMsg',
        name: 'thirdpartyMsg',
        hidden: true,
        component: () => import('@/views/ledger/thirdparty/thirdpartyMsg'),
        meta: {
          title: '第三方台账详情页面',
          affix: false,
          noCache: true
        }
      }
    ]
  },
  {
    path: '/detail',
    component: Layout,
    name: '/detail',
    children: [
      {
        path: 'contractDetail',
        name: 'contractDetail',
        hidden: true,
        component: () => import('@/views/ledger/detail/contractDetail'),
        meta: {
          title: '合同详情信息',
          affix: false,
          noCache: true
        }
      },
      {
        path: 'summaryDetail',
        name: 'summaryDetail',
        hidden: true,
        component: () => import('@/views/ledger/detail/summaryDetail'),
        meta: {
          title: '借据详情信息',
          affix: false,
          noCache: true
        }
      },
      {
        path: 'approveDetail',
        name: 'approveDetail',
        hidden: true,
        component: () => import('@/views/ledger/detail/approveDetail'),
        meta: {
          title: '批复详情信息',
          affix: false,
          noCache: true
        }
      },
    ]
  }

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [{
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [{
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: {
          title: 'Menu1'
        },
        children: [{
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: {
              title: 'Menu1-1'
            }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: {
              title: 'Menu1-2'
            },
            children: [{
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: {
                  title: 'Menu1-2-1'
                }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: {
                  title: 'Menu1-2-2'
                }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: {
              title: 'Menu1-3'
            }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: {
          title: 'menu2'
        }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [{
      path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
      meta: {
        title: 'External Link',
        icon: 'link'
      }
    }]
  },

  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
