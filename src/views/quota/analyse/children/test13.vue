<!-- 风险暴露超过一级资本净额2.5%的集团客户列表 -->
<template>
  <div>
    <!-- 客户名称、客户经理，管护机构 部分 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <!-- 客户名称 -->
      <el-form-item label="客户名称" prop="name">
        <el-input v-model="ruleForm.customerName" size="small"></el-input>
      </el-form-item>
      <!-- 客户经理 -->
      <!-- <el-form-item label="客户经理" prop="name">
        <el-input v-model="ruleForm.manager" size="small"></el-input>
      </el-form-item> -->
      <!-- 管护机构 -->
      <!-- <el-form-item label="管护机构" prop="name">
        <el-input v-model="ruleForm.organization" size="small"></el-input>
      </el-form-item> -->
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
        <!-- <p class="bottomCon">
          <span>日期：{{nowTime}}</span>
          <span>单位：亿元</span>
        </p> -->
      </div>
      <!-- 表格内容部分 -->
      <!-- 点击上方的查询按钮，表格中显示对应的数据，双击数据行，跳转到详情页 -->
      <div class="tableContent"></div>
      <el-table :data="tableData" border style="width: 100%" max-height="440">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="groupCustomerNum" label="集团编号" width="120"></el-table-column>
        <el-table-column prop="groupCustomerName" label="集团名称" width="180"></el-table-column>
        <el-table-column prop="groupApproveExpAmount" label="集团批复总额">
          <template slot-scope="scope">{{ scope.row.groupApproveExpAmount | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="groupCreditExpBalance" label="集团已用总额">
          <template slot-scope="scope">{{ scope.row.groupCreditExpBalance | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="groupCapitalRatio" label="一级资本占比">
          <template slot-scope="scope">{{ scope.row.groupCapitalRatio + '%' }}</template>
        </el-table-column>
        <el-table-column prop="risk" label="风险暴露类别"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-button class="textBtn" type="text" icon="el-icon-view" @click="detailDialog(scope.row)">业务详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能区 -->
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="pageInfo.current" :page-sizes="[10, 20, 30, 40]"
                     :page-size="pageInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total"></el-pagination>

      <!-- 业务详情页面 -->
      <el-dialog :title="detailDialogTitle" :visible.sync="detailDialogVisible" width="60%">
        <el-table :data="detailData" border style="width: 100%">
          <!--<el-table-column prop="customerNum" label="成员分类"></el-table-column>-->
          <el-table-column prop="customerNum" label="成员编号"></el-table-column>
          <el-table-column prop="customerName" label="成员名称"></el-table-column>
          <el-table-column prop="approveNum" label="批复编号"></el-table-column>
          <el-table-column prop="productName" label="业务品种"></el-table-column>
          <el-table-column prop="approveAmt" label="批复额度"></el-table-column>
          <el-table-column prop="approveExpAmt" label="敞口额度"></el-table-column>
          <el-table-column prop="approveExpUsed" label="敞口余额"></el-table-column>
          <el-table-column prop="mainGuaranteeTypeName" label="担保方式"></el-table-column>
          <el-table-column prop="beginDate" label="用信起期"></el-table-column>
          <el-table-column prop="endDate" label="用信止期"></el-table-column>
          <el-table-column prop="orgNumName" label="管户机构"></el-table-column>
          <el-table-column prop="userNumName" label="管户经理"></el-table-column>

        </el-table>
        <!-- 分页功能区 -->
        <el-pagination @size-change="sizeChange2" @current-change="currentChange2" :current-page="detailPageInfo.current" :page-sizes="[10, 20, 30, 40]"
                       :page-size="detailPageInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="detailPageInfo.total"></el-pagination>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { queryOverTwoPointFivePercent } from '@/api/rcd/limitAnalyse/limitAnalyse'
  import { crdApprove} from '@/api/rcd/standBook/thirdparty'
  export default {
    data() {
      return {
        ruleForm: {
          customerName: ''
        },
        // nowTime: '',
        // 表格详情部分 中间标题
        toptitle: '风险暴露超过一级资本净额2.5%的集团客户列表',
        // 表格详情部分 左侧日期
        tableDate: {
          year: '',
          month: ''
        },
        // 表格详情部分 右侧单位
        unit: '',
        detailDialogVisible: false,
        detailDialogTitle: '详情页面',
        detailData: [],
        // 表格数据源
        tableData: [],
        // 分页数据源
        pageInfo: {
          current: 1, // 当前页码
          size: 10,// 每页显示条数
          total: 0// 总条数
        },
        // 分页数据源
        detailPageInfo: {
          current: 1, // 当前页码
          size: 10,// 每页显示条数
          total: 0// 总条数
        }
      }
    },
    mounted: function() {
      this.query()
    },
    methods: {
      query() {
        queryOverTwoPointFivePercent(this.ruleForm, this.pageInfo).then(res => {
          const datas = res.data.data.records
          this.tableData = datas
          this.pageInfo.total = res.data.data.total
          if (datas.length == 0) {
            return
          }
        })
      },
      detailDialog(row) {
        this.detailDialogVisible = true
        this.detailDialogTitle = '【' + row.groupCustomerName + '】的业务列表'
        this.currentDetailNum = row.groupCustomerNum
        this.getDetailData()
      },
      getDetailData(){
        crdApprove(
          this.detailPageInfo.pagenum,
          this.detailPageInfo.pagesize,
          this.currentDetailNum,//'C005',
          ''//'01000'
        ).then(res => {
          this.detailData = res.data.data.records
          this.detailPageInfo.total = res.data.data.total
        })
      },
      // 每页总条数的变化，触发这个函数
      sizeChange(newSize) {
        this.pageInfo.size = newSize
        this.query()
      },
      // 当前页码的变化，触发这个函数
      currentChange(newPage) {
        this.pageInfo.current = newPage
        this.query()
      },
      // 每页总条数的变化，触发这个函数
      sizeChange2(newSize) {
        this.pageInfo.size = newSize
        this.getDetailData()
      },
      // 当前页码的变化，触发这个函数
      currentChange2(newPage) {
        this.pageInfo.current = newPage
        this.getDetailData()
      }
    }
  }
</script>

<style lang="scss" scoped>
  // 选择客户名称、客户经理、管护机构部分的样式
  .el-form /deep/ {
    display: flex;
    justify-content: flex-start;
    .el-form-item /deep/ {
      .el-form-item__content {
        .el-input {
          width: 150px;
          .el-input__inner {
            width: 180px;
          }
        }
      }
    }

    .el-form-item:first-child {
      .el-form-item__label {
        width: 68px;
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
    }

    // 分页功能区的样式
    .el-pagination {
      float: right;
      margin-top: 5px;
    }
  }

  // dialog样式
.el-dialog__wrapper /deep/ {
  .el-dialog {
    .el-dialog__body {
      padding: 30px 20px 50px;
    }
  }
}
</style>
