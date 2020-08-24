//交易记录
import request from '@/utils/request';

export const getList = (current, size, params) => {
  return request({
    url: '/git-front/servicerecord/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getList2 = (current, size, params) => {
  return request({
    url: '/git-front/servicerecord/query',
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
    url: '/git-front/servicerecord/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/git-front/servicerecord/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/git-front/servicerecord/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/git-front/servicerecord/submit',
    method: 'post',
    data: row
  })
}

export const retry = (row) => {
  return request({
    url: '/git-front/servicerecord/retry',
    method: 'post',
    data: row
  })
}

export const getTerminalconfig = () => {
  return request({
    url: '/git-front/terminalconfig/tree',
    method: 'get'
  })
}
