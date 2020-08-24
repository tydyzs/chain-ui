/**
 * 全局配置文件
 */
export default {
  title: "UCL",
  logo: "S",
  key: 'UCL',//配置主键,目前用于存储
  indexTitle: '江西省农商银行',
  clientId: 'saber', // 客户端id
  clientSecret: 'saber_secret', // 客户端密钥
  tenantMode: false, // 是否开启租户模式
  lockPage: '/lock',
  tokenTime: 3000,
  //http的status默认放行不才用统一处理的,
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont iconicon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source', // source 为数据表中的一个字段，发起侧边栏菜单请求时一起获取到，内容未字体图标的名称
      children: 'children'
    }
  }
}
