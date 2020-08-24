<!-- 风险暴露情况简表 组件页面 -->
<template>
  <div>
    <!-- 选择年、月、金额单位 部分 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <!-- 选择月 -->
      <el-form-item label="查询年份" prop="pickMonth">
        <el-date-picker v-model="pm" type="month" placeholder="选择月" size="small"></el-date-picker>
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
        <el-button type="primary" size="small">导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格详情部分 -->
    <div class="content">
      <!-- 表格上方标题部分 -->
      <div class="tableTitle">
        <!-- 中间标题 -->
        <h3 style="margin:0">{{ toptitle }}</h3>
        <p class="bottomCon">
          <span>日期： {{ tableDate.year }} 年 {{ tableDate.month }} 月</span>
          <span>单位：{{unit}}</span>
        </p>
      </div>
      <!-- 表格内容部分 -->
      <div class="tableContent">
        <el-table :data="tableContent" style="width: 100%;margin-bottom:0px" align="center" max-height="244px" size="mini">
          <!--<el-table-column type="index" label="序号" width="60" align="center"></el-table-column>-->
          <el-table-column prop="quotaIndexName" label="风险暴露指标" width="300" align="center"></el-table-column>
          <el-table-column label="实际授信情况" align="center">
            <el-table-column prop="quotaUsedAmt" label="余额" align="center">
              <template slot-scope="scope">{{ scope.row.quotaUsedAmt | NumsFormat }}</template>
            </el-table-column>
            <el-table-column prop="quotaUsedRatio" label="占比" align="center">
              <template slot-scope="scope">{{ scope.row.quotaUsedRatio + '%' }}</template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="管控指标" align="center">
            <el-table-column prop="controlValue" label="控制值(占比)" align="center">
              <template slot-scope="scope">{{ scope.row.controlValue + '%' }}</template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <!-- echarts图部分 -->
      <div class="chartContent" style="width:100%;margin-bottom:-25px;margin-top:-10px">
        <div class="chart1">
          <linegraph :id="'gauge1'" :data="option1" style="height:500px;"></linegraph>
        </div>
        <div class="chart2">
          <linegraph :id="'gauge2'" :data="option2" style="height:500px;"></linegraph>
        </div>
        <div class="chart3">
          <linegraph :id="'gauge3'" :data="option3" style="height:500px;"></linegraph>
        </div>
        <div class="chart4">
          <linegraph :id="'gauge4'" :data="option4" style="height:500px;"></linegraph>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { queryRiskExposureRpt } from '@/api/rcd/limitAnalyse/limitAnalyse'
  import linegraph from '../../../EchartsShow'

  export default {
    data() {
      return {
        ruleForm: {
          pickMonth: '',
          moneyUnit: 'wan'
        },
        pm: '',
        // 表格详情部分 中间标题
        toptitle: '风险暴露情况简表',
        // 表格详情部分 左侧日期
        tableDate: {
          month: '',
          year: ''
        },
        // 中间表格
        tableContent: [],
        // 表格详情部分 右侧单位
        unit: '',
        // echarts图数据
        option1: {
          backgroundColor: '#fff',
          // tooltip: {
          //     formatter: "{a} <br/>{b} : {c}%"
          // },
          title: {
            // text: "最大非同业单一客户贷款余额",
            text: '最大非同业单一客户风险暴露\n集中度（授信敞口余额）',
            textStyle: {
              fontSize: 16
            },
            // textAlign: 'center',
            left: '5%',
            top: '10%'
          },
          series: [
            {
              type: 'gauge',
              radius: '90%',
              startAngle: '180',
              endAngle: '0',
              // splitNumber: '95',
              pointer: {
                show: true,
                length: '55%'
              },
              detail: {
                offsetCenter: [0, -130],
                formatter: '{value}%'
              },
              data: [
                {
                  value: 23
                }
              ],
              axisLine: {
                show: true,
                lineStyle: {
                  color: [[0.3, '#55BF3B'], [0.7, '#DDDF0D'], [1, '#DF5353']],
                  width: 45,
                  // 	shadowBlur: 15,
                  // 	shadowColor: '#7691FA',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  opacity: 1
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: true,
                length: 45,
                lineStyle: {
                  color: '#eee',
                  width: 0,
                  type: 'solid',
                  shadowColor: '#eee',
                  shadowBlur: 25,
                  shadowOffsetX: 10,
                  shadowOffsetY: 10,
                  opacity: 0.5
                }
              },
              axisLabel: {
                show: false
              }
            }
          ]
        },
        option2: {
          backgroundColor: '#fff',
          // tooltip: {
          //     formatter: "{a} <br/>{b} : {c}%"
          // },
          title: {
            // text: "最大非同业单一客户风险暴露",
            text: '最大单一同业客户风险暴露\n集中度（授信敞口余额）',
            textStyle: {
              fontSize: 16
            },
            // textAlign: 'center',
            left: '8%',
            top: '10%'
          },
          series: [
            {
              type: 'gauge',
              radius: '90%',
              startAngle: '180',
              endAngle: '0',
              // splitNumber: '95',
              pointer: {
                show: true,
                length: '55%'
              },
              detail: {
                offsetCenter: [0, -130],
                formatter: '{value}%'
              },
              data: [
                {
                  value: 45
                }
              ],
              axisLine: {
                show: true,
                lineStyle: {
                  color: [[0.3, '#55BF3B'], [0.7, '#DDDF0D'], [1, '#DF5353']],
                  width: 45,
                  // 	shadowBlur: 15,
                  // 	shadowColor: '#7691FA',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  opacity: 1
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: true,
                length: 45,
                lineStyle: {
                  color: '#eee',
                  width: 0,
                  type: 'solid',
                  shadowColor: '#eee',
                  shadowBlur: 25,
                  shadowOffsetX: 10,
                  shadowOffsetY: 10,
                  opacity: 0.5
                }
              },
              axisLabel: {
                show: false
              }
            }
          ]
        },
        option3: {
          backgroundColor: '#fff',
          // tooltip: {
          //     formatter: "{a} <br/>{b} : {c}%"
          // },
          title: {
            // text: "最大非同业关联客户风险暴露",
            text: '最大非同业关联客户风险暴露\n集中度（授信敞口余额）',
            textStyle: {
              fontSize: 16
            },
            // textAlign: 'center',
            left: '7%',
            top: '10%'
          },
          series: [
            {
              type: 'gauge',
              radius: '90%',
              startAngle: '180',
              endAngle: '0',
              // splitNumber: '95',
              pointer: {
                show: true,
                length: '55%'
              },
              detail: {
                offsetCenter: [0, -130],
                formatter: '{value}%'
              },
              data: [
                {
                  value: 23
                }
              ],
              axisLine: {
                show: true,
                lineStyle: {
                  color: [[0.3, '#55BF3B'], [0.7, '#DDDF0D'], [1, '#DF5353']],
                  width: 45,
                  // 	shadowBlur: 15,
                  // 	shadowColor: '#7691FA',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  opacity: 1
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: true,
                length: 45,
                lineStyle: {
                  color: '#eee',
                  width: 0,
                  type: 'solid',
                  shadowColor: '#eee',
                  shadowBlur: 25,
                  shadowOffsetX: 10,
                  shadowOffsetY: 10,
                  opacity: 0.5
                }
              },
              axisLabel: {
                show: false
              }
            }
          ]
        },
        option4: {
          backgroundColor: '#fff',
          // tooltip: {
          //     formatter: "{a} <br/>{b} : {c}%"
          // },
          title: {
            // text: "最大单一同业客户风险暴露",
            text: '最大非同业单一客户贷款敞口\n余额集中度',
            textStyle: {
              fontSize: 16
            },
            // textAlign: 'center',
            left: '9%',
            top: '10%'
          },
          series: [
            {
              type: 'gauge',
              radius: '90%',
              startAngle: '180',
              endAngle: '0',
              // splitNumber: '95',
              pointer: {
                show: true,
                length: '55%'
              },
              detail: {
                offsetCenter: [0, -130],
                formatter: '{value}%'
              },
              data: [
                {
                  value: 78
                }
              ],
              axisLine: {
                show: true,
                lineStyle: {
                  color: [[0.3, '#55BF3B'], [0.7, '#DDDF0D'], [1, '#DF5353']],
                  width: 45,
                  // 	shadowBlur: 15,
                  // 	shadowColor: '#7691FA',
                  shadowOffsetX: 0,
                  shadowOffsetY: 0,
                  opacity: 1
                }
              },
              axisTick: {
                show: false
              },
              splitLine: {
                show: true,
                length: 45,
                lineStyle: {
                  color: '#eee',
                  width: 0,
                  type: 'solid',
                  shadowColor: '#eee',
                  shadowBlur: 25,
                  shadowOffsetX: 10,
                  shadowOffsetY: 10,
                  opacity: 0.5
                }
              },
              axisLabel: {
                show: false
              }
            }
          ]
        }
      }
    },
    props: ['selectionOrgId'],
    // mounted:function(){
    //   this.query();
    // },
    created() {
      this.query()
    },
    components: {
      linegraph
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
        queryRiskExposureRpt(this.selectionOrgId, this.tableDate.year, this.tableDate.month, this.ruleForm.moneyUnit).then(res => {
          const datas = res.data.data
          this.tableContent = datas
          if (datas.length == 0) {
            return
          }
          this.tableDate.year = datas[0].totalYear
          this.tableDate.month = datas[0].totalMonth
          // echarts图
          // 最大非同业单一客户风险暴露集中度（授信敞口余额）
          this.option1.series[0].data[0].value = datas[0].quotaUsedRatio
          // 最大单一同业客户风险暴露集中度（授信敞口余额）
          this.option2.series[0].data[0].value = datas[1].quotaUsedRatio
          //  最大非同业单一客户贷款敞口余额集中度"
          this.option4.series[0].data[0].value = datas[2].quotaUsedRatio
        })
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
        if (this.ruleForm.moneyUnit == 'wan') {
          this.unit = '万元'
        } else {
          this.unit = '亿元'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  // 选择年、月、金额单位部分的样式
  .el-form /deep/ {
    /*height: 60px;*/
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

    .chartContent {
      display: flex;
      justify-content: flex-start;

      .chart1,
      .chart2,
      .chart3,
      .chart4 {
        width: 25%;
      }
    }
  }
</style>
