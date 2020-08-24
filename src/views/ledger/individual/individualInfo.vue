<!-- 额度台账---个人客户详情信息 -->
<template>
  <div class="corporateInfoCon">
    <!-- 基本信息 -->
    <el-card class="basicInfo">
      <el-form ref="form" :model="basicInfoForm" label-width="180px" size="small">
        <el-form-item label="客户名称233" prop="custName">
          <el-input v-model="basicInfoForm.custName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="ECIF客户编号" prop="customerNum">
          <el-input v-model="basicInfoForm.customerNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="certType">
          <el-input v-model="basicInfoForm.certTypeName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="证件号码" prop="certNum">
          <el-input v-model="basicInfoForm.certNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input v-model="basicInfoForm.genderName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="国籍" prop="nation">
          <el-input v-model="basicInfoForm.nationName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="民族" prop="race">
          <el-input v-model="basicInfoForm.raceName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="最高学位" prop="highAcadeDegree">
          <el-input v-model="basicInfoForm.highAcadeDegreeName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="最高学历" prop="education">
          <el-input v-model="basicInfoForm.educationName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="是否农户" prop="agriRelatedInd">
          <el-input v-model="basicInfoForm.agriRelatedIndName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="职业" prop="occupation3">
          <el-input v-model="basicInfoForm.occupation3Name" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="婚姻状况" prop="marrStatus">
          <el-input v-model="basicInfoForm.marrStatusName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="健康状况" prop="healthyStatus">
          <el-input v-model="basicInfoForm.healthyStatusName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="评级结果" prop="custGrade">
          <el-input v-model="basicInfoForm.custGradeName" size="small" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 地址信息 -->
    <el-card>
      <span>地址信息</span>
      <!-- 表格详情 -->
      <el-table :data="addressTableData" style="width: 100%" size="small" border stripe>
        <el-table-column type="index" label="#" width="50" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="connTypeName" label="地址类型" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ connTypeDict[scope.row.connType] }}</template> -->
        </el-table-column>
        <el-table-column prop="counRegiName" label="国家和地区" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ counRegiDict[scope.row.counRegi] }}</template> -->
        </el-table-column>
        <el-table-column prop="provinceName" label="省" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ provinceDict[scope.row.province] }}</template> -->
        </el-table-column>
        <el-table-column prop="cityName" label="市" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ cityDict[scope.row.city] }}</template> -->
        </el-table-column>
        <el-table-column prop="countyName" label="县" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ countyDict[scope.row.county] }}</template> -->
        </el-table-column>
        <el-table-column prop="street" label="街道" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="detailAddr" label="详细地址" align="center" :resizable="false" width="200"></el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="addressPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="addressPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="addressPage.total"></el-pagination>
    </el-card>

    <!-- 关联客户信息 -->
    <el-card>
      <span>关联客户信息</span>
      <!-- 表格详情 -->
      <el-table :data="customerTableData" style="width: 100%" size="small" border stripe>
        <el-table-column type="index" label="#" width="50" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="relCustomerTypeName" label="关联关系类型" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ relCustomerTypeDict[scope.row.relCustomerType] }}</template> -->
        </el-table-column>
        <el-table-column prop="custName" label="关联客户名称" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="certTypeName" label="关联客户证件类型" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ certTypeDict[scope.row.certType] }}</template> -->
        </el-table-column>
        <el-table-column prop="certNum" label="关联客户证件号码" align="center" :resizable="false"></el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="customerPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="customerPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="customerPage.total"></el-pagination>
    </el-card>

    <!-- 我行管理团队 -->
    <el-card>
      <span>我行管理团队</span>
      <!-- 表格详情 -->
      <el-table :data="teamTableData" style="width: 100%" size="small" border stripe>
        <el-table-column type="index" label="#" width="50" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="realName" label="客户经理" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="userNum" label="客户经理工号" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="deptName" label="经办机构" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="orgNum" label="经办机构号" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="aeraCodeName" label="机构所在地区" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ aeraCodeDict[scope.row.aeraCode] }}</template> -->
        </el-table-column>
        <el-table-column prop="userPlacingCdName" label="权限类型" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ userPlacingCdDict[scope.row.userPlacingCd] }}</template> -->
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange3" @current-change="handleCurrentChange3" :current-page="teamPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="teamPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="teamPage.total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getCsmIndividualPageByCustNum,
  getAddressList,
  getRelationList,
  getCsmManageTeamPageByCusNum
} from '@/api/rcd/standBook/detail'
// import { dictTranslate } from '@/api/system/dict'
export default {
  data() {
    return {
      // 字典翻译
      // connTypeDict:[],//地址类型
      // counRegiDict:[],//国家和地区
      // provinceDict:[],//省
      // cityDict:[],//市
      // countyDict:[],//县
      // relCustomerTypeDict:[],//关联关系类型
      // certTypeDict:[],//关联客户证件类型
      // aeraCodeDict:[],//机构所在地区
      // userPlacingCdDict:[],//权限类型
      //客户号
      customerNum: [],
      // 基本信息中表单数据源
      basicInfoForm: {},
      // 地址信息中表格数据源
      addressTableData: [],
      // 地址信息中分页数据
      addressPage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      },
      // 关联客户信息中表格数据
      customerTableData: [],
      // 关联客户信息中分页数据
      customerPage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      },
      // 我行管理团队信息中表格数据
      teamTableData: [],
      // 我行管理团队信息中分页数据
      teamPage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      }
    }
  },
  created() {
    console.log(this.$route.params.val, '打印传递的值');
    this.basicInfoForm = JSON.parse(sessionStorage.getItem("individualInfoVal"))
    this.customerNum = this.basicInfoForm.customerNum

    // ========== 表单、表格填入数据 ==========
    this.getCsmIndividualPageByCustNumCommon()
    this.getAddressListCommon()
    this.getRelationListCommon()
    this.getCsmManageTeamPageByCusNumCommon()

    // this.dictTrans()
  },
  methods: {
    //个人客户详细信息
    getCsmIndividualPageByCustNumCommon() {
      getCsmIndividualPageByCustNum(this.customerNum).then(res => {
        console.log(res, "个人客户详细信息");
        this.basicInfoForm = res.data.data;
      });
    },
    // 地址信息
    getAddressListCommon() {
      getAddressList(
        this.addressPage.pagenum,
        this.addressPage.pagesize,
        this.customerNum
      ).then(res => {
        console.log(res, "地址信息");
        this.addressTableData = res.data.data.records;
        this.addressPage.total = res.data.data.total;
      })
    },
    //关联客户信息
    getRelationListCommon() {
      getRelationList(
        this.customerPage.pagenum,
        this.customerPage.pagesize,
        this.customerNum
      ).then(res => {
        console.log(res, "关联客户信息");
        this.customerTableData = res.data.data.records;
        this.customerPage.total = res.data.data.total;
      })
    },
    // 我行管理团队
    getCsmManageTeamPageByCusNumCommon() {
      getCsmManageTeamPageByCusNum(
        this.teamPage.pagenum,
        this.teamPage.pagesize,
        this.customerNum
      ).then(res => {
        console.log(res, "我行管理团队");
        this.teamTableData = res.data.data.records;
        this.teamPage.total = res.data.data.total;
      })
    },
    // 字典翻译
    // dictTrans(){
    //   // 证件类型
    //   dictTranslate("CD000003").then(res => {
    //     this.certTypeDict = res.data.data;
    //     this.basicInfoForm.certType = this.certTypeDict[this.basicInfoForm.certType];
    //   });
    //   // 性别
    //   dictTranslate("CD000004").then(res => {
    //     this.genderDict = res.data.data;
    //     this.basicInfoForm.gender = this.genderDict[this.basicInfoForm.gender];
    //   });
    //   // 国籍
    //   dictTranslate("CD000001").then(res => {
    //     this.nationDict = res.data.data;
    //     this.basicInfoForm.nation = this.nationDict[this.basicInfoForm.nation];
    //   });
    //   // 民族
    //   dictTranslate("CD000005").then(res => {
    //     this.raceDict = res.data.data;
    //     this.basicInfoForm.race = this.raceDict[this.basicInfoForm.race];
    //   });
    //   // 最高学位
    //   dictTranslate("CD000010").then(res => {
    //     this.highAcadeDegreeDict = res.data.data;
    //     this.basicInfoForm.highAcadeDegree = this.highAcadeDegreeDict[
    //       this.basicInfoForm.highAcadeDegree
    //     ];
    //   });
    //   // 最高学历
    //   dictTranslate("CD000011").then(res => {
    //     this.educationDict = res.data.data;
    //     this.basicInfoForm.education = this.educationDict[this.basicInfoForm.education];
    //   });
    //   // 是否农户
    //   dictTranslate("CD000167").then(res => {
    //     this.agriRelatedIndDict = res.data.data;
    //     this.basicInfoForm.agriRelatedInd = this.agriRelatedIndDict[
    //       this.basicInfoForm.agriRelatedInd
    //     ];
    //   });
    //   // 职业
    //   dictTranslate("CD000012").then(res => {
    //     this.occupation3Dict = res.data.data;
    //     this.basicInfoForm.occupation3 = this.occupation3Dict[
    //       this.basicInfoForm.occupation3
    //     ];
    //   });
    //   // 婚姻状况
    //   dictTranslate("CD000007").then(res => {
    //     this.marrStatusDict = res.data.data;
    //     this.basicInfoForm.marrStatus = this.marrStatusDict[this.basicInfoForm.marrStatus];
    //   });
    //   // 健康状况
    //   dictTranslate("CD000009").then(res => {
    //     this.healthyStatusDict = res.data.data;
    //     this.basicInfoForm.healthyStatus = this.healthyStatusDict[
    //       this.basicInfoForm.healthyStatus
    //     ];
    //   });
    //   // 评级结果
    //   dictTranslate("CD000216").then(res => {
    //     this.custGradeDict = res.data.data;
    //     this.basicInfoForm.custGrade = this.custGradeDict[this.basicInfoForm.custGrade];
    //   });
    //   // 地址类型
    //   dictTranslate("CD000031").then(res => {
    //     this.connTypeDict = res.data.data;
    //   });
    //   // 国家和地区
    //   dictTranslate("CD000001").then(res => {
    //     this.counRegiDict = res.data.data;
    //   });
    //   // 省市县
    //   dictTranslate("CD000002").then(res => {
    //     this.provinceDict = res.data.data;
    //     this.cityDict = res.data.data;
    //     this.countyDict = res.data.data;
    //     this.aeraCodeDict = res.data.data;
    //   });
    //   // 关联关系类型
    //   dictTranslate("CD000016").then(res => {
    //     this.relCustomerTypeDict = res.data.data;
    //   });
    //   // 关联客户证件类型
    //   dictTranslate("CD000003").then(res => {
    //     this.certTypeDict = res.data.data;
    //   });
    //   // 权限类型
    //   dictTranslate("scope_category").then(res => {
    //     this.userPlacingCdDict = res.data.data;
    //   });
    // },
    // 监听 地址信息 中分页 每页条数 改变的事件
    handleSizeChange1(newSize) {
      console.log(`每页 ${newSize} 条`);
      this.addressPage.pagesize = newSize;
      // 调用方法，重新获取列表数据
      this.getAddressListCommon()
    },
    // 监听 地址信息 中分页 页码值 改变的事件
    handleCurrentChange1(newPage) {
      console.log(`当前页: ${newPage}`);
      this.addressPage.pagenum = newPage;
      // 调用方法，重新获取列表数据
      this.getAddressListCommon()
    },
    // 监听 关联客户信息 中分页 每页条数 改变的事件
    handleSizeChange2(newSize) {
      console.log(`每页 ${newSize} 条`);
      this.customerPage.pagesize = newSize;
      // 调用方法，重新获取列表数据
      this.getRelationListCommon()
    },
    // 监听 关联客户信息 中分页 页码值 改变的事件
    handleCurrentChange2(newPage) {
      console.log(`当前页: ${newPage}`);
      this.customerPage.pagenum = newPage;
      // 调用方法，重新获取列表数据
      this.getRelationListCommon()
    },
    // 监听 我行管理团队 中分页 每页条数 改变的事件
    handleSizeChange3(newSize) {
      console.log(`每页 ${newSize} 条`);
      this.customerPage.pagesize = newSize;
      // 调用方法，重新获取列表数据
      this.getCsmManageTeamPageByCusNumCommon()
    },
    // 监听 我行管理团队 中分页 页码值 改变的事件
    handleCurrentChange3(newPage) {
      console.log(`当前页: ${newPage}`);
      this.customerPage.pagenum = newPage;
      // 调用方法，重新获取列表数据
      this.getCsmManageTeamPageByCusNumCommon()
    }
  }
}
</script>

<style lang="scss" scoped>
.corporateInfoCon {
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
        }
      }
    }
  }
}
</style>

