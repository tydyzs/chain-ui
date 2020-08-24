<!-- 合同详情页面 -->
<template>
  <div class="corporateMsgCon">
    <!-- 基本信息 -->
    <el-card class="basicInfo">
      <el-form ref="form" :model="ruleForm" label-width="180px" size="small">
        <el-form-item label="合同编号233" prop="contractNum">
          <el-input v-model="ruleForm.contractNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="批复编号" prop="approveId">
          <el-input v-model="ruleForm.approveId" size="small" disabled></el-input>
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
        <el-form-item label="合同金额" prop="contractAmt">
          <el-input v-model="ruleForm.contractAmt" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="合同余额" prop="contractBal">
          <el-input v-model="ruleForm.contractBal" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="合同可用" prop="contractAvi">
          <el-input v-model="ruleForm.contractAvi" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="合同起期" prop="beginDate">
          <el-input v-model="ruleForm.beginDate" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="合同止期" prop="endDate">
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

    <!-- 担保合同信息 -->
    <el-card>
      <span>担保合同信息</span>
      <!-- 表格详情 -->
      <el-table :data="subcontractData" style="width: 100%" size="small" border stripe>
        <el-table-column type="index" label="序号" align="center" width="50" />
        <el-table-column prop="subcontractNum" label="担保合同编号" align="center" :resizable="false" width="120"></el-table-column>
        <el-table-column prop="subcontractTypeName" label="担保合同类型" align="center" :resizable="false" width="120">
          <!-- <template slot-scope="scope">{{ subcontractTypeDict[scope.row.subcontractType] }}</template> -->
        </el-table-column>
        <el-table-column prop="isTopName" label="是否最高额" align="center" :resizable="false" width="120">
          <!-- <template slot-scope="scope">{{ isTopDict[scope.row.isTop] }}</template> -->
        </el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false" width="200">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="subcontractAmt" label="担保合同金额" align="center" :resizable="false" width="120">
          <template slot-scope="scope">{{ scope.row.subcontractAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="amtUsed" label="担保合同已用" align="center" :resizable="false" width="120">
          <template slot-scope="scope">{{ scope.row.amtUsed | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="amtAvi" label="担保合同可用" align="center" :resizable="false" width="120">
          <template slot-scope="scope">{{ scope.row.amtAvi | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="suretyAmt" label="本次担保金额" align="center" :resizable="false" width="120">
          <template slot-scope="scope">{{ scope.row.suretyAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="beginDate" label="担保合同起期" align="center" :resizable="false" width="120"></el-table-column>
        <el-table-column prop="endDate" label="担保合同止期" align="center" :resizable="false" width="120"></el-table-column>
        <el-table-column prop="subcontractStausName" label="担保合同状态" align="center" :resizable="false" width="120">
          <!-- <template slot-scope="scope">{{ subcontractStausDict[scope.row.subcontractStaus] }}</template> -->
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="subcontractPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="subcontractPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="subcontractPage.total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getCrdContractDetail, getCrdSubcontractPage } from '@/api/rcd/standBook/detail'
// import { dictTranslate } from '@/api/system/dict'
export default {
  data() {
    return {
      // 字典翻译
      // productTypeDict: [],//业务种类
      // userNumDict: [],//经办人
      // orgNumDict: [],//经办机构
      // subcontractTypeDict: [],//担保合同类型
      // isTopDict: [],//是否最高额
      // currencyCdDict: [],//币种
      // subcontractStausDict: [],//担保合同状态
      //合同编号
      contractNum: '',
      // 基本信息中表单数据源
      ruleForm: {},
      // 担保合同信息中表格数据源
      subcontractData: [],
      // 担保合同信息中分页数据源
      subcontractPage: {
        pagenum: 1,
        pagesize: 5,
        total: 0
      }
    }
  },
  created() {
    console.log(JSON.parse(sessionStorage.getItem("contractVal")), '打印传递的值')
    this.contractNum = JSON.parse(sessionStorage.getItem("contractVal")).contractNum

    // ========== 表单、表格填入数据 ==========
    this.getCrdContractDetailCommon();
    this.getCrdSubcontractPageCommon();

    // this.dictTrans()
  },
  methods: {
    // 客户合同信息
    getCrdContractDetailCommon() {
      getCrdContractDetail(this.contractNum).then(res => {
        console.log(res, "客户合同信息");
        this.ruleForm = res.data.data;
      })
    },
    // 担保合同信息
    getCrdSubcontractPageCommon() {
      getCrdSubcontractPage(
        this.subcontractPage.pagenum,
        this.subcontractPage.pagesize,
        // this.contractNum
        "HT002"
      ).then(res => {
        console.log(res, "担保合同信息");
        this.subcontractData = res.data.data.records;
        this.subcontractPage.total = res.data.data.total;
      })
    },
    // 字典翻译
    // dictTrans() {
    //   // 业务种类
    //   dictTranslate("CD000061").then(res => {
    //     this.productTypeDict = res.data.data;
    //     this.ruleForm.productType = this.productTypeDict[this.ruleForm.productType];
    //   });
    //   // 币种
    //   dictTranslate("CD000019").then(res => {
    //     this.currencyCdDict = res.data.data;
    //     this.ruleForm.currencyCd = this.currencyCdDict[this.ruleForm.currencyCd];
    //   });
    //   // 经办人
    //   dictTranslate("user").then(res => {
    //     this.userNumDict = res.data.data;
    //     this.ruleForm.userNum = this.userNumDict[this.ruleForm.userNum];
    //   });
    //   // 经办机构
    //   dictTranslate("org").then(res => {
    //     this.orgNumDict = res.data.data;
    //     this.ruleForm.orgNum = this.orgNumDict[this.ruleForm.orgNum];
    //   });
    //   // 担保合同类型
    //   dictTranslate("CD000102").then(res => {
    //     this.subcontractTypeDict = res.data.data;
    //   });
    //   // 是否最高额
    //   dictTranslate("CD000074").then(res => {
    //     this.isTopDict = res.data.data;
    //   });
    //   // 担保合同状态
    //   dictTranslate("CD000103").then(res => {
    //     this.subcontractStausDict = res.data.data;
    //   });
    // },
    // 监听 担保合同信息 中分页 每页条数 改变的事件
    handleSizeChange1(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.subcontractPage.pagesize = newSize
      console.log(this.subcontractPage.pagesize, "this.subcontractPage.pagesize");
      // 调用方法，重新获取列表数据
      this.getCrdSubcontractPageCommon()
    },
    // 监听 担保合同信息 中分页 页码值 改变的事件
    handleCurrentChange1(newPage) {
      console.log(`当前页: ${newPage}`)
      this.subcontractPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getCrdSubcontractPageCommon()
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



