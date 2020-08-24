<template>
  <div>
    <el-row style="float:right">
      <!-- <el-button type="primary">返&emsp;&emsp;回</el-button> -->
      <el-button type="primary" @click="toWarningMsgPlus">限额详情</el-button>
    </el-row>
    <!-- 业务信息表单 -->
    <el-card>
      <span class="msgTitle" style="margin:10px 0">
        <i class="iconfont iconnavicon"></i> 预警详情
      </span>
      <el-form class="tableMsg" :model="ruleForm" ref="ruleForm" label-width="140px">
        <el-form-item label="集中度限额编号" prop="quotaNum">
          <el-input v-model="ruleForm.quotaNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额名称" prop="quotaName">
          <el-input v-model="ruleForm.quotaName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额指标编号" prop="quotaIndexNum">
          <el-input v-model="ruleForm.quotaIndexNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额指标名称" prop="quotaIndexName">
          <el-input v-model="ruleForm.quotaIndexName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="触发时间" prop="triggerTime">
          <el-input v-model="ruleForm.triggerTime" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="预警级别" prop="triggerLevel">
          <el-input v-model="ruleForm.triggerLevel" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="触发当前值(余额)" prop="triggerAmt">
          <el-input v-model="ruleForm.triggerAmt" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="触发当前值(占比)" prop="triggerRatio">
          <el-input v-model="ruleForm.triggerRatio" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="预警阀值(余额)" prop="quotaControlAmt">
          <el-input v-model="ruleForm.quotaControlAmt" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="预警阀值(比例)" prop="warningCurrent">
          <el-input v-model="ruleForm.warningCurrent" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="触发管控节点" prop="triggerControlNode">
          <el-input v-model="ruleForm.triggerControlNode" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="应对措施" prop="nodeMeasure">
          <el-input v-model="ruleForm.nodeMeasure" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="触发时限额已用金额" prop="quotaUsedAmt">
          <el-input v-model="ruleForm.quotaUsedAmt" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="触发时限额可用金额" prop="quotaFreeAmt">
          <el-input v-model="ruleForm.quotaFreeAmt" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="触发时限额已用比例" prop="quotaUsedRatio">
          <el-input v-model="ruleForm.quotaUsedRatio" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="触发时限额可用比例" prop="quotaFreeRatio">
          <el-input v-model="ruleForm.quotaFreeRatio" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额生效机构" prop="useOrgNum">
          <el-input v-model="ruleForm.useOrgNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="历史触发次数" prop="historyTimes">
          <el-input v-model="ruleForm.hisFrequency" size="small" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <div style="height:20px"></div>

    <!-- 业务信息 -->
    <el-row style="float:right">
      <!-- <el-button type="primary">返&emsp;&emsp;回</el-button> -->
      <el-button type="primary" @click="businessDetails">业务详情</el-button>
    </el-row>
    <el-card>
      <span class="msgTitle" style="margin:10px 0">
        <i class="iconfont iconnavicon"></i> 业务信息
      </span>
      <el-form class="tableMsg" :model="ruleForm" ref="ruleForm2" label-width="140px">
        <el-form-item label="关联业务流水号" prop="tranSeqSn">
          <el-input v-model="ruleForm.tranSeqSn" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="关联业务编号" prop="bizNum">
          <el-input v-model="ruleForm.bizNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="业务类型" prop="bizType">
          <el-input v-model="ruleForm.bizType" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="业务品种" prop="productNum">
          <el-input v-model="ruleForm.productNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="发生金额" prop="amt">
          <el-input v-model="ruleForm.amt" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="币种" prop="currencyCd">
          <el-input v-model="ruleForm.currencyCd" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="业务客户经理" prop="userNum">
          <el-input v-model="ruleForm.userNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="业务网点机构" prop="orgNum">
          <el-input v-model="ruleForm.orgNum" size="small" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-drawer title="查看" :visible.sync="dialog1" direction="rtl" custom-class="demo-drawer" ref="drawer" size="70%" :append-to-body="true">
      <div class="demo-drawer__content">
        <el-form :model="drawerData" label-width="140px">
          <el-form-item label="批复编号">
            <el-input v-model="drawerData.approveNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="客户编号">
            <el-input v-model="drawerData.customerNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="drawerData.customerName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="业务类型">
            <el-input v-model="drawerData.bizType" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="是否低风险">
            <el-input v-model="drawerData.isLowRisk" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="低风险类型">
            <el-input v-model="drawerData.lowRiskType" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="币种">
            <el-input v-model="drawerData.currencyCd" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="批复金额">
            <el-input v-model="drawerData.totalAmt" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="批复已用">
            <el-input v-model="drawerData.approveUsed" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="批复可用">
            <el-input v-model="drawerData.approveAvi" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="批复状态">
            <el-input v-model="drawerData.approveStatus" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="经办人">
            <el-input v-model="drawerData.userNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="经办机构">
            <el-input v-model="drawerData.orgNum" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <el-drawer title="查看" :visible.sync="dialog2" direction="rtl" custom-class="demo-drawer" ref="drawer" size="70%" :append-to-body="true">
      <div class="demo-drawer__content">
        <el-form :model="drawerData" label-width="140px">
          <el-form-item label="合同编号">
            <el-input v-model="drawerData.contractNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="drawerData.customerName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="客户编号">
            <el-input v-model="drawerData.customerNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="业务品种">
            <el-input v-model="drawerData.productNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="币种">
            <el-input v-model="drawerData.currencyCd" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="合同金额">
            <el-input v-model="drawerData.contractAmt" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="合同余额">
            <el-input v-model="drawerData.contractBal" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="合同可用">
            <el-input v-model="drawerData.contractAvi" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="合同起期">
            <el-input v-model="drawerData.beginDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="合同止期">
            <el-input v-model="drawerData.endDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="经办人">
            <el-input v-model="drawerData.userNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="经办机构">
            <el-input v-model="drawerData.orgNum" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <el-drawer
      title="查看"
      :visible.sync="dialog3"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      size="70%"
      :append-to-body="true"
    >
      <div class="demo-drawer__content">
        <el-form :model="drawerData" label-width="140px">
          <el-form-item label="借据编号">
            <el-input v-model="drawerData.summaryNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="合同编号">
            <el-input v-model="drawerData.contractNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="drawerData.customerName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="客户编号">
            <el-input v-model="drawerData.customerNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="业务品种">
            <el-input v-model="drawerData.productNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="币种">
            <el-input v-model="drawerData.currencyCd" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="借据金额">
            <el-input v-model="drawerData.summaryAmt" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="借据余额">
            <el-input v-model="drawerData.summaryBal" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="担保方式">
            <el-input v-model="drawerData.guaranteeType" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="借据起期">
            <el-input v-model="drawerData.beginDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="借据止期">
            <el-input v-model="drawerData.endDate" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="经办人">
            <el-input v-model="drawerData.userNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="经办机构">
            <el-input v-model="drawerData.orgNum" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <el-drawer
      title="查看"
      :visible.sync="dialog4"
      direction="rtl"
      custom-class="demo-drawer"
      ref="drawer"
      size="70%"
      :append-to-body="true"
    >
      <div class="demo-drawer__content">
        <el-form :model="drawerData" label-width="140px">
          <el-form-item label="业务编号">
            <el-input v-model="drawerData.userNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="客户编号">
            <el-input v-model="drawerData.userName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="drawerData.customerManager" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="额度产品">
            <el-input v-model="drawerData.organizer" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="业务品种">
            <el-input v-model="drawerData.currency" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="交易日期">
            <el-input v-model="drawerData.creditLine" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="币种">
            <el-input v-model="drawerData.usedCreditLine" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="金额">
            <el-input v-model="drawerData.remainCreditLine" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="计息期限">
            <el-input v-model="drawerData.creditExposure" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="开始日期">
            <el-input v-model="drawerData.usedExposure" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="到期日期">
            <el-input v-model="drawerData.remainExposure" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="计息利率">
            <el-input v-model="drawerData.remainExposure" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-input v-model="drawerData.remainExposure" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="经办人">
            <el-input v-model="drawerData.remainExposure" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="经办机构">
            <el-input v-model="drawerData.remainExposure" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { dictTranslate } from "@/api/system/dict";
import {
  getWarnInfoDetail,
  getWarnHisInfoDetail,
  getApproveDetail,
  getContractDetail,
  getSummaryDetail
} from "@/api/quota/warning";
export default {
  data() {
    return {
      dialog1: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dicTriggerLevel: {},
      dicTriggerControlNode: {},
      dicNodeMeasure: {},
      ruleForm: {},
      drawerData: {}
    };
  },
  methods: {
    businessDetails() {
      console.log(this.ruleForm.bizType, "this.ruleForm.bizType");
      if (this.ruleForm.bizType == "额度申请") {
        console.log(99);
        getApproveDetail(this.ruleForm.bizNum).then(res => {
          console.log(res, "批复");
          const data = res.data.data;
          this.drawerData = data;
          this.translateSomes();
          dictTranslate("CD000170").then(res => {
            if (res.status != 200) {
              return this.$message.error("获取业务类型失败，请重试");
            }
            this.bizTypeCd = res.data.data;
            this.drawerData.bizType = this.bizTypeCd[this.drawerData.bizType];
          });
          dictTranslate("CD000167").then(res => {
            if (res.status != 200) {
              return this.$message.error("获取是否低风险失败，请重试");
            }
            this.isLowRiskCd = res.data.data;
            this.drawerData.isLowRisk = this.isLowRiskCd[
              this.drawerData.isLowRisk
            ];
          });
          dictTranslate("CD000109").then(res => {
            if (res.status != 200) {
              return this.$message.error("获取批复状态字典失败，请重试");
            }
            this.approveStatusCd = res.data.data;
            this.drawerData.approveStatus = this.approveStatusCd[
              this.drawerData.approveStatus
            ];
          });
        });
        this.dialog1 = true;
      } else if (this.ruleForm.bizType == "合同申请") {
        getContractDetail(this.ruleForm.bizNum).then(res => {
          console.log(res, "合同");
          const data = res.data.data;
          this.drawerData = data;
          this.translateSomes();
        });
        this.dialog2 = true;
      } else if (this.ruleForm.bizType == "放款申请") {
        getSummaryDetail(this.ruleForm.bizNum).then(res => {
          console.log(res, "借据");
          const data = res.data.data;
          this.drawerData = data;
          this.translateSomes();
          dictTranslate("CD000101").then(res => {
            if (res.status != 200) {
              return this.$message.error("获取担保方式失败，请重试");
            }
            this.guaranteeTypeCd = res.data.data;
            this.drawerData.guaranteeType = this.guaranteeTypeCd[
              this.drawerData.guaranteeType
            ];
          });
        });
        this.dialog3 = true;
      } else if (this.ruleForm.bizType == "同业业务申请") {
        this.dialog4 = true;
      }
    },

    //翻译币种、经办人、经办机构
    translateSomes() {
      dictTranslate("CD000019").then(res => {
        if (res.status != 200) {
          return this.$message.error("获取币种字典失败，请重试");
        }
        this.currencyCdCd = res.data.data;
        this.drawerData.currencyCd = this.currencyCdCd[
          this.drawerData.currencyCd
        ];
      });
      dictTranslate("user").then(res => {
        if (res.status != 200) {
          return this.$message.error("获取经办人字典失败，请重试");
        }
        this.userNumCd = res.data.data;
        this.drawerData.userNum = this.userNumCd[this.drawerData.userNum];
      });
      dictTranslate("org").then(res => {
        if (res.status != 200) {
          return this.$message.error("获取经办机构字典失败，请重试");
        }
        this.orgNumCd = res.data.data;
        this.drawerData.orgNum = this.orgNumCd[this.drawerData.orgNum];
      });
    },

    toWarningMsgPlus() {
      const data = this.ruleForm;
      console.log(data, "打印data的数据");
      this.$router.push({ name: "限额详情", params: { val: data } });
    },

    getWarnInfoData(warnInfo){
      console.log(warnInfo,"warnInfo------")
      if(warnInfo.isHis==1){
        getWarnInfoDetail(warnInfo.useOrgNum,warnInfo.warnNum).then(res => {
          console.log(res.data.data,"getWarnInfoData")
          this.ruleForm = res.data.data
        })
      }else if(warnInfo.isHis==2){
        getWarnHisInfoDetail(warnInfo.useOrgNum,warnInfo.warnNum).then(res => {
          console.log(res.data.data,"getWarnInfoData")
          this.ruleForm = res.data.data
        })
      }
    },
  },
  created() {
    //尚未实现，缺少接口
    // const data = this.$route.params.val;
    // //获取唯一标识符
    // const 唯一 = data.唯一;
    // getList(唯一).then(res => {
    //   console.log(res);
    //   this.ruleForm = res.data.data;
    // });
    //this.ruleForm = this.$route.params.val;
    this.getWarnInfoData(this.$route.params.val);
    console.log(this.ruleForm, "打印ruleform的值");
    dictTranslate("CD000223").then(res => {
      if (res.status != 200) {
        return this.$message.error("获取预警级别字典失败，请重试");
      }
      this.dicTriggerLevel = res.data.data;
      console.log(this.dicTriggerLevel);
      console.log(this.ruleForm.triggerLevel);
      this.ruleForm.triggerLevel = this.dicTriggerLevel[
        this.ruleForm.triggerLevel
      ];
      console.log(this.ruleForm.triggerLevel);
    });
    dictTranslate("CD000259").then(res => {
      if (res.status != 200) {
        return this.$message.error("获取触发管控节点字典失败，请重试");
      }
      this.dicTriggerControlNode = res.data.data;
      this.ruleForm.triggerControlNode = this.dicTriggerControlNode[
        this.ruleForm.triggerControlNode
      ];
    });
    dictTranslate("CD000260").then(res => {
      if (res.status != 200) {
        return this.$message.error("获取应对措施字典失败，请重试");
      }
      this.dicNodeMeasure = res.data.data;
      this.ruleForm.nodeMeasure = this.dicNodeMeasure[
        this.ruleForm.nodeMeasure
      ];
    });
    dictTranslate("org").then(res => {
      if (res.status != 200) {
        return this.$message.error("获取机构字典失败，请重试");
      }
      this.dicUseOrgNum = res.data.data;
      this.ruleForm.useOrgNum = this.dicUseOrgNum[this.ruleForm.useOrgNum];
      this.ruleForm.orgNum = this.dicUseOrgNum[this.ruleForm.orgNum];
    });
    dictTranslate("CD000019").then(res => {
      if (res.status != 200) {
        return this.$message.error("获取应对币种字典失败，请重试");
      }
      this.dicCurrencyCd = res.data.data;
      this.ruleForm.currencyCd = this.dicCurrencyCd[this.ruleForm.currencyCd];
    });
    dictTranslate("user").then(res => {
      if (res.status != 200) {
        return this.$message.error("获取客户经理字典失败，请重试");
      }
      this.dicManager = res.data.data;
      this.ruleForm.userNum = this.dicManager[this.ruleForm.userNum];
    });
    dictTranslate("CD000266").then(res => {
      if (res.status != 200) {
        return this.$message.error("获取业务类型字典失败，请重试");
      }
      this.dicBizType = res.data.data;
      this.ruleForm.bizType = this.dicBizType[this.ruleForm.bizType];
    });
  }
};
</script>

<style lang="scss" scoped>
/deep/ .msgTitle {
  display: block;
  margin-bottom: 10px;
  font-size: 16px;
  padding-left: 5px;
  i {
    font-size: 24px;
    vertical-align: middle;
  }
  .el-button {
    margin-left: 10px;
  }
}

/deep/ .tableMsg {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  /deep/ .el-form-item {
    /deep/ .el-form-item__content {
      /deep/ .el-input {
        /deep/ .el-input__inner {
          width: 350px;
          color: #333;
        }
      }
    }
  }
}

// 抽屉的样式
/deep/ .el-drawer__body {
  /deep/ .demo-drawer__content {
    /deep/ .el-form {
      display: flex;
      justify-content: around-start;
      flex-wrap: wrap;
      /deep/ .el-form-item {
        /deep/ .el-input {
          width: 300px;
        }
      }
    }
  }
}
</style>


