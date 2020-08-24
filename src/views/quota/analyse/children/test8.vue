<!-- 行业集中度明细表 组件页面 -->
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
        <el-table
          :data="tableData"
          style="width: 100%"
          max-height="440"
          :span-method="mergeTable"
          :header-cell-style="tableHead"
        >
          <el-table-column prop="target" label="指标" width="180" align="center"></el-table-column>
          <el-table-column prop="business" label="业务类别" width="180" align="center"></el-table-column>
          <el-table-column prop="merge" label="待合并" width="180" align="center"></el-table-column>
          <el-table-column label="实际授信情况" align="center">
            <el-table-column prop="balance" label="业务余额" width="135" align="center"></el-table-column>
            <el-table-column prop="focus" label="行业集中度" width="135" align="center"></el-table-column>
          </el-table-column>
          <el-table-column label="管控指标" align="center">
            <el-table-column prop="observe" label="观察值" width="135" align="center"></el-table-column>
            <el-table-column prop="warning" label="预警值" width="135" align="center"></el-table-column>
            <el-table-column prop="control" label="控制值" width="135" align="center"></el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {queryIndustryQuotaDetailRpt} from "@/api/rcd/limitAnalyse/limitAnalyse";
  export default {
    data() {
      return {
        //对公房地产授信(传入属于对公房地产授信的限额指标编号)
        listCorporation:["CB20191226013525", "CB20191226750353", "CB20191226386204"],
        //个人房地产授信(传入属于个人房地产授信的限额指标编号)
        listIndividual:["CB20191226707411", "CB20191226873823"],
        //产能过剩(传入属于产能过剩的限额指标编号)
        listSurplus:["CB20191226049888","????"],

        //表格数据
        //业务余额列数据（长度11）
        bizBalance:{bizBalance1:"",bizBalance2:"",bizBalance3:"",bizBalance4:"",bizBalance5:"",bizBalance6:"",bizBalance7:"",bizBalance8:"",bizBalance9:"",bizBalance10:"",bizBalance11:""},
        //行业集中度（长度11）
        industryQuota:{industryQuota1:"",industryQuota2:"",industryQuota3:"",industryQuota4:"",industryQuota5:"",industryQuota6:"",industryQuota7:"",industryQuota8:"",industryQuota9:"",industryQuota10:"",industryQuota11:""},
        //观察值，预警值，控制值（余额/占比，长度4）
        quotaLevelA:{quotaLevelA1:{},quotaLevelA2:{},quotaLevelA3:{},quotaLevelA4:{}},
        quotaLevelB:{quotaLevelB1:{},quotaLevelB2:{},quotaLevelB3:{},quotaLevelB4:{}},
        quotaLevelC:{quotaLevelC1:{},quotaLevelC2:{},quotaLevelC3:{},quotaLevelC4:{}},

        ruleForm: {
          pickMonth: "",
          moneyUnit: 'wan'
        },
        pm: "",
        // 表格详情部分 中间标题
        toptitle: "行业集中度明细表",
        // 表格详情部分 左侧日期
        tableDate: {
          year: "",
          month: ""
        },
        // 表格详情部分 右侧单位
        unit: "",
        // 表格数据源
        tableData: [
          {
            target: "房地产行业授信余额",
            business: "对公房地产授信",
            merge: "贷款",
            balance:"",
            focus: "",
            observe: "15.00%",
            warning: "20.00%",
            control: "35.00%"
          },
          {
            target: "房地产行业授信余额",
            business: "对公房地产授信",
            merge: "结构化融资",
            balance: "",
            focus: "",
            observe: "15.00%",
            warning: "20.00%",
            control: "35.00%"
          },
          {
            target: "房地产行业授信余额",
            business: "对公房地产授信",
            merge: "债券",
            balance: "",
            focus: "",
            observe: "15.00%",
            warning: "20.00%",
            control: "35.00%"
          },
          {
            target: "房地产行业授信余额",
            business: "小计",
            merge: "小计",
            balance: "",
            focus: "",
            observe: "15.00%",
            warning: "20.00%",
            control: "35.00%"
          },
          {
            target: "房地产行业授信余额",
            business: "个人住房代练",
            merge: "个人住房按揭",
            balance: "",
            focus: "",
            observe: "15.00%",
            warning: "20.00%",
            control: "35.00%"
          },
          {
            target: "房地产行业授信余额",
            business: "个人住房贷款",
            merge: "个人商用房按揭",
            balance: "",
            focus: "",
            observe: "15.00%",
            warning: "20.00%",
            control: "35.00%"
          },
          {
            target: "房地产行业授信余额",
            business: "小计",
            merge: "小计",
            balance: "",
            focus: "",
            observe: "15.00%",
            warning: "20.00%",
            control: "35.00%"
          },
          {
            target: "房地产行业授信余额",
            business: "房地产行业合计",
            merge: "房地产行业合计",
            balance: "",
            focus: "",
            observe: "15.00%",
            warning: "20.00%",
            control: "35.00%"
          },
          {
            target: "产能过剩行业授信余额",
            business: "产能过剩行业贷款",
            merge: "结构化融资",
            balance: "",
            focus: "",
            observe: "15.00%",
            warning: "20.00%",
            control: "35.00%"
          },
          {
            target: "产能过剩行业授信余额",
            business: "产能过剩航工业非标",
            merge: "结构化融资",
            balance: "",
            focus: "",
            observe: "15.00%",
            warning: "20.00%",
            control: "35.00%"
          },
          {
            target: "产能过剩行业授信余额",
            business: "产能过剩行业合计",
            merge: "结构化融资",
            balance: "",
            focus: "",
            observe: "15.00%",
            warning: "20.00%",
            control: "35.00%"
          }
        ]
      };
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
          this.tableDate.year=year;
          this.tableDate.month=month;
        }
        if(this.ruleForm.moneyUnit=="wan"){
          this.unit="万元";
        }else{
          this.unit="亿元";
        }
        queryIndustryQuotaDetailRpt(this.selectionOrgId,year,month,this.ruleForm.moneyUnit).then(res => {
          const datas = res.data.data.records;
          if(datas.length==0){this.empty();return;}
          const unit=datas[0].unitFlag;
          this.unit=unit;
          for(var i in datas){
            var obj=datas[i];
            //数据编码，业务余额，行业集中度
            var quotaNum=obj.quotaNum,bizBalance=obj.bizBalance,industryQuota=obj.industryQuota;
            var quotaLevelA='',quotaLevelB='',quotaLevelC='';
            if(unit=="万元"||unit=="亿元"){
              quotaLevelA=obj.quotaLevelAAmt;quotaLevelB=obj.quotaLevelBAmt;quotaLevelC=obj.quotaLevelCAmt;
            }else{
              quotaLevelA=obj.quotaLevelARation;quotaLevelB=obj.quotaLevelBRation;quotaLevelC=obj.quotaLevelCRation;
            }
            switch(quotaNum) {
              case this.listCorporation[0]:
                this.bizBalance.bizBalance1=bizBalance;
                this.bizBalance.bizBalance4=this.sumFun(this.bizBalance.bizBalance4,bizBalance);
                this.bizBalance.bizBalance8=this.sumFun(this.bizBalance.bizBalance8,bizBalance);

                this.industryQuota.industryQuota1=industryQuota;
                this.industryQuota.industryQuota4=this.sumFun(this.industryQuota.industryQuota4,industryQuota);
                this.industryQuota.industryQuota8=this.sumFun(this.industryQuota.industryQuota8,industryQuota);

                this.quotaLevelA.quotaLevelA1=this.sumFun(this.quotaLevelA.quotaLevelA1,quotaLevelA);
                this.quotaLevelB.quotaLevelB1=this.sumFun(this.quotaLevelB.quotaLevelB1,quotaLevelB);
                this.quotaLevelC.quotaLevelC1=this.sumFun(this.quotaLevelC.quotaLevelC1,quotaLevelC);
                this.quotaLevelA.quotaLevelA3=this.sumFun(this.quotaLevelA.quotaLevelA3,quotaLevelA);
                this.quotaLevelB.quotaLevelB3=this.sumFun(this.quotaLevelB.quotaLevelB3,quotaLevelB);
                this.quotaLevelC.quotaLevelC3=this.sumFun(this.quotaLevelC.quotaLevelC3,quotaLevelC);

                break;
              case this.listCorporation[1]:
                this.bizBalance.bizBalance2=bizBalance;
                this.bizBalance.bizBalance4=this.sumFun(this.bizBalance.bizBalance4,bizBalance);
                this.bizBalance.bizBalance8=this.sumFun(this.bizBalance.bizBalance8,bizBalance);

                this.industryQuota.industryQuota2=industryQuota;
                this.industryQuota.industryQuota4=this.sumFun(this.industryQuota.industryQuota4,industryQuota);
                this.industryQuota.industryQuota8=this.sumFun(this.industryQuota.industryQuota8,industryQuota);

                this.quotaLevelA.quotaLevelA1=this.sumFun(this.quotaLevelA.quotaLevelA1,quotaLevelA);
                this.quotaLevelB.quotaLevelB1=this.sumFun(this.quotaLevelB.quotaLevelB1,quotaLevelB);
                this.quotaLevelC.quotaLevelC1=this.sumFun(this.quotaLevelC.quotaLevelC1,quotaLevelC);
                this.quotaLevelA.quotaLevelA3=this.sumFun(this.quotaLevelA.quotaLevelA3,quotaLevelA);
                this.quotaLevelB.quotaLevelB3=this.sumFun(this.quotaLevelB.quotaLevelB3,quotaLevelB);
                this.quotaLevelC.quotaLevelC3=this.sumFun(this.quotaLevelC.quotaLevelC3,quotaLevelC);

                break;
              case this.listCorporation[2]:
                this.bizBalance.bizBalance3=bizBalance;
                this.bizBalance.bizBalance4=this.sumFun(this.bizBalance.bizBalance4,bizBalance);
                this.bizBalance.bizBalance8=this.sumFun(this.bizBalance.bizBalance8,bizBalance);

                this.industryQuota.industryQuota3=industryQuota;
                this.industryQuota.industryQuota4=this.sumFun(this.industryQuota.industryQuota4,industryQuota);
                this.industryQuota.industryQuota8=this.sumFun(this.industryQuota.industryQuota8,industryQuota);

                this.quotaLevelA.quotaLevelA1=this.sumFun(this.quotaLevelA.quotaLevelA1,quotaLevelA);
                this.quotaLevelB.quotaLevelB1=this.sumFun(this.quotaLevelB.quotaLevelB1,quotaLevelB);
                this.quotaLevelC.quotaLevelC1=this.sumFun(this.quotaLevelC.quotaLevelC1,quotaLevelC);
                this.quotaLevelA.quotaLevelA3=this.sumFun(this.quotaLevelA.quotaLevelA3,quotaLevelA);
                this.quotaLevelB.quotaLevelB3=this.sumFun(this.quotaLevelB.quotaLevelB3,quotaLevelB);
                this.quotaLevelC.quotaLevelC3=this.sumFun(this.quotaLevelC.quotaLevelC3,quotaLevelC);

                break;
              case this.listIndividual[0]:
                this.bizBalance.bizBalance5=bizBalance;
                this.bizBalance.bizBalance7=this.sumFun(this.bizBalance.bizBalance7,bizBalance);
                this.bizBalance.bizBalance8=this.sumFun(this.bizBalance.bizBalance8,bizBalance);

                this.industryQuota.industryQuota5=industryQuota;
                this.industryQuota.industryQuota7=this.sumFun(this.industryQuota.industryQuota7,industryQuota);
                this.industryQuota.industryQuota8=this.sumFun(this.industryQuota.industryQuota8,industryQuota);

                this.quotaLevelA.quotaLevelA2=this.sumFun(this.quotaLevelA.quotaLevelA2,quotaLevelA);
                this.quotaLevelB.quotaLevelB2=this.sumFun(this.quotaLevelB.quotaLevelB2,quotaLevelB);
                this.quotaLevelC.quotaLevelC2=this.sumFun(this.quotaLevelC.quotaLevelC2,quotaLevelC);
                this.quotaLevelA.quotaLevelA3=this.sumFun(this.quotaLevelA.quotaLevelA3,quotaLevelA);
                this.quotaLevelB.quotaLevelB3=this.sumFun(this.quotaLevelB.quotaLevelB3,quotaLevelB);
                this.quotaLevelC.quotaLevelC3=this.sumFun(this.quotaLevelC.quotaLevelC3,quotaLevelC);

                break;
              case this.listIndividual[1]:
                this.bizBalance.bizBalance6=bizBalance;
                this.bizBalance.bizBalance7=this.sumFun(this.bizBalance.bizBalance7,bizBalance);
                this.bizBalance.bizBalance8=this.sumFun(this.bizBalance.bizBalance8,bizBalance);

                this.industryQuota.industryQuota6=industryQuota;
                this.industryQuota.industryQuota7=this.sumFun(this.industryQuota.industryQuota7,industryQuota);
                this.industryQuota.industryQuota8=this.sumFun(this.industryQuota.industryQuota8,industryQuota);

                this.quotaLevelA.quotaLevelA2=this.sumFun(this.quotaLevelA.quotaLevelA2,quotaLevelA);
                this.quotaLevelB.quotaLevelB2=this.sumFun(this.quotaLevelB.quotaLevelB2,quotaLevelB);
                this.quotaLevelC.quotaLevelC2=this.sumFun(this.quotaLevelC.quotaLevelC2,quotaLevelC);
                this.quotaLevelA.quotaLevelA3=this.sumFun(this.quotaLevelA.quotaLevelA3,quotaLevelA);
                this.quotaLevelB.quotaLevelB3=this.sumFun(this.quotaLevelB.quotaLevelB3,quotaLevelB);
                this.quotaLevelC.quotaLevelC3=this.sumFun(this.quotaLevelC.quotaLevelC3,quotaLevelC);

                break;
              case this.listSurplus[0]:
                this.bizBalance.bizBalance9=bizBalance;
                this.bizBalance.bizBalance11=this.sumFun( this.bizBalance.bizBalance11,bizBalance);

                this.industryQuota.industryQuota9=industryQuota;
                this.industryQuota.industryQuota11=this.sumFun( this.industryQuota.industryQuota11,industryQuota);

                this.quotaLevelA.quotaLevelA4=this.sumFun(this.quotaLevelA.quotaLevelA4,quotaLevelA);
                this.quotaLevelB.quotaLevelB4=this.sumFun(this.quotaLevelB.quotaLevelB4,quotaLevelB);
                this.quotaLevelC.quotaLevelC4=this.sumFun(this.quotaLevelC.quotaLevelC4,quotaLevelC);

                break;
              case this.listSurplus[1]:
                this.bizBalance.bizBalance10=bizBalance;
                this.bizBalance.bizBalance11=this.sumFun( this.bizBalance.bizBalance11,bizBalance);

                this.industryQuota.industryQuota10=industryQuota;
                this.industryQuota.industryQuota11=this.sumFun( this.industryQuota.industryQuota11,industryQuota);

                this.quotaLevelA.quotaLevelA4=this.sumFun(this.quotaLevelA.quotaLevelA4,quotaLevelA);
                this.quotaLevelB.quotaLevelB4=this.sumFun(this.quotaLevelB.quotaLevelB4,quotaLevelB);
                this.quotaLevelC.quotaLevelC4=this.sumFun(this.quotaLevelC.quotaLevelC4,quotaLevelC);

                break;
            }
          }
          var objs=this;
          this.setTableData();
        });
      },
      //没查到数据：清空数据
      empty(){
        //表格数据
        //业务余额列数据（长度11）
        this.bizBalance={bizBalance1:"",bizBalance2:"",bizBalance3:"",bizBalance4:"",bizBalance5:"",bizBalance6:"",bizBalance7:"",bizBalance8:"",bizBalance9:"",bizBalance10:"",bizBalance11:""},
        //行业集中度（长度11）
        this.industryQuota={industryQuota1:"",industryQuota2:"",industryQuota3:"",industryQuota4:"",industryQuota5:"",industryQuota6:"",industryQuota7:"",industryQuota8:"",industryQuota9:"",industryQuota10:"",industryQuota11:""},
        //观察值，预警值，控制值（余额/占比，长度4）
        this.quotaLevelA={quotaLevelA1:{},quotaLevelA2:{},quotaLevelA3:{},quotaLevelA4:{}},
        this.quotaLevelB={quotaLevelB1:{},quotaLevelB2:{},quotaLevelB3:{},quotaLevelB4:{}},
        this.quotaLevelC={quotaLevelC1:{},quotaLevelC2:{},quotaLevelC3:{},quotaLevelC4:{}},
        this.setTableData();
      },
      //数字相加计算方法
      sumFun(arg1, arg2) {
        if (isNaN(arg1)) {
          arg1 = 0;
        }
        if (isNaN(arg2)) {
          arg2 = 0;
        }
        arg1 = Number(arg1);
        arg2 = Number(arg2);
        var r1, r2, m, c;
        try {
          r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
          r1 = 0;
        }
        try {
          r2 = arg2.toString().split(".")[1].length;
        }
        catch (e) {
          r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
          var cm = Math.pow(10, c);
          if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
          } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
          }
        } else {
          arg1 = Number(arg1.toString().replace(".", ""));
          arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
      },
      //数据设置
      setTableData(){
        var datas=this.tableData;
        for(var i in datas){
          var data=datas[i];
          var i_num=parseInt(i)+1;
          data.balance=this.bizBalance["bizBalance"+i_num];
          data.focus=this.industryQuota["industryQuota"+i_num];
          var i_num1=1;
          if(i_num>4&&i_num<8){i_num1=2;}else if(i_num==8){i_num1=3;}else if(i_num>8){i_num1=4;}
          data.observe=this.quotaLevelA["quotaLevelA"+i_num1];
          data.warning=this.quotaLevelB["quotaLevelB"+i_num1];
          data.control=this.quotaLevelC["quotaLevelC"+i_num1];
        }
      },
      // 合并表格
      mergeTable({ rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          if (rowIndex % 8 === 0) {
            return [8, 1];
          } else {
            return [0, 0];
          }
        }
        if (
          rowIndex === 3 ||
          rowIndex === 6 ||
          rowIndex === 7 ||
          rowIndex === 8 ||
          rowIndex === 9 ||
          rowIndex === 10
        ) {
          if (columnIndex === 1) {
            return [1, 2];
          } else if (columnIndex === 2) {
            return [0, 0];
          }
        }
        if (columnIndex === 5 || columnIndex === 6 || columnIndex === 7) {
          if (rowIndex === 0) {
            return [4, 1];
          } else if (rowIndex === 1 || rowIndex === 2 || rowIndex === 3) {
            return [0, 0];
          }
        }
        if (columnIndex === 5 || columnIndex === 6 || columnIndex === 7) {
          if (rowIndex === 4) {
            return [3, 1];
          } else if (rowIndex === 5 || rowIndex === 6) {
            return [0, 0];
          }
        }
        if (columnIndex === 5 || columnIndex === 6 || columnIndex === 7) {
          if (rowIndex === 8) {
            return [3, 1];
          } else if (rowIndex === 9 || rowIndex === 10) {
            return [0, 0];
          }
        }
        if (columnIndex === 1) {
          if (rowIndex === 0) {
            return [3, 1];
          } else if (rowIndex === 1 || rowIndex === 2) {
            return [0, 0];
          }
        }
        if (columnIndex === 1) {
          if (rowIndex === 4) {
            return [2, 1];
          } else if (rowIndex === 5) {
            return [0, 0];
          }
        }
      },
      tableHead({ rowIndex, columnIndex }) {
        // console.log(columnIndex, "rowIndex");
        // if (rowIndex === 1) {
        //   if (columnIndex === 0 || columnIndex === 1) {
        //     // return { display: 'none' };
        //   }
        // }
        // if(columnIndex === 0){
        //   return 'background-color:red';
        // }
        if (rowIndex === 0) {
          if (columnIndex === 2 ) {
            // return { display: 'none' };
            // return 'display：none';
          }
        }
      }
    }
  };
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
