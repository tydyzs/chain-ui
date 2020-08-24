//终端配置
import request from '@/utils/request';

export const getList = (current, size, params) => {
  return request({
    url: '/git-front/terminalconfig/list',
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
    url: '/git-front/terminalconfig/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const getDetailByCode = (terminalCode) => {
  return request({
    url: '/git-front/terminalconfig/detail',
    method: 'get',
    params: {
      terminalCode
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/git-front/terminalconfig/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/git-front/terminalconfig/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/git-front/terminalconfig/submit',
    method: 'post',
    data: row
  })
}

export const repeat = (terminalCode) => {
  return request({
    url: '/git-front/terminalconfig/validateRepeat',
    method: 'get',
    params: {
      terminalCode
    }
  })
}

export const start = () => {
  return request({
    url: '/git-front/terminalconfig/start',
    method: 'post'
  })
}

export const stop = () => {
  return request({
    url: '/git-front/terminalconfig/stop',
    method: 'post'
  })
}
