import request from '@/utils/request'
import defaultSettings from '@/settings'

export const getListStatisArea = () => {
  return request({
    url: defaultSettings.urlPrefix +'/git-chart/org-chart/listStatisArea',
    method: 'post',
  })
}