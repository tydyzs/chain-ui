// 额度台账--个人客户页面下的接口
import request from '@/utils/request'

// 分页查询客户列表（汇总额度）
export const getList = (
  current, size, userNum, customerName, orgNum, customerNum, certNum, certType, customerType) => {
  return request({
    url: '/git-chart/customer-chart/getCrdListSumPage',
    method: 'get',
    params: {
      current,
      size,
      userNum,
      customerName,
      orgNum,
      customerNum,
      certNum,
      certType,
      customerType
    }
  })
}

// 额度信息
export const getIndividualList = (current, size, customerNum,orgNum) => {
  return request({
    url: '/git-demo/crdMain/getCorporateList',
    method: 'get',
    params: {
      current,
      size,
      customerNum,
      orgNum
    }
  })
}

// 额度信息明细
export const findCrdDetailFromCrdMainNum = (current, size,customerNum,orgNum, crdMainNum) => {
  return request({
    url: '/git-demo/crdDetail/findCrdDetailFromCrdMainNum',
    method: 'get',
    params: {
      current,
      size,
      customerNum,
      orgNum,
      crdMainNum,
    }
  })
}

// 合同信息
export const getContractList = (current, size, customerNum,orgNum) => {
  return request({
    url: '/git-demo/tbcrdcontract/getContractList',
    method: 'get',
    params: {
      current,
      size,
      customerNum,
      orgNum
    }
  })
}

// 借据信息
export const getSummaryListFromCusNum = (current, size, customerNum,orgNum) => {
  return request({
    url: '/git-demo/tbcrdsummary/getSummaryListFromCusNum',
    method: 'get',
    params: {
      current,
      size,
      customerNum,
      orgNum
    }
  })
}

// 占用恢复信息
export const getApplySerialPage = (current, size, customerNum,orgNum) => {
  return request({
    url: '/git-demo/crdapplyserial/getApplySerialPage',
    method: 'get',
    params: {
      current,
      size,
      customerNum,
      orgNum
    }
  })
}

// 对外担保信息
export const getListGrtPage = (
  current, size,  customerNum, orgNum) => {
  return request({
    url: '/git-chart/customer-chart/listGrtPage',
    method: 'get',
    params: {
      current,
      size,
      customerNum,
      orgNum,
    }
  })
}

// 信用卡信息
export const getCrdCcInfoAndCustomerNamePage = (
  current, size,  customerNum, orgNum) => {
  return request({
    url: '/git-crd/crdccinfo/getCrdCcInfoAndCustomerNamePage',
    method: 'get',
    params: {
      current,
      size,
      customerNum,
      orgNum,
    }
  })
}
