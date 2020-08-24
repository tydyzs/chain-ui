<!-- 额度台账---担保台账360视图页面 -->
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
      <!-- 右侧切换机构+查看关系人信息 -->
      <div class="rightCon">
        <span>
          切换机构：
          <el-select v-model="orgValue" placeholder size="mini" @change="selectChange">
            <el-option v-for="(item, i) in orgOptions" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </span>
        <!-- <span>
          <el-button type="primary" size="mini">查看关系人信息</el-button>
        </span> -->
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
          <el-table-column prop="crdType" label="额度类型" align="center"></el-table-column>
          <el-table-column prop="money" label="金额（元）" align="center">
            <template slot-scope="scope">
              {{scope.row.money | NumsFormat}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 第三层table表格部分 -->
    <div class="tableChart">
      <!-- 第三层 table表格 -->
      <div class="leftTabel">
        <el-table :data="leftTableData" style="width: 100%" height="245" size="mini" border>
          <el-table-column prop="customerName" label="被担保客户名称" width="120" align="center">
          </el-table-column>
          <el-table-column prop="contractNum" label="合同编号" width="150" align="center">
          </el-table-column>
          <el-table-column prop="subcontractNum" label="担保合同编号" width="110" align="center">
            <!-- <template slot-scope="scope">
              {{ scope.row.limitCredit | NumFormat }}
            </template> -->
          </el-table-column>
          <el-table-column prop="suretyNum" label="担保物编号" width="110" align="center">
            <!-- <template slot-scope="scope">
              {{ scope.row.limitUsed | NumFormat }}
            </template> -->
          </el-table-column>
          <el-table-column prop="suretyCustomerNum" label="抵质押人/保证人客户编号" width="180" align="center">
            <!-- <template slot-scope="scope">
              {{ scope.row.limitAvi | NumFormat }}
            </template> -->
          </el-table-column>
          <el-table-column prop="subcontractType" label="担保合同类型" width="120" align="center">
            <template slot-scope="scope">
              {{ contractDict[scope.row.subcontractType] }}
            </template>
          </el-table-column>
          <el-table-column prop="pledgeType" label="抵押物类型" width="190" align="center">
            <template slot-scope="scope">
              {{ pledgeDict[scope.row.pledgeType] }}
            </template>
          </el-table-column>
          <el-table-column prop="currencyCd" label="币种" width="200" align="center">
            <template slot-scope="scope">
              {{ currencyDict[scope.row.currencyCd] }}
            </template>
          </el-table-column>
          <el-table-column prop="subcontractAmt" label="担保合同金额" width="140" align="center">
            <!-- <template slot-scope="scope">
              {{ scope.row.subcontractAmt | NumFormat }}
            </template> -->
          </el-table-column>
          <el-table-column prop="suretyAmt" label="本次担保金额" width="140" align="center">
            <template slot-scope="scope">
              {{ scope.row.suretyAmt | NumFormat }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="userNum" label="经办人" width="140" align="center">
            <template slot-scope="scope">
              {{ userDict[scope.row.userNum] }}
            </template>
          </el-table-column> -->
          <el-table-column prop="orgNum" label="经办机构" width="150" align="center">
            <template slot-scope="scope">
              {{ orgDict[scope.row.orgNum] }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 第二层echarts放大展示dialog框 -->
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :lock-scroll="false" :visible.sync="dialogVisible1" width="70%">
      <linegraph v-if="flag3" :id="'pie1'" :data="option11" style="height:60vh;"></linegraph>
    </el-dialog>
  </div>
</template>

<script>
import linegraph from '../../EchartsShow'
import { getOrgByCust, getSumCsmCrd, getCrdDetail } from '@/api/rcd/standBook/corporate'
import { dictTranslate } from '@/api/system/dict'
import { getListGrt, getListGrtPage } from '@/api/rcd/standBook/guarantee.js'
import { thousands } from "@/utils/thousands.js"
export default {
  data() {
    return {
      // 额度产品字典
      crdDict: {},
      // 机构字典
      orgDict: {},
      // 担保合同类型字典
      contractDict: {},
      // 抵押物类型字典
      pledgeDict: {},
      // 经办人字典
      // userDict: {},
      // 币种字典
      currencyDict: {},
      // 三个图表数据
      allDatas: [],
      // ===== 第一层数据源 =====
      // 第一层信息数据源
      topData: {},
      // 第一层中 右侧机构切换默认机构名称
      orgValue: '',
      // 第一层中 右侧机构切换默认机构号
      orgNum: '',
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
          caliber: '敞口额度',
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
      // ===== dialog中的数据 =====
      // 控制第二层echarts放大展示dialog框 显示与隐藏
      dialogVisible1: false
    }
  },
  created() {
    console.log(this.$route.params.val, "打印传递值")
    // this.topData = this.$route.params.val
    this.topData = JSON.parse(sessionStorage.getItem("guaranteeVal"))
    // this.orgNum = this.$route.params.val.orgNum
    // console.log(this.orgNum,'客户编号');
    this.orgNum = '01000' // TODO:
    this.getOrgs()
    this.getOrg() // 机构
    this.getContractType() // 担保合同类型
    this.getPledge() // 抵押物字典
    // this.getUser() // 经办人字典
    this.getCurrency() // 币种字典
    // console.log(this.topData, '接收的参数');

  },
  methods: {
    // 机构字典
    getOrg() {
      dictTranslate('org').then(res => {
        // console.log(res, '机构字典');
        if (res.status != 200) {
          return this.$message.error('获取机构字典数据失败，请重试')
        }
        this.orgDict = res.data.data
      })
    },
    // 担保合同类型字典
    getContractType() {
      dictTranslate('CD000102').then(res => {
        // console.log(res, '担保合同类型字典');
        if (res.status != 200) {
          return this.$message.error('获取担保合同类型字典数据失败，请重试')
        }
        this.contractDict = res.data.data
        // console.log(this.contractDict[1], '111');
      })
    },
    // 抵押物类型字典
    getPledge() {
      dictTranslate('CD000209').then(res => {
        console.log(res, '抵押物类型字典');
        if (res.status != 200) {
          return this.$message.error('获取抵押物类型字典数据失败，请重试')
        }
        this.pledgeDict = res.data.data
      })
    },
    // 币种字典
    getCurrency() {
      dictTranslate('CD000019').then(res => {
        // console.log(res, '币种字典');
        if (res.status != 200) {
          return this.$message.error('获取币种字典数据失败，请重试')
        }
        this.currencyDict = res.data.data
        console.log(this.currencyDict, '币种字典数据');
      })
    },
    // 经办人字典
    // getUser () {
    //   dictTranslate('user').then(res => {
    //     console.log(res, '经办人字典');
    //     if (res.status != 200) {
    //       return this.$message.error('获取经办人字典数据失败，请重试')
    //     }
    //     this.userDict = res.data.data
    //   })
    // },
    // 获取该客户下的机构
    getOrgs() {
      getOrgByCust(this.topData.customerNum).then(res => {
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
          return item.value == this.orgNum
        })
        // console.log(arr, '111');
        this.orgValue = arr[0].label
        // console.log(arr, '打印默认机构数据');
        this.getChartTable(this.topData.customerNum, this.orgNum) //TODO:
        this.getTable('1','999',this.topData.customerNum, this.orgNum) // TODO:
        // this.getTable('1', '999', 'C002', this.orgNum)
      })
    },
    // 切换机构时，触发该函数
    selectChange(e) {
      // console.log(e,'测试选项变化');
      this.getTable('1','999',this.topData.customerNum, this.orgNum) // TODO:
      // this.getTable('1', '999', 'C002', this.orgNum) // TODO:
    },
    //公共方法 获取第二层 echarts + table 数据
    getChartTable(a, b) {
      getListGrt(a, b).then(res => {
        console.log(res, '获取第二层图表数据');
        if (res.status != 200) {
          return this.$message.error('获取数据失败，请重试')
        }
        // const datas = res.data.data
        this.allDatas = res.data.data
        // 第二层 右侧table表格数据
        this.rightTableData = this.allDatas.map(item => {
          return { crdType: item.crdProductName, money: item.limitCredit }
        })
        // 第二层 左侧 echarts数据
        this.option1.legend.data = this.allDatas.map(item => {
          return item.crdProductName
        })
        this.option1.series[0].data = this.allDatas.map(item => {
          return { value: item.limitCredit, name: item.crdProductName }
        })
        this.flag1 = true
      })
    },
    // 公共方法 获取第三层table表格数据
    getTable(a, b, c, d) {
      getListGrtPage(a, b, c, d).then(res => {
        console.log(res, '获取第三层table表格数据');
        if (res.status != 200) {
          return this.$message.error('获取表格数据失败，请重试')
        }
        const datas = res.data.data.records
        this.leftTableData = JSON.parse(JSON.stringify(datas))
        thousands(this.leftTableData)

      })
    },
    // 点击第二层 左侧echarts图，放大展示
    showLeftChart() {
      this.option11.legend.data = this.allDatas.map(item => {
        return item.crdProductName
      })
      this.option11.series[0].data = this.allDatas.map(item => {
        return { value: item.limitCredit, name: item.crdProductName }
      })
      this.flag3 = true
      this.dialogVisible1 = true
    }
  },
  components: {
    linegraph
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/ledgerView.scss';
</style>
