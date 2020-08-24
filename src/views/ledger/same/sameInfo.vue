<!-- 公司客户详情信息页面 -->
<template>
  <div class="corporateInfoCon">
    <!-- 基本信息 -->
    <el-card class="basicInfo">
      <el-form ref="form" :model="basicInfoForm" label-width="180px" size="small">
        <el-form-item label="客户名称">
          <el-input v-model="basicInfoForm.custName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="客户编号">
          <el-input v-model="basicInfoForm.customerNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="公司客户类型">
          <el-input v-model="basicInfoForm.beneCustTypeName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码">
          <el-input v-model="basicInfoForm.creditOrganCode" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="国家和地区">
          <el-input v-model="basicInfoForm.countryCodeName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="从业人数">
          <el-input v-model="basicInfoForm.empNumber" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="注册资本">
          <el-input v-model="basicInfoForm.regCapital" size="small" disabled>
            777
            <!-- <template slot-scope="scope">{{ scope.row.regCapital | NumsFormat }}</template> -->
          </el-input>
        </el-form-item>
        <el-form-item label="注册资本币种">
          <el-input v-model="basicInfoForm.regCptlCurrName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="行业">
          <el-input v-model="basicInfoForm.nationalEconomyDepart4Name" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="企业规模">
          <el-input v-model="basicInfoForm.unitScaleName" size="small" disabled></el-input>
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
  getCsmCorporationPageByCusNum,
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
      // 进入页面时的客户编号
      customerNum: '',
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
    console.log(this.$route.params.val, '打印传递的值')
    this.basicInfoForm = JSON.parse(sessionStorage.getItem("sameInfoVal"))
    this.customerNum = this.basicInfoForm.customerNum

    // ========== 表单、表格填入数据 ==========
    this.getCsmCorporationPageByCusNumCommon()
    this.getAddressListCommon()
    this.getRelationListCommon()
    this.getCsmManageTeamPageByCusNumCommon()

    // this.dictTranslateCommon()
  },
  methods: {
    // 顶层表单，客户基本信息
    getCsmCorporationPageByCusNumCommon() {
      getCsmCorporationPageByCusNum(this.customerNum).then(res => {
        console.log(res, '顶层表单，客户基本信息')
        this.basicInfoForm = res.data.data
      })
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
    // dictTranslateCommon() {
    //   // 公司客户类型
    //   dictTranslate('CD000212').then(res => {
    //     this.customerTypeDict = res.data.data
    //     this.basicInfoForm.customerType = this.customerTypeDict[
    //       this.basicInfoForm.customerType
    //     ]
    //   })
    //   // 国家和地区
    //   dictTranslate('CD000001').then(res => {
    //     this.countryCodeDict = res.data.data
    //     this.basicInfoForm.countryCode = this.countryCodeDict[
    //       this.basicInfoForm.countryCode
    //     ]
    //   })
    //   // 注册资本币种
    //   dictTranslate('CD000019').then(res => {
    //     this.regCptlCurrDict = res.data.data
    //     this.basicInfoForm.regCptlCurr = this.regCptlCurrDict[
    //       this.basicInfoForm.regCptlCurr
    //     ]
    //   })
    //   // 行业
    //   dictTranslate('CD000015').then(res => {
    //     this.nationalEconomyDepart4Dict = res.data.data
    //     this.basicInfoForm.nationalEconomyDepart4 = this.nationalEconomyDepart4Dict[
    //       this.basicInfoForm.nationalEconomyDepart4
    //     ]
    //   })
    //   // 企业规模
    //   dictTranslate('CD000020').then(res => {
    //     this.unitScaleDict = res.data.data
    //     this.basicInfoForm.unitScale = this.unitScaleDict[
    //       this.basicInfoForm.unitScale
    //     ]
    //   })
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
      console.log(`每页 ${newSize} 条`)
      this.addressPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getAddressListCommon()
    },
    // 监听 地址信息 中分页 页码值 改变的事件
    handleCurrentChange1(newPage) {
      console.log(`当前页: ${newPage}`)
      this.addressPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getAddressListCommon()
    },
    // 监听 关联客户信息 中分页 每页条数 改变的事件
    handleSizeChange2(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.customerPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getRelationListCommon()
    },
    // 监听 关联客户信息 中分页 页码值 改变的事件
    handleCurrentChange2(newPage) {
      console.log(`当前页: ${newPage}`)
      this.customerPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getRelationListCommon()
    },
    // 监听 我行管理团队 中分页 每页条数 改变的事件
    handleSizeChange3(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.customerPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getCsmManageTeamPageByCusNumCommon()
    },
    // 监听 我行管理团队 中分页 页码值 改变的事件
    handleCurrentChange3(newPage) {
      console.log(`当前页: ${newPage}`)
      this.customerPage.pagenum = newPage
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
