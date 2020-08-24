<template>
  <div class="creditContainer">
    <!-- 基本信息 -->
    <el-card class="basicInfo">
      <el-form  :model="ruleForm" ref="form" label-width="140px" size="small">
        <el-form-item label="业务编号" prop="busiDealNum">
          <el-input v-model="ruleForm.busiDealNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户编号" prop="customerNum">
          <el-input v-model="ruleForm.customerNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="ruleForm.customerName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="额度产品" prop="crdProductName">
          <el-input v-model="ruleForm.crdProductName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="业务品种" prop="productName">
          <el-input v-model="ruleForm.productName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="交易日期" prop="certFinishDate">
          <el-input v-model="ruleForm.certFinishDate" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="币种" prop="certCurrencyCd">
          <el-input v-model="ruleForm.certCurrencyCdName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="交易金额" prop="busiSumAmt">
          <el-input v-model="ruleForm.busiSumAmt" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="计息期限" prop="certInterestPeriod">
          <el-input v-model="ruleForm.certInterestPeriod" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="开始日期" prop="certBeginDate">
          <el-input v-model="ruleForm.certBeginDate" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="到期日期" prop="certEndDate">
          <el-input v-model="ruleForm.certEndDate" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="计息利率" prop="certInterestRate">
          <el-input v-model="ruleForm.certInterestRate" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="certStatus">
          <el-input v-model="ruleForm.certStatusName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="经办人" prop="userNum">
          <el-input v-model="ruleForm.userNumName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="经办机构" prop="crdGrantOrgNum">
          <el-input v-model="ruleForm.crdGrantOrgNumName" size="small" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    </div>
</template>

<script>
// import { dictTranslate } from "@/api/system/dict";
import { peerDetail } from "@/api/rcd/standBook/detail";

export default {
  data() {
    return {
      ruleForm: {},
      //基本信息中表单数据源
      // cretInfoId: "",
      busiDealNum: "",
      // dicOrg: {},
      // dicCret: {},
      // dicManager: {},
      // dicCurr: {},
      // dicStatus: {}
    };
  },
  created() {
    console.log(JSON.parse(sessionStorage.getItem("crdBusiCertInfoVal")), '打印传递的值')
    this.busiDealNum = JSON.parse(sessionStorage.getItem("crdBusiCertInfoVal")).busiDealNum
    // this.busiDealNum = this.$route.params.val;
    console.log(this.$route.params.val, '打印传递的值');
    this.getPeerDetail();
    // this.getDic();
  },
  methods: {
    // //字典处理数据类型
    // getDic() {
    //   // 机构字典
    //   dictTranslate("org").then(res => {
    //     this.dicOrg = res.data.data;
    //     this.ruleForm.crdGrantOrgNum = this.dicOrg[this.ruleForm.crdGrantOrgNum];
    //   });

    //   // 证件类型字典
    //   dictTranslate("CD000003").then(res => {
    //     this.dicCret = res.data.data;
    //   });
    //   // 币种字典
    //   dictTranslate("CD000019").then(res => {
    //     this.dicCurr = res.data.data;
    //     this.ruleForm.certCurrencyCd = this.dicCurr[
    //       this.ruleForm.certCurrencyCd
    //     ];
    //   });

    //   // 经办人字典
    //   dictTranslate("user").then(res => {
    //     this.dicManager = res.data.data;
    //     this.ruleForm.userNum = this.dicManager[this.ruleForm.userNum];
    //   });

    //   //业务状态字典
    //   dictTranslate("CD000174").then(res => {
    //     this.dicStatus = res.data.data;
    //     this.ruleForm.certStatus = this.dicStatus[this.ruleForm.certStatus];
    //   });

    // },
    //详情页数据请求
    getPeerDetail() {
      //this.cretInfoId = this.ruleForm.cretInfoId;
      // peerDetail("CL20091221").then(res => {
      peerDetail(this.busiDealNum).then(res => {
        console.log(res, "测试详情同业");
        this.ruleForm = res.data.data;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-card {
  margin: 0 0 15px 15px;
  /deep/ .el-card__body {
    padding: 20px 20px 0 20px;
  }
}
.creditContainer /deep/ {
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
