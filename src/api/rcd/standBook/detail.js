import request from '@/utils/request'

//公司客户详细信息
export const getCsmCorporationPageByCusNum = (customerNum) => request({
  url: "/git-csm/csmcorporation/getCsmCorporationPageByCusNum",
  method: "get",
  params: {
    customerNum
  }
})

//地址信息
export const getAddressList = (current, size, customerNum) => request({
  url: "/git-csm/csmaddressinfo/page",
  method: "get",
  params: {
    current,
    size,
    customerNum
  }
})

//关联客户信息
export const getRelationList = (current, size, customerNum) => request({
  url: "/git-csm/csmrelation/page",
  method: "get",
  params: {
    current,
    size,
    customerNum
  }
})

//我行管理团队
export const getCsmManageTeamPageByCusNum = (current, size, customerNum) => request({
  url: "/git-csm/csmmanageteam/getCsmManageTeamPageByCusNum",
  method: "get",
  params: {
    current,
    size,
    customerNum
  }
})

//客户合同信息
export const getCrdContractDetail = (contractNum) => request({
  url: "/git-demo/tbcrdcontract/queryCrdContractDetail",
  method: "get",
  params: {
    contractNum
  }
})

//担保合同列表
export const getCrdSubcontractPage = (current, size, contractNum) => request({
  url: "/git-demo/subcontractStaus/queryCrdSubcontractPage",
  method: "get",
  params: {
    current,
    size,
    contractNum
  }
})

//票据/借据
export const summaryDetail = (summaryNum) => request({
  url: "/git-demo/tbcrdsummary/summaryDetail",
  method: "get",
  params: {
    summaryNum
  }
})

//个人客户详细信息
export const getCsmIndividualPageByCustNum = (customerNum) => request({
  url: "/git-csm/csmindividual/getCsmIndividualPageByCustNum",
  method: "get",
  params: {
    customerNum
  }
})

//详情批复客户信息
export const approveDetail = (approveNum) => request({
  url: "/git-demo/tbcrdapprove/approveDetail",
  method: "get",
  params: {
    approveNum
  }
})

//详情批复信息列表
export const findListCrdApprove = (current, size, approveNum) => request({
  url: "/git-demo/tbcrdapprove/findListCrdApprove",
  method: "get",
  params: {
    current,
    size,
    approveNum
  }
})

//详情页面同业客户信息
export const peerDetail = (busiDealNum) => request({
  url: "/git-demo/crdbusicertinfo/findCrdBusiCertInfoDetailByCusNum",
  method: "get",
  params: {
    // cretInfoId
    busiDealNum
  }
})
