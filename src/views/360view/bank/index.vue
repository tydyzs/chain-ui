<template>
  <div class="orgContainer">
    <!-- 第一层数据展示区 -->
    <div class="topData">
      <!-- 金额 -->
      <div class="money">
        <span>
          授信额度（万元）
          <br>
          <i>{{ topData.limitCredit | NumsFormat }}</i>
        </span>
        <span style="width: 0;border-right: 1px solid #999;"></span>
        <span>
          敞口额度（万元）
          <br>
          <i>{{ topData.approveExpAmount | NumsFormat }}</i>
        </span>
        <span style="width: 0;border-right: 1px solid #999;"></span>
        <span>
          授信敞口余额（万元）
          <br>
          <i>{{ topData.creditExpBalance | NumsFormat }}</i>
        </span>
        <span style="width: 0;border-right: 1px solid #999;"></span>
        <span>
          贷款敞口余额（万元）
          <br>
          <i>{{ topData.loanExpBalance | NumsFormat }}</i>
        </span>

      </div>
      <!-- 客户总数 -->
      <div class="totals">
        <span>
          个人客户总数
          <br>
          <i>{{ topData.individualCount }}</i>
        </span>
        <span style="width: 0;border-right: 1px solid #999;"></span>
        <span>
          公司客户总数
          <br>
          <i>{{ topData.corporationCount }}</i>
        </span>
        <span style="width: 0;border-right: 1px solid #999;"></span>
        <span>
          同业客户总数
          <br>
          <i>{{ topData.bankCount }}</i>
        </span>
      </div>
    </div>
    <!-- 第二层图+表 -->
    <div class="echartTable">
      <!-- 第二层左侧echarts图 -->
      <div class="leftChart">
        <map-chart ref="mapChart"></map-chart>
      </div>
      <!-- 第二层右侧table表格 -->
      <div class="rightTable">
        <bar-chart :id="'barChart'" :data="chartOption" style="width:480px;height:500px;"></bar-chart>
      </div>
    </div>
    <!-- 第三层表+图 -->
    <div class="tableChart">
      <el-table ref="allBankViewTable" :data="dataList" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border stripe height="350">
        <el-table-column v-for="(col) in column" :fixed="col.fixed" :width="col.width" :key="col.key" :label="col.label"
          :align="col.align" :resizable="col.resizable" :prop="col.key" show-overflow-tooltip />
      </el-table>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
import { getDatas } from '@/api/rcd/orgLimitView/orgView'
import { getListStatisArea } from '@/api/360view/bank'

import mapChart from './map-chart'
import barChart from '@/views/EchartsShow'
export default {
  components: { mapChart, barChart },
  data () {
    return {
      // 第一层 基础数据
      topData: {},
      // 第二层 右侧table表格数据
      rightTable: [],
      column: [{
        key: "areaName",
        label: "地区",
        resizable: true,
        width: 280,
        align: "left",
        fixed: true,
      }, {
        key: "limitCredit",
        label: "授信额度",
        resizable: true,
        align: "center"
      }, {
        key: "limitUsed",
        label: "授信额度已用",
        resizable: true,
        align: "center"
      }, {
        key: "limitAvi",
        label: "授信额度可用",
        resizable: true,
        align: "center"
      }, {
        key: "approveExpAmount",
        label: "敞口额度",
        resizable: true,
        align: "center"
      }, {
        key: "expUsed",
        label: "敞口额度已用",
        resizable: true,
        align: "center"
      }, {
        key: "expAvi",
        label: "敞口额度可用",
        resizable: true,
        align: "center"
      }, {
        key: "creditExpBalance",
        label: "授信敞口余额",
        resizable: true,
        align: "center"
      }, {
        key: "loanExpBalance",
        label: "贷款敞口额度",
        resizable: true,
        align: "center"
      }],
      dataList: [],
      chartOption: {
        title: {
          // text: '全行各地区额度统计',
          //subtext: '数据来自统一授信系统，单位（亿元）'
          subtext: '单位（亿元）'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['授信额度', '敞口额度', '授信敞口余额', '贷款敞口余额'],
          //默认只展示授信额度，页面更美观
          selected: { '授信额度': true, '敞口额度': false, '授信敞口余额': false, '贷款敞口余额': false }
        },

        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        yAxis: [
          {
            type: 'category',
            data: []
            //data: ['萍乡', '鹰潭', '抚州', '新余', '上饶', '景德镇', '宜春', '吉安', '赣州', '九江', '南昌']
          }
        ],
        xAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '授信额度',
            type: 'bar',
            label: {
              show: true,
              position: 'insideRight'
            },
            data: []
          },
          {
            name: '敞口额度',
            type: 'bar',
            label: {
              show: true,
              position: 'insideRight'
            },
            data: []
          },
          {
            name: '授信敞口余额',
            type: 'bar',
            label: {
              show: true,
              position: 'insideRight'
            },
            data: []
          },
          {
            name: '贷款敞口余额',
            type: 'bar',
            label: {
              show: true,
              position: 'insideRight'
            },
            data: []
          }
        ]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    // 页面初期加载，获取当前登录人信息，以 信息中的登录机构号 为参数，发起 get网络请求，获取 机构树 数据
    init () {
      getUserInfo().then(res => {
        // console.log(res, '机构视图下，获取当前登录人信息')
        if (res.status != 200) {
          return this.$message.error('获取当前登录人信息失败，请重试')
        }
        const userInfo = res.data.data
        this.getTopData(userInfo.deptId)

      })
      getListStatisArea().then(res => {
        if (res.data.code == 200) {
          this.dataList = res.data.data

          //加载地图数据
          this.$refs.mapChart.refresh(this.dataList);
          //加载柱状图数据
          // console.info(this.dataList)
          for (let i in this.dataList) {
            this.chartOption.yAxis[0].data.unshift(this.dataList[i].areaName);
            this.chartOption.series[0].data.unshift(this.dataList[i].limitCredit);
            this.chartOption.series[1].data.unshift(this.dataList[i].approveExpAmount);
            this.chartOption.series[2].data.unshift(this.dataList[i].creditExpBalance);
            this.chartOption.series[3].data.unshift(this.dataList[i].loanExpBalance);
          }

          this.dataList.map((x) => {
            for (let i in x) {
              if (typeof x[i] === 'number') {
                x[i] = x[i].toLocaleString()
              }
              if (x[i] instanceof Array) {
                x[i].map(y => {
                  for (let e in y) {
                    if (typeof y[e] === 'number') {
                      y[e] = y[e].toLocaleString()
                    }
                  }
                })
              }
            }
          })
          // console.log(this.dataList, 'this.dataList')
          // console.log(!isNaN(2) && typeof 2 === 'number')
        }
      })
    },
    getTopData (e) {
      getDatas(e).then(res => {
        if (res.status != 200) {
          return this.$message.error('获取当前机构下基础数据失败，请重试')
        }
        this.topData = res.data.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.orgContainer {
  padding: 0 0.5vw 1vh 0.5vw;
  // 搜索区 样式
  .search {
    display: flex;
    justify-content: flex-start;
    transform: translateY(25%);
    padding: 8px;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 4px #ccc;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    .pickLimit {
      margin: 0 2vw;
    }
  }
  // 第一层数据展示区 样式
  .topData {
    display: flex;
    justify-content: space-between;
    margin: 3vh 0 1vh 0;
    // 通用样式
    i {
      font-style: normal;
      font-size: 24px;
    }
    span {
      display: inline-block;
      text-align: center;
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
      width: 51%;
    }
    .leftChart {
      width: 47%;
    }
  }
}
</style>
