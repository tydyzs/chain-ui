<template>
  <div>
    <el-row style="float:right">
      <el-button type="primary" @click="toHistoryMsg">历史记录</el-button>
    </el-row>
    <!-- 限额详情表单 -->
    <el-card>
      <span class="msgTitle" style="margin:10px 0">
        <i class="iconfont iconnavicon"></i> 限额详情
      </span>
      <el-form class="tableMsg" :model="ruleForm" ref="ruleForm" label-width="140px">
        <el-form-item label="集中度限额编号" prop="quotaNum">
          <el-input v-model="ruleForm.quotaNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额名称" prop="quotaName">
          <el-input v-model="ruleForm.quotaName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额指标类型" prop="quotaIndexType">
          <el-input v-model="ruleForm.quotaIndexType" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="生效机构" prop="useOrgNum">
          <el-input v-model="ruleForm.useOrgNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额已用金额" prop="quotaUsedAmt">
          <el-input v-model="ruleForm.quotaUsedAmt" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额可用金额" prop="quotaFreeAmt">
          <el-input v-model="ruleForm.quotaFreeAmt" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额已用比例" prop="quotaUsedRatio">
          <el-input v-model="ruleForm.quotaUsedRatio" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额可用比例" prop="quotaFreeRatio">
          <el-input v-model="ruleForm.quotaFreeRatio" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额生效日期" prop="startDate">
          <el-input v-model="ruleForm.startDate" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额失效日期" prop="invalidDate">
          <el-input v-model="ruleForm.invalidDate" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="历史触发次数" prop="hisFrequency">
          <el-input v-model="ruleForm.historyTimes" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额状态" prop="quotaState">
          <el-input v-model="ruleForm.quotaState" size="small" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <div style="height:20px"></div>

    <!-- 表格 -->
    <el-card>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="quotaLevel" label="阈值层级" width="180" align="center">
          <template slot-scope="scope">{{ dicQuotaLevel[scope.row.quotaLevel] }}</template>
        </el-table-column>
        <el-table-column prop="amtOrRatio" label="阈值" width="180" align="center"></el-table-column>
        <el-table-column prop="quotaControlType" label="阈值类型" width="120" align="center">
          <template slot-scope="scope">{{ dicQuotaControlType[scope.row.quotaControlType] }}</template>
        </el-table-column>
        <el-table-column prop="controlNode" label="管控节点" align="center">
          <template slot-scope="scope">{{ dicControlNode[scope.row.controlNode] }}</template>
        </el-table-column>
        <el-table-column prop="nodeMeasure" label="阈值层级在管控节点的应对措施" align="center">
          <template slot-scope="scope">{{ dicNodeMeasure[scope.row.nodeMeasure] }}</template>
        </el-table-column>
      </el-table>
    </el-card>

    <div style="height:20px"></div>

    <el-card>
      <span class="msgTitle" style="margin:10px 0">
        <i class="iconfont iconnavicon"></i> 限额指标信息
      </span>
      <el-form class="tableMsg" :model="ruleForm2" ref="ruleForm2" label-width="140px">
        <el-form-item label="限额指标编号" prop="quotaIndexNum">
          <el-input v-model="ruleForm.quotaIndexNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额指标名称" prop="quotaIndexName">
          <el-input v-model="ruleForm.quotaIndexName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额类型" prop="quotaType">
          <el-input v-model="ruleForm2.quotaType" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额计算方式" prop="computingMethod">
          <el-input v-model="ruleForm2.computingMethod" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="统计口径" prop="quotaIndexCaliber">
          <el-input v-model="ruleForm2.quotaIndexCaliber" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额计算对象" prop="computingTarget">
          <el-input v-model="ruleForm2.quotaComputeObj" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="是否全部维度" prop="quotaIndexRange">
          <el-input v-model="ruleForm2.quotaIndexRange" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="限额指标" prop="quotaIndex" v-if="isView">
          <el-input type="textarea" v-model="ruleForm2.quotaIndex" style="width:840px;" disabled></el-input>
        </el-form-item>
        <el-form-item label="补充说明" prop="explainInfo">
          <el-input type="textarea" v-model="ruleForm2.explainInfo" style="width:840px;" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { dictTranslate } from "@/api/system/dict";
import { getQuotaDetail, getParaDetail } from "@/api/quota/warning";
export default {
  data() {
    return {
      dicQuotaLevel:[],
      dicQuotaControlType:[],
      dicControlNode:[],
      dicNodeMeasure:[],
      //quotaTypeCols: [], //限额类型
      rangeRegion: "", //区域
      rangeCustomer: "", //客户类型
      currency: "", //币种
      rangeCountry: "", //国别
      rangerRiskMitigation: "", //风险缓释
      rangeIndustry: "", //行业
      rangeProduct: "", //产品
      businessType: "", //业务种类
      rangeTerm: "", //期限
      computingMethod: "", //限额计算方式
      quotaIndexCaliber: "", //统计口径
     // quotaComputeObj: "", //限额计算对象
      //控制限额指标是否显示
      isView: true,
      //限额详情表单
      ruleForm: {},
      ruleForm2: {},
      //阈值表
      tableData: []
    };
  },
  methods: {
    toHistoryMsg() {
      const data = this.ruleForm.quotaNum;
      console.log(data, "打印data的数据");
      this.$router.push({ name: "历史记录", params: { val: data } });
    }
  },
  mounted() {
    this.ruleForm = this.$route.params.val;
    dictTranslate("CD000253").then(res => {
      if (res.status != 200) {
        return this.$message.error("获取限额指标类型字典失败，请重试");
      }
      this.quotaIndexTypeCd = res.data.data;
      this.ruleForm.quotaIndexType = this.quotaIndexTypeCd[
        this.ruleForm.quotaIndexType
      ];
    });
    dictTranslate("CD000261").then(res => {
      if (res.status != 200) {
        return this.$message.error("获取限额状态字典失败，请重试");
      }
      this.quotaStateCd = res.data.data;
      this.ruleForm.quotaState = this.quotaStateCd[this.ruleForm.quotaState];
    });
    console.log(this.ruleForm, "打印ruleform的值")

    getQuotaDetail(this.ruleForm.quotaIndexNum).then(res => {
      this.ruleForm2 = res.data.data;
      console.log(this.ruleForm2, "8989");
      this.rangeRegion = res.data.data.rangeRegion;
      this.rangeCustomer = res.data.data.rangeCustomer;
      this.currency = res.data.data.currency;
      this.rangeCountry = res.data.data.rangeCountry;
      this.rangerRiskMitigation = res.data.data.rangerRiskMitigation;
      this.rangeIndustry = res.data.data.rangeIndustry;
      this.rangeProduct = res.data.data.rangeProduct;
      this.businessType = res.data.data.businessType;
      this.rangeTerm = res.data.data.rangeTerm;
      //判断限额指标的额显隐
      if (this.ruleForm2.quotaIndexRange == 1) {
        this.isView = true;
        this.ruleForm2.quotaIndexRange = "否";
        dictTranslate("CD000212").then(res => {
          this.rangeCustomerCd = res.data.data;
          this.rangeCustomer = this.rangeCustomerCd[this.rangeCustomer];
        });
        dictTranslate("CD000257").then(res => {
          this.rangeRegionCd = res.data.data;
          this.rangeRegion = this.rangeRegionCd[this.rangeRegion];
        });
        dictTranslate("CD000019").then(res => {
          this.currencyCd = res.data.data;
          this.currency = this.currencyCd[this.currency];
        });
        dictTranslate("CD000100").then(res => {
          this.rangerRiskMitigationCd = res.data.data;
          this.rangerRiskMitigation = this.rangerRiskMitigationCd[
            this.rangerRiskMitigation
          ];
        });
        dictTranslate("CD000001").then(res => {
          this.rangeCountryCd = res.data.data;
          this.rangeCountry = this.rangeCountryCd[this.rangeCountry];
        });
        dictTranslate("CD000015").then(res => {
          this.rangeIndustryCd = res.data.data;
          this.rangeIndustry = this.rangeIndustryCd[this.rangeIndustry];
        });
        dictTranslate("产品").then(res => {
          this.rangeProductCd = res.data.data;
          this.rangeProduct = this.rangeProductCd[this.rangeProduct];
        });
        dictTranslate("CD000061").then(res => {
          this.businessTypeCd = res.data.data;
          this.businessType = this.businessTypeCd[this.businessType];
        });
        dictTranslate("CD000210").then(res => {
          this.rangeTermCd = res.data.data;
          this.rangeTerm = this.rangeTermCd[this.rangeTerm];
        });
        // this.ruleForm2.quotaIndex = this.
      } else {
        this.isView = false;
        this.ruleForm2.quotaIndexRange = "是";
      }

      dictTranslate("CD000148").then(res => {
        if (res.status != 200) {
          return this.$message.error("获取限额类型字典失败，请重试");
        }
        console.log(res, this.ruleForm2.quotaType);
        this.quotaTypeCd = res.data.data;
        this.ruleForm2.quotaType = this.quotaTypeCd[this.ruleForm.quotaType];
      });

       //限额计算方式字典(CD000255)
    dictTranslate("CD000255").then(res => {
      if (res.status != 200) {
        return this.$message.error("获取限额计算方式字典失败，请重试");
      }
      this.computingMethodCd = res.data.data;
      this.ruleForm2.computingMethod = this.computingMethodCd[this.ruleForm2.computingMethod];
    });

    //统计口径字典(CD000256)
    dictTranslate("CD000256").then(res => {
      if (res.status != 200) {
        return this.$message.error("获取限额统计口径失败，请重试");
      }
      this.quotaIndexCaliberCd = res.data.data;
      this.ruleForm2.quotaIndexCaliber = this.quotaIndexCaliberCd[this.ruleForm2.quotaIndexCaliber];
    });

    //限额计算对象字典(CD000262)
    // dictTranslate("CD000262").then(res => {
    //   if (res.status != 200) {
    //     return this.$message.error("获取限额限额计算对象失败，请重试");
    //   }
    //   this.quotaComputeObjCd = res.data.data;
    //   this.ruleForm2.quotaComputeObj = this.quotaComputeObjCd[this.ruleForm2.quotaComputeObj];
    // });

    });

    getParaDetail(this.ruleForm.quotaNum).then(res => {
      this.tableData = res.data.data;
      dictTranslate("CD000223").then(res => {
        if (res.status != 200) {
          return this.$message.error("获取阈值层级字典失败，请重试");
        }
        this.dicQuotaLevel = res.data.data;
      });
      dictTranslate("CD000258").then(res => {
        if (res.status != 200) {
          return this.$message.error("获取阈值类型字典失败，请重试");
        }
        this.dicQuotaControlType = res.data.data;
      });
      dictTranslate("CD000259").then(res => {
        if (res.status != 200) {
          return this.$message.error("获取管控节点字典失败，请重试");
        }
        this.dicControlNode = res.data.data;
      });
      dictTranslate("CD000260").then(res => {
        if (res.status != 200) {
          return this.$message.error("获取应对措施字典失败，请重试");
        }
        this.dicNodeMeasure = res.data.data;
      });
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
</style>


