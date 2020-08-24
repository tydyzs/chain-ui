<!-- 集团客户360视图 -->
<template>
  <div class="viewContainer">
    <!-- 第一层基本信息部分 -->
    <div class="topInfo">
      <!-- 左侧客户名称+证件号码 -->
      <div class="leftCon">
        <template>
          <span>{{ topData.customerName }}</span>
          <span>{{ topData.memberCustomerNum }}</span>
        </template>
      </div>
      <!-- 右侧切换机构+查看关系人信息 -->
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
      <div class="leftChart" @click="showBar">
        <linegraph v-if="flag1" :id="'bar'" :data="option1" style="height:30vh;"></linegraph>
      </div>
      <div class="rightTable">
        <el-table :data="secTableData" style="width: 100%" size="small" border height="230">
          <el-table-column prop="sumCaliber" label="统计口径" width="180" align="center" :resizable="false">
          </el-table-column>
          <el-table-column prop="money" label="金额（元）" width="180" align="center" :resizable="false">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 第三层表+图部分 -->
    <div class="tableChart">
      <!-- 第三层 左侧echarts图 -->
      <div class="leftChart">
        <TreeChart class="treeChart" :json="treeData" @click-node="handle" />
      </div>
      <!-- 第三层 右侧table表格 -->
      <div class="rightTable">
        <el-table :data="rightTableData" style="width: 100%" height="360" size="small" border>
          <el-table-column prop="customerName" label="成员客户名称" width="110" align="center" :resizable="false">
          </el-table-column>
          <el-table-column prop="superCrdName" label="额度大类" width="110" align="center" :resizable="false">
          </el-table-column>
          <el-table-column prop="crdProductName" label="额度产品" width="150" align="center" :resizable="false">
          </el-table-column>
          <el-table-column prop="limitCredit" label="授信额度" align="center" :resizable="false">
          </el-table-column>
          <el-table-column prop="limitUsed" label="已用额度" align="center" :resizable="false">
          </el-table-column>
          <el-table-column prop="limitAvi" label="可用额度" align="center" :resizable="false">
          </el-table-column>
          <el-table-column prop="expCredit" label="授信敞口" align="center" :resizable="false">
          </el-table-column>
          <el-table-column prop="expAvi" label="可用敞口" align="center" :resizable="false">
          </el-table-column>
          <el-table-column prop="expUsed" label="已用敞口" align="center" :resizable="false">
          </el-table-column>
          <el-table-column prop="orgName" label="经办机构" width="110" align="center" :resizable="false">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 第二层echarts放大dialog框 -->
    <el-dialog :visible.sync="dialogVisible" width="80%" :lock-scroll="false">
      <linegraph v-if="flag2" :id="'Bar'" :data="option11" style="height:70vh;"></linegraph>
    </el-dialog>
  </div>
</template>

<script>
// import urls from "../../../../vue.config.js"
import linegraph from '../../EchartsShow'
import TreeChart from '@/components/TreeChart'
import { getOrgByCust } from '@/api/rcd/standBook/corporate'
import { groupMemberDetail, groupChartTable } from '@/api/rcd/standBook/group.js'
import { thousands } from "@/utils/thousands.js"
export default {
  data () {
    return {
      // 第一层信息数据源
      topData: {},
      // 第一层中 右侧机构切换默认数据
      orgValue: '',
      // 第一层中 右侧机构切换默认机构号
      orgNum: '',
      // 第一层中 右侧机构切换机构数据
      orgOptions: [],
      // 第二层左侧 echarts图数据
      option1: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['可用授信额度', '已用授信额度'],
          top: '3%'
          // data: ['流贷额度', '固贷额度', '银票额度', '其他额度']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '6%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: [],
          // data: ['票据融资（贴现）额度', '质押额度', '抵押额度', '一般保证额度', '低风险额度', '银行承兑汇票额度'],
          axisLabel: {
            // interval: 0,
            rotate: -30  //倾斜的程度
          }
        },
        series: [
          {
            name: '可用授信额度',
            type: 'bar',
            stack: '额度',
            data: []
            // data: ["30,000", "0", "200", "90,000", "-1,499,800", "40,000", "40,000", "200", "-1,499,800", "30,000", "0", "90,000"]
            // data: [40000, 14990, 20000, 30000, 40000, 60000]
          }, {
            name: '已用授信额度',
            type: 'bar',
            stack: '额度',
            data: []
            // data: ["70,000", "0", "0", "10,000", "1,500,000", "10,000", "10,000", "0", "1,500,000", "70,000", "0", "10,000"]
            // data: [30000, 15000, 30000, 30000, 30000, 70000]
          }
        ]
      },
      flag1: false,
      // 第二层右侧 table表格数据
      secTableData: [
        {
          sumCaliber: '授信总额度',
          sumName: 'limitCredit',
          money: ''
        }, {
          sumCaliber: '授信额度已用',
          sumName: 'limitUsed',
          money: ''
        }, {
          sumCaliber: '授信额度可用',
          sumName: 'limitAvi',
          money: ''
        }, {
          sumCaliber: '批复敞口金额',
          sumName: 'approveExpAmount',
          money: ''
        }, {
          sumCaliber: '授信敞口余额',
          sumName: 'creditExpBalance',
          money: ''
        }, {
          sumCaliber: '贷款敞口余额',
          sumName: 'loanExpBalance',
          money: ''
        }
      ],
      // 第三层左侧 关系图
      treeData: {},
      // 第三层右侧 table表格数据
      rightTableData: [],
      dialogVisible: false,
      allDatas: [],
      option11: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['可用授信额度', '已用授信额度'],
          top: '3%'
          // data: ['流贷额度', '固贷额度', '银票额度', '其他额度']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '6%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: [],
          // data: ['票据融资（贴现）额度', '质押额度', '抵押额度', '一般保证额度', '低风险额度', '银行承兑汇票额度'],
          axisLabel: {
            // interval: 0,
            rotate: -30  //倾斜的程度
          }
        },
        series: [
          {
            name: '可用授信额度',
            type: 'bar',
            stack: '额度',
            data: []
            // data: [40000, 14990, 20000, 30000, 40000, 60000]
          }, {
            name: '已用授信额度',
            type: 'bar',
            stack: '额度',
            data: []
            // data: [30000, 15000, 30000, 30000, 30000, 70000]
          }
        ]
      },
      flag2: false
    }
  },
  created () {
    this.topData = JSON.parse(sessionStorage.getItem("groupVal"))
    console.log('topData:', this.topData);
    // this.orgNum = '01000'
    this.getOrgs()
  },
  methods: {
    handle (data) {
      console.log('接收到的参数：', data);
    },
    // 获取该客户下的机构
    getOrgs () {
      getOrgByCust(this.topData.customerNum).then(res => {
        const datas = res.data.data
        this.orgOptions = datas.map(item => {
          return { value: item.id, label: item.deptName }
        })
        // console.log(this.orgOptions,'0000');
        let arr = this.orgOptions.filter(item => {
          return item.value == this.topData.orgNum
        })
        this.orgValue = arr[0].label
        this.getSecTableData(this.topData.customerNum, arr[0].value)
        this.getChartTable(this.topData.customerNum, arr[0].value)
      })
    },
    // 切换机构，触发该函数
    selectChange (e) {
      console.log(e, '切换机构');
      this.getSecTableData(this.topData.customerNum, e)
      this.getChartTable(this.topData.customerNum, e)
      // this.getMember(this.topData.customerNum,e)
      // this.getMember('C008','10800')
    },
    // 点击echarts，实现放大效果
    showBar () {
      this.option11.xAxis.data = this.allDatas.map(k => {
        return k.crdProductName
      })
      this.option11.series[0].data = this.allDatas.map(k => {
        return k.limitAvi
      })
      this.option11.series[1].data = this.allDatas.map(k => {
        return k.limitUsed
      })
      this.flag2 = true
      this.dialogVisible = true
    },
    toRelation (val) {
      this.$router.push({ name: 'relation', params: { val: val } })
      sessionStorage.setItem('relationVal', JSON.stringify(val))
    },
    // 获取第二层右侧表格中的数据
    getSecTableData (a,b) {
      groupMemberDetail(a,b).then(res => {
        // console.log('二层表格数据：', res);
        const datas = res.data.data
        this.secTableData.map((e) => {
          for (let k in datas) {
            if (k == e.sumName) {
              e.money = datas[k]
            }
          }
        })
        thousands(this.secTableData)
        // this.secTableData.map(k => {
        //   for (let i in k) {
        //     if (typeof k[i] === 'number') {
        //       k[i] = k[i].toLocaleString()
        //     }
        //   }
        // })
        // console.log('打印表格数据：', this.secTableData);
      })
    },
    // 获取第二层左侧echarts图，三层右侧表格数据
    getChartTable (a,b) {
      groupChartTable(a,b).then(res => {
        // console.log('图表数据：', res);
        const datas = res.data.data
        // console.log('3号接口数据：', datas);
        this.allDatas = datas
        this.rightTableData = JSON.parse(JSON.stringify(datas))
        thousands(this.rightTableData)
        // this.rightTableData.map(k => {
        //   for (let i in k) {
        //     if (typeof k[i] === 'number') {
        //       k[i] = k[i].toLocaleString()
        //     }
        //   }
        // })

        this.option1.xAxis.data = datas.map(k => {
          return k.crdProductName
        })
        // console.log('X轴：', this.option1.xAxis.data);
        this.option1.series[0].data = datas.map(k => {
          return k.limitAvi
        })
        // console.log('可用额度:', this.option1.series[0].data);
        this.option1.series[1].data = datas.map(k => {
          return k.limitUsed
        })
        // console.log('已用额度:', this.option1.series[1].data);
        this.flag1 = true

        var childs = []
        datas.map(k => {
          let {name,ava,topData:{customerName,customerNum}} = { name: '集团成员', ava: k.customerName, topData:{customerName: k.customerName,customerNum: k.customerNum}}
          childs.push({name,ava,topData:{customerName,customerNum}})
        })
        let obj = {}
        let child = childs.reduce((item, next) => {
          obj[next.ava] ? "" : obj[next.ava] = true && item.push(next)
          return item
        }, [])
        this.treeData = {
        ava: this.topData.customerName,
        name: '集团',
        id: '1',
        topData: { customerName: this.topData.customerName, customerNum: 'C002' },
        children: child
      }
      })
    }
  },
  components: {
    linegraph,
    TreeChart
  }
}
</script>

<style lang='scss' scoped>
@import '@/styles/ledgerView.scss';
.viewContainer {
  // 第三层 表+图 样式
  .tableChart {
    display: flex;
    justify-content: space-between;
    .leftChart {
      width: 55%;
      .treeChart /deep/ {
        margin-top: 24px;
        td {
          padding: 0 0 35px 0;
          .node {
            width: 6em;
          }
        }
      }
    }
    .rightTable {
      width: 43%;
    }
  }
}
</style>
