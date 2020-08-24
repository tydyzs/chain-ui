<!-- 额度台账---担保台账详情页面 -->
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
      <el-form ref="form" :model="ruleForm" label-width="180px" size="small">
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="ruleForm.customerName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="ECIF客户编号" prop="costomerNum">
          <el-input v-model="ruleForm.customerNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="certType">
          <el-input v-model="ruleForm.certTypeName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="证件号码" prop="certNum">
          <el-input v-model="ruleForm.certNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="总担保额度" prop="limitCredit">
          <el-input v-model="ruleForm.limitCredit" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="主办机构" prop="orgNum">
          <el-input v-model="ruleForm.orgNumName" size="small" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="主办客户经理" prop="userNum">
          <el-input v-model="ruleForm.userNum" size="small" disabled></el-input>
        </el-form-item> -->
      </el-form>
    </el-card>

    <!-- 额度明细信息 -->
    <el-card class="con">
      <span>额度明细信息</span>
      <!-- 表格详情 -->
      <el-table :data="limitDeaTableData" style="width: 100%" size="small" border stripe>
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="crdProductName" label="额度产品" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="limitCredit" label="担保额度" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.limitCredit | NumsFormat }}</template>
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="limitDeaPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="limitDeaPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="limitDeaPage.total"></el-pagination>
    </el-card>
    <!-- 对外担保信息 -->
    <el-card class="con">
      <span>对外担保信息</span>
      <!-- 表格详情 -->
      <el-table :data="recoverTableData" style="width: 100%" size="small" border stripe>
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false" width="110">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="customerName" label="被担保客户名称" align="center" :resizable="false" width="140"></el-table-column>
        <el-table-column prop="contractNum" label="合同编号" align="center" :resizable="false" width="120">
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
        <el-table-column prop="userNumName" label="经办人" align="center" :resizable="false" width="120">
          <!-- <template slot-scope="scope">{{ userNumDict[scope.row.userNum] }}</template> -->
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="recoverPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="recoverPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="recoverPage.total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getGuaranteeCrdDetail,
  getListGrtPage,
  getList
} from '@/api/rcd/standBook/guarantee'
// import { dictTranslate } from '@/api/system/dict'
import { getCrdOrgByCust } from '@/api/rcd/standBook/corporate'
import { nav } from "@/utils/navigation.js"
export default {
  data () {
    return {
      active: 0,
      // 字典翻译项 数据存放处
      // orgNumDict: [], //经办机构
      // currencyCdDict: [], //币种
      // subcontractTypeDict: [], //担保合同类型
      // pledgeTypeDict: [], //担保物类型
      // userNumDict: [], //经办人
      //机构下拉框
      orgForCustomer: '', //数据源
      orgForCustomerSelection: [],
      //机构号：进入页面的时候为当前登录机构
      //        当选择左上机构后，变更为选择后的机构
      orgNumForThisCustomer: '',
      // 进入页面默认客户号
      customerNum: '',
      // 基本信息中表单数据源
      ruleForm: {},
      // 额度明细信息 表格数据源
      limitDeaTableData: [],
      // 额度明细信息 分页数据源
      limitDeaPage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      },
      // 对外担保信息 表格数据源
      recoverTableData: [],
      // 对外担保信息 分页数据
      recoverPage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      },
      steps: ['基本信息', '额度明细信息', '对外担保信息']
    }
  },
  created () {
    console.log(this.$route.params.val, '打印传递的值')
    // this.ruleForm = this.$route.params.val
    this.ruleForm = JSON.parse(sessionStorage.getItem("guaranteeMsgVal"))
    this.customerNum = this.ruleForm.customerNum
    //机构号赋值
    this.orgNumForThisCustomer = this.ruleForm.orgNum
    // 下拉框获取当前客户授信机构
    this.getCrdOrgByCustCommon()
    // ========== 表单、表格填入数据 ==========
    this.getGuaranteeCrdDetailCommon()
    this.getListGrtPageCommon()
    // 字典翻译
    // this.dictTranslate()
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
    getListCommon () {
      console.log(this.orgNumForThisCustomer, this.customerNum);
      getList('1', '1', '', '', this.orgNumForThisCustomer, this.customerNum, '', '').then(res => {
        if (res.data.data.records[0] == undefined) {
          this.ruleForm = {};
        } else {
          this.ruleForm = res.data.data.records[0];
        }
      });
    },
    // 点击合同号打开合同详情页签
    handleToContract (row) {
      console.log(row, '点击合同号打开合同详情页签')
      this.$router.push({ name: 'contractDetail', params: { val: row } })
      sessionStorage.setItem('contractVal', JSON.stringify(row))
    },
    // 额度明细信息
    getGuaranteeCrdDetailCommon () {
      getGuaranteeCrdDetail(
        this.limitDeaPage.pagenum,
        this.limitDeaPage.pagesize,
        this.customerNum,
        // 'C002',
        this.orgNumForThisCustomer
        // '01000'
      ).then(res => {
        console.log(res, '额度明细信息')
        this.limitDeaTableData = res.data.data.records
        this.limitDeaPage.total = res.data.data.total
      })
    },
    //对外担保信息
    getListGrtPageCommon () {
      getListGrtPage(
        this.recoverPage.pagenum,
        this.recoverPage.pagesize,
        this.customerNum,
        // 'C002',
        this.orgNumForThisCustomer
        // '01000'
      ).then(res => {
        console.log(res, '对外担保信息')
        this.recoverTableData = res.data.data.records
        this.recoverPage.total = res.data.data.total
      })
    },

    // 当机构改变的时候
    orgNumChange (val) {
      this.orgNumForThisCustomer = val
      this.getListCommon()
      this.getGuaranteeCrdDetailCommon()
      this.getListGrtPageCommon()
      // this.dictTranslate()
    },

    // 字典翻译
    // dictTranslate() {
    //   //经办人
    //   dictTranslate('user').then(res => {
    //     this.userNumDict = res.data.data
    //     this.ruleForm.userNum = this.userNumDict[this.ruleForm.userNum]
    //   })
    //   //经办机构
    //   dictTranslate('org').then(res => {
    //     this.orgNumDict = res.data.data
    //     this.ruleForm.orgNum = this.orgNumDict[this.ruleForm.orgNum]
    //   })
    //   //证件类型
    //   dictTranslate('CD000003').then(res => {
    //     this.certTypeDict = res.data.data
    //     this.ruleForm.certType = this.certTypeDict[this.ruleForm.certType]
    //   })
    //   //币种
    //   dictTranslate('CD000019').then(res => {
    //     this.currencyCdDict = res.data.data
    //   })
    //   //担保合同类型
    //   dictTranslate('CD000102').then(res => {
    //     this.subcontractTypeDict = res.data.data
    //   })
    //   //担保物类型
    //   dictTranslate('CD000209').then(res => {
    //     this.pledgeTypeDict = res.data.data
    //   })
    // },

    // 获取当前客户的授信机构
    getCrdOrgByCustCommon () {
      getCrdOrgByCust(
        this.customerNum
        // 'C002'
      ).then(res => {
        this.orgForCustomerSelection = res.data.data
      })
    },

    // 监听 额度明细信息 中分页 每页条数 改变的事件
    handleSizeChange1 (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.limitDeaPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getGuaranteeCrdDetailCommon()
    },
    // 监听 额度明细信息 中分页 页码值 改变的事件
    handleCurrentChange1 (newPage) {
      console.log(`当前页: ${newPage}`)
      this.limitDeaPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getGuaranteeCrdDetailCommon()
    },
    // 监听 对外担保信息 中分页 每页条数 改变的事件
    handleSizeChange2 (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.recoverPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getListGrtPageCommon()
    },
    // 监听 对外担保信息 中分页 页码值 改变的事件
    handleCurrentChange2 (newPage) {
      console.log(`当前页: ${newPage}`)
      this.recoverPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getListGrtPageCommon()
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
        } else if (scrolled >= jump[len].offsetTop - 85) {
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
}
.hideSidebar .fixed-header {
  width: calc(100% - 64px);
}
</style>



