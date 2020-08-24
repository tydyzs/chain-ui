import request from '@/utils/request'

export const getList = (current, size, params) => {
  return request({
    url: '/git-system/topmenu/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/git-system/topmenu/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/git-system/topmenu/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/git-system/topmenu/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/git-system/topmenu/submit',
    method: 'post',
    data: row
  })
}

export const grantTree = () => {
  return request({
    url: '/git-system/menu/grant-top-tree',
    method: 'get',
  })
}

export const getTopTree = (topMenuIds) => {
  return request({
    url: '/git-system/menu/top-tree-keys',
    method: 'get',
    params: {
      topMenuIds,
    }
  })
}

export const grant = (topMenuIds, menuIds) => {
  return request({
    url: '/git-system/topmenu/grant',
    method: 'post',
    params: {
      topMenuIds,
      menuIds,
    }
  })
}
