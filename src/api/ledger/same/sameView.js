import request from '@/utils/request'

// 省联社数据获取
export const getProvincialUnionList = (customerNum) => {
  return request({
    url: '/git-chart/ledger-chart/queryLedgerDeatilByOrgType',
    method: 'get',
    params: {
      customerNum,
    }
  });
}
//成员行数据获取
export const getMemberList = (customerNum,crdGrantOrgNum) => {
  return request({
    url: '/git-chart/ledger-chart/queryLedgerDeatilByOrgTypeThree',
    method: 'get',
    params: {
      customerNum,
      crdGrantOrgNum
    }
  });
}
