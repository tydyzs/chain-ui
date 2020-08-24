<!-- 额度台账---集团客户页面 -->
<template>
  <div class="container">
    <!-- 搜索区 -->
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="ruleForm" :model="ruleForm" label-width="80px" class="ruleForm" size="small">
          <!-- 主办机构 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="主办机构" prop="orgNum">
              <!-- 搜索框 -->
              <el-input v-model="ruleForm.orgNum" clearable :disabled="true">
                <el-button slot="append" icon="el-icon-search" @click="chooseDept" :disabled="false"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <!-- 集团客户名称 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="ruleForm.customerName" clearable />
            </el-form-item>
          </el-col>
          <!-- 集团客户编号 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="客户编号" prop="memberCustomerNum">
              <el-input v-model="ruleForm.memberCustomerNum" clearable @keyup.native="inputChange($event)"
                @keydown.native="inputChange($event)" />
            </el-form-item>
          </el-col>
          <!-- 操作按钮 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchInfo">搜索</el-button>
              <exportExcel :headerArr="header" :excelContent="content" :excelTableData="alltableData" :excelTitle="title" @getExcelDatas="getExcelDatas"></exportExcel>
              <el-button icon="el-icon-refresh-right" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <!-- 表格区 -->
    <div class="table">
      <!-- 上层 表格详情区 -->
      <!-- 集团客户信息表格详情区 -->
      <el-table highlight-current-row @cell-click="getTemplateRow" :data="groupListTableData" style="width: 100%" size="small"
        border stripe height="440" v-loading="loading">
        <el-table-column label="选择" fixed width="50">
          <template slot-scope="scope">
            <el-radio :label="scope.row.memberCustomerNum" v-model="templateRadioVal" style="margin-left:8px">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <!-- <el-table-column class="tabLeft" fixed type="selection" :resizable="false" align="center" width="50" /></el-table-column> -->
        <el-table-column prop="orgNumName" label="主办机构" :resizable="false" align="center" width="150">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="customerName" label="集团客户名称" :resizable="false" align="center" width="150" />
        <el-table-column prop="memberCustomerNum" label="集团客户编号" width="150" :resizable="false" align="center" />
        <el-table-column prop="limitCreditTotal" label="总授信额度" :resizable="false" align="center" width="150" />
        <el-table-column prop="limitUsedTotal" label="总额度已用" width="150" :resizable="false" align="center" />
        <el-table-column prop="limitAviTotal" label="总额度可用" :resizable="false" align="center" width="150" />
        <el-table-column prop="expCreditTotal" label="总授信敞口" :resizable="false" align="center" width="150" />
        <el-table-column prop="expUsedTotal" label="总敞口已用" :resizable="false" align="center" width="150" />
        <el-table-column prop="expAviTotal" label="总敞口可用" :resizable="false" align="center" width="150" />
        <!-- <el-table-column prop="userNum" label="主办客户经理" :resizable="false" align="center" width="120">
          <template slot-scope="scope">{{ dicUserNum[scope.row.userNum] }}</template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="150" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-button class="textBtn" type="text" size="small" icon="el-icon-view" @click="toGroupView(scope.row)">360视图</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 隐藏的表格，用户数据导出之用 -->
      <el-table :data="alltableData" style="width: 100%" size="small" border stripe max-height="400" v-if="flag=false">
        <el-table-column prop="orgNumName" label="主办机构" :resizable="false" align="center" width="130">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="customerName" label="集团客户名称" :resizable="false" align="center" width="180" />
        <el-table-column prop="memberCustomerNum" label="集团客户编号" width="120" :resizable="false" align="center" />
        <el-table-column prop="limitCreditTotal" label="总授信额度" :resizable="false" align="center" width="180" />
        <el-table-column prop="limitUsedTotal" label="总额度已用" width="200" :resizable="false" align="center" />
        <el-table-column prop="limitAviTotal" label="总额度可用" :resizable="false" align="center" width="180" />
        <el-table-column prop="expCreditTotal" label="总授信敞口" :resizable="false" align="center" width="180" />
        <el-table-column prop="expUsedTotal" label="总敞口已用" :resizable="false" align="center" width="110" />
        <el-table-column prop="expAviTotal" label="总敞口可用" :resizable="false" align="center" width="110" />
        <!-- <el-table-column prop="userNum" label="主办客户经理" :resizable="false" align="center" width="120">
          <template slot-scope="scope">{{ dicUserNum[scope.row.userNum] }}</template>
        </el-table-column> -->
      </el-table>
      <!--上层表格 分页区 -->
      <div class="pageination">
        <el-pagination :total="groupListTotal" :current-page="groupListPageInfo.pageNum" :page-sizes="[10, 20, 30, 40]"
          :page-size="groupListPageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1" />
      </div>
      <!-- 下层 表格详情区 -->

      <!-- 集团成员信息表格详情区 -->
      <el-table v-if='groupMemberTableIf' :data="groupMemberTableData" style="width: 100%" size="small" border stripe
        max-height="400">
        <el-table-column prop="orgNumName" label="主办机构" :resizable="false" align="center" width="130">
          <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.orgNum] }}</template> -->
        </el-table-column>
        <el-table-column prop="companyCustomerName" label="集团客户名称" :resizable="false" align="center" width="150" />
        <el-table-column prop="memberCustomerName" label="成员客户名称" width="150" :resizable="false" align="center" />
        <!-- <el-table-column prop="certType" label="成员证件类型" :resizable="false" align="center" width="180">
          <template slot-scope="scope">{{ dicCertType[scope.row.certType] }}</template>
        </el-table-column>-->
        <el-table-column prop="certNum" label="成员证件号码" width="150" :resizable="false" align="center" />
        <el-table-column prop="currencyCdName" label="币种" :resizable="false" align="center" width="110">
          <!-- <template slot-scope="scope">{{ currencyCdDict[scope.row.currencyCd] }}</template> -->
        </el-table-column>
        <el-table-column prop="limitCredit" label="授信额度" :resizable="false" align="center" width="110" />
        <el-table-column prop="limitUsed" label="已用额度" :resizable="false" align="center" width="110" />
        <el-table-column prop="limitAvi" label="可用额度" :resizable="false" align="center" width="110" />
        <el-table-column prop="expCredit" label="授信敞口" :resizable="false" align="center" width="110" />
        <el-table-column prop="expUsed" label="已用敞口" :resizable="false" align="center" width="110" />
        <el-table-column prop="expAvi" label="可用敞口" :resizable="false" align="center" width="110" />
        <!-- <el-table-column prop="userNum" label="主办客户经理" :resizable="false" align="center" width="110">
          <template slot-scope="scope">{{ dicUserNum[scope.row.userNum] }}</template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="150" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-button class="textBtn" type="text" size="small" icon="el-icon-view" @click="look(scope.row)">查看</el-button>
            <el-button class="textBtn" type="text" size="small" icon="el-icon-picture-outline" @click="toCorporateView(scope.row)" >360视图</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--下层表格 分页区 -->
      <div class="pageination" v-if='groupMemberTableIf'>
        <el-pagination :total="groupMemberTotal" :current-page="groupMemberPageInfo.pagenum" :page-sizes="[10, 20, 30, 40]"
          :page-size="groupMemberPageInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange2"
          @current-change="handleCurrentChange2" />
      </div>
    </div>
    <!-- 机构选择dialog框 -->
    <el-dialog class="deptDialog" title="请选择机构" :visible.sync="deptDialogVisible" width="55%" height="430" @closed="closeDialogDept" :lock-scroll="false">
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
import { groupList, groupMemberList } from '@/api/rcd/standBook/group'
import { dictTranslate } from '@/api/system/dict'
import { getDeptList } from '@/api/system/dept'
import { getUserInfo } from '@/api/user'
// import { debuglog } from 'util'
import exportExcel from '@/components/ExportExcel/exportExcel'
export default {
  data () {
    return {
      //列表加载属性
      loading: false,
      groupMemberTableIf: false,
      // 客户号
      memberCustomerNum: '',
      // 作为顶部查询条件的 客户经理号
      managerNum: '',
      // 默认机构号
      defaultOrgNum: '',
      // 主办机构
      orgNumDict: [],
      // 主办客户经理
      // dicUserNum: [],
      //客户经理
      ccountManager: '',
      // 证件类型数据集合
      crets: [],
      //查询全部表格数据集合
      records: [],
      //radio选中时候的数据
      templateSelection: {},
      //radio是否默认选中
      templateRadio: false,
      templateRadioVal: '',
      // =====搜索区数据=====
      // 搜索表单绑定的数据
      ruleForm: {
        orgNum: '', // 主办机构
        memberCustomerNum: '', // 客户编号
        customerName: '', // 客户名称
        currencyCd: '', // 币种
        creditLine: '', // 总授信额度
        usedCreditLine: '', // 总额度已用
        remainCreditLine: '', // 总额度可用
        creditExposure: '', // 总授信敞口
        usedExposure: '', // 总敞口已用
        remainExposure: '', // 总敞口可用
        crdCode: '', // 统一社会信用代码
        memberCustomerNum: '' //成员编号
      },
      // =====导出功能需要传递的数据=====
      header: ['主办机构', '集团客户名称', '集团客户编号', '总授信额度', '总额度已用', '总额度可用', '总授信敞口', '总敞口已用', '总敞口可用'], // 表头中文名称
      content: ['orgNumName', 'customerName', 'memberCustomerNum', 'limitCreditTotal', 'limitUsedTotal', 'limitAviTotal', 'expCreditTotal', 'expUsedTotal', 'expAviTotal'], // 表头字段
      title: '集团客户额度台账表', // 导出的excel名称
      // =====表格详情区=====
      // 集团客户信息表格的数据源
      groupListTableData: [],
      alltableData: [],//隐藏表格
      // 分页内容
      groupListPageInfo: {
        pageNum: 1,
        pageSize: 10
      },
      groupListTotal: 0,
      // 集团成员信息表格的数据源
      groupMemberTableData: [],
      // 分页内容
      groupMemberPageInfo: {
        pagenum: 1,
        pagesize: 10
      },
      groupMemberTotal: 0,
      // 控制显隐对话框的显示与隐藏
      dialogVisible: false,
      // 控制选择机构对话框的显示与隐藏
      orgNumDialogVisible: false,
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
      deptPageInfo: {
        ageNum: 1,
        pageSize: 10
      },
      // 机构dialog中数据总条数
      deptTotal: 0,
      // 机构号
      deptId: '',
    }
  },
  created () {
    this.ruleForm = JSON.parse(sessionStorage.getItem("groupFormData")) || {}
  },
  methods: {
    getInfoCommon () {
      getUserInfo().then(res => {
        this.defaultOrgNum = res.data.data.deptId
        this.ruleForm.orgNum = res.data.data.deptName
        this.getGroupList()
        this.getGroupMemberList()
      })
    },
    //获取集团客户表格信息
    getGroupList () {
      this.loading = true
      //    console.log(this.ruleForm.orgNum, '机构号22')
      groupList(
        this.groupListPageInfo.pageNum,
        this.groupListPageInfo.pageSize,
        this.defaultOrgNum,
        // this.ruleForm.orgNum,
        this.ruleForm.customerName,
        this.ruleForm.customerNum,
        this.ruleForm.userNum,
        this.managerNum
      ).then(res => {
        // console.log(res, "集团客户的表格数据");
        this.groupListTableData = res.data.data.records
        this.groupListTotal = res.data.data.total
      })
      .finally(() => {
          this.loading = false
        })
    },
    //获取集团成员表格数据
    getGroupMemberList () {
      groupMemberList(
        this.groupMemberPageInfo.pagenum,
        this.groupMemberPageInfo.pagesize,
        this.memberCustomerNum,
        this.defaultOrgNum

      ).then(res => {
        //    console.log(res, '集团成员信息')
        this.groupMemberTableData = res.data.data.records
        this.groupMemberTotal = res.data.data.total
      })
    },
    //隐藏表格数据填充
    getExcelDatas () {
      // this.groupListPageInfo.pagenum = 1
      // this.groupListPageInfo.pagesize = 999999999
      groupList(
        // this.groupListPageInfo.pageNum,
        // this.groupListPageInfo.pageSize,
        '1',
        '-1',
        this.defaultOrgNum,
        // this.ruleForm.orgNum,
        this.ruleForm.customerName,
        this.ruleForm.customerNum,
        this.ruleForm.userNum,
        this.managerNum
      ).then(res => {
        // console.log(res, "集团客户的表格数据");
        this.alltableData = res.data.data.records
        console.log(this.alltableData, '导出数据');
      })
    },
    // 点击上面主表 视图 按钮，跳转到对应的集团视图页面
    toGroupView (val) {
      this.$router.push({ name: 'groupView', params: { val: val } })
      sessionStorage.setItem('groupVal', JSON.stringify(val))
    },
    // 点击下表中的 360视图按钮，触发该函数
    toCorporateView (val) {
      this.$router.push({ name: 'corporateView', params: { val: val } })
      sessionStorage.setItem('corporateVal', JSON.stringify(val))
    },
    // select框值改变时候触发的事件
    selectChange (e) {
      // console.log(e, '测试下拉框选择方法')
    },
    // 机构选择时，用过关键字过滤结果，触发该函数
    filterNode (value, data) {
      // console.log(value,data,'66666');
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    chooseOrgNum () {
      this.orgNumDialogVisible = true
    },
    // 点击搜索区的重置按钮，触发该函数，清空表单内容
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.managerNum = ''
      sessionStorage.clear()
      this.ruleForm = {}
    },
    // 点击搜索按钮触发该事件 TODO:
    searchInfo () {
      this.getGroupList()
      //数据初始化
      this.templateRadioVal = '' //数据初始化
      this.templateSelection = {}
      this.memberCustomerNum = ''
      this.defaultOrgNum = ''
      this.groupMemberTableIf = false
      if (this.ruleForm.customerName == undefined && this.ruleForm.customerNum == undefined && this.ruleForm.certNum == undefined && this.ruleForm.orgNum == undefined) {
        this.getInfoCommon()
      } else {
        sessionStorage.setItem('groupFormData', JSON.stringify(this.ruleForm))
        this.getGroupList()
      }
    },
    // 监听 pagesize 改变的事件
    handleSizeChange1 (newSize) {
      //console.log(`每页 ${newSize} 条`)
      this.groupListPageInfo.pageSize = newSize
      this.getGroupList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange1 (newPage) {
      //console.log(`当前页: ${newPage}`)
      this.groupListPageInfo.pageNum = newPage
      this.getGroupList()
    },
    // 监听 pagesize 改变的事件
    handleSizeChange2 (newSize) {
      //console.log(`每页 ${newSize} 条`)
      this.groupMemberPageInfo.pagesize = newSize
      this.getGroupMemberList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange2 (newPage) {
      //console.log(`当前页: ${newPage}`)
      this.groupMemberPageInfo.pagenum = newPage
      this.getGroupMemberList()
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
        console.log(res, '获取机构列表')
        this.deptMsg = res.data.data.records
        this.deptTotal = res.data.data.total
      })
    },
    makeDeptSure (row) {
      console.log(row, '打印row的信息')
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
      console.log(`每页 ${val} 条`)
      this.deptPageInfo.pageSize = val
      this.getDeptListCommon()
    },
    // 监听 页码值 改变的事件
    deptCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.deptPageInfo.pageNum = val
      this.getDeptListCommon()
    },
    //信息数据表radio选择数据
    getTemplateRow (row, column, cell, event) {
      this.templateRadioVal = row.memberCustomerNum

      if (
        event.target.localName == 'label' ||
        row.memberCustomerNum == this.memberCustomerNum
      ) {
        return
      }
      this.groupMemberTableIf = true
      this.templateSelection = row
      this.memberCustomerNum = row.memberCustomerNum
      this.defaultOrgNum = row.orgNum
      this.getGroupMemberList()

    },
    //点击客户名称跳转
    handleToDetail (row) {
      this.membercustomerName = row.membercustomerName
      this.customerNum = row.customerNum
      this.$router.push({
        name: '公司客户',
        params: {
          customerNum: this.customerNum,
          membercustomerName: this.membercustomerName
        }
      })
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
.container {
  .el-table th.gutter {
    display: table-cell !important;
  }
  .el-select {
    display: block;
  }

  // 表格区样式
  .table {
    /deep/ .el-table__fixed-right .el-table__fixed-body-wrapper .cell {
      line-height: 0 !important;
    }
    // /deep/ .el-table__fixed .el-table__fixed-body-wrapper .cell {
    //   // line-height: 0 !important;
    // }

  }

  // 分页区样式
  .pageination {
    float: right;
    margin-bottom: 2vh;
  }

}
</style>
