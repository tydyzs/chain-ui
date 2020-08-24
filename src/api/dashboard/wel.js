import request from '@/utils/request'

export const getStatisOrg = (orgNum) => request({
  url: '/git-chart/org-chart/getStatisOrg',
  method: 'get',
  params: {
    orgNum
  }
})


export const getHomeQuota = (useOrgNum) => request({
  url: '/git-rcm/ledger/home',
  method: 'get',
  params: {
    useOrgNum
  }
})


