<!-- 关联关系 -->
<template>
  <div class="container">
    <!-- 第一层 基本信息 -->
    <div class="basicInfo">
      <span>客户名称：{{ acceptData.customerName || acceptData.companyCustomerName }}</span>
      <!-- <span>证件类型：{{ acceptData.certType }}</span> -->
      <span>证件类型：身份证</span>
      <!-- <span>证件号码：{{ acceptData.certNum }}</span> -->
      <span>证件号码：4201171198705125216</span>
    </div>
    <!-- 第二层 人物关系图 -->
    <div class="relation">
      <TreeChart :json="treeData" />
    </div>
    <!-- 第三层 table表格 -->
    <div class="tableData">
      <el-table :data="tableData" style="width: 100%;" border stripe>
        <el-table-column prop="relTypeName" label="关联关系类型" align="center" :resizable="false">
        </el-table-column>
        <el-table-column prop="custName" label="关联客户名称" align="center" :resizable="false">
        </el-table-column>
        <el-table-column prop="certTypeName" label="关联客户证件类型" align="center" :resizable="false" width="140">
        </el-table-column>
        <el-table-column prop="certNum" label="关联客户证件号码" align="center" :resizable="false" width="150">
        </el-table-column>
        <el-table-column prop="isBankGrant" label="是否我行授信客户" align="center" :resizable="false" width="140">
        </el-table-column>
        <el-table-column prop="crdGrantOrgName" label="授信机构" align="center" :resizable="false">
        </el-table-column>
        <el-table-column prop="crdMainPrdName" label="二级额度产品" align="center" :resizable="false">
        </el-table-column>
        <el-table-column prop="limitCredit" label="授信额度" align="center" :resizable="false">
        </el-table-column>
        <el-table-column prop="limitUsed" label="授信额度已用" align="center" :resizable="false">
        </el-table-column>
        <el-table-column prop="limitAvi" label="授信额度可用" align="center" :resizable="false">
        </el-table-column>
      </el-table>
      <!-- 分页内容 -->
      <el-pagination :total="pageInfo.total" :current-page="pageInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import TreeChart from '@/components/TreeChart'
import { relationView, relationPic } from '@/api/rcd/standBook/relation.js'
export default {
  data () {
    return {
      acceptData: '',
      treeData: {},
      tableData: [],
      // 分页数据
      pageInfo: {
        pagenum: 1,
        pagesize: 5,
        total: 0
      },
    }
  },
  created () {
    this.acceptData = JSON.parse(sessionStorage.getItem("relationVal"))
    console.log(this.acceptData, '接收的信息');
    this.getTableData()
    this.init()
  },
  methods: {
    getTableData () {
      // relationView('C0020', this.pageInfo.pagenum, this.pageInfo.pagesize).then(res => {
      relationView(this.acceptData.customerNum, this.pageInfo.pagenum, this.pageInfo.pagesize).then(res => {
        console.log('测试关系人接口', res);
        this.tableData = res.data.data.records
        this.pageInfo.total = res.data.data.total
      })
    },
    init () {
      this.pageInfo.pagenum = 1
      this.pageInfo.pagesize = 999999999
      //  relationPic('C0020', this.pageInfo.pagenum, this.pageInfo.pagesize).then(res => {
      relationPic(this.acceptData.customerNum, this.pageInfo.pagenum, this.pageInfo.pagesize).then(res => {
        console.log('测试关系人接口', res);
        const datas = res.data.data.records
        var child = []
        datas.map(k => {
          let { name, ava, topData: { customerName, customerNum } } = { name: k.relCustomerTypeName, ava: k.custName, topData: { customerName: k.custName, customerNum: k.relCustomerNum } }
          child.push({ name, ava, topData: { customerName, customerNum } })
        })
        this.treeData = {
          ava: this.acceptData.customerName || this.acceptData.companyCustomerName,
          name: '客户',
          topData: { customerName: this.acceptData.customerName || this.acceptData.companyCustomerName, customerNum: this.acceptData.customerNum },
          children: child
        }
      })
      // this.treeData = {
      //   ava: this.acceptData.customerName || this.acceptData.companyCustomerName,
      //   name: '客户',
      //   id: '1',
      //   topData: { customerName: this.acceptData.customerName || this.acceptData.companyCustomerName, customerNum: 'C002' },
      //   children: [
      //     { name: '大股东', ava: '李四', id: '2', topData: { customerName: '李四', customerNum: 'C002' } },
      //     { name: '小股东', ava: '周八', id: '3', topData: { customerName: '周八', customerNum: 'C002' } },
      //     { name: '法人代表', ava: '张三', id: '4', topData: { customerName: '张三', customerNum: 'C002' } },
      //   ]
      // }
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      // console.log(`每页 ${newSize} 条`)
      this.pageInfo.pagesize = newSize
      this.getTableData()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      // console.log(`当前页: ${newPage}`)
      this.pageInfo.pagenum = newPage
      this.getTableData()
    },
  },
  components: {
    TreeChart
  }
}
</script>

<style lang='scss' scoped>
.container {
  padding: 2vh 0.5vw;
  .basicInfo,
  .relation,
  .tableData {
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 2px 2px 3px #ccc;
    margin-bottom: 2vh;
  }
  .basicInfo {
    padding: 3vh 4vh;
    display: flex;
    justify-content: flex-start;
    span {
      margin-right: 7vw;
    }
  }
  .tableData {
    .el-pagination {
      float: right;
      margin: 1vh 0;
    }
  }
}
</style>
