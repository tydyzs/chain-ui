// 额度台账--公司客户页面下的接口
import request from '@/utils/request'

// 公司客户首页 table表格接口
//分页查询客户列表（汇总额度）
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

// 360视图页面中的接口
// 获取机构树的最新接口
export const getOrgByCust = (customerNum) => {
  return request({
    url: '/git-chart/customer-chart/getOrgByCust',
    method: 'get',
    params: {
      customerNum
    }
  })
}


// 额度信息
export const getCorporateList = (current, size, customerNum,orgNum) => {
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

// 限额台账 占用恢复信息
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

// 限额台账 对外担保信息数据
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

//获取当前客户的授信机构
export const getCrdOrgByCust = (customerNum) => {
  return request({
    url: '/git-chart/customer-chart/getOrgByCust',
    method: 'get',
    params: {
      customerNum
    }
  })
}

// 查询客户额度汇总信息(公司客户-360视图页面右上角table表格数据接口)
export const getSumCsmCrd = (customerNum, orgNum) => {
  return request({
    url: '/git-chart/customer-chart/sumCsmCrd',
    method: 'get',
    params: {
      customerNum,
      orgNum
    }
  })
}

// 查询客户额度明细列表(公司客户-360视图页面 左上角echarts图、左下角tbale表格、右下角echarts图 数据接口)
export const getCrdDetail = (customerNum, orgNum) => {
  return request({
    url: '/git-chart/customer-chart/listCrdDetail',
    method: 'get',
    params: {
      customerNum,
      orgNum
    }
  })
}
