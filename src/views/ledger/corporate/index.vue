<!-- 额度台账---公司客户页面 -->
<template>
  <div class="container">
    <!-- 搜索区 -->
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="ruleForm" :model="ruleForm" label-width="80px" class="ruleForm" size="small">
          <!-- 客户名称 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="客户名称">
              <el-input v-model="ruleForm.customerName" clearable />
            </el-form-item>
          </el-col>
          <!-- 客户编号 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="客户编号">
              <el-input v-model="ruleForm.customerNum" clearable @keyup.native="inputChange($event)" @keydown.native="inputChange($event)" />
            </el-form-item>
          </el-col>
          <!-- 证件号码 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="证件号码">
              <el-input v-model="ruleForm.certNum" clearable @keyup.native="inputChange($event)" @keydown.native="inputChange($event)" />
            </el-form-item>
          </el-col>
          <!-- 主办机构 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="主办机构">
              <el-input v-model="ruleForm.orgNum" clearable :disabled="true">
                <el-button slot="append" icon="el-icon-search" @click="chooseDept" :disabled="false"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 按钮 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchInfo">搜索</el-button>
              <exportExcel :headerArr="header" :excelContent="content" :excelTableData="alltableData" :excelTitle="title"
                @getExcelDatas="getExcelDatas"></exportExcel>
              <el-button icon="el-icon-refresh-right" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <!-- 表格区 -->
    <div class="table">
      <!-- 表格详情区 -->
      <el-table :data="tableData" style="width: 100%" size="small" border stripe height="450" v-loading="loading">
        <el-table-column type="index" label="序号" align="center" width="50" fixed :resizable="false" />
        <el-table-column prop="orgNumName" label="主办机构" :resizable="false" align="center" width="130">
        </el-table-column>
        <el-table-column prop="customerNum" label="客户编号" :resizable="false" align="center" width="90" />
        <el-table-column prop="customerName" label="客户名称" :resizable="false" align="center" width="210">
          <template slot-scope="scope">
            <p type="text" size="small" class="customerName" @click="customerInfo(scope.row)" style="color:#00a252;text-decoration: underline;cursor: pointer;">{{scope.row.customerName}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="certTypeName" label="证件类型" :resizable="false" align="center" width="150">
        </el-table-column>
        <el-table-column prop="certNum" label="证件号码" :resizable="false" align="center" width="160" />
        <el-table-column prop="currencyCdName" label="币种" :resizable="false" align="center">
        </el-table-column>
        <el-table-column prop="limitCredit" label="总授信额度" :resizable="false" align="center" width="110">
          <template slot-scope="scope">{{ scope.row.limitCredit | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="limitUsed" label="总额度已用" :resizable="false" align="center" width="110">
          <template slot-scope="scope">{{ scope.row.limitUsed | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="limitAvi" label="总额度可用" :resizable="false" align="center" width="110">
          <template slot-scope="scope">{{ scope.row.limitAvi | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expCredit" label="总授信敞口" :resizable="false" align="center" width="110">
          <template slot-scope="scope">{{ scope.row.expCredit | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expUsed" label="总敞口已用" :resizable="false" align="center" width="110">
          <template slot-scope="scope">{{ scope.row.expUsed | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expAvi" label="总敞口可用" :resizable="false" align="center" width="110">
          <template slot-scope="scope">{{ scope.row.expAvi | NumsFormat }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-button class="textBtn" type="text" size="small" icon="el-icon-view" @click="toMsg(scope.row)">查看
            </el-button>
            <el-button class="textBtn" type="text" size="small" icon="el-icon-picture-outline" @click="to360view(scope.row)">360视图</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 隐藏的表格，用户数据导出之用 -->
      <el-table :data="alltableData" style="width: 100%" size="small" border stripe max-height="400" v-if="flag=false">
        <el-table-column type="index" label="序号" align="center" width="50" fixed :resizable="false" />
        <el-table-column prop="orgNumName" label="主办机构" :resizable="false" align="center" width="180" />>
        <el-table-column prop="customerNum" label="客户编号" :resizable="false" align="center" width="130" />
        <el-table-column prop="customerName" label="客户名称" :resizable="false" align="center" width="180" />
        <el-table-column prop="certTypeName" label="证件类型" :resizable="false" align="center" width="180" />
        <el-table-column prop="certNum" label="证件号码" width="200" :resizable="false" align="center" />
        <el-table-column prop="currencyCdName" label="币种" :resizable="false" align="center" width="180" />
        <el-table-column prop="limitCredit" label="总授信额度" :resizable="false" align="center">
          <template slot-scope="scope">{{ scope.row.limitCredit | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="limitUsed" label="总额度已用" :resizable="false" align="center">
          <template slot-scope="scope">{{ scope.row.limitUsed | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="limitAvi" label="总额度可用" :resizable="false" align="center">
          <template slot-scope="scope">{{ scope.row.limitAvi | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expCredit" label="总授信敞口" :resizable="false" align="center">
          <template slot-scope="scope">{{ scope.row.expCredit | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expUsed" label="总敞口已用" :resizable="false" align="center">
          <template slot-scope="scope">{{ scope.row.expUsed | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="expAvi" label="总敞口可用" :resizable="false" align="center">
          <template slot-scope="scope">{{ scope.row.expAvi | NumsFormat }}</template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页区 -->
    <div class="pageination">
      <el-pagination :total="total" :current-page="pageInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 机构选择dialog框 -->
    <el-dialog class="deptDialog" title="请选择机构" :visible.sync="deptDialogVisible" width="55%" height="430" @closed="closeDialogDept"
      :lock-scroll="false">
      <!-- 查询条件 -->
      <div class="searchOrg">
        <el-form :model="deptForm" ref="deptForm" label-width="100px">
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            <el-form-item label="机构名称" prop="deptName">
              <el-input v-model="deptForm.deptName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item class="btns">
              <el-button icon="el-icon-search" type="primary" @click="querDeptyMsg" size="small">搜索</el-button>
              <el-button icon="el-icon-refresh-right" @click="clearDeptMsg('deptForm')" size="small">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <!-- 详细表格信息 -->
      <div class="table">
        <el-table :data="deptMsg" style="width: 100%" height="400">
          <el-table-column prop="id" label="机构号"></el-table-column>
          <el-table-column prop="deptName" label="机构名称"></el-table-column>
          <el-table-column prop="parentId" label="上级机构">
            <template slot-scope="scope">{{ orgNumDict[scope.row.parentId] }}</template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="makeDeptSure(scope.row)" type="text" size="small">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页功能区 -->
      <!-- <div class="pageination"> -->
      <el-pagination class="pageination" @size-change="deptSizeChange" @current-change="deptCurrentChange"
        :current-page="deptPageInfo.pageNum" :page-sizes="[10]" :page-size="deptPageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="deptTotal" style="float:right"></el-pagination>
      <!-- </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { dictTranslate } from '@/api/system/dict'
import { getDeptList } from '@/api/system/dept'
import { getList } from '@/api/rcd/standBook/corporate'
import { getInfo } from '@/api/user'
import exportExcel from '@/components/ExportExcel/exportExcel'
export default {
  data () {
    return {
      //列表加载属性
      loading: false,
      // 机构dialog框中，详细信息表格中的数据源
      deptMsg: [],
      // 机构选择器搜索条件form
      deptForm: {
        deptName: '',
        fullName: '',
        orgType: ''
      },
      // 机构dialog框
      deptDialogVisible: false,
      // 机构dialog中的分页信息
      deptPageInfo: { pageNum: 1, pageSize: 10 },
      // 机构dialog中数据总条数
      deptTotal: 0,
      // 机构号
      deptId: '',
      // 客户经理编号
      managerNum: '',
      // 主办机构字典
      orgNumDict: [],
      // 表单数据源
      ruleForm: {
        customerName: '',
        customerNum: '',
        orgNum: '',
        certNum: ''
      },
      // =====导出功能需要传递的数据=====
      header: [
        '主办机构',
        '客户编号',
        '客户名称',
        '证件类型',
        '证件号码',
        '币种',
        '总授信额度',
        '总额度已用',
        '总额度可用',
        '总授信敞口',
        '总敞口已用',
        '总敞口可用'
      ], // 表头中文名称
      content: [
        'orgNumName',
        'customerNum',
        'customerName',
        'certTypeName',
        'certNum',
        'currencyCdName',
        'limitCredit',
        'limitUsed',
        'limitAvi',
        'expCredit',
        'expUsed',
        'expAvi'
      ], // 表头字段
      title: '公司客户额度台账表', // 导出的excel名称
      // =====表格区数据=====
      tableData: [],
      alltableData: [], //隐藏表格
      // 分页数据
      pageInfo: {
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
    }
  },
  created () {
    // this.getInfoCommon()
    this.ruleForm = JSON.parse(sessionStorage.getItem("corporateFormData")) || {}
  },
  methods: {
    // 点击搜索按钮触发该事件
    searchInfo () {
      if (this.ruleForm.customerName == undefined && this.ruleForm.customerNum == undefined && this.ruleForm.certNum == undefined && this.ruleForm.orgNum == undefined) {
        this.getInfoCommon()
      } else {
        sessionStorage.setItem('corporateFormData', JSON.stringify(this.ruleForm))
        this.getTableData()
      }
    },
    // 获取table表格数据
    getTableData () {
      this.loading = true
      getList(
        this.pageInfo.pagenum,
        this.pageInfo.pagesize,
        this.managerNum,
        this.ruleForm.customerName,
        this.deptId,
        this.ruleForm.customerNum,
        this.ruleForm.certNum,
        this.ruleForm.certType,
        '2' //客户种类：1 个人
        //         2 对公
        //         3 同业
      ).then(res => {
        this.total = res.data.data.total
        this.tableData = res.data.data.records
      })
        .finally(() => {
          this.loading = false
        })
    },
    //隐藏表格数据填充
    getExcelDatas () {
      getList(
        '1', // this.pageInfo.pagenum,
        '-1', // this.pageInfo.pagesize,
        this.managerNum,
        this.ruleForm.customerName,
        this.deptId,
        this.ruleForm.customerNum,
        this.ruleForm.certNum,
        this.ruleForm.certType,
        '2' //客户种类：1 个人
        //         2 对公
        //         3 同业
      ).then(res => {
        this.alltableData = res.data.data.records
        console.log(this.alltableData,'导出数据');
      })
    },
    // 点击搜索区的清空按钮，触发该函数，清空表单内容
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.managerNum = ''
      this.pageInfo.pagesize = 10
      this.pageInfo.pagenum = 1
      sessionStorage.clear()
      this.ruleForm = {}
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      this.pageInfo.pagesize = newSize
      this.getTableData()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      this.pageInfo.pagenum = newPage
      this.getTableData()
    },
    // 点击表格内客户信息按钮，触发该函数
    customerInfo (val) {
      this.$router.push({ name: 'corporateInfo', params: { val: val } })
      sessionStorage.setItem('corporateInfoVal', JSON.stringify(val))
    },
    // 点击360视图按钮，触发该函数
    to360view (val) {
      this.$router.push({ name: 'corporateView', params: { val: val } })
      sessionStorage.setItem('corporateVal', JSON.stringify(val))
    },
    // 双击表格中某一行，跳转到详情页
    toMsg (val) {
      this.$router.push({ name: 'corporateMsg', params: { val: val } })
      sessionStorage.setItem('corporateMsgVal', JSON.stringify(val))
    },
    // 获取当前登录用户相关信息
    getInfoCommon () {
      getInfo().then(res => {
        this.deptId = res.data.data.deptId
        this.ruleForm.orgNum = res.data.data.deptName
        this.getTableData()
      })
    },
    // =============以下方法函数为机构选择相关的内容=============
    // 点击确定按钮，确认选择机构名称
    // 翻译上级机构
    parentTrans () {
      dictTranslate('org').then(res => {
        this.orgNumDict = res.data.data
      })
    },
    // 获取机构列表
    getDeptListCommon () {
      getDeptList(
        this.deptPageInfo.pageNum,
        this.deptPageInfo.pageSize,
        this.deptForm
      ).then(res => {
        this.deptMsg = res.data.data.records
        this.deptTotal = res.data.data.total
      })
    },
    makeDeptSure (row) {
      this.ruleForm.orgNum = row.deptName
      this.deptId = row.id
      this.deptDialogVisible = false
    },
    // 点击重置按钮，清空input中的内容(机构)
    clearDeptMsg () {
      this.$refs['deptForm'].resetFields()
      this.getDeptListCommon()
    },
    // 机构dialog框关闭后
    closeDialogDept () {
      this.deptForm.deptName = ''
    },
    // 点击查询按钮，触发该函数，根据input中的值显示对应的信息(机构)
    querDeptyMsg () {
      this.getDeptListCommon()
    },
    // 点击搜索框右侧放大镜选择机构，触发该函数
    chooseDept () {
      this.deptPageInfo.pageNum = 1
      this.deptPageInfo.pagesize = 10
      this.getDeptListCommon()
      this.parentTrans()
      this.deptDialogVisible = true
    },
    // ====选择机构dialog中的分页功能====
    // 监听 pagesize 改变的事件
    deptSizeChange (val) {
      this.deptPageInfo.pageSize = val
      this.getDeptListCommon()
    },
    // 监听 页码值 改变的事件
    deptCurrentChange (val) {
      this.deptPageInfo.pageNum = val
      this.getDeptListCommon()
    },
    // 输入框验证，不能输入汉字
    inputChange (e) {
      const o = e.target
      o.value = o.value.replace(/[^\w\.\/]/gi, '') // 清除除了中文以外的输入的字符
      this.name = o.value
    }
  },
  components: {
    exportExcel
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/ledger.scss';
</style>

