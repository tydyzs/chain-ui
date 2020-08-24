// 额度台账--第三方客户页面下的接口
import request from '@/utils/request'

//获取第三方表格数据
export const thirdPartyList = (current, size, certType, certNum, customerName, customerNum, userNum, orgNum) => request({
  url: "/git-credit/crdsum/findThirdPartyCrdSumPage",
  method: "get",
  params: {
    current,
    size,
    certType,
    certNum,
    customerName,
    customerNum,
    userNum,
    orgNum
  }
})

//第三方额度明细
export const crdDetail = (current, size, customerNum, orgNum) => request({
  url: "/git-demo/crdDetail/findThirdPartyCrdDetailPage",
  method: "get",
  params: {
    current,
    size,
    customerNum,
    orgNum
  }
})

//第三方批复
export const crdApprove = (current, size, customerNum, orgNum) => request({
  url: "/git-demo/tbcrdapprove/findThirdPartyCrdApprovePage",
  method: "get",
  params: {
    current,
    size,
    customerNum,
    orgNum
  }
})

//第三方占用
export const applySerial = (current, size, customerNum, orgNum) => request({
  url: "/git-demo/crdapplyserial/getApplySerialPage",
  method: "get",
  params: {
    current,
    size,
    customerNum,
    orgNum
  }
})

//第三方对外担保
export const listGrt = (current, size, customerNum, orgNum) => request({
  url: "/git-chart/customer-chart/listGrtPage",
  method: "get",
  params: {
    current,
    size,
    customerNum,
    orgNum
  }
})
