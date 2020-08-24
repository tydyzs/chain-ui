import request from '@/utils/request'
import defaultSettings from '@/settings'

export function login (data) {
  return request({
    url: defaultSettings.urlPrefix + '/git-auth/oauth/token',
    method: 'post',
    headers: {
      'Tenant-Id': tenantId
    },
    data
  })
}

export function getDeptsByAccount (account) {
  return request({
    url: defaultSettings.urlPrefix + '/git-auth/oauth/depts',
    method: 'post',
    params: {
      account
    }
  })
}

export function getInfo (token) {
  return request({
    url: '/user/info',
    method: 'post',
    params: { token }
  })
}

