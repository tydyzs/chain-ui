<!-- 借据详情 -->
<template>
  <div class="corporateMsgCon">
    <!-- 基本信息 -->
    <el-card class="basicInfo">
      <el-form ref="form" :model="ruleForm" label-width="180px" size="small">
        <el-form-item label="借据编号" prop="summaryNum">
          <el-input v-model="ruleForm.summaryNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNum">
          <el-input v-model="ruleForm.contractNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="ruleForm.customerName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户编号" prop="customerNum">
          <el-input v-model="ruleForm.customerNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="业务品种" prop="productName">
          <el-input v-model="ruleForm.productName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="业务种类" prop="productType">
          <el-input v-model="ruleForm.productTypeName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="币种" prop="currencyCd">
          <el-input v-model="ruleForm.currencyCdName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="借据金额" prop="summaryAmt">
          <el-input v-model="ruleForm.summaryAmt" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="借据余额" prop="summaryBal">
          <el-input v-model="ruleForm.summaryBal" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="担保方式" prop="guaranteeType">
          <el-input v-model="ruleForm.guaranteeTypeName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="借据起期" prop="beginDate">
          <el-input v-model="ruleForm.beginDate" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="借据止期" prop="endDate">
          <el-input v-model="ruleForm.endDate" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="经办人" prop="userNum">
          <el-input v-model="ruleForm.userNumName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="经办机构" prop="orgNum">
          <el-input v-model="ruleForm.orgNumName" size="small" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import { summaryDetail } from '@/api/rcd/standBook/detail'
// import { dictTranslate } from '@/api/system/dict'
export default {
  data() {
    return {
      // 基本信息中表单数据源
      ruleForm: {},
      //借据号
      summaryNum: ''
    }
  },
  created() {
    console.log(JSON.parse(sessionStorage.getItem("summaryVal")), '打印传递的值')
    this.summaryNum = JSON.parse(sessionStorage.getItem("summaryVal")).summaryNum

    this.getSummaryDetail();
    // this.dictTrans();
  },
  methods: {
    //获取借据信息
    getSummaryDetail() {
      summaryDetail(this.summaryNum).then(res => {
        console.log(res, '借据信息')
        this.ruleForm = res.data.data
      })
    },
    // dictTrans() {
    //   //经办人
    //   dictTranslate('user').then(res => {
    //     this.userNumCd = res.data.data
    //     this.ruleForm.userNum = this.userNumCd[this.ruleForm.userNum]
    //   })
    //   //业务种类
    //   dictTranslate('CD000061').then(res => {
    //     this.productTypeCd = res.data.data
    //     this.ruleForm.productType = this.productTypeCd[
    //       this.ruleForm.productType
    //     ]
    //   })
    //   //币种
    //   dictTranslate('CD000019').then(res => {
    //     this.currencyCdCd = res.data.data
    //     this.ruleForm.currencyCd = this.currencyCdCd[this.ruleForm.currencyCd]
    //   })
    //   //担保方式
    //   dictTranslate('CD000019').then(res => {
    //     this.guaranteeTypeCd = res.data.data
    //     this.ruleForm.guaranteeType = this.guaranteeTypeCd[
    //       this.ruleForm.guaranteeType
    //     ]
    //   })
    //   //经办人
    //   dictTranslate('org').then(res => {
    //     this.orgNumCd = res.data.data
    //     this.ruleForm.orgNum = this.orgNumCd[this.ruleForm.orgNum]
    //   })
    // }
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



