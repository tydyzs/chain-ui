// 额度台账--担保客户页面下的接口
import request from '@/utils/request'

// 分页查询客户列表（汇总额度）
export const getList = (
  current, size, userNum, customerName, orgNum, customerNum, certNum, certType) => {
  return request({
    url: '/git-demo/tbcrdsum/getTbCrdGuaranteeSumPage',
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
      // customerType
    }
  })
}

// 担保台账：担保额度明细
export const getGuaranteeCrdDetail = (
  current, size,  customerNum, orgNum) => {
  return request({
    url: '/git-demo/crdDetail/getGuaranteeCrdDetail',
    method: 'get',
    params: {
      current,
      size,
      customerNum,
      orgNum,
    }
  })
}

// 担保360视图接口
// 查询担保额度列表，担保客户视图左上echar、右上角表格
export const getListGrt = (customerNum, orgNum) => {
  return request({
    url: '/git-chart/customer-chart/listGuaranteeCrd',
    method: 'get',
    params: {
      customerNum,
      orgNum
    }
  })
}

// 查询对外担保列表（分页）,担保客户视图下方列表
export const getListGrtPage = (current, size, customerNum, orgNum) => {
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
