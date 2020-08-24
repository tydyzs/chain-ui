import request from '@/utils/request';

export const getList = (current, size, quotaName, triggerLevel,useOrgNum, triggerTimeStart, triggerTimeEnd) => {
  return request({
    url: '/git-rcm/warn-info/query',
    method: 'get',
    params: {
      current,
      size,
      quotaName,
      triggerLevel,
      useOrgNum,
      triggerTimeStart,
      triggerTimeEnd,
    }
  })
}

//批复信息表接口
export const getWarnInfoDetail = (useOrgNum,warnNum) => {
  return request({
    url: '/git-rcm/warn-info/detail',
    method: 'get',
    params: {
      useOrgNum,
      warnNum,
    }
  })
}

//十二个月以前的信息
export const getHisList = (current, size, quotaName, triggerLevel, triggerTimeStart, triggerTimeEnd) => {
  return request({
    url: '/git-rcm/warn-info-his/query',
    method: 'get',
    params: {
      current,
      size,
      quotaName,
      triggerLevel,
      triggerTimeStart,
      triggerTimeEnd,
    }
  })
}

//批复信息表接口
export const getWarnHisInfoDetail = (useOrgNum,warnNum) => {
  return request({
    url: '/git-rcm/warn-info-his/detail',
    method: 'get',
    params: {
      useOrgNum,
      warnNum,
    }
  })
}

//批复信息表接口
export const getApproveDetail = (approveId) => {
  return request({
    url: '/git-demo/tbcrdapprove/approveDetail',
    method: 'get',
    params: {
      approveId
    }
  })
}

//合同信息表接口
export const getContractDetail = (contractNum) => {
  return request({
    url: '/git-demo/tbcrdcontract/contractDetail',
    method: 'get',
    params: {
      contractNum
    }
  })
}

//合同信息表接口
export const getSummaryDetail = (summaryId) => {
  return request({
    url: '/git-demo/tbcrdsummary/summaryDetail',
    method: 'get',
    params: {
      summaryId
    }
  })
}
//限额指标信息
export const getQuotaDetail = (quotaIndexNum) => {
  return request({
    url: '/git-rcm/rcmConfigurationQuota/detail',
    method: 'get',
    params: {
      quotaIndexNum
    }
  })
}

//获取限额参数
export const getParaDetail = (quotaNum) => {
  return request({
    url: '/git-rcm/rcmConfigurationPara/paraDetail',
    method: 'get',
    params: {
      quotaNum,
    }
  })
}
