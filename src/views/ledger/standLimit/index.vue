<!-- 额度台账--同业授信页面 -->
<template>
  <div class="limitContainer">
    <!-- 搜索区内容 -->
    <el-form ref="form" :model="form" label-width="80px" size="small">
      <el-form-item label="机构名称" prop="customerName">
        <el-input v-model="form.customerName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
         <el-button type="primary" icon="el-icon-download" @click="dowmloadExcel">导出</el-button>
        <el-button icon="el-icon-refresh-right" @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格内容 -->
    <el-table :data="tableData" style="width: 100%" size="small" border stripe height="470">
      <el-table-column prop="customerName" label="机构名称" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="beginDate" label="授信开始日" :resizable="false" align="center" width="100">
      </el-table-column>
      <el-table-column prop="endDate" label="授信截止日" :resizable="false" align="center" width="100">
      </el-table-column>
      <!-- 综合授信 -->
      <el-table-column prop="limitAvi" label="综合授信授信总额" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="limitCredit" label="综合授信已用额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="limitEarmark" label="综合授信剩余额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="limitUsed" label="综合授信已圈额度" :resizable="false" align="center">
      </el-table-column>
      <!-- 逆回购 -->
      <el-table-column prop="taLimitAvi" label="逆回购/借贷授信总额" :resizable="false" align="center" width="100">
      </el-table-column>
      <el-table-column prop="taLimitCredit" label="逆回购/借贷已用额度" :resizable="false" align="center" width="100">
      </el-table-column>
      <el-table-column prop="taLimitEarmark" label="逆回购/借贷剩余额度" :resizable="false" align="center" width="100">
      </el-table-column>
      <el-table-column prop="taLimitUsed" label="逆回购/借贷已圈额度" :resizable="false" align="center" width="100">
      </el-table-column>
      <!-- 同业存单 -->
      <el-table-column prop="tbLimitAvi" label="同业存单授信总额" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tbLimitCredit" label="同业存单已用额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tbLimitEarmark" label="同业存单剩余额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tbLimitUsed" label="同业存单已圈额度" :resizable="false" align="center">
      </el-table-column>
      <!-- 存放同业 -->
      <el-table-column prop="tcLimitAvi" label="存放同业授信总额" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tcLimitCredit" label="存放同业已用额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tcLimitEarmark" label="存放同业剩余额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tcLimitUsed" label="存放同业已圈额度" :resizable="false" align="center">
      </el-table-column>
      <!-- 债券 -->
      <el-table-column prop="tdLimitAvi" label="债券授信总额" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tdLimitCredit" label="债券已用额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tdLimitEarmark" label="债券剩余额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tdLimitUsed" label="债券已圈额度" :resizable="false" align="center">
      </el-table-column>
      <!-- 票据 -->
      <el-table-column prop="teLimitAvi" label="票据授信总额" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="teLimitCredit" label="票据已用额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="teLimitEarmark" label="票据剩余额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="teLimitUsed" label="票据已圈额度" :resizable="false" align="center">
      </el-table-column>
      <!-- 同业拆借 -->
      <el-table-column prop="tfLimitAvi" label="同业拆借授信总额" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tfLimitCredit" label="同业拆借已用额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tfLimitEarmark" label="同业拆借剩余额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tfLimitUsed" label="同业拆借已圈额度" :resizable="false" align="center">
      </el-table-column>
      <!-- 同业借款 -->
      <el-table-column prop="tgLimitAvi" label="同业借款授信总额" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tgLimitCredit" label="同业借款已用额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tgLimitEarmark" label="同业借款剩余额度" :resizable="false" align="center">
      </el-table-column>
      <el-table-column prop="tgLimitUsed" label="同业借款已圈额度" :resizable="false" align="center">
      </el-table-column>
    </el-table>
    <!-- 分页内容 -->
     <el-pagination class="pageination" :total="total" :current-page="pageInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange">
    </el-pagination>

  </div>
</template>

<script>
import { bankCreditTable, downloadBankCreditTable } from '@/api/rcd/standLimit/standLimit'
import { getInfo } from '@/api/user'
export default {
  data () {
    return {
      // 搜索区数据
      form: {
        customerName: ''
      },
      // 表格数据
      tableData: [],
      // 分页数据
      pageInfo: {
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
    }
  },
  created() {
    this.form = JSON.parse(sessionStorage.getItem("standLimitFormData")) || {}
  },
  methods: {
    // 获取当前登录用户相关信息
    getInfoCommon () {
      getInfo().then(res => {
        this.form.customerName = res.data.data.deptName
        sessionStorage.setItem('standLimitFormData', JSON.stringify(this.form))
        this.getTableDatas()
      })
    },
    // 获取表格列表数据
    getTableDatas () {
      this.getDatas(this.pageInfo.pagenum,this.pageInfo.pagesize,this.form.customerName)
    },
    // 点击查询按钮，触发该函数
    search () {
      if (this.form.customerName == undefined) {
        this.getInfoCommon()
      } else {
        sessionStorage.setItem('standLimitFormData', JSON.stringify(this.form))
        this.getTableDatas()
      }
    },
    // 点击重置按钮，触发该函数
    resetForm (formName) {
      this.$refs[formName].resetFields()
      sessionStorage.clear()
      this.form = {}
    },
    // 公共方法，获取列表数据
    getDatas(a,b,c) {
      bankCreditTable(a,b,c).then(res => {
        console.log(res,'测试接口');
        if (res.status != 200) {
          return this.$message.error('获取表格数据失败，请重试')
        }
        this.tableData = res.data.data.records
        this.total = res.data.data.total
      })
    },
    // 点击导出按钮，触发该函数
    dowmloadExcel() {
      // downloadBankCreditTable(this.form.customerName).then(res => {
      //   console.log(res,'测试导出表格接口');
      // })
      var url = '/git-doc/excel-report/download/bankCreditTable'
      var ref = 'http://106.12.241.109:9080' + url + '?customerName' + this.form.customerName
      // console.log(ref)
      window.location = ref
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.pageInfo.pagesize = newSize
      this.getTableDatas()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(`当前页: ${newPage}`)
      this.pageInfo.pagenum = newPage
      this.getTableDatas()
    }
  },
}
</script>

<style lang="scss" scoped>
.limitContainer {
  padding: 10px 15px;
  .el-form {
    display: flex;
    justify-content: flex-start;
  }
  // 分页区样式
  .pageination {
    float: right;
    padding-top: 2vh;
  }
}
</style>
