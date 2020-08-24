// 限额管理下 限额台账页面接口
import request from '@/utils/request'

// 查询机构限额清单
export const limitList = (useOrgNum) => {
  return request({
    url: '/git-rcm/ledger/select',
    method: 'get',
    params: {
      useOrgNum
    }
  })
}

// 查询限额分析（含累计触发次数）
export const analyzeData = (quotaNum) => {
  return request({
    url: '/git-rcm/ledger/analyze',
    method: 'get',
    params: {
      quotaNum
    }
  })
}

// 查询限额详情
export const analyzeDetail = (quotaNum) => {
  return request({
    url: '/git-rcm/ledger/detail',
    method: 'get',
    params: {
      quotaNum
    }
  })
}

// 查询限额和预警次数最近12月的趋势变化
export const quotaData = (quotaNum) => {
  return request({
    url: '/git-rcm/ledger/trend',
    method: 'get',
    params: {
      quotaNum
    }
  })
}
