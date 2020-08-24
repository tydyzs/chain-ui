import request from '@/utils/request';

//1.客户授信集中度简表。
export const creditConcentration = (orgNum,totalYear,totalMonth,amtUnit) => {
 return request({
    url: '/api/git-rcm/rpt/queryRcmCusQuotaRpt',
    method: 'get',
    params: {
      orgNum,totalYear,totalMonth,amtUnit
    }
  })
}

//2.最大十家客户贷款集中度及单一客户明细表
export const queryLoanTenCusRpt = (orgNum,totalYear,totalMonth,amtUnit) => {
  return request({
    url: '/api/git-rcm/rpt/queryLoanTenCusRpt',
    method: 'get',
    params: {
      orgNum,totalYear,totalMonth,amtUnit
    }
  })
}

//3.最大十家客户授信集中度及单一客户明细表
export const queryCreditTenCusRpt = (orgNum,totalYear,totalMonth,amtUnit) => {
  return request({
    url: '/api/git-rcm/rpt/queryCreditTenCusRpt',
    method: 'get',
    params: {
      orgNum,totalYear,totalMonth,amtUnit
    }
  })
}

//4.最大十家集团客户授信集中度及集团客户明细表
export const queryCreditTenGroupCusRpt = (orgNum,totalYear,totalMonth,amtUnit) => {
  return request({
    url: '/api/git-rcm/rpt/queryCreditTenGroupCusRpt',
    method: 'get',
    params: {
      orgNum,totalYear,totalMonth,amtUnit
    }
  })
}

//5.todo 暂缓，关联客户授信集中度简表
export const test1 = (orgNum,totalYear,totalMonth,amtUnit) => {
  return request({
    url: '/api/git-rcm/rpt/queryCreditTenGroupCusRpt',
    method: 'get',
    params: {
      orgNum,totalYear,totalMonth,amtUnit
    }
  })
}

//6.todo 暂缓，关联客户授信集中度明细表
export const test2 = (orgNum,totalYear,totalMonth,amtUnit) => {
  return request({
    url: '/api/git-rcm/rpt/queryCreditTenGroupCusRpt',
    method: 'get',
    params: {
      orgNum,totalYear,totalMonth,amtUnit
    }
  })
}

//7.行业授信集中度简表。todo 数据结构待变更。
export const queryIndustryQuotaBaseRpt = (orgNum,totalYear,totalMonth,amtUnit) => {
  return request({
    url: '/api/git-rcm/rpt/queryIndustryQuotaBaseRpt',
    method: 'get',
    params: {
      orgNum,totalYear,totalMonth,amtUnit
    }
  })
}

//8.行业集中度明细表 todo 数据结构待变更
export const queryIndustryQuotaDetailRpt = (orgNum,totalYear,totalMonth,amtUnit) => {
  return request({
    url: '/api/git-rcm/rpt/queryIndustryQuotaDetailRpt',
    method: 'get',
    params: {
      orgNum,totalYear,totalMonth,amtUnit
    }
  })
}

//9.风险暴露情况简表
export const queryRiskExposureRpt = (orgNum,totalYear,totalMonth,amtUnit) => {
  return request({
    url: '/api/git-rcm/rpt/queryRiskExposureRpt',
    method: 'get',
    params: {
      orgNum,totalYear,totalMonth,amtUnit
    }
  })
}

//10.同业客户风险暴露明细表
export const queryBusinessDetail = (orgNum,totalYear,totalMonth,amtUnit) => {
  return request({
    url: '/api/git-rcm/rpt/queryBusinessDetail',
    method: 'get',
    params: {
      orgNum,totalYear,totalMonth,amtUnit
    }
  })
}
