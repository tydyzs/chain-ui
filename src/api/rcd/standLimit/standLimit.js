// 额度台账--同业授信页面下的接口
import request from '@/utils/request'

// 获取表格列表数据
export const bankCreditTable = (current,size,customerName) => {
  return request({
    url: '/git-doc/excel-report/query/bankCreditTable',
    method: 'get',
    params: {
      current,
      size,
      customerName
    }
  })
}

// 导出表格数据
export const downloadBankCreditTable = (customerName,modelMap) => {
  return request({
    url: '/git-doc/excel-report/download/bankCreditTable',
    method: 'get',
    params: {
      customerName,
      modelMap
    }
  })
}
