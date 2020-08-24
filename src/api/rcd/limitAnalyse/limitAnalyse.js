import request from '@/utils/request'
//1.客户授信集中度简表。
export const creditConcentration = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-rcm/rpt/queryRcmCusQuotaRpt',
    method: 'get',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//2.最大十家客户贷款集中度及单一客户明细表
export const queryLoanTenCusRpt = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-rcm/rpt/queryLoanTenCusRpt',
    method: 'get',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//3.最大十家客户授信集中度及单一客户明细表
export const queryCreditTenCusRpt = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-rcm/rpt/queryCreditTenCusRpt',
    method: 'get',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//4.最大十家集团客户授信集中度及集团客户明细表
export const queryCreditTenGroupCusRpt = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-rcm/rpt/queryCreditTenGroupCusRpt',
    method: 'get',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//5.关联客户授信集中度简表
export const queryRelationQuotaBaseRpt = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-rcm/rpt/queryRelationQuotaBaseRpt',
    method: 'get',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//6.todo 暂缓，关联客户授信集中度明细表
export const test2 = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-rcm/rpt/queryCreditTenGroupCusRpt',
    method: 'get',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//7.行业授信集中度简表。
export const queryIndustryQuotaBaseRpt = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-rcm/rpt/queryIndustryQuotaBaseRpt',
    method: 'get',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//8.行业集中度明细表 todo 数据结构待变更
export const queryIndustryQuotaDetailRpt = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-rcm/rpt/queryIndustryQuotaDetailRpt',
    method: 'get',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//9.风险暴露情况简表
export const queryRiskExposureRpt = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-rcm/rpt/queryRiskExposureRpt',
    method: 'get',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//10.同业客户风险暴露明细表
export const queryBankRiskExposureRpt = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-rcm/rpt/queryBankRiskExposureRpt',
    method: 'get',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//10.匿名客户风险暴露明细表
export const queryAnonymityRiskExposureRpt = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-rcm/rpt/queryAnonymityRiskExposureRpt',
    method: 'get',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}


// 最大十家客户贷款集中度 todo 展缓
export const getLoan = () => {
  return request({
    url: '/git-rcm/rpt/query',
    method: 'get'
  })
}


// 查询风险暴露超过1亿元（含）的单一客户
export const queryOverOneHundredMillion = (query, page) => {
  return request({
    url: '/git-rcm/rpt/queryOverOneHundredMillion',
    method: 'get',
    params: {
      ...query, ...page
    }
  })
}

// 查询风险暴露超过一级资本净额2.5%的集团客户
export const queryOverTwoPointFivePercent = (query, page) => {
  return request({
    url: '/git-rcm/rpt/queryOverTwoPointFivePercent',
    method: 'get',
    params: {
      ...query, ...page
    }
  })
}

// 14.查询全客户（单一客户）明细
export const querySingleCustomer = (query, page) => {
  return request({
    url: '/git-rcm/rpt/querySingleCustomer',
    method: 'get',
    params: {
      ...query, ...page
    }
  })
}

// 15.全客户（集团客户）明细表
export const queryGroupCustomer = (query, page) => {
  return request({
    url: '/git-rcm/rpt/queryGroupCustomer',
    method: 'get',
    params: {
      ...query, ...page
    }
  })
}


//最大十家客户贷款集中度及单一客户明细表导出
export const downLoanTenCusRptTable = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-doc/excel-report/download/downLoanTenCusRptTable',
    method: 'get',
    responseType: 'arraybuffer',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//客户授信集中度简表导出
export const downRcmCusQuotaRpt = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-doc/excel-report/download/downRcmCusQuotaRpt',
    method: 'get',
    responseType: 'arraybuffer',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//最大十家客户授信集中度及单一客户明细表
export const downCreditTenCusRpt = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-doc/excel-report/download/downCreditTenCusRpt',
    method: 'get',
    responseType: 'arraybuffer',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

//最大十家集团客户授信集中度及集团客户明细表导出
export const downCreditTenGroupCusRpt = (orgNum, totalYear, totalMonth, amtUnit) => {
  return request({
    url: '/git-doc/excel-report/download/downCreditTenGroupCusRpt',
    method: 'get',
    responseType: 'arraybuffer',
    params: {
      orgNum, totalYear, totalMonth, amtUnit
    }
  })
}

// 获取当前年份 yyyy
export const getWorkYear = () => {
  return request({
    url: '/git-system/sysdate/getWorkYear',
    method: 'get'
  })
}

// 获取当前月份 mm
export const getWorkMonth = () => {
  return request({
    url: '/git-system/sysdate/getWorkMonth',
    method: 'get'
  })
}

// 获取当前年份和月份
export const getWorkDateMap = () => {
  return request({
    url: '/git-system/sysdate/getWorkDateMap',
    method: 'get'
  })
}
