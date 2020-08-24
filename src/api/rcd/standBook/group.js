// 集团模块JS

import request from '@/utils/request'

// 集团客户页面数据
export const groupList = (current, size, orgNum,customerName,customerNum,userNum) => request({
  url: "/git-loan/csmGroupMember/listCsmGroupMemberPage",
  method: "get",
  params: {
    current,
    size,
    orgNum,
    customerName,
    customerNum,
    userNum
  }
});

// 集团成员信息数据
export const groupMemberList = (current, size, memberCustomerNum, orgNum) => request({
  url: "/git-loan/csmGroupMember/findCsmGroupMemberPage",
  method: "get",
  params: {
    current,
    size,
    memberCustomerNum,
    orgNum
  }
})

// 查询集团客户视图成员结构（360视图页面中，二层右侧表格数据）
export const groupMemberDetail = (orgNum,customerNum) => request({
  url: "/git-chart/group-chart/findGroupMemberDetail",
  method: "get",
  params: {
    orgNum,
    customerNum
  }
})

// 集团组织树形结构（360视图页面中，三层左侧结构图数据）
export const groupMemberByCsNum = (customerNum) => request({
  url: "/git-chart/group-chart/queryGroupMemberByCsNum",
  method: "get",
  params: {
    customerNum
  }
})

// 查询集团客户视图组织结构(360视图页面中，二层echarts和三层右侧表格数据)
export const groupChartTable = (memberCustomerNum,orgNum) => request({
  url: "/git-chart/group-chart/queryGroupMemberList",
  method: "get",
  params: {
    memberCustomerNum,
    orgNum
  }
})
