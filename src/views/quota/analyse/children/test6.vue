<!-- 关联客户授信集中度明细表 组件页面 -->
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
          <!-- 左边 年月 -->
          <span>日期： {{ tableDate.year }} 年 {{ tableDate.month }} 月</span>
          <!-- 右边 金额单位 -->
          <span>单位：{{unit}} 元, %</span>
        </p>
      </div>
      <!-- 表格内容部分 -->
      <div class="tableContent">
        <el-table :data="tableData" style="width: 100%" border max-height="440px">
          <el-table-column type="index" width="40"></el-table-column>
          <el-table-column label="单一关联方">
            <el-table-column prop="singleCus" label="单一关联客户名称" width="160"></el-table-column>
            <el-table-column prop="unused" label="授信余额" width="80"></el-table-column>
            <el-table-column prop="percent" label="占资本净额比例" width="120"></el-table-column>
            <el-table-column prop="newChange" label="较上月变化" width="100"></el-table-column>
          </el-table-column>
          <el-table-column label="单一关联方所在集团">
            <el-table-column prop="groupName" label="所在集团名称" width="160"></el-table-column>
            <el-table-column prop="groupUnused" label="授信余额" width="80"></el-table-column>
            <el-table-column prop="groupPercent" label="占资本净额比例" width="120"></el-table-column>
            <el-table-column prop="groupNewChange" label="较上月变化" width="100"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import {test2} from "@/api/rcd/limitAnalyse/limitAnalyse";
export default {
  data () {
    return {
      ruleForm: {
        pickMonth: '',
        moneyUnit: 'wan'
      },
      pm: '',
      // 表格详情部分 中间标题
      toptitle: '关联客户授信集中度明细表',
      // 表格详情部分 左侧日期
      tableDate: {
        year: '',
        month: ''
      },
      // 表格详情部分 右侧单位
      unit: '',
      // 表格数据源
      tableData: [
        {
          singleCus: '',
          unused: '',
          percent: '',
          newChange: '',
          groupName: '',
          groupUnused: '',
          groupPercent: '',
          groupNewChange: ''
        },
        {
          singleCus: '',
          unused: '',
          percent: '',
          newChange: '',
          groupName: '',
          groupUnused: '',
          groupPercent: '',
          groupNewChange: ''
        },
        {
          singleCus: '',
          unused: '',
          percent: '',
          newChange: '',
          groupName: '',
          groupUnused: '',
          groupPercent: '',
          groupNewChange: ''
        },
        {
          singleCus: '',
          unused: '',
          percent: '',
          newChange: '',
          groupName: '',
          groupUnused: '',
          groupPercent: '',
          groupNewChange: ''
        },
        {
          singleCus: '',
          unused: '',
          percent: '',
          newChange: '',
          groupName: '',
          groupUnused: '',
          groupPercent: '',
          groupNewChange: ''
        },
        {
          singleCus: '',
          unused: '',
          percent: '',
          newChange: '',
          groupName: '',
          groupUnused: '',
          groupPercent: '',
          groupNewChange: ''
        },
        {
          singleCus: '',
          unused: '',
          percent: '',
          newChange: '',
          groupName: '',
          groupUnused: '',
          groupPercent: '',
          groupNewChange: ''
        },
        {
          singleCus: '',
          unused: '',
          percent: '',
          newChange: '',
          groupName: '',
          groupUnused: '',
          groupPercent: '',
          groupNewChange: ''
        },
        {
          singleCus: '',
          unused: '',
          percent: '',
          newChange: '',
          groupName: '',
          groupUnused: '',
          groupPercent: '',
          groupNewChange: ''
        },
        {
          singleCus: '',
          unused: '',
          percent: '',
          newChange: '',
          groupName: '',
          groupUnused: '',
          groupPercent: '',
          groupNewChange: ''
        }
      ]
    }
  },
  props:["selectionOrgId"],
  mounted:function(){
      this.query();
  },
  methods: {
      query(){
          var year = null,month = null;
          var date = this.pm==""?null:this.pm;
          if (date != null) {
              year = date.getFullYear();
              month = (date.getMonth() + 1).toString();
          }
          test2(this.selectionOrgId,year,month,this.ruleForm.moneyUnit).then(res => {
              const datas = res.data.data.records;
              this.tableInfo=datas;
          });
      },

  },
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
.content /deep/{
  // 上方标题部分的样式
  .tableTitle {
    // 中间标题样式
    h3 {
      text-align: center;
      font-weight: 700;
      margin-top: 0;
    }
    // 年月 、 金额单位样式
    .bottomCon {
      display: flex;
      justify-content: space-between;
    }
  }
  // 表格样式
     .tableContent {
       .el-table{
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
      }
    }
}
</style>
