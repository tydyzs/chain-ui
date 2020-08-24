// 串用管理
import request from '@/utils/request'


export const getList = (current, size, params) => {
  return request({
    url: '/git-param/borrow/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const page = (current, size, params) => {
  return request({
    url: '/git-param/borrow/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/git-param/borrow/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const submit = (row) => {
  return request({
    url: '/git-param/borrow/submit',
    method: 'post',
    data: row
  })
}

export const getborrow = (id) => {
  return request({
    url: '/git-param/borrow/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const detailPage = (current, size, params) => {
  return request({
    url: '/git-param/borrowDetail/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const customerPage = (current, size, params) => {
  return request({
    url: '/git-param/borrow/customerPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}