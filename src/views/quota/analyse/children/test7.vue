<!-- 行业授信集中度简表 组件页面 -->
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
        <el-select v-model="ruleForm.moneyUnit" placeholder="选择金额单位" size="small">
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
        <h3>{{ toptitle }}</h3>
        <p class="bottomCon">
          <span>日期： {{ tableDate.year }} 年 {{ tableDate.month }} 月</span>
          <span>单位：{{unit}}</span>
        </p>
      </div>
      <!-- 表格内容部分 -->
      <div class="tableContent">
        <el-table :data="tableContent" style="width: 100%" max-height="440px" row-key="quotaNum" border default-expand-all
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column prop="quotaName" label="行业分类" width="250"></el-table-column>
          <el-table-column label="实际授信情况">
            <el-table-column prop="quotaUsedAmt" label="余额">
              <template slot-scope="scope">{{ scope.row.quotaUsedAmt | NumsFormat }}</template>
            </el-table-column>
            <el-table-column prop="quotaUsedRatio" label="占比">
              <template slot-scope="scope">{{ scope.row.quotaUsedRatio + '%' }}</template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="管控指标">
            <el-table-column prop="observeValue" label="观察值(余额/占比)"></el-table-column>
            <el-table-column prop="warnValue" label="预警值(余额/占比)"></el-table-column>
            <el-table-column prop="controlValue" label="控制值(余额/占比)"></el-table-column>
          </el-table-column>

        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { queryIndustryQuotaBaseRpt,getWorkYear,getWorkMonth } from '@/api/rcd/limitAnalyse/limitAnalyse'

  export default {
    data() {
      return {
        ruleForm: {
          pickMonth: '',
          moneyUnit: 'wan'
        },
        pm: '',
        // 表格详情部分 中间标题
        toptitle: '行业授信集中度简表',
        // 表格详情部分 左侧日期
        tableDate: {
          year: '',
          month: ''
        },
        // 表格详情部分 右侧单位
        unit: '',
        // 表格数据源
        tableContent: [
         /* {
            quotaNum: '1',
            quotaName: '房地产行业授信余额',
            quotaUsedAmt: 8888,
            quotaUsedRatio: '88',
            observeValue: '888',
            warnValue: '888',
            controlValue: '8888',
            children: [{
              quotaNum: '11',
              quotaName: '对公房地产业授信',
              quotaUsedAmt: 8888,
              quotaUsedRatio: '88',
              observeValue: '888',
              warnValue: '888',
              controlValue: '8888',
              children: [
                {
                  quotaNum: '111',
                  quotaName: '贷款',
                  quotaUsedAmt: 8888,
                  quotaUsedRatio: '88',
                  observeValue: '888',
                  warnValue: '888',
                  controlValue: '8888'
                },
                {
                  quotaNum: '112',
                  quotaName: '债券',
                  quotaUsedAmt: 8888,
                  quotaUsedRatio: '88',
                  observeValue: '888',
                  warnValue: '888',
                  controlValue: '8888'
                },
                {
                  quotaNum: '113',
                  quotaName: '结构化融资',
                  quotaUsedAmt: 8888,
                  quotaUsedRatio: '88',
                  observeValue: '888',
                  warnValue: '888',
                  controlValue: '8888'
                }
              ]
            }, {
              quotaNum: '12',
              quotaName: '个人住房/商用房按揭贷款',
              quotaUsedAmt: 8888,
              quotaUsedRatio: '88',
              observeValue: '888',
              warnValue: '888',
              controlValue: '8888',
              children:[
                {
                  quotaNum: '121',
                  quotaName: '个人住房按揭',
                  quotaUsedAmt: 8888,
                  quotaUsedRatio: '88',
                  observeValue: '888',
                  warnValue: '888',
                  controlValue: '8888',
                },
                {
                  quotaNum: '888',
                  quotaName: '个人商用房按揭',
                  quotaUsedAmt: 8888,
                  quotaUsedRatio: '88',
                  observeValue: '888',
                  warnValue: '888',
                  controlValue: '8888',
                }
              ]
            }]
          }, {
            quotaNum: '2',
            quotaName: '产能过剩行业授信余额',
            quotaUsedAmt: 8888,
            quotaUsedRatio: '88',
            observeValue: '888',
            warnValue: '888',
            controlValue: '8888',
            children:[
              {
                quotaNum: '21',
                quotaName: '产能过剩行业贷款',
                quotaUsedAmt: 8888,
                quotaUsedRatio: '88',
                observeValue: '888',
                warnValue: '888',
                controlValue: '8888',
              },
              {
                quotaNum: '22',
                quotaName: '产能过剩行业非标',
                quotaUsedAmt: 8888,
                quotaUsedRatio: '88',
                observeValue: '888',
                warnValue: '888',
                controlValue: '8888',
              }
            ]
          }*/
        ]
      }
    },
    props: ['selectionOrgId'],
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
        queryIndustryQuotaBaseRpt(this.selectionOrgId, this.tableDate.year, this.tableDate.month, this.ruleForm.moneyUnit).then(res => {
          const datas = res.data.data;
          if(datas.root1 != null){
            this.tableDate.year = datas.root1.totalYear
            this.tableDate.month = datas.root1.totalMonth
          }
          this.tableContent = [datas.root1,datas.root2]
          // this.$set(this.tableContent,"age", 24)
          //这种写法不会触发视图更新
          // this.tableContent[0] = res.data.data.root1;
          // this.tableContent[1] = res.data.data.root2;
        })
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
    .tableTitle /deep/ {
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

    .tableContent /deep/ {
      .el-table {
        .el-table__header-wrapper {
          .el-table__header {
            thead {
              tr:first-child {
                th:nth-child(2),
                th:nth-child(3) {
                  text-align: center;
                }
              }
            }
          }
        }

        // .el-table__body-wrapper {
        //   .el-table__body {
        //     tbody {
        //       /*              tr:nth-child(2) {
        //                       td:first-child {
        //                         div.cell::before {
        //                           content: '';
        //                           width: 2em;
        //                           display: inline-block;
        //                         }
        //                       }
        //                     }

        //                     tr:nth-child(3) {
        //                       td:first-child {
        //                         div.cell::before {
        //                           content: '';
        //                           width: 5em;
        //                           display: inline-block;
        //                         }
        //                       }
        //                     }*/
        //     }
        //   }
        // }
      }
    }
  }
</style>
