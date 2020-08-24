import request from '@/utils/request'


export const getList = (current, size, params) => {
    return request({
      url: '/git-system/role/getList',
      method: 'post',
      params: {
        ...params,
        current,
        size,
      }
    })
  }
  export const grantTree = () => {
    return request({
      url: '/git-system/menu/grant-tree',
      method: 'get',
    })
  }
  
  export const grant = (roleIds, menuIds, dataScopeIds, apiScopeIds) => {
    return request({
      url: '/git-system/role/grant',
      method: 'post',
      data: {
        roleIds,
        menuIds,
        dataScopeIds,
        apiScopeIds
      }
    })
  }
  
  export const remove = (ids) => {
    return request({
      url: '/git-system/role/remove',
      method: 'post',
      params: {
        ids,
      }
    })
  }
  
  export const add = (row) => {
    return request({
      url: '/git-system/role/submit',
      method: 'post',
      data: row
    })
  }
  
  export const update = (row) => {
    return request({
      url: '/git-system/role/submit',
      method: 'post',
      data: row
    })
  }

    // 角色所分配的树
  export const getRoleById = (id) => {
        return request({
          url: '/git-system/role/detail',
          method: 'post',
          params: {
           id,
          }
        })
  }
  
  // 角色所分配的树
  export const getRole = (roleIds) => {
    return request({
      url: '/git-system/menu/role-tree-keys',
      method: 'get',
      params: {
        roleIds,
      }
    })
  }
  
  export const getRoleTree = (tenantId) => {
    return request({
      url: '/git-system/role/tree',
      method: 'post',
      params: {
        tenantId,
      }
    })
  }


  export const getRoleTreeByDeptLevel = (deptId) => {
    return request({
      url: '/git-system/role/roleByLevel',
      method: 'post',
      params: {
        deptId,
      }
    })
  }

  
  