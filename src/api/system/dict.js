// 字典接口
import request from '@/utils/request'

// 通用字典翻译器
export const dictTranslate = (code) => {
  return request({
    url: '/git-system/dict/dictTranslate',
    method: 'get',
    params: {
      code
    }
  })
}


export const getDictionarys = (codes) => {
  return request({
    url: '/git-system/dict/dictionarys',
    method: 'get',
    params: {
      codes
    }
  })
}



// 字典
export const getDictionary = (code) => {
  return request({
    url: '/git-system/dict/dictionary',
    method: 'get',
    params: {
      code
    }
  })
}
// 字典2
export const getDict2 = (code,value) => {
  return request({
    url: '/git-system/dict/dictionary',
    method: 'get',
    params: {
      code,
      value
    }
  })
}
// 查询
export const getList = (current, size, params) => {
  return request({
    url: '/git-system/dict/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

// 删除
export const remove = (ids) => {
  return request({
    url: '/git-system/dict/remove',
    method: 'post',
    params: {
      ids
    }
  })
}

export const addOrUpdata = (row) => {
  return request({
    url: '/git-system/dict/submit',
    method: 'post',
    data: row
  })
}

//将具有树结构的字典转换成树结构
export const dictTranslateToTree = () => {
  return request({
    url: '/git-system/dict/tree',
    method: 'get',
    params: {
    }
  })
}

export const getDictTreeByCode = (code) => {
  return request({
    url: '/git-system/dict/treeByCode',
    method: 'get',
    params: {
      code
    }
  })
}

//根据CODE获取字典树形结构
export const dictTreeByCode = (code) => {
  return request({
    url: '/git-system/dict/treeAndKeyAsValue',
    method: 'get',
    params: {
      code
    }
  })
}



export const getDictTree = () => {
  return request({
    url: '/git-system/dict/tree?code=DICT',
    method: 'get'
  })
}

//部门
export const getDept = () => {
  return request({
    url: '/git-system/dept/tree?tenantId=000000',
    method: 'post',
  })
}
//产品-非同业为1，同业为2
export const product = (val) => {
  return request({
    url: '/git-param/product/listByProTarger?proTarger=' + val,
    method: 'get',
  })
}

//通过ID获取字典信息
export const getDictDetail = (id) => {
  return request({
    url: '/git-system/dict/detail',
    method: 'get',
    params: {
      id
    }
  })
}




