import request from '@/utils/request'

export const list = (page, params) => {
  return request({
    url: '/git-rcm/rcmConfigurationManager/page',
    method: 'get',
    params: {
      ...params,
      ...page
    }
  })
}

export const detail = (quotaNum) => {
  return request({
    url: '/git-rcm/rcmConfigurationManager/detail',
    method: 'get',
    params: {
      quotaNum
    }
  })
}

export const detail2 = (quotaIndexNum) => {
  return request({
    url: '/git-rcm/rcmConfigurationQuota/detail',
    method: 'get',
    params: {
      quotaIndexNum
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

export const getQuotaIndexNum = () => {
  return request({
    url: '/git-rcm/rcmConfigurationBase/list?quotaIndexState=1',
    method: 'get',
  })
}

export const getHisList = (quotaNum, current, size) => {
  return request({
    url: '/git-rcm/rcmConfigurationManager/hisList',
    method: 'get',
    params: {
      quotaNum,
      current,
      size
    }
  })
}

export const getHisDetail = (id) => {
  return request({
    url: '/git-rcm/rcmConfigurationParaHis/hisDetail',
    method: 'get',
    params: {
      id
    }
  })
}

export const pageTurn = (quotaNum, current, size) => {
  return request({
    url: '/git-rcm/rcmConfigurationManager/hisPageTurn',
    method: 'get',
    params: {
      quotaNum,
      current,
      size
    }
  })
}

// 获取限额基础指标
export const getRcmIndexList = (current, size, quotaIndexNum, quotaIndexName) => {
  return request({
    url: '/git-rcm/rcmConfigurationBase/page',
    method: 'get',
    params: {
      current,
      size,
      quotaIndexNum,
      quotaIndexName
    }
  })
}
