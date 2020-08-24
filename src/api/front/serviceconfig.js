//服务配置
import request from '@/utils/request';

export const getList = (current, size, params) => {
  return request({
    url: '/git-front/serviceconfig/list',
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
    url: '/git-front/serviceconfig/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/git-front/serviceconfig/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/git-front/serviceconfig/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/git-front/serviceconfig/submit',
    method: 'post',
    data: row
  })
}
