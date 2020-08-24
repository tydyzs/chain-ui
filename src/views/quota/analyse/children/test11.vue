<!-- 匿名客户风险暴露金额变动图 组件页面 -->
<template>
  <div>
    <!-- 选择年、月、金额单位 部分 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <!-- 选择月 -->
      <el-form-item label="查询年份" prop="pickMonth">
        <el-date-picker v-model="pm" type="year" placeholder="选择年" size="small" ></el-date-picker>
      </el-form-item>
      <!-- 选择金额单位 -->
      <el-form-item label="金额单位" prop="moneyUnit">
        <el-select v-model="ruleForm.moneyUnit" placeholder="选择金额单位" size="small" @change="chooseUnit">
          <el-option label="万" value="wan"></el-option>
          <el-option label="亿" value="yi"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="query">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格详情部分 -->
    <div class="content">
      <!-- 表格上方标题部分 -->
      <div class="tableTitle">
        <!-- 中间标题 -->
        <p class="bottomCon">
          <span>年份： {{ tableDate.year }} 年</span>
          <span>单位：{{unit}}</span>
        </p>
      </div>
      <!-- 表格内容部分 -->
      <div class="tableContent">
        <div>
          <linegraph id="'line'" :data="option" style="width:800px;height:400px" ></linegraph>
        </div>
        注：风险暴露金额取每月末的敞口余额
      </div>
    </div>
  </div>
</template>

<script>
  import { queryAnonymityRiskExposureRpt } from '@/api/rcd/limitAnalyse/limitAnalyse'
  import linegraph from '../../../EchartsShow'

  const echarts = require('echarts')

  export default {
    data() {
      return {
        ruleForm: {
          pickMonth: '',
          moneyUnit: 'wan'
        },
        pm: '',
        // 表格详情部分 左侧日期
        tableDate: {
          year: '',
          month: ''
        },
        // 表格详情部分 右侧单位
        unit: '',
        option: {
          title: {
            text: '匿名客户风险暴露金额变动图'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '授信余额',
              type: 'line',
              stack: '总量',
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
              data: []
            }
          ]
        }
      }
    },
    props: ['selectionOrgId'],
    components: {
      linegraph
    },
    mounted() {
      // this.initCharts()
      this.query()
    },
    methods: {
      query() {
        var date = this.pm == '' ? null : this.pm
        if (date != null) {
          this.tableDate.year = date.getFullYear()
          this.tableDate.month = (date.getMonth() + 1).toString()
        } else {
          this.tableDate.year = null
          this.tableDate.month = null
        }
        if (this.ruleForm.moneyUnit == 'wan') {
          this.unit = '万元'
        } else {
          this.unit = '亿元'
        }
        queryAnonymityRiskExposureRpt(this.selectionOrgId, this.tableDate.year, this.tableDate.month, this.ruleForm.moneyUnit).then(res => {
          const datas = res.data.data
          if (datas.length == 0) {
            return
          }
          this.tableDate.year = datas[0].totalYear
          this.tableDate.month = datas[0].totalMonth
          // 图状数据展示
          this.option.xAxis[0].data = datas.map(item => {
            return item.totalMonth
          })
          this.option.series[0].data = datas.map(item => {
            return item.crdBalance
          })

        })
      },
      initCharts() {
        let myChart = echarts.init(this.$refs.chart)
        // 绘制图表
        myChart.setOption(this.option)
      },

      // 用户确认选定的值时触发(选定年)
      chooseYear() {
        console.log(this.pm)
        var timeStr = this.pm.split('-')
        this.tableDate.month = timeStr[1]
        this.tableDate.year = timeStr[0]
      },

      // 选中值发生变化时触发(单位)
      chooseUnit() {
        console.log(this.ruleForm.moneyUnit)
        if (this.ruleForm.moneyUnit == 'wan') {
          this.unit = '万'
        } else {
          this.unit = '亿'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  // 选择年、月、金额单位部分的样式
  .el-form /deep/ {
    display: flex;
    justify-content: space-between;

    .el-form-item {
      .el-form-item__content {
        .el-input {
          width: 150px;

          .el-input__inner {
            width: 150px;
          }
        }
      }
    }
  }

  //表格详情部分
  .content {
    // 上方标题部分的样式
    .tableTitle {
      h3 {
        text-align: center;
        font-weight: 700;
        margin-top: 0;
      }

      .bottomCon {
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
