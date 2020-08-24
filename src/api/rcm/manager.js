import request from '@/utils/request';

export const getList = (current, size, params) => {
  return request({
    url: '/git-rcm/rcmConfigurationManager/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const remove = (quotaNum) => {
  return request({
    url: '/git-rcm/rcmConfigurationManager/remove',
    method: 'post',
    params: {
      quotaNum,
    }
  })
}

export const getDetail = (quotaNum) => {
  return request({
    url: '/git-rcm/rcmConfigurationManager/detail',
    method: 'get',
    params: {
      quotaNum
    }
  })
}

export const add = (row) => {
  return request({
    url: '/git-rcm/rcmConfigurationManager/save',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/git-rcm/rcmConfigurationManager/update',
    method: 'post',
    data: row
  })
}

export const getHisList = (quotaNum,current,size) => {
  return request({
    url: '/git-rcm/rcmConfigHis/list',
    method: 'get',
    params: {
      quotaNum,
      current,
      size
    }
  })
}

export const getHisDetail = (mainHisId) => {
  return request({
    url: '/git-rcm/rcmConfigurationParaHis/hisDetail',
    method: 'get',
    params: {
      mainHisId
    }
  })
}
