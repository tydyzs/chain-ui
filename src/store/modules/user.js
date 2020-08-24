import { login, bigLogOut, getInfo, loginByUsername,toggle } from '@/api/user'
import {getStore} from '@/utils/store'
import { getToken, setToken, removeToken,removeRefreshToken,setRefreshToken } from '@/utils/auth'
import { Message } from 'element-ui'


const user = {
  state : {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permission: getStore({name: 'permission'}) || {},
},

mutations : {
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_REFRESH_TOKEN: (state, refresh_token) => {
    state.refresh_token = refresh_token
    setRefreshToken (refresh_token)
  },
  SET_TENANT_ID:(state, tenantId) => {
    state.tenantId = tenantId
  },
  SET_USER_INFO :(state, userInfo) =>{
    state.userInfo = userInfo
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENU: (state, menu) => {
    state.menu = menu
  }
},

 actions : {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // login by account
  LoginByUsername ({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      loginByUsername(userInfo.account, userInfo.password, userInfo.type, userInfo.deptId).then(res => {
        const data = res.data
        if (data.error_description) {
          Message({
            message: data.error_description,
            type: 'error'
          })
        } else {
          commit('SET_TOKEN', data.access_token)
          commit('SET_REFRESH_TOKEN', data.refresh_token)
          commit('SET_TENANT_ID', data.tenant_id)
          commit('SET_USER_INFO', data)
          //commit('DEL_ALL_TAG')
          //commit('CLEAR_LOCK')
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  loginOrgSwitch({ commit }, deptId){
    return new Promise((resolve, reject) => {
      toggle(deptId).then(res => {
        const data = res.data
        if (data.error_description) {
          Message({
            message: data.error_description,
            type: 'error'
          })
        } else {
          commit('SET_TOKEN', data.access_token)
          commit('SET_REFRESH_TOKEN', data.refresh_token)
          commit('SET_TENANT_ID', data.tenant_id)
          commit('SET_USER_INFO', data)
          commit('SET_ROLES', "")
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 新增部分
  getUserInfo({commit}) {
    return new Promise((resolve, reject) => {
      getInfo().then((res) => {
        const { data } = res.data
        console.log(data)
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        if (!data.roleId) {
          reject('UserInfo: roleId is null, please Login again.')
        }
        commit('SET_ROLES', data.roleName)
        commit('SET_NAME', data.name)
        commit('SET_AVATAR', "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif")
        resolve(data)
      }).catch(err => {
        reject(err)
      })
    })
  }, 
  FedLogOut({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_MENU', [])
      commit('SET_ROLES', [])
      // commit('DEL_ALL_TAG');
      // commit('CLEAR_LOCK');
      removeToken()
      removeRefreshToken()
      resolve()
    })
  },
  // user logout
  LogOut({commit}) {
    return new Promise((resolve, reject) => {
      bigLogOut().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_MENU', [])
        commit('SET_ROLES', [])
        // commit('DEL_ALL_TAG');
        // commit('CLEAR_LOCK');
        removeToken()
        removeRefreshToken()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}
}

export default user



