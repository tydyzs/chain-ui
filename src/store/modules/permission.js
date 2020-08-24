import { constantRoutes } from '@/router'
import {setStore} from '@/utils/store'
import { getRoutes,getButtons } from "@/api/user"
import {getTopMenu} from '@/api/system/menu'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission (roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}



/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes (routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

export function generateTitle (title, key) {
  if (!key) return title;
  const hasKey = this.$vue.$te('route.' + key)
  if (hasKey) {
      // $t :this method from vue-i18n, inject in @/lang/index.js
      const translatedTitle = this.$vue.$t('route.' + key)
      return translatedTitle
  }
  return title
}

export function formatRoutes (menus) {
  let routers = []
  menus.forEach(menu => {
    let router = {
      path: (menu.parentId == 0?"/":"" ) + menu.code.split("_").reverse()[0],
      name: menu.code.split("_").reverse()[0],
      meta: { title:  menu.name, icon: menu.source},
    };
    if(menu.parentId == 0){
      router.component = ()=> import('@/layout/index')
    }
    if (menu.children) {
       let children = formatRoutes(menu.children)
       router.children = children
       router.redirect = router.path+"/"+children[0].path
    }else{
      router.component = ()=> import(`@/views${menu.path}/index.vue`)
    }
    routers.push(router)
  })
  return routers
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSION: (state, permission) => {
    let result = [];
    function getCode(list) {
      list.forEach(ele => {
        if (typeof (ele) === 'object') {
          const chiildren = ele.children;
          const code = ele.code;
          if (chiildren) {
            getCode(chiildren)
          } else {
            result.push(code);
          }
        }

      })
    }
    getCode(permission);
    state.permission = {};
    result.forEach(ele => {
      state.permission[ele] = true;
    });
    setStore({name: 'permission', content: state.permission, type: 'session'})
  }
}

const actions = {
  generateRoutes ({ commit,dispatch}) {
    return new Promise((resolve, reject) => {
      getRoutes(null).then(res => {
        let menu = res.data.data;
        let accessedRoutes
        accessedRoutes = formatRoutes(menu);
        commit('SET_ROUTES', accessedRoutes)
        dispatch('GetButtons');
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  },
  //获取顶部菜单
  GetTopMenu({commit}) {
    return new Promise(resolve => {
      getTopMenu().then((res) => {
        const data = res.data.data || []
        resolve(data)
      })
    })
  },
  GetButtons({commit}) {
    return new Promise((resolve) => {
      getButtons().then(res => {
        const data = res.data.data;
        commit('SET_PERMISSION', data);
        resolve();
      })
    })
  },
  GetMenu({commit,dispatch}, topMenuId) {
    return new Promise(resolve => {
      getRoutes(topMenuId).then(res => {
        // console.log('res:', res);
        let menu = res.data.data;
        let accessedRoutes
        accessedRoutes = formatRoutes(menu);
        commit('SET_ROUTES', accessedRoutes)
        dispatch('GetButtons');
        resolve(accessedRoutes)
      }).catch(error => {
        reject(error)
      })
    })
 },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
