//业务品种接口
import request from '@/utils/request'

export const getSystemTree = () => {
  return request({
    url: '/git-front/terminalconfig/tree',
    method: 'get',
  })
}

export const getList = (current, size, params) => {
  return request({
    url: '/git-param/product/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
export const remove = (ids) => {
  return request({
    url: '/git-param/product/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/git-param/product/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/git-param/product/update',
    method: 'post',
    data: row
  })
}

export const getBreed = (productNum) => {
  return request({
    url: '/git-param/product/query_product',
    method: 'get',
    params: {
      productNum
    }
  })
}




export const queryBusinessType = (productNum) => {
  return request({
    url: '/git-loan/business-type/query',
    method: 'post',
    params: {
      productNum
    }
  })
}

export const listSystemDistinct = () => {
  return request({
    url: '/git-front/terminalconfig/listSystemDistinct',
    method: 'get',
  })
}

