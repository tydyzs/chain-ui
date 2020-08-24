import request from '@/utils/request'
import defaultSettings from '@/settings'

export function login (data) {
  return request({
    url: defaultSettings.urlPrefix +'/user/login',
    method: 'post',
    data
  })
}

// 测试接口
export const loginByUsername = (account, password, type, deptId) => request({
  url: defaultSettings.urlPrefix +'/git-auth/oauth/token',
  method: 'post',
  headers: {
    'Tenant-Id': "000000"
  },
  params: {
    account,
    password,
    grant_type: 'password',
    scope: 'all',
    type,
    deptId
  }
})

export const getUserInfo = (userId) => {
  return request({
    url: defaultSettings.urlPrefix +'/git-user/info',
    method: 'post',
    params: {
      userId
    }
  })
}

export function getInfo () {
  return request({
    url: defaultSettings.urlPrefix +'/git-user/info',
    method: 'post'
  })
};

export function getRoutes (topMenuId) {
  return request({
    url: defaultSettings.urlPrefix +'/git-system/menu/routes',
    method: 'get',
    params: {
      topMenuId
    }
  })
}

// 获取营业时间
export const runTime = () => {
  return request({
    url: defaultSettings.urlPrefix +'/git-system/sysdate/workDateTime',
    method: 'get'
  })
}

// 用户登出
export const bigLogOut = () => {
  return request({
    url: defaultSettings.urlPrefix +'/git-auth/oauth/logout',
    method: 'post'
  })
}

// 切换登录机构
export const toggle = (deptId) => request({
  url: defaultSettings.urlPrefix +'/git-auth/oauth/loginOrgSwitch',
  method: 'post',
  params: {
    deptId
  }
})

// 获取用户列表（客户经理）
export const getManagerList = (current, size, account,realName) => {
  return request({
    url: defaultSettings.urlPrefix +'/git-user/list',
    method: 'post',
    params: {
      current,
      size,
      account,
      realName
    }
  })
}
export const getButtons = () => request({
  url: '/git-system/menu/buttons',
  method: 'get'
});
