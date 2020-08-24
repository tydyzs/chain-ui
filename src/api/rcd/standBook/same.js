// 同业客户接口
import request from '@/utils/request'

//获取同业客户表格数据
export const getList = (
  current, size, userNum, customerName, orgNum, customerNum, certNum, certType, customerType) => {
  return request({
    url: '/git-chart/customer-chart/getCrdListSumPage',
    //url: '/git-chart/customer-chart/queryLedgerCrdSumPage',
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

//获取客户经理数据
export const pickManager = (current, size, account,realName) => {
  return request({
    url: '/git-user/list',
    method: 'get',
    params: {
      current,
      size,
      account,
      realName
    }
  })
}


//同业详情页额度信息查询
export const quotaList = (current, size, customerNum, orgNum) => {
  return request({
    url: '/git-demo/crdMain/findLedgerCrdMainPage',
    method: 'get',
    params: {
      current,
      size,
      customerNum,
      orgNum
    }
  })
}
//同业详情页额度明细信息
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

//同业详情页业务产品信息
export const businessProduct = (current, size, customerNum, orgNum) => {
  return request({
    url: '/git-demo/crdbusicertinfo/findLedgerCrdBusiCertInfoPage',
    method: 'get',
    params: {
      current,
      size,
      customerNum,
      orgNum
    }
  })
}

//同业详情页占用恢复信息
export const occupancyRecovery = (current, size, customerNum,orgNum) => {
  return request({
    url: '/git-demo/crdapplyserial/findLedgerCrdApplySerialPage',
    method: 'get',
    params: {
      current,
      size,
      customerNum,
      orgNum
    }
  })
}

//同业详情页额度授信情况
export const quotaCredit = (current, size, customerNum, orgNum) => {
  return request({
    url: '/git-crd/crdgrantingserial/findLedgerCrdGrantingSerialPage',
    method: 'get',
    params: {
      current,
      size,
      customerNum,
      orgNum
    }
  })
}




