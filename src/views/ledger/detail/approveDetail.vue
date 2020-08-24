<!-- 批复详情页面 -->
<template>
  <div class="corporateMsgCon">
    <!-- 基本信息 -->
    <el-card class="basicInfo">
      <el-form ref="form" :model="ruleForm" label-width="180px" size="small">
        <el-form-item label="批复编号" prop="approveNum">
          <el-input v-model="ruleForm.approveNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户编号" prop="customerNum">
          <el-input v-model="ruleForm.customerNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="ruleForm.customerName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="业务类型" prop="bizType">
          <el-input v-model="ruleForm.bizTypeName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="是否低风险" prop="isLowRisk">
          <el-input v-model="ruleForm.isLowRiskName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="低风险类型" prop="lowRiskType">
          <el-input v-model="ruleForm.lowRiskTypeName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="币种" prop="currencyCd">
          <el-input v-model="ruleForm.currencyCdName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="批复总金额" prop="totalAmt">
          <el-input v-model="ruleForm.totalAmt" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="批复总已用" prop="approveUsed">
          <el-input v-model="ruleForm.approveUsed" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="批复总可用" prop="approveAvi">
          <el-input v-model="ruleForm.approveAvi" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="批复状态" prop="approveStatus">
          <el-input v-model="ruleForm.approveStatusName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="经办人" prop="realName">
          <el-input v-model="ruleForm.userNumName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="经办机构" prop="fullName">
          <el-input v-model="ruleForm.orgNumName" size="small" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 批复明细信息 -->
    <el-card>
      <span>批复明细信息</span>
      <!-- 表格详情 -->
      <el-table :data="approveData" style="width: 100%" size="small" border stripe>
        <el-table-column type="index" label="序号" align="center" width="50" />
        <el-table-column prop="approveNum" label="批复编号" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="productName" label="业务品种" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="productTypeName" label="业务种类" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="approveAmt" label="批复明细金额" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.approveAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="approveUsed" label="批复明细已用" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.approveUsed | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="approveAvi" label="批复明细可用" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.approveAvi | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="beginDate" label="申请日期" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="term" label="申请期限" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="termUnitName" label="申请期限单位" align="center" :resizable="false"></el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="approvePage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="approvePage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="approvePage.total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { approveDetail, findListCrdApprove } from '@/api/rcd/standBook/detail'
export default {
  data() {
    return {
      //批复编号
      approveNum: '',
      // 基本信息中表单数据源
      ruleForm: {},
      // 批复明细信息中表格数据源
      approveData: [],
      // 批复明细信息中分页数据源
      approvePage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      }
    }
  },
  created() {
    console.log(JSON.parse(sessionStorage.getItem("approveVal")), '打印传递的值')
    this.approveNum = JSON.parse(sessionStorage.getItem("approveVal")).approveNum

    // ========== 表单、表格填入数据 ==========
    this.getApproveDetail()
    this.getFindListCrdApprove()
  },
  methods: {
    //获取批复客户信息
    getApproveDetail() {
      approveDetail(this.approveNum).then(res => {
        console.log(res, "批复客户信息");
        this.ruleForm = res.data.data;
      });
    },
    //获取批复列表信息
    getFindListCrdApprove() {
      findListCrdApprove(
        this.approvePage.pagenum,
        this.approvePage.pagesize,
        this.approveNum
      ).then(res => {
        console.log(res, "获取批复列表信息");
        this.approveData = res.data.data.records;
        this.approvePage.total = res.data.data.total;
      });
    },
    // 监听 批复明细信息 中分页 每页条数 改变的事件
    handleSizeChange1(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.approvePage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getFindListCrdApprove()
    },
    // 监听 批复明细信息 中分页 页码值 改变的事件
    handleCurrentChange1(newPage) {
      console.log(`当前页: ${newPage}`)
      this.approvePage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getFindListCrdApprove()
    }
  }
}
</script>

<style lang="scss" scoped>
.corporateMsgCon {
  padding: 2vh 1vw;
  // el-card 通用样式
  .el-card /deep/ {
    margin-bottom: 2vh;
    .el-card__body {
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 20px 20px 5px 20px;
      // 表头标题信息
      span {
        display: block;
        margin-bottom: 1.5vh;
      }
      // 表格头部添加底部线条
      .el-table {
        .el-table__header-wrapper {
          border-bottom: 1px solid #ebeef5;
        }
      }
      // 分页部分 样式
      .el-pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 1.5vh;
      }
    }
  }
  // 基本信息部分 样式
  .basicInfo {
    .el-card__body {
      .el-form {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .el-form-item /deep/ {
          .el-form-item__label {
            font-weight: normal;
          }
          .el-form-item__content {
            .el-input {
              .el-input__inner {
                color: #606266;
              }
            }
          }
        }
      }
    }
  }
}
</style>



