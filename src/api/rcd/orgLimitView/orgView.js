// 360视图下的 机构视图接口
import request from '@/utils/request'

// 获取该机构的基础统计数据
export const getDatas = (orgNum) => {
  return request({
    url: '/git-chart/org-chart/getStatisOrg',
    method: 'get',
    params: {
      orgNum
    }
  })
}

// 获取该机构的统计数据
export const getSumData = (dimension, orgNum) => {
  return request({
    url: '/git-chart/org-chart/listStatis',
    method: 'get',
    params: {
      dimension,
      orgNum
    }
  })
}
