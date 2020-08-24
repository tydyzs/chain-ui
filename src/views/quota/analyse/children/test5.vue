<!-- 关联客户授信集中度简表 组件页面 -->
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
        <el-table :data="tableInfo" style="width: 100%" max-height="400px" :span-method="mergeCol">
          <el-table-column type="index" width="40"></el-table-column>
          <el-table-column prop="target" label="指标名称" width="190"></el-table-column>
          <el-table-column prop="customer" label="客户名称" width="190"></el-table-column>
          <el-table-column label="实际授信情况">
            <el-table-column prop="balance" label="余额" width="70"></el-table-column>
            <el-table-column prop="percent" label="占比" width="70"></el-table-column>
          </el-table-column>
          <el-table-column label="管控指标">
            <el-table-column prop="observe" label="观察值(余额/占比)" width="140"></el-table-column>
            <el-table-column prop="warning" label="预警值(余额/占比)" width="140"></el-table-column>
            <el-table-column prop="control" label="控制值(余额/占比)" width="140"></el-table-column>
          </el-table-column>
        </el-table>
        <p>注：占比是指占我行资本净额的比例</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { queryRelationQuotaBaseRpt } from '@/api/rcd/limitAnalyse/limitAnalyse'

  export default {
    data() {
      return {
        ruleForm: {
          pickMonth: '',
          moneyUnit: 'wan'
        },
        pm: '',
        // 表格详情部分 中间标题
        toptitle: '关联客户授信集中度简表',
        // 表格详情部分 左侧日期
        tableDate: {
          year: '',
          month: ''
        },
        // 表格详情部分 右侧单位
        unit: '',
        // 表格的数据源
        tableInfo: [
          /*{
            target: '单一关联客户集中度',
            customer: '取最大一家',
            balance: '8.00',
            percent: '1.42%',
            observe: '20/3.55%',
            warning: '20/3.55%',
            control: '20/3.55%'
          },
          {
            target: '单一关联方所在集团客户集中度',
            customer: '取最大一家关联客户所在集团',
            balance: '23.47',
            percent: '4.17%',
            observe: '20/3.55%',
            warning: '20/3.55%',
            control: '20/3.55%'
          },
          {
            target: '单一关联方所在集团客户集中度',
            customer: '取最大一家关联客户所在集团',
            balance: '23.47',
            percent: '4.17%',
            observe: '20/3.55%',
            warning: '20/3.55%',
            control: '20/3.55%'
          },
          {
            target: '全部关联度指标',
            customer: '取最大一家关联客户所在集团',
            balance: '23.47',
            percent: '4.17%',
            observe: '20/3.55%',
            warning: '20/3.55%',
            control: '20/3.55%'
          }*/
        ]
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
        queryRelationQuotaBaseRpt(this.selectionOrgId, this.tableDate.year, this.tableDate.month, this.ruleForm.moneyUnit).then(res => {
          const datas = res.data.data.records
          this.tableInfo = datas
          if (datas.length > 0) {
            this.tableDate.year = datas[0].totalYear
            this.tableDate.month = datas[0].totalMonth
          }
        })
      },
      mergeCol({ rowIndex, columnIndex }) {
        if (rowIndex === this.tableInfo.length - 1) {
          if (columnIndex === 1) {
            return [1, 2]
          } else if (columnIndex === 2) {
            return [0, 0]
          }
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
