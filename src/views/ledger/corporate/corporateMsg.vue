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
        <el-form-item label="客户名称">
          <el-input v-model="basicInfoForm.customerName" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="ECIF客户编号">
          <el-input v-model="basicInfoForm.customerNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码">
          <el-input v-model="basicInfoForm.certNum" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="总授信额度">
          <el-input v-model="basicInfoForm.limitCredit" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="总额度已用">
          <el-input v-model="basicInfoForm.limitUsed" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="总额度可用">
          <el-input v-model="basicInfoForm.limitAvi" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="总授信敞口">
          <el-input v-model="basicInfoForm.expCredit" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="总敞口已用">
          <el-input v-model="basicInfoForm.expUsed" size="small" disabled></el-input>
        </el-form-item>
        <el-form-item label="总敞口可用">
          <el-input v-model="basicInfoForm.expAvi" size="small" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item label="主办客户经理">
          <el-input v-model="basicInfoForm.userNum" size="small" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="主办机构">
          <el-input v-model="basicInfoForm.orgNumName" size="small" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 额度信息 -->
    <el-card class="con">
      <span>额度信息</span>
      <!-- 表格详情 -->
      <el-table :data="limitTableData" style="width: 100%" size="small" border stripe>
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="crdMainNum" label="额度编号" align="center" :resizable="false" width="180">
          <template slot-scope="scope">
            <p type="text" size="small" class="crdMainNum" @click="handleToDetail(scope.row)" style="color:#00a252;text-decoration: underline;cursor: pointer;">{{scope.row.crdMainNum}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="crdProductName" label="额度大类" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="limitCredit" label="授信额度" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.limitCredit | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="limitUsed" label="已用额度" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.limitUsed | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="limitAvi" label="可用额度" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.limitAvi | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expCredit" label="授信敞口" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.expCredit | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expAvi" label="可用敞口" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.expAvi | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expUsed" label="已用敞口" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.expUsed | NumsFormat }}</template>
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange1" @current-change="handleCurrentChange1" :current-page="limitPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="limitPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="limitPage.total"></el-pagination>
    </el-card>

    <!-- 额度明细信息 -->
    <el-card class="con">
      <span>额度明细信息</span>
      <!-- 表格详情 -->
      <el-table :data="limitDeaTableData" style="width: 100%" size="small" border stripe>
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="crdDetailNum" label="额度编号" align="center" :resizable="false" width="180"></el-table-column>
        <el-table-column prop="crdProductName" label="额度产品" align="center" :resizable="false" width="160"></el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="limitCredit" label="授信额度" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.limitCredit | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="limitUsed" label="已用额度" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.limitUsed | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="limitAvi" label="可用额度" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.limitAvi | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expCredit" label="授信敞口" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.expCredit | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expAvi" label="可用敞口" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.expAvi | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expUsed" label="已用敞口" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.expUsed | NumsFormat }}</template>
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="limitDeaPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="limitDeaPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="limitDeaPage.total"></el-pagination>
    </el-card>

    <!-- 合同信息 -->
    <el-card class="con">
      <span>合同信息</span>
      <!-- 表格详情 -->
      <el-table :data="contractTableData" style="width: 100%" size="small" border stripe>
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false" width="120">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="contractNum" label="合同编号" align="center" :resizable="false">
          <template slot-scope="scope">
            <p type="text" size="small" class="contractNum" @click="handleToContract(scope.row)" style="color:#00a252;text-decoration: underline;cursor: pointer;">{{scope.row.contractNum}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="crdProductName" label="额度产品" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="productName" label="业务品种" align="center" :resizable="false" width="110"></el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="contractAmt" label="合同金额" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.contractAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="contractBal" label="合同余额" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.contractBal | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="beginDate" label="合同起始日" align="center" :resizable="false" width="100"></el-table-column>
        <el-table-column prop="endDate" label="合同到期日" align="center" :resizable="false" width="100"></el-table-column>
        <el-table-column prop="contractStatusName" label="合同状态" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ contractStatusDict[scope.row.contractStatus] }}</template> -->
        </el-table-column>
        <el-table-column prop="userNumName" label="经办人" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ userNumDict[scope.row.userNum] }}</template> -->
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange6" @current-change="handleCurrentChange6" :current-page="contractPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="contractPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="contractPage.total"></el-pagination>
    </el-card>

    <!-- 借据信息 -->
    <el-card class="con">
      <span>借据信息</span>
      <!-- 表格详情 -->
      <el-table :data="borrowTableData" style="width: 100%" size="small" border stripe>
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false" width="120">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="summaryNum" label="借据编号" align="center" :resizable="false">
          <template slot-scope="scope">
            <p type="text" size="small" class="summaryNum" @click="handleToSummary(scope.row)" style="color:#00a252;text-decoration: underline;cursor: pointer;">{{scope.row.summaryNum}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="contractNum" label="合同编号" align="center" :resizable="false">
          <template slot-scope="scope">
            <p type="text" size="small" class="contractNum" @click="handleToContract(scope.row)" style="color:#00a252;text-decoration: underline;cursor: pointer;">{{scope.row.contractNum}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="业务品种" align="center" :resizable="false" width="110"></el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="summaryAmt" label="借据金额" align="center" :resizable="false" width="100">
          <template slot-scope="scope">{{ scope.row.summaryAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="summaryBal" label="借据余额" align="center" :resizable="false" width="100">
          <template slot-scope="scope">{{ scope.row.summaryBal | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="beginDate" label="借据起始日" align="center" :resizable="false" width="95"></el-table-column>
        <el-table-column prop="endDate" label="借据到期日" align="center" :resizable="false" width="95"></el-table-column>
        <el-table-column prop="summaryStatusName" label="借据状态" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ summaryStatusDict[scope.row.summaryStatus] }}</template> -->
        </el-table-column>
        <el-table-column prop="userNumName" label="经办人" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ userNumDict[scope.row.userNum] }}</template> -->
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange3" @current-change="handleCurrentChange3" :current-page="borrowPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="borrowPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="borrowPage.total"></el-pagination>
    </el-card>

    <!-- 占用恢复信息 -->
    <el-card class="con">
      <span>占用恢复信息</span>
      <!-- 表格详情 -->
      <el-table :data="recoverTableData" style="width: 100%" size="small" border stripe>
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false" width="110">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="crdDetailNum" label="额度编号" align="center" :resizable="false" width="100"></el-table-column>
        <el-table-column prop="busiDealNum" label="业务编号" align="center" :resizable="false" width="180"></el-table-column>
        <el-table-column prop="crdProductName" label="额度品种" align="center" :resizable="false" width="120"></el-table-column>
        <el-table-column prop="tranTypeCdName" label="交易类型" align="center" :resizable="false" width="140">
          <!-- <template slot-scope="scope">{{ tranTypeCdDict[scope.row.tranTypeCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false" width="190">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="limitCreditAmt" label="金额" align="center" :resizable="false" width="110">
          <template slot-scope="scope">{{ scope.row.limitCreditAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="tranDate" label="占用/恢复时间" align="center" :resizable="false" width="150"></el-table-column>
        <el-table-column prop="terminalName" label="经办系统" a lign="center" :resizable="false" width="120"></el-table-column>
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
        <el-table-column prop="suretyNum" label="担保物编号" align="center" :resizable="false" width="150"></el-table-column>
        <el-table-column prop="suretyCustomerNum" label="抵质押人/保证人客户编号" align="center" :resizable="false" width="200"></el-table-column>
        <el-table-column prop="subcontractTypeName" label="担保合同类型" align="center" :resizable="false" width="150">
          <!-- <template slot-scope="scope">{{ subcontractTypeDict[scope.row.subcontractType] }}</template> -->
        </el-table-column>
        <el-table-column prop="pledgeTypeName" label="担保物类型" align="center" :resizable="false" width="150">
          <!-- <template slot-scope="scope">{{ pledgeTypeDict[scope.row.pledgeType] }}</template> -->
        </el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false" width="200">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="subcontractAmt" label="担保合同金额" align="center" :resizable="false" width="150">
          <template slot-scope="scope">{{ scope.row.subcontractAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="suretyAmt" label="本次担保金额" align="center" :resizable="false" width="150">
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
import { dictTranslate } from '@/api/system/dict'
import {
  getCorporateList,
  getCrdOrgByCust,
  findCrdDetailFromCrdMainNum,
  getContractList,
  getSummaryListFromCusNum,
  getApplySerialPage,
  getListGrtPage,
  getList
} from '@/api/rcd/standBook/corporate'
import { nav } from "@/utils/navigation.js"
export default {
  data () {
    return {
      active: 0,
      //二级额度编号crdMainNum
      crdMainNum: '',
      // 字典翻译数据承载对象
      // orgNumDict: [], //经办机构
      // currencyCdDict: [], //币种
      // contractStatusDict: [], //合同状态
      // userNumDict: [], //经办人
      // summaryStatusDict: [], //借据状态
      // tranTypeCdDict: [], //交易类型
      // subcontractTypeDict: [], //担保合同类型
      // pledgeTypeDict: [], //担保物类型
      //机构下拉框
      orgForCustomer: '', //数据源
      orgForCustomerSelection: [],
      //机构号：进入页面的时候为双击数据的机构
      //        当选择左上机构后，变更为选择后的机构
      orgNumForThisCustomer: '',
      // 进入页面默认客户号
      customerNum: '',
      // 基本信息中表单数据源
      basicInfoForm: {},
      // 额度信息中表格数据源
      limitTableData: [],
      // 额度信息中分页数据源
      limitPage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      },
      // 额度明细信息表格数据源
      limitDeaTableData: [],
      // 额度明细信息分页数据源
      limitDeaPage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      },
      // 合同信息表格数据源
      contractTableData: [],
      // 合同信息分页数据源
      contractPage: {
        pagenum: 1,
        pagesize: 5,
        total: 20
      },
      // 借据信息表格数据源
      borrowTableData: [],
      // 借据信息分页数据
      borrowPage: {
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
      steps: ['基本信息', '额度信息', '额度明细信息', '合同信息', '借据信息', '占用恢复信息', '对外担保信息']
    }
  },
  created () {
    // console.log(this.$route.params.val, '打印传递的值')
    // this.basicInfoForm = this.$route.params.val
    // console.log(JSON.parse(sessionStorage.getItem("corporateMsgVal"), "上个页面来的"))
    this.basicInfoForm = JSON.parse(sessionStorage.getItem("corporateMsgVal"))
    this.customerNum = this.basicInfoForm.customerNum
    // console.log(this.customerNum)
    //机构号赋值
    this.orgNumForThisCustomer = this.basicInfoForm.orgNum
    // 下拉框获取当前客户授信机构
    this.getCrdOrgByCustCommon()
    // ========== 表单、表格填入数据 ==========
    this.getCorporateListCommon()
    this.findCrdDetailFromCrdMainNumCommon()
    this.getContractListCommon()
    this.getSummaryListFromCusNumCommon()
    this.getApplySerialPageCommon()
    this.getListGrtPageCommon()

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
    getListCommon () {
      getList('1', '1', '', '', this.orgNumForThisCustomer, this.customerNum, '', '', '2').then(res => {
        if (res.data.data.records[0] == undefined) {
          this.basicInfoForm = {};
        } else {
          this.basicInfoForm = res.data.data.records[0];
        }

      });
    },
    // 点击合同号打开合同详情页签
    handleToContract (row) {
      console.log(row, '点击合同号打开合同详情页签')
      this.$router.push({ name: 'contractDetail', params: { val: row } })
      sessionStorage.setItem('contractVal', JSON.stringify(row))
    },
    // 点击借据编号打开借据详情页
    handleToSummary (row) {
      console.log(row, '点击借据编号打开借据详情页')
      this.$router.push({ name: 'summaryDetail', params: { val: row } })
      sessionStorage.setItem('summaryVal', JSON.stringify(row))
    },
    // 点击额度编号时触发的函数
    handleToDetail (row) {
      console.log(row, '额度编号点击')
      this.crdMainNum = row.crdMainNum
      this.findCrdDetailFromCrdMainNumCommon()
    },
    // 额度信息
    getCorporateListCommon () {
      getCorporateList(
        this.limitPage.pagenum,
        this.limitPage.pagesize,
        this.customerNum,
        // 'C002',
        this.orgNumForThisCustomer
        // '01000'
      ).then(res => {
        console.log(res, '额度信息')
        this.limitTableData = res.data.data.records
        this.limitPage.total = res.data.data.total
      })
    },
    // 额度明细信息
    findCrdDetailFromCrdMainNumCommon () {
      findCrdDetailFromCrdMainNum(
        this.limitDeaPage.pagenum,
        this.limitDeaPage.pagesize,
        this.customerNum,
        // 'C002',
        this.orgNumForThisCustomer,
        // '01000',
        this.crdMainNum
      ).then(res => {
        console.log(res, '额度明细信息')
        this.limitDeaTableData = res.data.data.records
        this.limitDeaPage.total = res.data.data.total
      })
    },
    // 合同信息
    getContractListCommon () {
      getContractList(
        this.contractPage.pagenum,
        this.contractPage.pagesize,
        this.customerNum,
        // 'C002',
        this.orgNumForThisCustomer
        // '01000'
      ).then(res => {
        console.log(res, '合同信息')
        this.contractTableData = res.data.data.records
        this.contractPage.total = res.data.data.total
      })
    },
    // 借据信息
    getSummaryListFromCusNumCommon () {
      getSummaryListFromCusNum(
        this.borrowPage.pagenum,
        this.borrowPage.pagesize,
        this.customerNum,
        // 'C002',
        this.orgNumForThisCustomer
        // '01000'
      ).then(res => {
        console.log(res, '借据信息')
        this.borrowTableData = res.data.data.records
        this.borrowPage.total = res.data.data.total
      })
    },
    // 占用恢复信息
    getApplySerialPageCommon () {
      getApplySerialPage(
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
    // 对外担保信息
    getListGrtPageCommon () {
      getListGrtPage(
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
    orgNumChange (val) {
      this.orgNumForThisCustomer = val
      this.crdMainNum = ''
      this.getListCommon()
      this.getCorporateListCommon()
      this.findCrdDetailFromCrdMainNumCommon()
      this.getContractListCommon()
      this.getSummaryListFromCusNumCommon()
      this.getApplySerialPageCommon()
      this.getListGrtPageCommon()
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
    //   // 经办机构
    //   dictTranslate('org').then(res => {
    //     this.orgNumDict = res.data.data
    //     this.basicInfoForm.orgNum = this.orgNumDict[this.basicInfoForm.orgNum]
    //   })
    //   // 币种字典
    //   dictTranslate('CD000019').then(res => {
    //     this.currencyCdDict = res.data.data
    //   })
    //   // 合同状态
    //   dictTranslate('CD000094').then(res => {
    //     this.contractStatusDict = res.data.data
    //   })
    //   // 借据状态
    //   dictTranslate('CD000175').then(res => {
    //     this.summaryStatusDict = res.data.data
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

    // 监听 额度信息 中分页 每页条数 改变的事件
    handleSizeChange1 (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.limitPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getCorporateListCommon()
    },
    // 监听 额度信息 中分页 页码值 改变的事件
    handleCurrentChange1 (newPage) {
      console.log(`当前页: ${newPage}`)
      this.limitPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getCorporateListCommon()
    },
    // 监听 额度明细信息 中分页 每页条数 改变的事件
    handleSizeChange2 (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.limitDeaPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.findCrdDetailFromCrdMainNumCommon()
    },
    // 监听 额度明细信息 中分页 页码值 改变的事件
    handleCurrentChange2 (newPage) {
      console.log(`当前页: ${newPage}`)
      this.limitDeaPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.findCrdDetailFromCrdMainNumCommon()
    },

    // 监听 合同信息 中分页 每页条数 改变的事件
    handleSizeChange6 (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.contractPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getContractListCommon()
    },
    // 监听 合同信息 中分页 页码值 改变的事件
    handleCurrentChange6 (newPage) {
      console.log(`当前页: ${newPage}`)
      this.contractPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getContractListCommon()
    },
    // 监听 借据信息 中分页 每页条数 改变的事件
    handleSizeChange3 (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.borrowPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getSummaryListFromCusNumCommon()
    },
    // 监听 借据信息 中分页 页码值 改变的事件
    handleCurrentChange3 (newPage) {
      console.log(`当前页: ${newPage}`)
      this.borrowPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getSummaryListFromCusNumCommon()
    },
    // 监听 占用恢复信息 中分页 每页条数 改变的事件
    handleSizeChange4 (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.recoverPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getApplySerialPageCommon()
    },
    // 监听 占用恢复信息 中分页 页码值 改变的事件
    handleCurrentChange4 (newPage) {
      console.log(`当前页: ${newPage}`)
      this.recoverPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getApplySerialPageCommon()
    },
    // 监听 对外担保信息 中分页 每页条数 改变的事件
    handleSizeChange5 (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.assurePage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getListGrtPageCommon()
    },
    // 监听 对外担保信息 中分页 页码值 改变的事件
    handleCurrentChange5 (newPage) {
      console.log(`当前页: ${newPage}`)
      this.assurePage.pagenum = newPage
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
                  /deep/ .crdMainNum {
                    text-decoration: underline;
                    color: #00a252 !important;
                    cursor: pointer;
                  }
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

