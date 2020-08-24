import request from '@/utils/request'

export const getList = (current, size, params) => {
  return request({
    url: '/git-rcm/rcmConfigurationQuota/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  });
}

export const getDetail = (quotaIndexNum) => {
  return request({
    url: '/git-rcm/rcmConfigurationQuota/detail',
    method: 'get',
    params: {
      quotaIndexNum
    }
  })
}

export const remove = (quotaIndexNum) => {
  return request({
    url: '/git-rcm/rcmConfigurationQuota/remove',
    method: 'post',
    params: {
      quotaIndexNum,
    }
  })
}

export const add = (row) => {
  var row1=JSON.parse(JSON.stringify(row));
  return request({
    url: '/git-rcm/rcmConfigurationQuota/save',
    method: 'post',
    data: row1
  })
}

export const update = (row) => {
   var row1=JSON.parse(JSON.stringify(row));
   return request({
      url: '/git-rcm/rcmConfigurationQuota/update',
      method: 'post',
      data: row1
    });
}

export const usable = (quotaIndexNum) => {
  return request({
    url: '/git-rcm/rcmConfigurationQuota/usable',
    method: 'post',
    params: {
      quotaIndexNum
    }
  })
}

export const unusable = (quotaIndexNum) => {
  return request({
    url: '/git-rcm/rcmConfigurationQuota/unusable',
    method: 'post',
    params: {
      quotaIndexNum
    }
  })
}

