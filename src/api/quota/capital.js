import request from '@/utils/request'

export const list = (page, params) => {
  return request({
    url: '/git-rcm/rcmNetCapital/page',
    method: 'get',
    params: {
      ...params,
      ...page
    }
  })
}

export const detail = (netCapitalNum) => {
  return request({
    url: '/git-rcm/rcmNetCapital/detail',
    method: 'get',
    params: {
      netCapitalNum
    }
  })
}

export const remove = (netCapitalNum) => {
  return request({
    url: '/git-rcm/rcmNetCapital/remove',
    method: 'post',
    params: {
      netCapitalNum
    }
  })
}

export const save = (row) => {
  return request({
    url: '/git-rcm/rcmNetCapital/save',
    method: 'post',
    data: row
  })
}


