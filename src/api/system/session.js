import request from '@/utils/request'

export const getList = (current, size, params) => {
  return request({
    url: '/git-auth/oauth/loginUserList',
    method: 'post',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const remove = (account) => {
  return request({
    url: '/git-auth/oauth/forcedout',
    method: 'post',
    params: {
      account,
    }
  })
}