import request from '@/utils/request'

export const getList = (current, size, params) => {
  return request({
    url: '/git-user/getList',
    method: 'post',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/git-user/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/git-user/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/git-user/update',
    method: 'post',
    data: row
  })
}

export const getUser = (id) => {
  return request({
    url: '/git-user/detail',
    method: 'post',
    params: {
      id,
    }
  })
}

export const getUserInfo = (userId) => {
  return request({
    url: '/git-user/info',
    method: 'post',
    params: {
      userId
    }
  })
}

export const resetPassword = (userIds) => {
  return request({
    url: '/git-user/reset-password',
    method: 'post',
    params: {
      userIds,
    }
  })
}

export const updatePassword = (oldPassword, newPassword, newPassword1) => {
  return request({
    url: '/git-user/update-password',
    method: 'post',
    params: {
      oldPassword,
      newPassword,
      newPassword1,
    }
  })
}


// 添加用户角色
export const addUserRole = (userRole) => {
  return request({
    url: '/git-user/save-user-role',
    method: 'post',
    data: userRole
  })
}

// 主机构切换
export const masterOrgSwitch = (userRoleId) => {
  return request({
    url: '/git-user/update-master-org',
    method: 'post',
    params: {
      userRoleId
    }
  })
}

//获取用户角色
export const getUserRoleById = (userRoleId) => {
  return request({
    url: '/git-user/user-role',
    method: 'post',
    params: {
      userRoleId
    }
  })
}



// 获取 用户角色列表
export const roleList = (userId) => {
  return request({
    url: '/git-user/user-role-list-new',
    method: 'post',
    params: {
      userId
    }
  })
}

// 修改用户角色
export const updateUserRole = (userRole) => request({
  url: '/git-user/update-user-role',
  method: 'post',
  data:userRole
})


// 删除用户角色
export const removeUserRole = (userRoleId) => {
  return request({
    url: '/git-user/remove-user-role',
    method: 'post',
    params: {
      userRoleId
    }
  })
}

// 获取营业时间
export const runTime = () => {
  return request({
    url: '/git-system/sysdate/workDateTime',
    method: 'post'
  })
}

// 用户登出
export const bigLogOut = () => {
  return request({
    url: '/git-auth/oauth/logout',
    method: 'post'
  })
}
