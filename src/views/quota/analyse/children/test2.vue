<!-- 最大十家客户贷款集中度及单一客户明细表 -->
<template>
  <div>
    <!-- 选择年、月、金额单位 部分 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <!-- 选择月 -->
      <el-form-item label="查询年月" prop="pickMonth">
        <el-date-picker v-model="pm" type="month" placeholder="选择月" size="small"></el-date-picker>
      </el-form-item>
      <!-- 选择金额单位 -->
      <el-form-item label="金额单位" prop="moneyUnit">
        <el-select v-model="ruleForm.moneyUnit" placeholder="选择金额单位" size="small" clearable>
          <el-option label="万" value="wan"></el-option>
          <el-option label="亿" value="yi"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query" size="small">查询</el-button>
        <el-button type="primary" @click="dowmloadExcel" size="small">导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格详情部分 -->
    <div class="content">
      <!-- 表格上方标题部分 -->
      <div class="tableTitle">
        <!-- 中间标题 -->
        <h3>{{ toptitle }}</h3>
        <p class="bottomCon">
          <span>日期： {{ tableDate.year }} 年 {{ tableDate.month }} 月</span>
          <span>单位：{{unit}}</span>
        </p>
      </div>
      <!-- 表格内容部分 -->
      <div class="tableContent">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="最大十家客户贷款集中度" name="1" style="margin-top:0px">
            <el-form :data="formData" label-width="auto" style="margin-top:-5px" size="mini">
              <el-form-item label="金额">{{formData.quotaUsedAmt | NumsFormat}}</el-form-item>
              <el-form-item label="占比">{{formData.quotaUsedRatio}}%</el-form-item>
              <el-form-item label="观察值">{{formData.observeValue | NumsFormat}}</el-form-item>
              <el-form-item label="预警值">{{formData.warnValue | NumsFormat}}</el-form-item>
              <el-form-item label="控制值">{{formData.controlValue | NumsFormat}}</el-form-item>
            </el-form>
            <!-- 图表部分 -->
            <div class="chartContent" style="margin-top:-10px;margin-bottom: -10px">
              <!-- 左边折柱混合图 -->
              <div class="leftChart" @click="showLinebar">
                <!-- 折柱混合图 -->
                <linegraph v-if="flag1" :id="'linebar'" :data="option1" style="height:290px;"></linegraph>
              </div>
              <!-- 右边折线图 + 柱状图 -->
              <div class="rightChart">
                <!-- 折线图 -->
                <div class="line" @click="showLine">
                  <linegraph v-if="flag2" :id="'line'" :data="option2" style="height:170px;"></linegraph>
                </div>
                <!-- 柱图 -->
                <div class="bar" @click="showBar">
                  <linegraph v-if="flag3" :id="'bar'" :data="option3" style="height:170px;"></linegraph>
                </div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="单一客户明细表" name="2" style="margin-top:0px">
            <!-- 表格部分 -->
            <el-table :data="tableContent" border style="width:100%;margin-bottom:-25px;margin-top:-5px"  max-height="180px" size="mini">
              <el-table-column type="index" width="60"></el-table-column>
              <el-table-column prop="customerNum" label="客户编号" width="100"></el-table-column>
              <el-table-column prop="customerName" label="客户名称" width="300"></el-table-column>
              <el-table-column prop="loanBalance" label="贷款余额">
                <template slot-scope="scope">{{ scope.row.loanBalance | NumsFormat }}</template>
              </el-table-column>
              <el-table-column prop="change" label="较上月变化">
                <template slot-scope="scope">{{ scope.row.change | NumsFormat }}</template>
              </el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>

      </div>
    </div>
    <!-- dialog框，单独放大展示每个echarts图表 -->
    <!-- 折柱混合图放大框 -->
    <el-dialog :visible.sync="dialogVisible" :lock-scroll="false" width="70%">
      <linegraph v-if="flag4" :id="'bigShow'" :data="option11" style="height:500px;"></linegraph>
    </el-dialog>
    <!-- 折线图放大框 -->
    <el-dialog :visible.sync="dialogVisible1" :lock-scroll="false" width="70%">
      <linegraph v-if="flag5" :id="'bigShow1'" :data="option22" style="height:500px;"></linegraph>
    </el-dialog>
    <!-- 柱图放大框 -->
    <el-dialog :visible.sync="dialogVisible2" :lock-scroll="false" width="70%">
      <linegraph v-if="flag6" :id="'bigShow2'" :data="option33" style="height:500px;"></linegraph>
    </el-dialog>
  </div>
</template>

<script>
  import linegraph from '../../../EchartsShow'
  import { queryLoanTenCusRpt, downLoanTenCusRptTable } from '@/api/rcd/limitAnalyse/limitAnalyse'

  export default {
    data() {
      return {
        activeNames: ['1','2'],
        formData: {
          quotaUsedAmt: '',//观察值
          quotaUsedRatio: '',//观察值
          observeValue: '',//观察值
          warnValue: '',//预警值
          controlValue: ''//控制值
        },
        ruleForm: {
          pickMonth: '',
          moneyUnit: 'wan'
        },
        pm: '',
        // 表格详情部分 中间标题
        toptitle: '最大十家客户贷款集中度及单一客户明细表',
        // 表格详情部分 左侧日期
        tableDate: {
          year: '',
          month: ''
        },
        // 表格详情部分 右侧单位
        unit: '',
        // 表格数据源
        tableContent: [],
        // echarts图数据
        allDatas: [],
        // 折柱混合图 数据源
        option1: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          legend: {
            data: ['贷款余额', '较上月变化']
          },
          xAxis: [
            {
              type: 'category',
              data: ['客户1', '客户2', '客户3', '客户4', '客户5', '客户6', '客户7', '客户8', '客户9', '客户10'],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '贷款余额',
              // min: 0,
              // max: 20,
              // interval: 5,
              axisLabel: {
                formatter: '{value} 亿'
              }
            },
            {
              type: 'value',
              name: '较上月增长量',
              // min: -20,
              // max: 20,
              // interval: 5,
              axisLabel: {
                formatter: '{value} 亿'
              }
            }
          ],
          series: [
            {
              name: '贷款余额',
              type: 'bar',
              data: [],
              // data: [14, 13, 12, 11, 10, 9, 8, 7, 8, 6, 7, 6],
              itemStyle: {
                normal: {
                  color: '#029f4a'
                }
              }
            },
            {
              name: '较上月变化',
              type: 'line',
              yAxisIndex: 1,
              data: [],
              // data: [5, 3, -4, 3, 8, 5, -6, 0, 3, 2, 4, 2],
              itemStyle: {
                normal: {
                  color: '#c23531'
                }
              }
            }
          ]
        },
        option11: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          legend: {
            data: ['贷款余额', '较上月变化']
          },
          xAxis: [
            {
              type: 'category',
              data: ['客户1', '客户2', '客户3', '客户4', '客户5', '客户6', '客户7', '客户8', '客户9', '客户10'],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '贷款余额',
              // min: 0,
              // max: 20,
              // interval: 5,
              axisLabel: {
                formatter: '{value} 亿'
              }
            },
            {
              type: 'value',
              name: '较上月增长量',
              // min: -20,
              // max: 20,
              // interval: 5,
              axisLabel: {
                formatter: '{value} 亿'
              }
            }
          ],
          series: [
            {
              name: '贷款余额',
              type: 'bar',
              data: [],
              // data: [14, 13, 12, 11, 10, 9, 8, 7, 8, 6, 7, 6],
              itemStyle: {
                normal: {
                  color: '#029f4a'
                }
              }
            },
            {
              name: '较上月变化',
              type: 'line',
              yAxisIndex: 1,
              data: [],
              // data: [5, 3, -4, 3, 8, 5, -6, 0, 3, 2, 4, 2],
              itemStyle: {
                normal: {
                  color: '#c23531'
                }
              }
            }
          ]
        },
        // 折线图
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
          legend: {
            data: ['贷款余额', '较上月变化']
          },
          xAxis: [
            {
              type: 'category',
              data: ['客户1', '客户2', '客户3', '客户4', '客户5', '客户6', '客户7', '客户8', '客户9', '客户10'],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '贷款余额',
              // min: 0,
              // max: 20,
              // interval: 5,
              axisLabel: {
                formatter: '{value} 亿'
              }
            },
            {
              type: 'value',
              name: '较上月增长量',
              // min: -20,
              // max: 20,
              // interval: 5,
              axisLabel: {
                formatter: '{value} 亿'
              }
            }
          ],
          series: [
            {
              name: '贷款余额',
              type: 'line',
              data: [14, 13, 12, 11, 10, 9, 8, 7, 8, 6, 7, 6],
              itemStyle: {
                normal: {
                  color: '#029f4a'
                }
              }
            },
            {
              name: '较上月变化',
              type: 'line',
              yAxisIndex: 1,
              data: [5, 3, -4, 3, 8, 5, -6, 0, 3, 2, 4, 2],
              itemStyle: {
                normal: {
                  color: '#c23531'
                }
              }
            }
          ]
        },
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
          legend: {
            data: ['贷款余额', '较上月变化']
          },
          xAxis: [
            {
              type: 'category',
              data: ['客户1', '客户2', '客户3', '客户4', '客户5', '客户6', '客户7', '客户8', '客户9', '客户10'],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '贷款余额',
              // min: 0,
              // max: 20,
              // interval: 5,
              axisLabel: {
                formatter: '{value} 亿'
              }
            },
            {
              type: 'value',
              name: '较上月增长量',
              // min: -20,
              // max: 20,
              // interval: 5,
              axisLabel: {
                formatter: '{value} 亿'
              }
            }
          ],
          series: [
            {
              name: '贷款余额',
              type: 'line',
              data: [14, 13, 12, 11, 10, 9, 8, 7, 8, 6, 7, 6],
              itemStyle: {
                normal: {
                  color: '#029f4a'
                }
              }
            },
            {
              name: '较上月变化',
              type: 'line',
              yAxisIndex: 1,
              data: [5, 3, -4, 3, 8, 5, -6, 0, 3, 2, 4, 2],
              itemStyle: {
                normal: {
                  color: '#c23531'
                }
              }
            }
          ]
        },
        // 柱状图
        option3: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          legend: {
            data: ['贷款余额', '较上月变化']
          },
          xAxis: [
            {
              type: 'category',
              data: ['客户1', '客户2', '客户3', '客户4', '客户5', '客户6', '客户7', '客户8', '客户9', '客户10'],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '贷款余额',
              // min: 0,
              // max: 20,
              // interval: 5,
              axisLabel: {
                formatter: '{value} 亿'
              }
            },
            {
              type: 'value',
              name: '较上月增长量',
              // min: -20,
              // max: 20,
              // interval: 5,
              axisLabel: {
                formatter: '{value} 亿'
              }
            }
          ],
          series: [
            {
              name: '贷款余额',
              type: 'bar',
              data: [14, 13, 12, 11, 10, 9, 8, 7, 8, 6, 7, 6],
              itemStyle: {
                normal: {
                  color: '#029f4a'
                }
              }
            },
            {
              name: '较上月变化',
              type: 'bar',
              yAxisIndex: 1,
              data: [5, 3, -4, 3, 8, 5, -6, 0, 3, 2, 4, 2],
              itemStyle: {
                normal: {
                  color: '#c23531'
                }
              }
            }
          ]
        },
        option33: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          legend: {
            data: ['贷款余额', '较上月变化']
          },
          xAxis: [
            {
              type: 'category',
              data: ['客户1', '客户2', '客户3', '客户4', '客户5', '客户6', '客户7', '客户8', '客户9', '客户10'],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '贷款余额',
              // min: 0,
              // max: 20,
              // interval: 5,
              axisLabel: {
                formatter: '{value} 亿'
              }
            },
            {
              type: 'value',
              name: '较上月增长量',
              // min: -20,
              // max: 20,
              // interval: 5,
              axisLabel: {
                formatter: '{value} 亿'
              }
            }
          ],
          series: [
            {
              name: '贷款余额',
              type: 'bar',
              data: [14, 13, 12, 11, 10, 9, 8, 7, 8, 6, 7, 6],
              itemStyle: {
                normal: {
                  color: '#029f4a'
                }
              }
            },
            {
              name: '较上月变化',
              type: 'bar',
              yAxisIndex: 1,
              data: [5, 3, -4, 3, 8, 5, -6, 0, 3, 2, 4, 2],
              itemStyle: {
                normal: {
                  color: '#c23531'
                }
              }
            }
          ]
        },
        // =====dialog放大框 内容=========
        // 控制折柱混合图dailog框的放大与隐藏
        dialogVisible: false,
        flag1: false,
        flag2: false,
        flag3: false,
        flag4: false,
        flag5: false,
        flag6: false,
        // 控制饼图的dialog展示与隐藏
        dialogVisible1: false,
        // 饼柱结合图dialog展示与隐藏
        dialogVisible2: false
      }
    },
    props: ['selectionOrgId'],
    components: {
      linegraph
    },
    created() {
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
        queryLoanTenCusRpt(this.selectionOrgId, this.tableDate.year, this.tableDate.month, this.ruleForm.moneyUnit).then(res => {
          const datas = res.data.data
          this.allDatas = datas.loanTenCusRptVOList
          this.formData = datas.quotaInfoVO
          this.tableContent = datas.loanTenCusRptVOList
          if (datas.loanTenCusRptVOList.length > 0) {
            this.tableDate.month = datas.loanTenCusRptVOList[0].totalMonth
            this.tableDate.year = datas.loanTenCusRptVOList[0].totalYear
          }

          // 图状数据显示待开发
          this.option1.series[0].data = this.option2.series[0].data = this.option3.series[0].data = datas.loanTenCusRptVOList.map(item => {
            return item.loanBalance
          })
          this.option1.series[1].data = this.option2.series[1].data = this.option3.series[1].data = datas.loanTenCusRptVOList.map(item => {
            return item.change
          })
          this.option1.xAxis[0].data = this.option2.xAxis[0].data = this.option3.xAxis[0].data = datas.loanTenCusRptVOList.map(item => {
            return item.customerName
          })

          this.flag1 = true
          this.flag2 = true
          this.flag3 = true
        })
      },

      // 点击导出按钮，触发该函数
      dowmloadExcel() {
        var year = null, month = null
        var date = this.pm == '' ? null : this.pm
        if (date != null) {
          year = date.getFullYear()
          month = (date.getMonth() + 1).toString()
          this.tableDate.year = year
          this.tableDate.month = month
        }
        if (this.ruleForm.moneyUnit == 'wan') {
          this.unit = '万元'
        } else {
          this.unit = '亿元'
        }
        downLoanTenCusRptTable(this.selectionOrgId, year, month, this.ruleForm.moneyUnit).then(res => {
          const content = res
          const blob = new Blob([content])
          const fileName = this.toptitle + new Date().getTime() + '.xlsx'
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
      },

      showLinebar() {
        this.option11.series[0].data = this.allDatas.map(item => {
          return item.loanBalance
        })
        this.option11.series[1].data = this.allDatas.map(item => {
          return item.change
        })
        this.option11.xAxis[0].data = this.allDatas.map(item => {
          return item.customerName
        })
        this.dialogVisible = true
        this.flag4 = true
      },
      showLine() {
        this.option22.series[0].data = this.allDatas.map(item => {
          return item.loanBalance
        })
        this.option22.series[1].data = this.allDatas.map(item => {
          return item.change
        })
        this.option22.xAxis[0].data = this.allDatas.map(item => {
          return item.customerName
        })
        this.dialogVisible1 = true
        this.flag5 = true
      },
      showBar() {
        this.option33.series[0].data = this.allDatas.map(item => {
          return item.loanBalance
        })
        this.option33.series[1].data = this.allDatas.map(item => {
          return item.change
        })
        this.option33.xAxis[0].data = this.allDatas.map(item => {
          return item.customerName
        })
        this.dialogVisible2 = true
        this.flag6 = true
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

    // 表格部分的样式
    .tableContent /deep/ {
      .el-table th {
        padding: 5px 0;
      }
      .el-table td {
        padding: 3px 0;
      }
    }
  }

  // 表格部分 图表区的样式
  .chartContent {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 295px;
    // border: 1px solid #ccc;
    margin-top: 5px;
    // padding: 1px;
    .leftChart {
      width: 60%;
      height: 100%;
      border: 1px solid #ccc;
      // padding-top: 5px;
    }

    .rightChart {
      width: 39%;
      height: 100%;
      border: 1px solid #ccc;

      .line {
        width: 100%;
        height: 49%;
        border-bottom: 1px solid #ccc;
      }
    }
  }
</style>
