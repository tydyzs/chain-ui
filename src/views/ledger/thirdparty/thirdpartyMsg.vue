<!-- 额度台账---公司客户详情页面 -->
<template>
  <div class="corporateMsgCon">
     <!-- 机构下拉选择框 -->
    <div class="fixed-header">
      <el-card>
      <el-select v-model="orgForCustomer" placeholder="当前为登录机构" @change="orgNumChange" size="small">
        <el-option v-for="item in orgForCustomerSelection" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
      </el-select>
      <el-steps :active="active" align-center>
          <el-step v-for="(item, i) in steps" :key="i" :title="item" @click.native="jump(i)"></el-step>
        </el-steps>
    </el-card>
    </div>

    <!-- 基本信息 -->
    <el-card class="basicInfo con">
      <el-form ref="form" :model="basicInfoForm" label-width="180px" size="small">
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="basicInfoForm.customerName" size="small" disabled></el-input>
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
        <el-form-item label="第三方额度" prop="expCredit">
          <el-input v-model="basicInfoForm.expCredit" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="总额度可用" prop="expAvi">
          <el-input v-model="basicInfoForm.expAvi" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="总额度已用" prop="expUsed">
          <el-input v-model="basicInfoForm.expUsed" size="small" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="主办客户经理" prop="userNum">
          <el-input v-model="basicInfoForm.userNum" size="small" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="主办机构" prop="orgNum">
          <el-input v-model="basicInfoForm.orgNumName" size="small" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 额度明细信息 -->
    <el-card class="con">
      <span>额度明细信息233</span>
      <!-- 表格详情 -->
      <el-table :data="limitDeaTableData" style="width: 100%" size="small" border stripe>
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="crdDetailNum" label="额度编号" align="center" :resizable="false" width="180"></el-table-column>
        <el-table-column prop="crdProductName" label="额度产品" align="center" :resizable="false" width="160"></el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false" width="200">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="expCredit" label="第三方额度" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.expCredit | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expUsed" label="已用额度" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.expUsed | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expAvi" label="可用额度" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.expAvi | NumsFormat }}</template>
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="limitDeaPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="limitDeaPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="limitDeaPage.total"></el-pagination>
    </el-card>
    <!-- 批复信息 -->
    <el-card class="con">
      <span>批复信息</span>
      <!-- 表格详情 -->
      <el-table :data="crdApprove" style="width: 100%" size="small" border stripe>
        <el-table-column type="index" label="序号" width="50" :resizable="false"></el-table-column>
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false" width="120">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="approveNum" label="批复编号" align="center" :resizable="false">
          <template slot-scope="scope">
            <p type="text" size="small" class="approveNum" @click="handleToApproveNum(scope.row)" style="color:#00a252;text-decoration: underline;cursor: pointer;">{{scope.row.approveNum}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="业务品种" align="center" :resizable="false" width="130"></el-table-column>
        <el-table-column prop="productTypeName" label="业务种类" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ productTypeDict[scope.row.productType] }}</template> -->
        </el-table-column>
        <el-table-column prop="mainGuaranteeTypeName" label="主担保方式" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ mainGuaranteeTypeDict[scope.row.mainGuaranteeType] }}</template> -->
        </el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false" width="200">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="approveAmt" label="批复金额" align="center" :resizable="false" width="100">
          <template slot-scope="scope">{{ scope.row.approveAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="userNumName" label="经办人" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ userNumDict[scope.row.userNum] }}</template> -->
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange3" @current-change="handleCurrentChange3" :current-page="crdApprovePage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="crdApprovePage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="crdApprovePage.total"></el-pagination>
    </el-card>

    <!-- 占用恢复信息 -->
    <el-card class="con">
      <span>占用恢复信息</span>
      <!-- 表格详情 -->
      <el-table :data="recoverTableData" style="width: 100%" size="small" border stripe>
        <el-table-column type="index" label="序号" width="50" align="center" :resizable="false" />
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false" width="110">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="crdDetailNum" label="额度编号" align="center" :resizable="false" width="120"></el-table-column>
        <el-table-column prop="busiDealNum" label="业务编号" align="center" :resizable="false" width="180"></el-table-column>
        <el-table-column prop="crdProductName" label="额度品种" align="center" :resizable="false" width="180"></el-table-column>
        <el-table-column prop="tranTypeCdName" label="交易类型" align="center" :resizable="false" width="180">
          <!-- <template slot-scope="scope">{{ tranTypeCdDict[scope.row.tranTypeCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false" width="200">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="limitCreditAmt" label="金额" align="center" :resizable="false" width="110">
          <template slot-scope="scope">{{ scope.row.limitCreditAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="tranDate" label="占用/恢复时间" align="center" :resizable="false" width="150"></el-table-column>
        <el-table-column prop="terminalName" label="经办系统" align="center" :resizable="false" width="120"></el-table-column>
        <el-table-column prop="userNumName" label="经办人" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ userNumDict[scope.row.userNum] }}</template> -->
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange4" @current-change="handleCurrentChange4" :current-page="recoverPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="recoverPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="recoverPage.total"></el-pagination>
    </el-card>

    <!-- 对外担保信息 -->
    <el-card class="con">
      <span>对外担保信息</span>
      <!-- 表格详情 -->
      <el-table :data="assureTableData" style="width: 100%" size="small" border stripe>
        <el-table-column type="index" label="序号" width="50" align="center" :resizable="false" />
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="customerName" label="被担保客户名称" align="center" :resizable="false" width="150"></el-table-column>
        <el-table-column prop="contractNum" label="合同编号" align="center" :resizable="false">
          <template slot-scope="scope">
            <p type="text" size="small" class="contractNum" @click="handleToContract(scope.row)" style="color:#00a252;text-decoration: underline;cursor: pointer;">{{scope.row.contractNum}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="subcontractNum" label="担保合同编号" align="center" :resizable="false" width="120"></el-table-column>
        <el-table-column prop="suretyNum" label="担保物编号" align="center" :resizable="false" width="120"></el-table-column>
        <el-table-column prop="suretyCustomerNum" label="抵质押人/保证人客户编号" align="center" :resizable="false" width="180"></el-table-column>
        <el-table-column prop="subcontractTypeName" label="担保合同类型" align="center" :resizable="false" width="120">
          <!-- <template slot-scope="scope">{{ subcontractTypeDict[scope.row.subcontractType] }}</template> -->
        </el-table-column>
        <el-table-column prop="pledgeTypeName" label="担保物类型" align="center" :resizable="false" width="120">
          <!-- <template slot-scope="scope">{{ pledgeTypeDict[scope.row.pledgeType] }}</template> -->
        </el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false" width="200">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="subcontractAmt" label="担保合同金额" align="center" :resizable="false" width="120">
          <template slot-scope="scope">{{ scope.row.subcontractAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="suretyAmt" label="本次担保金额" align="center" :resizable="false" width="120">
          <template slot-scope="scope">{{ scope.row.suretyAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="userNumName" label="经办人" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ userNumDict[scope.row.userNum] }}</template> -->
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange5" @current-change="handleCurrentChange5" :current-page="assurePage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="assurePage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="assurePage.total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
// import { dictTranslate } from '@/api/system/dict'
import {
  crdDetail,
  crdApprove,
  applySerial,
  listGrt,
  thirdPartyList
} from '@/api/rcd/standBook/thirdparty'
import { getCrdOrgByCust } from '@/api/rcd/standBook/corporate'
import { nav } from "@/utils/navigation.js"
export default {
  data() {
    return {
      active: 0,
      // 字典翻译数据承载对象
      // orgNumDict: [], //经办机构
      // currencyCdDict: [], //币种
      // userNumDict: [], //经办人
      // tranTypeCdDict: [], //交易类型
      // subcontractTypeDict: [], //担保合同类型
      // pledgeTypeDict: [], //担保物类型
      // productTypeDict: [],//业务种类
      // mainGuaranteeTypeDict: [],//主担保方式
      //机构下拉框
      orgForCustomer: '', //数据源
      orgForCustomerSelection: [],
      //机构号：进入页面的时候为当前登录机构
      //        当选择左上机构后，变更为选择后的机构
      orgNumForThisCustomer: '',
      // 进入页面默认客户号
      customerNum: '',
      // 基本信息中表单数据源
      basicInfoForm: {},
      // 额度明细信息表格数据源
      limitDeaTableData: [],
      // 额度明细信息分页数据源
      limitDeaPage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      },
      // 借据信息表格数据源
      crdApprove: [],
      // 借据信息分页数据
      crdApprovePage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      },
      // 占用恢复信息表格数据源
      recoverTableData: [],
      // 占用恢复分页数据
      recoverPage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      },
      // 对外担保信息表格数据源
      assureTableData: [],
      assurePage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      },
      steps: ['基本信息', '额度明细信息', '批复信息', '占用恢复信息', '对外担保信息']
    }
  },
  created() {
    // console.log(this.$route.params.val, '打印传递的值')
    // this.basicInfoForm = this.$route.params.val
    this.basicInfoForm = JSON.parse(sessionStorage.getItem("thirdpartyMsgVal"))
    console.log(this.basicInfoForm, '打印传递过来的值');
    this.customerNum = this.basicInfoForm.customerNum
    //机构号赋值
    this.orgNumForThisCustomer = this.basicInfoForm.orgNum
    // 下拉框获取当前客户授信机构
    this.getCrdOrgByCustCommon()
    // ========== 表单、表格填入数据 ==========
    this.getThirdPartyList()
    this.getCrdApprove()
    this.getCrdDetail()
    this.getListGrt()

    // this.dictTranslateCommon()
  },
  mounted () {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.onScroll)
    })
  },
  beforeDestroy () {
    window.removeEventListener("scroll", this.onScroll)
  },
  methods: {
    // 顶部表单信息
    thirdPartyListCommon() {
      console.log(this.orgNumForThisCustomer, this.customerNum);
      thirdPartyList('1', '1', '', '', '', this.customerNum, '', this.orgNumForThisCustomer).then(res => {
        if (res.data.data.records[0] == undefined) {
          this.basicInfoForm = {};
        } else {
          this.basicInfoForm = res.data.data.records[0];
        }
      });
    },
    // 点击合同号打开合同详情页签
    handleToContract(row) {
      console.log(row, '点击合同号打开合同详情页签')
      this.$router.push({ name: 'contractDetail', params: { val: row } })
      sessionStorage.setItem('contractVal', JSON.stringify(row))
    },
    // 点击批复号打开合同详情页签
    handleToApproveNum(row) {
      console.log(row, '点击批复号打开批复详情页签')
      this.$router.push({ name: 'approveDetail', params: { val: row } })
      sessionStorage.setItem('approveVal', JSON.stringify(row))
    },
    //额度明细表数据
    getThirdPartyList() {
      crdDetail(
        this.limitDeaPage.pagenum,
        this.limitDeaPage.pagesize,
        this.customerNum,
        // 'C002',
        this.orgNumForThisCustomer,
        // '01000'
      ).then(res => {
        //console.log(res, "第三方额度明细");
        this.limitDeaTableData = res.data.data.records
        this.limitDeaPage.total = res.data.data.total
      })
    },
    //批复信息
    getCrdApprove() {
      crdApprove(
        this.crdApprovePage.pagenum,
        this.crdApprovePage.pagesize,
        this.customerNum,
        // 'C005',
        this.orgNumForThisCustomer,
        // '01000'
      ).then(res => {
        //console.log(res, "第三方占用恢复信息");
        this.crdApprove = res.data.data.records
        console.log('打印批复数据', this.crdApprove);
        this.crdApprovePage.total = res.data.data.total
      })
    },
    //占用恢复信息
    getCrdDetail() {
      applySerial(
        this.recoverPage.pagenum,
        this.recoverPage.pagesize,
        this.customerNum,
        // '23412',
        this.orgNumForThisCustomer
        // '10101'
      ).then(res => {
        console.log(res, '占用恢复信息')
        this.recoverTableData = res.data.data.records
        this.recoverPage.total = res.data.data.total
      })
    },
    //对外担保信息
    getListGrt() {
      listGrt(
        this.assurePage.pagenum,
        this.assurePage.pagesize,
        this.customerNum,
        // 'C002',
        this.orgNumForThisCustomer
        // '01000'
      ).then(res => {
        console.log(res, '对外担保信息')
        this.assureTableData = res.data.data.records
        this.assurePage.total = res.data.data.total
      })
    },
    // 当机构改变的时候
    orgNumChange(val) {
      this.orgNumForThisCustomer = val

      this.thirdPartyListCommon()
      this.getThirdPartyList()
      this.getCrdApprove()
      this.getCrdDetail()
      this.getListGrt()
    },
    // 字典翻译
    // dictTranslateCommon() {
    //   //经办人
    //   dictTranslate('user').then(res => {
    //     this.userNumDict = res.data.data
    //     this.basicInfoForm.userNum = this.userNumDict[
    //       this.basicInfoForm.userNum
    //     ]
    //   })
    //   // 证件类型
    //   dictTranslate('CD000003').then(res => {
    //     this.certTypeDict = res.data.data
    //     this.basicInfoForm.certType = this.certTypeDict[
    //       this.basicInfoForm.certType
    //     ]
    //   })
    //   // 经办机构
    //   dictTranslate('org').then(res => {
    //     this.orgNumDict = res.data.data
    //     this.basicInfoForm.orgNum = this.orgNumDict[this.basicInfoForm.orgNum]
    //   })
    //   // 币种字典
    //   dictTranslate('CD000019').then(res => {
    //     this.currencyCdDict = res.data.data
    //   })
    //   // 交易类型
    //   dictTranslate('CD000087').then(res => {
    //     this.tranTypeCdDict = res.data.data
    //   })
    //   // 担保合同类型
    //   dictTranslate('CD000102').then(res => {
    //     this.subcontractTypeDict = res.data.data
    //   })
    //   // 担保物类型
    //   dictTranslate('CD000209').then(res => {
    //     this.pledgeTypeDict = res.data.data
    //   })
    //   // 业务种类
    //   dictTranslate("CD000061").then(res => {
    //     this.productTypeDict = res.data.data;
    //   });
    //   // 主担保方式
    //   dictTranslate("CD000100").then(res => {
    //     this.mainGuaranteeTypeDict = res.data.data;
    //   });
    // },

    // 获取当前客户的授信机构
    getCrdOrgByCustCommon() {
      getCrdOrgByCust(
        this.customerNum
        // 'C002'
      ).then(res => {
        this.orgForCustomerSelection = res.data.data
      })
    },
    // 监听 额度明细信息 中分页 每页条数 改变的事件
    handleSizeChange2(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.limitDeaPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getThirdPartyList()
    },
    // 监听 额度明细信息 中分页 页码值 改变的事件
    handleCurrentChange2(newPage) {
      console.log(`当前页: ${newPage}`)
      this.limitDeaPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getThirdPartyList()
    },
    // 监听 批复信息 中分页 每页条数 改变的事件
    handleSizeChange3(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.crdApprovePage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getCrdApprove()
    },
    // 监听 批复信息 中分页 页码值 改变的事件
    handleCurrentChange3(newPage) {
      console.log(`当前页: ${newPage}`)
      this.crdApprovePage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getCrdApprove()
    },
    // 监听 占用恢复信息 中分页 每页条数 改变的事件
    handleSizeChange4(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.recoverPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getCrdDetail()
    },
    // 监听 占用恢复信息 中分页 页码值 改变的事件
    handleCurrentChange4(newPage) {
      console.log(`当前页: ${newPage}`)
      this.recoverPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getCrdDetail()
    },
    // 监听 对外担保信息 中分页 每页条数 改变的事件
    handleSizeChange5(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.assurePage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getListGrt()
    },
    // 监听 对外担保信息 中分页 页码值 改变的事件
    handleCurrentChange5(newPage) {
      console.log(`当前页: ${newPage}`)
      this.assurePage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getListGrt()
    },
    // 电梯导航跳转功能
    jump (e) {
      nav(e)
    },
    onScroll () {
      let scrolled = Math.trunc(document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset) + 45
      let jump = document.getElementsByClassName('con')
      let len = this.steps.length - 1
      this.steps.forEach((item, index) => {
        if (scrolled >= jump[index].offsetTop - 85 && scrolled < jump[index + 1].offsetTop - 85) {
          this.active = index
        } else if (scrolled >= jump[len].offsetTop - 310) {
          this.active = len
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.corporateMsgCon {
  @import '@/styles/msgnav.scss';
  // el-card 通用样式
  .el-card /deep/ {
    .el-card__body {
      // 表格头部添加底部线条
      .el-table {
        .el-table__body-wrapper {
          .el-table__body {
            .el-table__row {
              td:nth-child(2) {
                .cell {
                  /deep/.contractNum {
                    text-decoration: underline;
                    color: #00a252 !important;
                    cursor: pointer;
                  }
                  /deep/.summaryNum {
                    text-decoration: underline;
                    color: #00a252 !important;
                    cursor: pointer;
                  }
                }
              }
              td:nth-child(3) {
                /deep/.contractNum {
                  text-decoration: underline;
                  color: #00a252 !important;
                  cursor: pointer;
                }
                /deep/.contractNum {
                  text-decoration: underline;
                  color: #00a252 !important;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
  }
}
.hideSidebar .fixed-header {
  width: calc(100% - 64px);
}
</style>

