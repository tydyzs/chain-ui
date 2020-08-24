<!-- 额度台账---个人客户额度详情 -->
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
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false" width="110">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="crdDetailNum" label="额度编号" align="center" :resizable="false" width="180"></el-table-column>
        <el-table-column prop="crdProductName" label="额度产品" align="center" :resizable="false" width="180">
          <!-- <template slot-scope="scope">{{ crdProductTypeDict[scope.row.crdProductType] }}</template> -->
        </el-table-column>
        <el-table-column prop="productName" label="业务品种" align="center" :resizable="false" width="120"></el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false" width="120">
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
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="limitDeaPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="limitDeaPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="limitDeaPage.total"></el-pagination>
    </el-card>

    <!-- 业务产品信息 -->
    <el-card class="con">
      <span>业务产品信息</span>
      <!-- 表格详情 -->
      <el-table :data="productDeaTableData" style="width: 100%" size="small" border stripe>
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false" width="110">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="productName" label="业务品种" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="busiDealNum" label="业务编号" align="center" :resizable="false">
          <template slot-scope="scope">
            <p type="text" size="small" class="busiDealNum" @click="handleToContract(scope.row)" style="color:#00a252;text-decoration: underline;cursor: pointer;">{{scope.row.busiDealNum}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="certInterestPeriod" label="计息期限" align="center" :resizable="false" width="80"></el-table-column>
        <el-table-column prop="certInterestRate" label="计息利率" align="center" :resizable="false" width="80"></el-table-column>
        <el-table-column prop="certCurrencyCdName" label="币种" align="center" width="120" :resizable="false">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.certCurrencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="certSeqAmt" label="凭证金额" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="certApplyAmt" label="占用金额" align="center" :resizable="false"></el-table-column>
        <el-table-column prop="certStatusName" label="凭证状态" align="center" :resizable="false" width="80">
          <!-- <template slot-scope="scope">{{ certStatusDict[scope.row.certStatus] }}</template> -->
        </el-table-column>
        <el-table-column prop="certBeginDate" label="开始日期" align="center" :resizable="false" width="90"></el-table-column>
        <el-table-column prop="certEndDate" label="到期日期" align="center" :resizable="false" width="90"></el-table-column>
        <el-table-column prop="certBusiRemark" label="备注" align="center" :resizable="false" width="80"></el-table-column>
        <el-table-column prop="userNumName" label="经办人" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ userNumDict[scope.row.userNum] }}</template> -->
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange3" @current-change="handleCurrentChange3" :current-page="productPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="productPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="productPage.total"></el-pagination>
    </el-card>

    <!-- 占用恢复信息 -->
    <el-card class="con">
      <span>占用恢复信息</span>
      <!-- 表格详情 -->
      <el-table :data="recoverTableData" style="width: 100%" size="small" border stripe>
        <el-table-column prop="orgNumName" label="经办机构" align="center" :resizable="false" width="110">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="crdDetailNum" label="额度明细编号" align="center" :resizable="false" width="180"></el-table-column>
        <el-table-column prop="busiDealNum" label="业务编号" align="center" :resizable="false" width="140">
          <template slot-scope="scope">
            <p type="text" size="small" class="certNum" @click="handleToContract_3(scope.row)" style="color:#00a252;text-decoration: underline;cursor: pointer;">{{scope.row.busiDealNum}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="crdProductName" label="额度品种" align="center" :resizable="false" width="120"></el-table-column>
        <!-- <el-table-column prop="productName" label="业务品种" align="center" :resizable="false" width="90"></el-table-column> -->
        <el-table-column prop="tranTypeCdName" label="交易类型" align="center" :resizable="false" width="100">
          <!-- <template slot-scope="scope">{{ tranTypeCdApplyDict[scope.row.tranTypeCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="isMixName" label="是否串用" align="center" :resizable="false" width="100">
          <!-- <template slot-scope="scope">{{ isMixDict[scope.row.isMix] }}</template> -->
        </el-table-column>
        <el-table-column prop="mixCredit" label="串用额度" align="center" :resizable="false" width="100"></el-table-column>
        <el-table-column prop="currencyCdName" label="币种" align="center" :resizable="false" width="120">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="limitCreditAmt" label="金额" align="center" :resizable="false">
          <template slot-scope="scope">{{ scope.row.limitCreditAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="tranDate" label="交易日期" align="center" :resizable="false" width="90"></el-table-column>
        <el-table-column prop="tranSystem" label="占用/恢复系统" align="center" :resizable="false" width="110"></el-table-column>
        <el-table-column prop="userNumName" label="经办人" align="center" :resizable="false" width="70">
          <!-- <template slot-scope="scope">{{ userNumDict[scope.row.userNum] }}</template> -->
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange4" @current-change="handleCurrentChange4" :current-page="recoverPage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="recoverPage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="recoverPage.total"></el-pagination>
    </el-card>

    <!-- 额度授信情况 -->
    <el-card class="con">
      <span>额度授信情况</span>
      <!-- 表格详情 -->
      <el-table :data="limitCreTableData" style="width: 100%" size="small" border stripe>
        <el-table-column prop="tranDate" label="交易日期" align="center" :resizable="false" width="120"></el-table-column>
        <el-table-column prop="busiDealNum" label="业务编号" align="center" :resizable="false" width="120">
          <template slot-scope="scope">
            <p type="text" size="small" class="certNum" @click="handleToContract_2(scope.row)" style="color:#00a252;text-decoration: underline;cursor: pointer;">{{scope.row.busiDealNum}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="tranTypeCdName" label="交易类型" align="center" :resizable="false" width="110">
          <!-- <template slot-scope="scope">{{ tranTypeCdSerialDict[scope.row.tranTypeCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="crdGrantOrgNumName" label="授信机构" align="center" :resizable="false" width="140">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.crdGrantOrgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="crdProductName" label="额度产品" align="center" :resizable="false" width="120"></el-table-column>
        <el-table-column prop="crdCurrencyCdName" label="币种" align="center" :resizable="false" width="120">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.crdCurrencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="crdDetailAmt" label="授信额度" align="center" :resizable="false" width="120">
          <template slot-scope="scope">{{ scope.row.crdDetailAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="crdEarkAmt" label="圈存额度" align="center" :resizable="false" width="120">
          <template slot-scope="scope">{{ scope.row.crdEarkAmt | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="crdBeginDate" label="额度起期" align="center" :resizable="false" width="110"></el-table-column>
        <el-table-column prop="crdEndDate" label="额度止期" align="center" :resizable="false" width="110"></el-table-column>
        <el-table-column prop="crdStatusName" label="额度状态" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ tranCrdStatusDict[scope.row.crdStatus] }}</template> -->
        </el-table-column>
        <el-table-column prop="crdAdmitFlagName" label="客户准入" align="center" :resizable="false">
          <!-- <template slot-scope="scope">{{ tranCrdAdmitFlagDict[scope.row.crdAdmitFlag] }}</template> -->
        </el-table-column>
      </el-table>
      <!-- 分页部分 -->
      <el-pagination @size-change="handleSizeChange5" @current-change="handleCurrentChange5" :current-page="limitCrePage.pagenum"
        :page-sizes="[3, 5, 10, 20]" :page-size="limitCrePage.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="limitCrePage.total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { dictTranslate } from '@/api/system/dict'
import { getCrdOrgByCust } from '@/api/rcd/standBook/corporate'
import {
  quotaList,
  findCrdDetailFromCrdMainNum,
  businessProduct,
  occupancyRecovery,
  quotaCredit,
  getList
} from '@/api/rcd/standBook/same'
import { nav } from "@/utils/navigation.js"
export default {
  data () {
    return {
      active: 0,
      // 字典翻译数据承载对象
      // userNumDict: [],//经办人
      // orgNumDict: [], //经办机构
      // currencyCdDict: [], //币种
      // crdProductTypeDict: [], //额度类型
      // isCycleDict: [], //是否可循环
      // certStatusDict: [],//业务产品信息中的凭证状态（CD000201）
      // tranTypeCdSerialDict: [],//额度授信交易类型
      // tranCrdStatusDict: [],//额度状态
      // tranCrdAdmitFlagDict: [],//客户准入
      // tranTypeCdApplyDict: [], // 占用恢复信息中的交易类型
      // isMixDict: [],//占用恢复信息中的是否串用(CD000161)
      //二级额度编号crdMainNum
      crdMainNum: '',
      //机构下拉框
      orgForCustomer: '', //数据源
      orgForCustomerSelection: [],
      //机构号：进入页面的时候为双击数据的机构
      //当选择左上机构后，变更为选择后的机构
      orgNumForThisCustomer: '',
      // 进入页面默认客户号
      customerNum: '',
      // 基本信息中表单数据源
      basicInfoForm: {},
      // 额度信息 中表格数据源
      limitTableData: [],
      // 额度信息 中分页数据源
      limitPage: {
        pagenum: 1,
        pagesize: 5,
        total: 0
      },
      // 额度明细信息 表格数据源
      limitDeaTableData: [],
      // 额度明细信息 分页数据源
      limitDeaPage: {
        pagenum: 1,
        pagesize: 5,
        total: 0
      },
      // 业务产品信息 表格数据源
      productDeaTableData: [],
      // 业务产品信息 分页数据
      productPage: {
        pagenum: 1,
        pagesize: 5,
        total: 0
      },
      // 占用恢复信息 表格数据源
      recoverTableData: [],
      // 占用恢复信息 分页数据
      recoverPage: {
        pagenum: 1,
        pagesize: 5,
        total: 0
      },
      // 额度授信情况 表格数据源
      limitCreTableData: [],
      // 额度授信情况 分页数据
      limitCrePage: {
        pagenum: 1,
        pagesize: 5,
        total: 0
      },
      steps: ['基本信息', '额度信息', '额度明细信息', '业务产品信息', '占用恢复信息', '额度授信情况']
    }
  },
  created () {
    // console.log(this.$route.params.val, '打印传递的值')
    // this.basicInfoForm = this.$route.params.val
    console.log(JSON.parse(sessionStorage.getItem("sameMsgVal"), "上个页面来的"))
    this.basicInfoForm = JSON.parse(sessionStorage.getItem("sameMsgVal"))
    // this.customerNum = this.basicInfoForm.customerNum
    this.customerNum = JSON.parse(sessionStorage.getItem("sameMsgVal")).customerNum
    console.log(this.customerNum)
    //机构号赋值
    this.orgNumForThisCustomer = JSON.parse(sessionStorage.getItem("sameMsgVal")).orgNum
    // 下拉框获取当前客户授信机构
    this.getCrdOrgByCustCommon();
    // ========== 表单、表格填入数据 ==========
    this.getQuotaList();
    this.findCrdDetailFromCrdMainNumCommon();
    this.getBusinessProudct();
    this.getOccupancyRecovery();
    this.getQuotaCredit();
    // 字典翻译
    // this.dictTranslateCommon();
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
    // 点击额度编号时触发的函数
    handleToDetail (row) {
      console.log(row, "额度编号点击");
      this.crdMainNum = row.crdMainNum;
      this.findCrdDetailFromCrdMainNumCommon();
    },
    //点击凭证编号跳转同业产品详情
    handleToContract (row) {
      let val = row.busiDealNum;
      console.log(val, "点击凭证编号跳转同业产品详情");
      this.$router.push({ name: "peerDetail", params: { val: val } });
      sessionStorage.setItem('crdBusiCertInfoVal', JSON.stringify(row))
    },
    //点击业务编号跳转同业产品详情
    handleToContract_2 (row) {
      let val = row.busiDealNum;
      console.log(val, "点击业务编号跳转同业产品详情");
      this.$router.push({ name: "peerDetail", params: { val: val } });
      sessionStorage.setItem('crdBusiCertInfoVal', JSON.stringify(row))
    },
    //点击业务编号跳转同业产品详情
    handleToContract_3 (row) {
      let val = row.busiDealNum;
      console.log(val, "点击业务编号跳转同业产品详情");
      this.$router.push({ name: "peerDetail", params: { val: val } });
      sessionStorage.setItem('crdBusiCertInfoVal', JSON.stringify(row))
    },
    // 获取当前客户的授信机构
    getCrdOrgByCustCommon () {
      getCrdOrgByCust(
        // this.customerNum
        'C008'
      ).then(res => {
        this.orgForCustomerSelection = res.data.data
      })
    },
    //获取额度信息
    getQuotaList () {
      quotaList(
        this.limitPage.pagenum,
        this.limitPage.pagesize,
        this.limitInfo.customerNum,
        this.limitInfo.orgNumForThisCustomer
        // "C008",
        // "01000"
      ).then(res => {
        console.log(res, "查询额度信息");
        this.limitTableData = res.data.data.records;
        this.limitPage.total = res.data.data.total;
      });
    },
    //查询额度明细表内容
    findCrdDetailFromCrdMainNumCommon () {
      findCrdDetailFromCrdMainNum(
        this.limitDeaPage.pagenum,
        this.limitDeaPage.pagesize,
        this.limitDetail.customerNum,
        this.limitDetail.orgNumForThisCustomer,
        // "C008",
        // "01000",
        this.crdMainNum
      ).then(res => {
        console.log(res, "查询额度明细信息");
        this.limitDeaTableData = res.data.data.records
        this.limitDeaPage.total = res.data.data.total
      })
    },
    //查询业务产品信息表内容
    getBusinessProudct () {
      businessProduct(
        this.productPage.pagenum,
        this.productPage.pagesize,
        this.proInfo.customerNum,
        this.proInfo.orgNumForThisCustomer
        // "C008",
        // "01000"
      ).then(res => {
        console.log(res, "查询业务产品信息");
        this.productDeaTableData = res.data.data.records;
        this.productPage.total = res.data.data.total;
      });
    },
    //占用恢复信息
    getOccupancyRecovery () {
      occupancyRecovery(
        this.recoverPage.pagenum,
        this.recoverPage.pagesize,
        this.recover.customerNum,
        this.recover.orgNumForThisCustomer
        // "C008",
        // "01000"
      ).then(res => {
        console.log(res, "查看占用恢复信息");
        this.recoverTableData = res.data.data.records;
        this.recoverPage.total = res.data.data.total;
      });
    },

    //查询额度授信情况
    getQuotaCredit () {
      quotaCredit(
        this.limitCrePage.pagenum,
        this.limitCrePage.pagesize,
        this.limitConfer.orgNumForThisCustomer,
        this.limitConfer.customerNum
        // "C008",
        // "01000"
      ).then(res => {
        console.log(res, "查询授信额度信息");
        this.limitCreTableData = res.data.data.records;
        this.limitCrePage.total = res.data.data.total;
      });
    },
    // 字典翻译
    // dictTranslateCommon() {
    //   //证件类型
    //   dictTranslate('CD000003').then(res => {
    //     this.certTypeDict = res.data.data
    //     this.basicInfoForm.certType = this.certTypeDict[
    //       this.basicInfoForm.certType
    //     ]
    //   })
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
    //   // 额度类型
    //   dictTranslate('CD000093').then(res => {
    //     this.crdProductTypeDict = res.data.data
    //   })
    //   // 是否可循环
    //   dictTranslate('CD000162').then(res => {
    //     this.isCycleDict = res.data.data
    //   })
    //   // 合同状态
    //   dictTranslate("CD000094").then(res => {
    //     this.contractStatusDict = res.data.data;
    //   });
    //   // 额度授信交易类型
    //   dictTranslate('CD000087').then(res => {
    //     // console.log(res,'额度授信交易类型字典')
    //     this.tranTypeCdSerialDict = res.data.data
    //   })
    //   // 额度状态
    //   dictTranslate('CD000176').then(res => {
    //     // console.log(res,'额度状态字典')
    //     this.tranCrdStatusDict = res.data.data
    //   })
    //   // 客户准入
    //   dictTranslate('CD000196').then(res => {
    //     // console.log(res,'客户准入字典')
    //     this.tranCrdAdmitFlagDict = res.data.data
    //   })
    //   // 占用恢复信息中的交易类型(CD000197)
    //   dictTranslate('CD000087').then(res => {
    //     // console.log(res,'占用恢复信息中的交易类型')
    //     this.tranTypeCdApplyDict = res.data.data
    //   })
    //   //占用恢复信息中的是否串用(CD000161)
    //   dictTranslate('CD000161').then(res => {
    //     // console.log(res,'占用恢复信息中的是否串用(CD000161)')
    //     this.isMixDict = res.data.data
    //   })
    //   //凭证状态（CD000201）
    //   dictTranslate('CD000201').then(res => {
    //     // console.log(res,'凭证状态（CD000201）')
    //     this.certStatusDict = res.data.data
    //   })
    // },
    // 当机构改变的时候
    orgNumChange (val) {
      this.orgNumForThisCustomer = val
      this.crdMainNum = ''
      this.getQuotaList();
      this.findCrdDetailFromCrdMainNumCommon();
      this.getBusinessProudct();
      this.getOccupancyRecovery();
      this.getQuotaCredit();
    },
    // 监听 额度信息 中分页 每页条数 改变的事件
    handleSizeChange1 (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.limitPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getQuotaList()
    },
    // 监听 额度信息 中分页 页码值 改变的事件
    handleCurrentChange1 (newPage) {
      console.log(`当前页: ${newPage}`)
      this.limitPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getQuotaList()
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
    // 监听 业务产品信息 中分页 每页条数 改变的事件
    handleSizeChange3 (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.productPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getBusinessProudct()
    },
    // 监听 业务产品信息 中分页 页码值 改变的事件
    handleCurrentChange3 (newPage) {
      console.log(`当前页: ${newPage}`)
      this.productPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getBusinessProudct()
    },
    // 监听 占用情况 中分页 每页条数 改变的事件
    handleSizeChange4 (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.recoverPage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getOccupancyRecovery()
    },
    // 监听 占用情况 中分页 页码值 改变的事件
    handleCurrentChange4 (newPage) {
      console.log(`当前页: ${newPage}`)
      this.recoverPage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getOccupancyRecovery()
    },
    // 监听 额度授信情况 中分页 每页条数 改变的事件
    handleSizeChange5 (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.limitCrePage.pagesize = newSize
      // 调用方法，重新获取列表数据
      this.getQuotaCredit()
    },
    // 监听 额度授信情况 中分页 页码值 改变的事件
    handleCurrentChange5 (newPage) {
      console.log(`当前页: ${newPage}`)
      this.limitCrePage.pagenum = newPage
      // 调用方法，重新获取列表数据
      this.getQuotaCredit()
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
}
.hideSidebar .fixed-header {
  width: calc(100% - 64px);
}
</style>



