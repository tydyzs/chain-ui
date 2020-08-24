<!-- 额度台账---个人客户视图页面 -->
<template>
  <div class="viewContainer">
    <!-- 第一层基本信息部分 -->
    <div class="topInfo">
      <!-- 左侧客户名称+证件号码 -->
      <div class="leftCon">
        <template>
          <span>{{ topData.customerName }}</span>
          <span>{{ topData.customerNum }}</span>
        </template>
      </div>
      <!-- 右侧切换机构+查看关系人信息  -->
      <div class="rightCon">
        <span>
          切换机构：
          <el-select v-model="orgValue" placeholder size="mini" @change="selectChange">
            <el-option v-for="(item, i) in orgOptions" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </span>
        <span>
          <el-button class="btn" type="primary" size="mini" @click="toRelation(topData)">查看关系人信息</el-button>
        </span>
      </div>
    </div>
    <!-- 第二层图+表部分 -->
    <div class="chartTable">
      <!-- 第二层 左侧echarts图 -->
      <div class="leftChart" @click="showLeftChart">
        <linegraph v-if="flag1" :id="'pie'" :data="option1" style="height:30vh;"></linegraph>
      </div>
      <!-- 第二层 右侧table表格 -->
      <div class="rightTable">
        <el-table :data="rightTableData" style="width: 100%" size="mini" border>
          <el-table-column prop="caliber" label="统计口径" align="center"></el-table-column>
          <el-table-column prop="money" label="金额（元）" align="center">
            <template slot-scope="scope">
              {{ scope.row.money | NumsFormat }}
              <!-- {{ scope.row.money | NumFormat }} TODO: -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 第三层表+图部分 -->
    <div class="tableChart">
      <!-- 第三层 左侧table表格 -->
      <div class="leftTabel">
        <el-table :data="leftTableData" style="width: 100%" height="235" size="mini" border>
          <el-table-column prop="crdMainPrdName" label="额度大类" width="100" align="center">
          </el-table-column>
          <el-table-column prop="crdDetailPrdName" label="额度产品" width="150" align="center">
          </el-table-column>
          <el-table-column prop="limitCredit" label="授信额度" width="90" align="center">
            <!-- <template slot-scope="scope">
              {{ scope.row.limitCredit | NumFormat }}
            </template> -->
          </el-table-column>
          <el-table-column prop="limitUsed" label="授信额度已用" width="90" align="center">
            <!-- <template slot-scope="scope">
              {{ scope.row.limitUsed | NumFormat }}
            </template> -->
          </el-table-column>
          <el-table-column prop="limitAvi" label="授信额度可用" width="90" align="center">
            <!-- <template slot-scope="scope">
              {{ scope.row.limitAvi | NumFormat }}
            </template> -->
          </el-table-column>
          <el-table-column prop="expCredit" label="敞口额度" width="90" align="center">
            <!-- <template slot-scope="scope">
              {{ scope.row.expCredit | NumFormat }}
            </template> -->
          </el-table-column>
          <el-table-column prop="expAvi" label="敞口额度可用" width="90" align="center">
            <!-- <template slot-scope="scope">
              {{ scope.row.expAvi | NumFormat }}
            </template> -->
          </el-table-column>
          <el-table-column prop="expUsed" label="敞口额度已用" width="90" align="center">
            <!-- <template slot-scope="scope">
              {{ scope.row.expUsed | NumFormat }}
            </template> -->
          </el-table-column>
          <el-table-column prop="orgNum" label="经办机构" width="140" align="center">
            <template slot-scope="scope">
              {{orgDict[scope.row.orgNum]}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 第三层 右侧echarts图 -->
      <div class="rightChart" @click="showRightChart">
        <linegraph v-if="flag2" :id="'bar'" :data="option2" style="height:30vh;"></linegraph>
      </div>
    </div>
    <!-- 第二层echarts放大展示dialog框 -->
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :lock-scroll="false" :visible.sync="dialogVisible1"
      width="70%">
      <linegraph v-if="flag3" :id="'pie1'" :data="option11" style="height:60vh;"></linegraph>
    </el-dialog>
    <!-- 第三层echarts放大展示dialog框 -->
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :lock-scroll="false" :visible.sync="dialogVisible2"
      width="70%">
      <linegraph v-if="flag4" :id="'bar1'" :data="option22" style="height:60vh;"></linegraph>
    </el-dialog>
  </div>
</template>

<script>
import linegraph from '../../EchartsShow'
import { getOrgByCust, getSumCsmCrd, getCrdDetail } from '@/api/rcd/standBook/corporate'
import { dictTranslate } from '@/api/system/dict'
import { thousands } from "@/utils/thousands.js"
export default {
  data () {
    return {
      // 额度产品字典
      crdDict: {},
      // 机构字典
      orgDict: {},
      // 三个图表数据
      allDatas: [],
      // ===== 第一层数据源 =====
      // 第一层信息数据源
      topData: {},
      // 第一层中 右侧机构切换默认机构名称
      orgValue: '',
      // 第一层中 右侧机构切换默认机构号
      // orgNum: '',
      // 第一层中 右侧机构切换机构数据
      orgOptions: [],
      // ===== 第二层数据源 =====
      // 第二层 左侧echarts图数据
      option1: {
        title: {
          text: '额度结构图',
          x: 'center',
          top: '3%'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: '2%',
          top: '2%',
          data: []
          // data: ['一般保证额度','抵押额度','联保保证额度','票据融资（贴现）额度','低风险额度','信用卡额度']
        },
        series: [
          {
            name: '额度品种',
            type: 'pie',
            radius: '55%',
            center: ['50%', '55%'],
            data: [],
            // data: [
            //   { value: 500, name: '一般保证额度' },
            //   { value: 310, name: '抵押额度' },
            //   { value: 135, name: '联保保证额度' },
            //   { value: 200, name: '票据融资（贴现）额度' },
            //   { value: 135, name: '低风险额度' },
            //   { value: 135, name: '信用卡额度' }
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
      option11: {
        title: {
          text: '额度结构图',
          x: 'center',
          top: '3%'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: '2%',
          top: '2%',
          data: []
          // data: ['一般保证额度','抵押额度','联保保证额度','票据融资（贴现）额度','低风险额度','信用卡额度']
        },
        series: [
          {
            name: '额度品种',
            type: 'pie',
            radius: '55%',
            center: ['50%', '55%'],
            data: [],
            // data: [
            //   { value: 500, name: '一般保证额度' },
            //   { value: 310, name: '抵押额度' },
            //   { value: 135, name: '联保保证额度' },
            //   { value: 200, name: '票据融资（贴现）额度' },
            //   { value: 135, name: '低风险额度' },
            //   { value: 135, name: '信用卡额度' }
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
      flag1: false,
      flag3: false,
      // 第二层 右侧table表格数据
      rightTableData: [
        {
          caliber: '授信总额度',
          temp: 'limitCredit',
          money: ''
        }, {
          caliber: '授信额度已用',
          temp: 'limitUsed',
          money: ''
        }, {
          caliber: '授信额度可用',
          temp: 'limitAvi',
          money: ''
        }, {
          caliber: '敞口总额度',
          temp: 'approveExpAmount',
          money: ''
        }, {
          caliber: '授信敞口余额',
          temp: 'creditExpBalance',
          money: ''
        }, {
          caliber: '贷款敞口余额',
          temp: 'loanExpBalance',
          money: ''
        }
      ],
      // ===== 第三层数据源 =====
      // 第三层左侧table表格数据
      leftTableData: [],
      // 第三层右侧echarts图数据
      option2: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["授信额度可用", "授信额度已用", "敞口额度可用", "敞口额度已用"],
          top: "3%"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        yAxis: {
          type: "value"
        },
        xAxis: {
          type: "category",
          // nameLocation: 'start',
          axisLabel: {
            // interval: 0,
            rotate: -30  //倾斜的程度
          },
          data: []
          // data: ["流贷额度", "票据融资额度", "银票额度", "囤贷额度", "并购贷款额度"]
        },
        series: [
          {
            name: "授信额度可用",
            type: "bar",
            stack: "额度",
            data: []
            // data: [120, 140, 100, 145, 90,110, 115, 102, 50, 105]
          },
          {
            name: "授信额度已用",
            type: "bar",
            stack: "额度",
            data: []
            // data: [120, 140, 100, 145, 90,110, 115, 102, 50, 105]
          },
          {
            name: "敞口额度可用",
            type: "bar",
            stack: "敞口",
            data: []
            // data: [120, 140, 100, 145, 90,110, 115, 102, 50, 105]
          },
          {
            name: "敞口额度已用",
            type: "bar",
            stack: "敞口",
            data: []
            // data: [120, 140, 100, 145, 90,110, 115, 102, 50, 105]
          }
        ]
      },
      option22: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ["授信额度可用", "授信额度已用", "敞口额度可用", "敞口额度已用"],
          top: "3%"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        yAxis: {
          type: "value"
        },
        xAxis: {
          type: "category",
          // nameLocation: 'start',
          axisLabel: {
            interval: 0,
            rotate: -30  //倾斜的程度
          },
          data: []
          // data: ["流贷额度", "票据融资额度", "银票额度", "囤贷额度", "并购贷款额度"]
        },
        series: [
          {
            name: "授信额度可用",
            type: "bar",
            stack: "额度",
            data: []
            // data: [120, 140, 100, 145, 90,110, 115, 102, 50, 105]
          },
          {
            name: "授信额度已用",
            type: "bar",
            stack: "额度",
            data: []
            // data: [120, 140, 100, 145, 90,110, 115, 102, 50, 105]
          },
          {
            name: "敞口额度可用",
            type: "bar",
            stack: "敞口",
            data: []
            // data: [120, 140, 100, 145, 90,110, 115, 102, 50, 105]
          },
          {
            name: "敞口额度已用",
            type: "bar",
            stack: "敞口",
            data: []
            // data: [120, 140, 100, 145, 90,110, 115, 102, 50, 105]
          }
        ]
      },
      // 第三层 右侧echarts节流阀
      flag2: false,
      // 第三层 右侧echarts放大dialog框节流阀
      flag4: false,
      // ===== dialog中的数据 =====
      // 控制第二层echarts放大展示dialog框 显示与隐藏
      dialogVisible1: false,
      // 控制第三层echarts放大展示dialog框 显示与隐藏
      dialogVisible2: false
    }
  },
  created () {
    // console.log(this.$route.params.val, "打印传递值")
    // this.topData = this.$route.params.val
    this.topData = JSON.parse(sessionStorage.getItem("individualval"))
    // this.orgNum =  this.topData.orgNum
    // this.orgNum = '01000' // TODO:
    this.getOrg()
    // console.log(this.topData, '接收的参数');
    this.getOrgs()
  },
  methods: {
    // 机构字典
    getOrg () {
      dictTranslate('org').then(res => {
        // console.log(res, '机构字典');
        if (res.status != 200) {
          return this.$message.error('获取机构字典数据失败，请重试')
        }
        this.orgDict = res.data.data
      })
    },
    // 获取该客户下的机构
    getOrgs () {
      getOrgByCust(this.topData.customerNum).then(res => {
        //   console.log(res, '测试机构接口');
        // }) TODO:
        //  getOrgByCust('C002').then(res => {
        // console.log(res, '测试机构接口');
        if (res.status != 200) {
          return this.$message.error('获取机构数据失败，请重试')
        }
        const datas = res.data.data
        // console.log(datas, '打印综合数据');
        this.orgOptions = datas.map(item => {
          return { value: item.id, label: item.deptName }
        })
        // console.log(this.orgOptions, '222');
        // console.log(this.orgNum, '333');
        let arr = this.orgOptions.filter(item => {
          return item.value == this.topData.orgNum
        })
        // console.log(arr, '111');
        this.orgValue = arr[0].label
        // console.log(arr, '打印默认机构数据');
        this.getRightTable(this.topData.customerNum, arr[0].value)
        // this.getRightTable('C002', arr[0].value)  // TODO:
        this.getElseData(this.topData.customerNum, arr[0].value)
        //this.getElseData('C002', arr[0].value)
        // console.log(this.orgOptions,'打印机构列表');
      })
    },
    // 切换机构，触发该函数
    selectChange (e) {
      // console.log(e,'测试选项变化');
      this.getRightTable(this.topData.customerNum, e)
      //this.getRightTable('C002', e)
      this.getElseData(this.topData.customerNum, e)
      //this.getElseData('C002', e)
    },
    // 公共方法 获取右上角table表格数据
    getRightTable (a, b) {
      getSumCsmCrd(a, b).then(res => {
        // console.log(res, '右上角table数据');
        if (res.status != 200) {
          return this.$message.error('获取table数据失败，请重试')
        }
        const datas = res.data.data
        this.rightTableData.map(item => {
          item.money = datas[item.temp]
        })
        // console.log(this.rightTableData,'右上角表格111');
      })
    },
    // 公共方法 获取其他图表数据
    getElseData (a, b) {
      getCrdDetail(a, b).then(res => {
        // console.log(res, '打印其他图表数据');
        if (res.status != 200) {
          return this.$message.error('获取图表数据失败，请重试')
        }
        const datas = res.data.data
        // console.log(datas, '三个图表数据');
        this.leftTableData = JSON.parse(JSON.stringify(datas))
        thousands(this.leftTableData)
        this.allDatas = datas
        console.log(this.allDatas, '333');
        // 第二层 左侧echarts数据
        this.option1.legend.data = datas.map(item => {
          return item.crdDetailPrdName
        })
        this.option1.series[0].data = datas.map(item => {
          return { value: item.limitCredit, name: item.crdDetailPrdName }
        })
        this.flag1 = true
        // 第三层 右侧echarts数据
        this.option2.xAxis.data = datas.map(item => {
          return item.crdDetailPrdName
        })
        // console.log(this.option2.xAxis.data,'变化的图表数据');
        // 授信额度可用 数据
        this.option2.series[0].data = datas.map(item => {
          return item.limitAvi
        })
        // 授信额度已用 数据
        this.option2.series[1].data = datas.map(item => {
          return item.limitUsed
        })
        // 可用敞口 数据
        this.option2.series[2].data = datas.map(item => {
          return item.expAvi
        })
        // 已用敞口 数据
        this.option2.series[3].data = datas.map(item => {
          return item.expUsed
        })
        this.flag2 = true
        // console.log(this.option2.xAxis.data, '三级额度');
      })
    },
    // 点击第二层 左侧echarts图，放大展示
    showLeftChart () {
      this.option11.legend.data = this.allDatas.map(item => {
        return item.crdDetailPrdName
      })
      this.option11.series[0].data = this.allDatas.map(item => {
        return { value: item.limitCredit, name: item.crdDetailPrdName }
      })
      this.flag3 = true
      this.dialogVisible1 = true
    },
    // 点击第三层 右侧echarts图，放大展示
    showRightChart () {
      // console.log('测试按钮');
      this.option22.xAxis.data = this.allDatas.map(item => {
        return item.crdDetailPrdName
      })
      // 授信额度可用 数据
      this.option22.series[0].data = this.allDatas.map(item => {
        return item.limitAvi
      })
      // 授信额度已用 数据
      this.option22.series[1].data = this.allDatas.map(item => {
        return item.limitUsed
      })
      // 可用敞口 数据
      this.option22.series[2].data = this.allDatas.map(item => {
        return item.expAvi
      })
      // 已用敞口 数据
      this.option22.series[3].data = this.allDatas.map(item => {
        return item.expUsed
      })
      this.flag4 = true
      this.dialogVisible2 = true
    },
    toRelation (val) {
      this.$router.push({ name: 'relation', params: { val: val } })
      sessionStorage.setItem('relationVal', JSON.stringify(val))
    }
  },
  components: {
    linegraph
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/ledgerView.scss';
.viewContainer {
  // 第三层 表+图 样式
  .tableChart {
    display: flex;
    justify-content: space-between;
    .leftTabel {
      width: 55%;
    }
    .rightChart {
      width: 43%;
    }
  }
}
</style>
