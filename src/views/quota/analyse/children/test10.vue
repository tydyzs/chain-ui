<!-- 同业客户风险暴露明细表 组件页面 -->
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
        <h3>{{ toptitle }}</h3>
        <p class="bottomCon">
          <span>日期： {{ tableDate.year }} 年 {{ tableDate.month }} 月</span>
          <span>单位：{{unit}}</span>
        </p>
      </div>
      <!-- 表格内容部分 -->
      <div class="tableContent">
        <el-table :data="tableContent" border style="width: 100%" max-height="430px">
          <el-table-column label="序号" width="60" type="index" align="center"></el-table-column>
          <el-table-column prop="customerName" label="同业客户" width="300" align="center">
          </el-table-column>
          <el-table-column prop="crdBalance" label="授信余额" width="180" align="center">
            <template slot-scope="scope">{{ scope.row.crdRatio | NumsFormat }}</template>
          </el-table-column>
          <el-table-column prop="crdRatio" label="占比" align="center">
            <template slot-scope="scope">{{ scope.row.crdBalance + '%' }}</template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import { queryBankRiskExposureRpt } from '@/api/rcd/limitAnalyse/limitAnalyse'

  export default {
    data() {
      //tableData数据填充
      const data = {
        index: '',
        balance: '',
        account: ''
      }
      return {
        ruleForm: {
          pickMonth: '',
          moneyUnit: 'wan'
        },
        pm: '',
        // 表格详情部分 中间标题
        toptitle: '同业客户风险暴露明细表',
        // 表格详情部分 左侧日期
        tableDate: {
          year: '',
          month: ''
        },
        // 中部表格
        tableContent: [],//Array(20).fill(data),
        // 表格详情部分 右侧单位
        unit: ''
      }
    },
    props: ['selectionOrgId'],
    mounted: function() {
      this.query()
    },
    methods: {
      query() {
        var date = this.pm == '' ? null : this.pm
        if (date != null) {
          this.tableDate.year = date.getFullYear();
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
        queryBankRiskExposureRpt(this.selectionOrgId, this.tableDate.year, this.tableDate.month, this.ruleForm.moneyUnit).then(res => {
          const datas = res.data.data
          this.tableContent = datas
          if (datas.length > 0) {
            this.tableDate.year = datas[0].totalYear
            this.tableDate.month = datas[0].totalMonth
          }

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
