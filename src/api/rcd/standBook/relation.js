// 关系人页面 接口
import request from '@/utils/request'

export const relationView = (customerNum, current, size) => {
  return request({
    url: '/git-csm/csmrelation/view',
    method: 'get',
    params: {
      customerNum,
      current,
      size
    }
  })
}

export const relationPic = (customerNum, current, size) => {
  return request({
    url: '/git-csm/csmrelation/page',
    method: 'get',
    params: {
      customerNum,
      current,
      size
    }
  })
}
