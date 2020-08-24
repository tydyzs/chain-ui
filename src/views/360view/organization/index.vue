<template>
  <div class="orgContainer">
    <!-- 搜索区内容 -->
    <el-form :inline="true" :model="ruleForm" class="demo-form-inline" size="small">
      <el-form-item label="当前机构">
        <el-select v-if="!treeIf" v-model="orgs" disabled placeholder="请选择">
          <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <tree-select v-if="treeIf" v-model="orgs" :props="props" :options="orgData" :clearable="isClearable" :accordion="isAccordion" />
      </el-form-item>
      <el-form-item label="当前维度">
        <el-select v-model="limitValue" placeholder="请选择维度" size="small" @change="chooseLim">
          <el-option v-for="item in chartList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="当前口径">
        <el-select v-model="sumValue" placeholder="请选择口径" size="small" @change="chooseSum">
          <el-option v-for="item in sumList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" @click="getTableData">查询</el-button>
      </el-form-item> -->
    </el-form>
    <!-- 第一层数据展示区 -->
    <div class="topData">
      <!-- 金额 -->
      <div class="money">
        <span>
          授信额度（万元）
          <br />
          <i>{{ topData.limitCredit | NumsFormat }}</i>
        </span>
        <span style="width: 0;border-right: 1px solid #999;"></span>
        <span>
          敞口额度（万元）
          <br />
          <i>{{ topData.approveExpAmount | NumsFormat }}</i>
        </span>
        <span style="width: 0;border-right: 1px solid #999;"></span>
        <span>
          授信敞口余额（万元）
          <br />
          <i>{{ topData.creditExpBalance | NumsFormat }}</i>
        </span>
        <span style="width: 0;border-right: 1px solid #999;"></span>
        <span>
          贷款敞口余额（万元）
          <br />
          <i>{{ topData.loanExpBalance | NumsFormat }}</i>
        </span>
      </div>
      <!-- 客户总数 -->
      <div class="totals">
        <span>
          个人客户总数
          <br />
          <i>{{ topData.individualCount }}</i>
        </span>
        <span style="width: 0;border-right: 1px solid #999;"></span>
        <span>
          公司客户总数
          <br />
          <i>{{ topData.corporationCount }}</i>
        </span>
        <span style="width: 0;border-right: 1px solid #999;"></span>
        <span>
          同业客户总数
          <br />
          <i>{{ topData.bankCount }}</i>
        </span>
      </div>
    </div>
    <!-- 第二层图+表 -->
    <div class="echartTable">
      <!-- 第二层左侧echarts图 -->
      <div class="leftChart" @click="showLeftChart">
        <linegraph v-if="flag1" :id="'pie'" :data="option1" style="height:230px;"></linegraph>
      </div>
      <!-- 第二层右侧table表格 -->
      <div class="rightTable">
        <el-table :data="rightTable" max-height="230" style="width: 100%" border stripe size="small">
          <el-table-column :resizable="false" align="center" prop="keyName" :label="labelTitle"></el-table-column>
          <el-table-column :resizable="false" align="center" prop="sum" label="金额" width="180">
            <template slot-scope="scope">{{ scope.row.sum | NumFormat }}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 第三层表+图 -->
    <div class="tableChart">
      <!-- 第三层左侧table表格 -->
      <div class="leftTable">
        <el-table :data="leftTable" style="width: 100%" height="240" border stripe size="small">
          <el-table-column :resizable="false" align="center" prop="keyNames" :label="labelTitle" width="155"></el-table-column>
          <el-table-column :resizable="false" align="center" prop="now" label="本期" width="100">
            <template slot-scope="scope">{{ scope.row.now | NumFormat }}</template>
          </el-table-column>
          <el-table-column :resizable="false" align="center" prop="same" label="同期（增幅）" width="160"></el-table-column>
          <el-table-column :resizable="false" align="center" prop="early" label="年初（增幅）" width="160"></el-table-column>
          <el-table-column :resizable="false" align="center" prop="last" label="上期（增幅）" width="160"></el-table-column>
        </el-table>
      </div>
      <!-- 第三层右侧echarts图 -->
      <div class="leftChart">
        <div @click="showRightChart">
          <linegraph v-if="flag2" :id="'bar'" :data="option2" style="height:230px;"></linegraph>
        </div>
      </div>
    </div>
    <!-- 第二层echarts放大展示dialog框 -->
    <el-dialog :visible.sync="dialogVisible1" :lock-scroll="false" width="70%">
      <linegraph v-if="flag3" :id="'pie1'" :data="option11" style="height:60vh;"></linegraph>
    </el-dialog>
    <!-- 第三层echarts放大展示dialog框 -->
    <el-dialog :visible.sync="dialogVisible2" :lock-scroll="false" width="70%">
      <linegraph v-if="flag4" :id="'bar1'" :data="option22" style="height:60vh;"></linegraph>
    </el-dialog>
  </div>
</template>

<script>
import TreeSelect from '@/components/TreeSelect/expand.vue'
import linegraph from '../../EchartsShow'
import { getUserInfo } from '@/api/user'
import { getDeptTreeManage } from '@/api/system/dept'
import { getDatas, getSumData } from '@/api/rcd/orgLimitView/orgView'
import { deepClone, extend } from "@/utils/clone.js"
export default {
  data () {
    return {
      treeIf: false,
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: {
        // 配置项（必选）
        formVal: '',
        value: 'id',
        label: 'title',
        children: 'children',
        disabled: false,
        identifier: ['3'] // 限制层级
      },
      // 当前选中的组件
      // currentComp: 'test1',
      // 选择机构中的数据
      orgs: '',
      orgsValue: '',
      orgData: [], // 选择机构中的机构树数据源
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      filterText: '',
      // orgValue: "",
      // orgOptions: "",
      // 当前选中的维度值
      limitValue: '1',
      // 当前选中的口径值
      sumValue: '1',
      // 机构id
      deptId: '',
      // 当前机构、维度下的综合数据
      allDatas: [],
      // 维度选择数据源
      chartList: [
        {
          value: '1',
          label: '行业分类'
        },
        {
          value: '2',
          label: '额度品种'
        },
        {
          value: '3',
          label: '客户类型'
        },
        {
          value: '4',
          label: '担保方式'
        },
        {
          value: '5',
          label: '企业规模'
        }
      ],
      // 统计口径数据源
      sumList: [
        {
          value: '1',
          label: '授信额度'
        },
        {
          value: '2',
          label: '敞口额度'
        },
        {
          value: '3',
          label: '授信敞口金额'
        },
        {
          value: '4',
          label: '贷款敞口金额'
        }
      ],
      // 第一层 基础数据
      topData: {},
      ruleForm: {},
      // 第二层 echarts图节流阀
      // flag1: false,
      // 第二层 左侧echarts图数据
      option1: {
        title: {
          text: '授信额度结构',
          subtext: '',
          x: 'center',
          top: '3%'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          left: '2%',
          top: '2%',
          data: [],
          selected: {}
          // data: ['农、林、牧、渔业', '采矿业', '制造业', '航空运输业', '批发和零售业']
        },
        series: [
          {
            name: '行业',
            type: 'pie',
            radius: '55%',
            center: ['55%', '60%'],
            data: [],
            // data: [
            //   { value: 500, name: '农、林、牧、渔业' },
            //   { value: 310, name: '采矿业' },
            //   { value: 135, name: '制造业' },
            //   { value: 200, name: '航空运输业' },
            //   { value: 135, name: '批发和零售业' },
            // ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      // 第二层 放大展示dialog框中echarts图数据
      option11: {},
      // 第二层 echarts图控制开关
      flag1: false,
      // 第二层 右侧table表格数据
      rightTable: [],
      // 第三层 左侧table表格
      leftTable: [],
      // 第三层 右侧echarts图
      option2: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          // left: '10%',
          y: 80,
          y2: 40,
          x: 100
        },
        legend: {
          type: 'scroll',
          data: [],
          selected: {}
        },
        xAxis: [
          {
            type: 'category',
            data: ['同期', '年初', '上期', '本期'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额（元）',
            min: 0,
            // max: 200,
            // interval: 50,
            axisLabel: {
              formatter: '{value} '
            }
          },
          // {
          //   type: 'value',
          //   name: '金额（亿元）',
          //   min: 0,
          //   // max: 200,
          //   // interval: 50,
          //   axisLabel: {
          //     formatter: ' {value}'
          //   }
          // }
        ],
        series: [],
      },
      // 第三层 放大展示dialog框中echarts图数据
      option22: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          top: '20',
          right: '10',
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        grid: {
          y: 80,
          y2: 40
        },
        legend: {
          type: 'scroll',
          data: [],
          selected: {}
        },
        xAxis: [
          {
            type: 'category',
            data: ['同期', '年初', '上期', '本期'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额（元）',
            min: 0,
            // max: 200,
            // interval: 50,
            axisLabel: {
              formatter: '{value} '
            }
          },
          // {
          //   type: 'value',
          //   name: '金额（亿元）',
          //   min: 0,
          //   max: 200,
          //   interval: 50,
          //   axisLabel: {
          //     formatter: ' {value}'
          //   }
          // }
        ],
        series: []
      },
      // 第三层 右侧echarts图控制开关
      flag2: false,
      // 第二层 dialog框中echarts的节流阀开发
      flag3: false,
      dialogVisible1: false,
      // 第三层 dialog框中echarts的节流阀开发
      flag4: false,
      dialogVisible2: false,
      labelTitle: '行业'
    }
  },
  watch: {
    // 监听 搜索区 当前机构 机构树
    filterText (val) {
      this.$refs.orgTree.filter(val)
    }
  },
  created () {
    this.getUser()
  },
  methods: {
    // 页面初期加载，获取当前登录人信息，以 信息中的登录机构号 为参数，发起 get网络请求，获取 机构树 数据
    getUser () {
      getUserInfo().then(res => {
        // console.log(res, '机构视图下，获取当前登录人信息')
        if (res.status != 200) {
          return this.$message.error('获取当前登录人信息失败，请重试')
        }
        const userInfo = res.data.data
        getDeptTreeManage(userInfo.deptId).then(res => {
          // console.log(res, '机构视图下，获取机构树数据')
          if (res.status != 200) {
            return this.$message.error('获取机构树数据失败，请重试')
          }
          const orgs = res.data.data
          this.orgData = orgs
          // console.log(this.orgData, '打印机构树')
          // console.log(this.orgData[0].deptLevel, '打印机构级别');
          // 当前登录机构为省联社的时候，当前机构默认显示省联社，当前登录机构为市一级机构时，当前机构默认显示该市级下第一个成员行机构，当前登录机构为成员行时，当前机构默认显示该成员行
          if (this.orgData[0].deptLevel == 1 || this.orgData[0].deptLevel == 3) {
            this.orgs = this.orgData[0].id
            this.deptId = this.orgData[0].id
            // console.log(this.deptId,'当前机构号')id
            this.getTopData(this.orgData[0].id)
            this.getDatas(this.limitValue, this.deptId, '行业分类')
          } else if (this.orgData[0].deptLevel == 2) {
            this.orgs = this.orgData[0].children[0].id
            this.deptId = this.orgData[0].children[0].id
            this.getTopData(this.orgData[0].children[0].id)
            this.getDatas(this.limitValue, this.deptId, '行业分类')
          }
          this.treeIf = true
        })
      })
    },
    // 公共方法 获取该机构下的第一层基础数据
    getTopData (e) {
      getDatas(e).then(res => {
        // console.log(res, '获取第一层基础数据')
        if (res.status != 200) {
          return this.$message.error('获取当前机构下基础数据失败，请重试')
        }
        this.topData = res.data.data
      })
    },
    // 搜索区 当前机构 机构树节点选择，触发该函数
    // handleNodeClick (e) {
    //   console.log(e, '测试选择变化');
    //   if (e.deptLevel == 1 || e.deptLevel == 3) {
    //     this.orgs = e.id
    //     this.orgsValue = e.title
    //     // this.deptId = e.id
    //   }
    // },
    // 搜索区 当前机构 选择下拉框中的过滤函数
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 搜索区 选择当前维度，触发该函数
    chooseLim () {
      // console.log(this.limitValue, "item");
      if (this.limitValue == 1) {
        const subtext = '行业分类'
        this.labelTitle = '行业'
        this.getDatas(this.limitValue, this.deptId, subtext)
      } else if (this.limitValue == 2) {
        const subtext = '额度品种'
        this.labelTitle = '额度品种'
        this.getDatas(this.limitValue, this.deptId, subtext)
      } else if (this.limitValue == 3) {
        const subtext = '客户类型'
        this.labelTitle = '客户类型'
        this.getDatas(this.limitValue, this.deptId, subtext)
      } else if (this.limitValue == 4) {
        const subtext = '担保方式'
        this.labelTitle = '担保方式'
        this.getDatas(this.limitValue, this.deptId, subtext)
      } else if (this.limitValue == 5) {
        const subtext = '企业规模'
        this.labelTitle = '企业规模'
        this.getDatas(this.limitValue, this.deptId, subtext)
      }
    },
    // 搜索区 改变当前机构选项，触发该函数
    selectChange (e) {
      // console.log(e,'测试按钮');
      if (!e) {
        this.filterText = ''
      }
    },
    // 搜索区 机构选择时，用过关键字过滤结果，触发该函数
    filterNode (value, data) {
      // console.log(value,data,'66666');
      if (!value) return true
      return data.label.indexOf(value) !== -1
      id
    },
    // 搜索区 选中机构树节点，触发该函数
    handleNodeClick (data) {
      console.log(data, '选中节点')
      if (data.deptLevel == 1 || data.deptLevel == 3) {
        this.orgs = data.id
        this.deptId = data.id
        this.getDatas(this.limitValue, this.deptId)
      }
    },
    // 搜索区 选择统计口径，触发该函数
    chooseSum () {
      // console.log(this.limitValue, '1111')
      // console.log(this.sumValue, '2222');
      if (this.limitValue == 1) {
        const a = '行业分类'
        this.toggleSum(a)
      } else if (this.limitValue == 2) {
        const a = '额度品种'
        this.toggleSum(a)
      } else if (this.limitValue == 3) {
        const a = '客户类型'
        this.toggleSum(a)
      } else if (this.limitValue == 4) {
        const a = '担保方式'
        this.toggleSum(a)
      } else if (this.limitValue == 5) {
        const a = '企业规模'
        this.toggleSum(a)
      }
    },
    // 公共方法 获取当前机构、当前维度下的统计数据
    getDatas (a, b, c) {
      getSumData(a, b).then(res => {
        // console.log(res, '获取不同维度下的数据')
        if (res.status != 200) {
          return this.$message.error('获取图表综合数据失败，请重试')
        }
        const datas = res.data.data
        this.allDatas = res.data.data
        // 第二层 左侧echarts图数据
        this.option1.legend.data = datas.map(item => {
          return item.keyName
        })
        console.log(this.option1.legend.data,'000');
        let legendArr = this.option1.legend.data.slice(6)
        legendArr.forEach((item) => {
          let obj = {}
          obj[item] = false
          let objs = extend(this.option1.legend.selected, obj)
          this.option1.legend.selected = objs
        })
        this.option1.series[0].data = datas.map(item => {
          return { value: item.limitCredit, name: item.keyName }
        })
        this.option1.title.subtext = c
        this.flag1 = true
        // 第二层 dialog框中的echarts
        this.option11 = deepClone(this.option1)

        // 第二层 右侧table表格数据
        this.rightTable = datas.map(item => {
          return { keyName: item.keyName, sum: item.limitCredit }
        })
        // console.log(this.rightTable,'右侧数据111');
        // 第三层 左侧table表格数据
        this.leftTable = datas.map(item => {
          // 同期（增幅）
          const sames = this.$options.filters['NumFormat'](item.limitCreditTq) + '(' + item.limitCreditTqup + '%' + ')'
          // 年初（增幅）
          const earlys = this.$options.filters['NumFormat'](item.limitCreditNc) + '(' + item.limitCreditNc + '%' + ')'
          // 上期（增幅）
          const lasts = this.$options.filters['NumFormat'](item.limitCreditSq) + '(' + item.limitCreditSqup + '%' + ')'
          return { keyNames: item.keyName, now: item.limitCredit, same: sames, early: earlys, last: lasts }
        })
        // 第三层 右侧echarts图数据
        this.option2.legend.data = datas.map(item => {
          return item.keyName
        })
        // console.log(this.option2.legend.data,'000');
        let legendArr2 = this.option2.legend.data.slice(5)
        legendArr2.forEach((item) => {
          let obj = {}
          obj[item] = false
          let objs = extend(this.option2.legend.selected, obj)
          this.option2.legend.selected = objs
        })
        this.option2.series = datas.map(item => {
          // 同期数据
          const data = [item.limitCreditTq, item.limitCreditNc, item.limitCreditSq, item.limitCredit]
          return { name: item.keyName, type: 'bar', data: data }
        })
        // console.log(this.option2.series, '打印第三层数据');
        this.flag2 = true
        // 第三层 dialog框中的echarts
        this.option22.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        let legendArr22 = this.option22.legend.data.slice(7)
        legendArr22.forEach((item) => {
          let obj = {}
          obj[item] = false
          let objs = extend(this.option22.legend.selected, obj)
          this.option22.legend.selected = objs
        })
        this.option22.series = this.allDatas.map(item => {
          // 同期数据
          const data = [item.limitCreditTq, item.limitCreditNc, item.limitCreditSq, item.limitCredit]
          return { name: item.keyName, type: 'bar', data: data }
        })
      })
    },
    // 公共方法 切换当前口径，触发该函数
    toggleSum (a) {
      if (this.sumValue == 1) {
        // 授信额度
        // 第二层 左侧echarts图数据
        this.option1.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option1.series[0].data = this.allDatas.map(item => {
          return { value: item.limitCredit, name: item.keyName }
        })
        this.option1.title.subtext = a
        this.flag1 = true
        // 第二层 dialog中的echarts
        this.option11.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option11.series[0].data = this.allDatas.map(item => {
          return { value: item.limitCredit, name: item.keyName }
        })
        // 第二层 右侧table表格数据
        this.rightTable = this.allDatas.map(item => {
          return { keyName: item.keyName, sum: item.limitCredit }
        })
        // console.log(this.rightTable,'右侧数据111');
        // 第三层 左侧table表格数据
        this.leftTable = this.allDatas.map(item => {
          // 同期（增幅）
          const sames = this.$options.filters['NumFormat'](item.limitCreditTq) + '(' + item.limitCreditTqup + '%' + ')'
          // 年初（增幅）
          const earlys = this.$options.filters['NumFormat'](item.limitCreditNc) + '(' + item.limitCreditNc + '%' + ')'
          // 上期（增幅）
          const lasts = this.$options.filters['NumFormat'](item.limitCreditSq) + '(' + item.limitCreditSqup + '%' + ')'
          return { keyNames: item.keyName, now: item.limitCredit, same: sames, early: earlys, last: lasts }
        })
        // 第三层 右侧echarts图数据
        this.option2.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option2.series = this.allDatas.map(item => {
          // 同期数据
          const data = [item.limitCreditTq, item.limitCreditNc, item.limitCreditSq, item.limitCredit]
          return { name: item.keyName, type: 'bar', data: data }
        })
        this.flag2 = true
        // 第三层 dialog中的echarts
        this.option22.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option22.series = this.allDatas.map(item => {
          // 同期数据
          const data = [item.limitCreditTq, item.limitCreditNc, item.limitCreditSq, item.limitCredit]
          return { name: item.keyName, type: 'bar', data: data }
        })
      } else if (this.sumValue == 2) {
        // 敞口额度
        // 第二层 左侧echarts图数据
        this.option1.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option1.series[0].data = this.allDatas.map(item => {
          return { value: item.approveExpAmount, name: item.keyName }
        })
        this.option1.title.subtext = a
        this.flag1 = true
        // 第二层 dialog中的echarts
        this.option11.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option11.series[0].data = this.allDatas.map(item => {
          return { value: item.approveExpAmount, name: item.keyName }
        })
        // 第二层 右侧table表格数据
        this.rightTable = this.allDatas.map(item => {
          return { keyName: item.keyName, sum: item.approveExpAmount }
        })
        // console.log(this.rightTable,'右侧数据111');
        // 第三层 左侧table表格数据
        this.leftTable = this.allDatas.map(item => {
          // 同期（增幅）
          const sames = this.$options.filters['NumFormat'](item.approveExpAmountTq) + '(' + item.approveExpAmountTqup + '%' + ')'
          // 年初（增幅）
          const earlys = this.$options.filters['NumFormat'](item.approveExpAmountNc) + '(' + item.approveExpAmountNcup + '%' + ')'
          // 上期（增幅）
          const lasts = this.$options.filters['NumFormat'](item.approveExpAmountSq) + '(' + item.approveExpAmountSqup + '%' + ')'
          return { keyNames: item.keyName, now: item.limitCredit, same: sames, early: earlys, last: lasts }
        })
        // 第三层 右侧echarts图数据
        this.option2.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option2.series = this.allDatas.map(item => {
          // 同期数据
          const data = [item.approveExpAmountTq, item.approveExpAmountNc, item.approveExpAmountSq, item.approveExpAmount]
          return { name: item.keyName, type: 'bar', data: data }
        })
        this.flag2 = true
        // 第三层 dialog中的echarts
        this.option22.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option22.series = this.allDatas.map(item => {
          // 同期数据
          const data = [item.approveExpAmountTq, item.approveExpAmountNc, item.approveExpAmountSq, item.approveExpAmount]
          return { name: item.keyName, type: 'bar', data: data }
        })
      } else if (this.sumValue == 3) {
        // 授信敞口金额
        // 第二层 左侧echarts图数据
        this.option1.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option1.series[0].data = this.allDatas.map(item => {
          return { value: item.creditExpBalance, name: item.keyName }
        })
        this.option1.title.subtext = a
        this.flag1 = true
        // 第二层 dialog中echarts
        this.option11.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option11.series[0].data = this.allDatas.map(item => {
          return { value: item.creditExpBalance, name: item.keyName }
        })
        // 第二层 右侧table表格数据
        this.rightTable = this.allDatas.map(item => {
          return { keyName: item.keyName, sum: item.creditExpBalance }
        })
        // console.log(this.rightTable,'右侧数据111');
        // 第三层 左侧table表格数据
        this.leftTable = this.allDatas.map(item => {
          // 同期（增幅）
          const sames = this.$options.filters['NumFormat'](item.creditExpBalanceTq) + '(' + item.creditExpBalanceTqup + '%' + ')'
          // 年初（增幅）
          const earlys = this.$options.filters['NumFormat'](item.creditExpBalanceNc) + '(' + item.creditExpBalanceNcup + '%' + ')'
          // 上期（增幅）
          const lasts = this.$options.filters['NumFormat'](item.creditExpBalanceSq) + '(' + item.creditExpBalanceSqup + '%' + ')'
          return { keyNames: item.keyName, now: item.limitCredit, same: sames, early: earlys, last: lasts }
        })
        // 第三层 右侧echarts图数据
        this.option2.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option2.series = this.allDatas.map(item => {
          // 同期数据
          const data = [item.creditExpBalanceTq, item.creditExpBalanceNc, item.creditExpBalanceSq, item.creditExpBalance]
          return { name: item.keyName, type: 'bar', data: data }
        })
        this.flag2 = true
        // 第三层 dialog中echarts
        this.option22.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option22.series = this.allDatas.map(item => {
          // 同期数据
          const data = [item.creditExpBalanceTq, item.creditExpBalanceNc, item.creditExpBalanceSq, item.creditExpBalance]
          return { name: item.keyName, type: 'bar', data: data }
        })
      } else if (this.sumValue == 4) {
        // 贷款敞口金额
        // 第二层 左侧echarts图数据
        this.option1.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option1.series[0].data = this.allDatas.map(item => {
          return { value: item.loanExpBalance, name: item.keyName }
        })
        this.option1.title.subtext = a
        this.flag1 = true
        // 第二层 dialog中echarts
        this.option11.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option11.series[0].data = this.allDatas.map(item => {
          return { value: item.loanExpBalance, name: item.keyName }
        })
        // 第二层 右侧table表格数据
        this.rightTable = this.allDatas.map(item => {
          return { keyName: item.keyName, sum: item.loanExpBalance }
        })
        // console.log(this.rightTable,'右侧数据111');
        // 第三层 左侧table表格数据
        this.leftTable = this.allDatas.map(item => {
          // 同期（增幅）
          const sames = this.$options.filters['NumFormat'](item.loanExpBalanceTq) + '(' + item.loanExpBalanceTqup + '%' + ')'
          // 年初（增幅）
          const earlys = this.$options.filters['NumFormat'](item.loanExpBalanceNc) + '(' + item.loanExpBalanceNcup + '%' + ')'
          // 上期（增幅）
          const lasts = this.$options.filters['NumFormat'](item.loanExpBalanceSq) + '(' + item.loanExpBalanceSqup + '%' + ')'
          return { keyNames: item.keyName, now: item.limitCredit, same: sames, early: earlys, last: lasts }
        })
        // 第三层 右侧echarts图数据
        this.option2.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option2.series = this.allDatas.map(item => {
          // 同期数据
          const data = [item.loanExpBalanceTq, item.loanExpBalanceNc, item.loanExpBalanceSq, item.loanExpBalance]
          return { name: item.keyName, type: 'bar', data: data }
        })
        this.flag2 = true
        // 第三层 dialog中echarts
        this.option22.legend.data = this.allDatas.map(item => {
          return item.keyName
        })
        this.option22.series = this.allDatas.map(item => {
          // 同期数据
          const data = [item.loanExpBalanceTq, item.loanExpBalanceNc, item.loanExpBalanceSq, item.loanExpBalance]
          return { name: item.keyName, type: 'bar', data: data }
        })
      }
    },
    // 点击第二层 左侧echarts图，放大展示
    showLeftChart () {
      console.log('测试按钮');
      this.flag3 = true
      this.dialogVisible1 = true
    },
    // 点击第三层 右侧echarts图，放大展示
    showRightChart () {
      this.flag4 = true
      this.dialogVisible2 = true
    }
  },
  components: {
    linegraph,
    TreeSelect
  }
}
</script>

<style lang="scss" scoped>
.orgContainer {
  padding: 0.5vw 1vh;
  // 搜索区 样式
  .demo-form-inline {
    height: 30px;
  }
  // 第一层数据展示区 样式
  .topData {
    display: flex;
    justify-content: space-between;
    margin: 1.9vh 0 1vh;
    // 通用样式
    i {
      font-style: normal;
      font-size: 24px;
    }
    span {
      display: inline-block;
      text-align: center;
      // border: 1px solid #999;
      font-size: 12px;
    }
    .money,
    .totals {
      display: flex;
      justify-content: space-around;
      width: 49%;
      padding: 10px 5px;
      border: 1px solid #dfd8d8;
      border-radius: 5px;
      box-shadow: 1px 1px 4px #ccc;
      box-sizing: border-box;
    }
    .money {
      width: 60%;
    }
    .totals {
      width: 38%;
    }
  }
  // 通用样式
  .leftChart,
  .rightTable,
  .leftTable,
  .leftChart {
    border: 1px solid #dfd8d8;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    box-shadow: 1px 1px 4px #ccc;
  }
  // 第二层图+表 样式
  .echartTable {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1vh;
    // 第二层左侧echarts图 样式
    .leftChart {
      width: 60%;
    }
    // 第二层右侧table表格 样式
    .rightTable {
      width: 38%;
    }
  }
  // 第三层表+图 样式
  .tableChart {
    display: flex;
    justify-content: space-between;
    .leftTable {
      width: 49%;
    }
    .leftChart {
      width: 49%;
    }
  }
}
</style>
