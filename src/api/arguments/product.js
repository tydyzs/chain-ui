// 额度产品
import request from '@/utils/request'

//点击保存时，将额度产品名称，额度产品编号，额度品种状态，额度品种描述传递给后台
export const saveList = (data) => {
  return request({
    url: '/git-param/crd/update',
    method: 'post',
    data: data
  })
}

//新增额度品种，将父级产品ID，父级产品名字，父级产品级别+1，传递到后台
export const add = (data) => {
  return request({
    url: '/git-param/crd/save',
    method: 'post',
    data: data
  })
}

//获取新增额度品种ID，系统自动生成
export const getCrdId = (crdId) => {
  return request({
    url: '/git-param/crd/getCrdId',
    method: 'post',
    params: {
      crdId
    }
  })
}

//获取树的数据
export const getTreeData = () => {
  return request({
    url: '/git-param/crd/query',
    method: 'get',
  })
}

//删除树
export const removeTree = (crdProductNum) => {
  return request({
    url: '/git-param/crd/remove',
    method: 'post',
    params: {
      crdProductNum
    }
  })
}

//将业务品种编号发送给服务端，获取业务品种名称、状态、产品额度占用方式
export const getProductData = (productNum) => {
  return request({
    url: '/git-param/product/query_product',
    method: 'get',
    params: {
      productNum
    }
  })
}

//修改关联信息
export const saveRelevance = (data) => {
  return request({
    url: '/git-param/crdProduct/save',
    method: 'post',
    data: data
  })
}

//获取关联业务品种列表
export const getList = (crdProductNum, current, size) => {
  var crdProduct = {
    crdProductNum: crdProductNum
  }
  return request({
    url: '/git-param/crdProduct/page',
    method: 'get',
    params: {
      ...crdProduct,
      current,
      size
    }
  })
}

//删除业务关联信息
export const removeRelevanceData = (ids) => {
  return request({
    url: '/git-param/crdProduct/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

//获取业务品种编号
export const getBusinessNum = () => {
  return request({
    url: '/git-param/product/query',
    method: 'get',
  })
}

//通过额度编号获取额度类型
export const getcrdProductType = (crdId) => {
  return request({
    url: '/git-param/crd/getCrd',
    method: 'post',
    params: {
      crdId
    }
  })
}

//获取业务品种列表
export const getProductList = (productNum, productName, current, size) => {
  return request({
    url: '/git-param/product/page',
    method: 'get',
    params: {
      productNum,
      productName,
      current,
      size
    }
  })
}
