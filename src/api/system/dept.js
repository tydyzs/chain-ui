import request from '@/utils/request'

// 获取机构树的最新接口
export const getDeptTreeManage = (orgNum) => {
  return request({
    url: '/git-system/dept/treeManage',
    method: 'post',
    params: {
      orgNum
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/git-system/dept/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/git-system/dept/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/git-system/dept/submit',
    method: 'post',
    data: row
  })
}

export const getDept = (id) => {
  return request({
    url: '/git-system/dept/detail',
    method: 'post',
    params: {
      id,
    }
  })
}

export const getDeptTree = (tenantId) => {
  return request({
    url: '/git-system/dept/treeManage',
    method: 'post',
    params: {
      tenantId,
    }
  })
}

// 获取机构列表接口（平铺，分页）
export const getDeptList = (current,size,param) => {
  return request({
    url: '/git-system/dept/getList',
    method: 'post',
    params: {
      current,
      size,
      deptName: param.deptName,
      fullName: param.fullName,
      orgType: param.orgType
    }
  })
}

