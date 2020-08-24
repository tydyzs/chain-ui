<!-- 风险暴露超过1亿元（含）的单一客户用信明细表页面 -->
<template>
  <div>
    <!-- 客户名称、客户经理，管护机构 部分 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <!-- 客户名称 -->
      <el-form-item label="客户名称">
        <el-input v-model="ruleForm.customerName" size="small"></el-input>
      </el-form-item>
      <!-- 客户经理 -->
      <!-- <el-form-item label="客户经理" prop="customerManager">
        <el-input
          v-model="ruleForm.customerManager"
          placeholder="请输入主办客户经理"
          clearable
          @keyup.enter.native="searchInfo()"
        >
          <el-button slot="append" icon="el-icon-search" @click="chooseManager"></el-button>
        </el-input>
      </el-form-item> -->
      <!--      <el-form-item label="机构" prop="org">
              <el-select v-model="currOrg" placeholder="请选择当前机构">
                <el-option :value="orgValue" style="height: auto">
                  &lt;!&ndash; 搜索框 &ndash;&gt;
                  <el-input placeholder="输入关键字进行搜索" v-model="filterText"></el-input>
                  <el-tree class="filter-tree" :data="orgData" :props="defaultProps" :filter-node-method="filterNode" ref="orgTree"
                           @node-click="handleNodeClick"></el-tree>
                </el-option>
              </el-select>
            </el-form-item>-->
      <el-form-item>
        <el-button type="primary" size="small" @click="query">查询</el-button>
        <el-button type="primary" size="small">导出</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格详情部分 -->
    <div class="content">
      <!-- 表格上方标题部分 -->
      <div class="tableTitle">
        <!-- 中间标题 -->
        <h3>{{ toptitle }}</h3>
        <!-- <p class="bottomCon">
          <span>日期：{{nowTime}}</span>
          <span>单位：亿元</span>
        </p> -->
      </div>
      <!-- 表格内容部分 -->
      <!-- 点击上方的查询按钮，表格中显示对应的数据，双击数据行，跳转到详情页 -->
      <div class="tableContent"></div>
      <el-table :data="tableData" border style="width: 100%" max-height="440">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="customerNum" label="客户编号" width="100"></el-table-column>
        <el-table-column prop="customerName" label="客户名称" width="200"></el-table-column>
        <el-table-column prop="approveExpAmount" label="批复额度">
          <template slot-scope="scope">{{ scope.row.approveExpAmount | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="creditExpBalance" label="敞口余额">
          <template slot-scope="scope">{{ scope.row.creditExpBalance | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="ratio" label="占一级资本净额比例"></el-table-column>
        <el-table-column prop="change" label="较上月变化">
          <template slot-scope="scope">{{ scope.row.change | NumsFormat }}</template>
        </el-table-column>
        <el-table-column prop="groupName" label="所属集团"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-button class="textBtn" type="text" icon="el-icon-view" @click="detailDialog(scope.row)">业务详情</el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页功能区 -->
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="pageInfo.current"
        :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.size" layout="total, sizes, prev, pager, next, jumper"
        :total="pageInfo.total"></el-pagination>

      <!-- 业务详情页面 -->
      <el-dialog :title="detailDialogTitle" :visible.sync="detailDialogVisible" width="60%">
        <el-table :data="detailData" border style="width: 100%">
          <el-table-column prop="approveNum" label="批复编号"></el-table-column>
          <el-table-column prop="productName" label="业务品种"></el-table-column>
          <el-table-column prop="approveAmt" label="敞口余额"></el-table-column>
          <el-table-column prop="mainGuaranteeTypeName" label="担保方式"></el-table-column>
          <el-table-column prop="beginDate" label="用信起期"></el-table-column>
          <el-table-column prop="endDate" label="用信止期"></el-table-column>
          <el-table-column prop="orgNumName" label="管户机构"></el-table-column>
          <el-table-column prop="userNumName" label="管户经理"></el-table-column>
        </el-table>
        <!-- 分页功能区 -->
        <el-pagination @size-change="sizeChange2" @current-change="currentChange2" :current-page="detailPageInfo.current"
          :page-sizes="[10, 20, 30, 40]" :page-size="detailPageInfo.size" layout="total, sizes, prev, pager, next, jumper"
          :total="detailPageInfo.total"></el-pagination>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user'
import { getDeptTreeManage } from '@/api/system/dept'
import { queryOverOneHundredMillion } from '@/api/rcd/limitAnalyse/limitAnalyse'
import { crdApprove } from '@/api/rcd/standBook/thirdparty'
export default {
  data () {
    return {
      // 机构选择 input框中的数据
      currOrg: '',
      // 机构选择 下拉框选中的数据
      orgValue: '',
      // 机构选择树的数据
      orgData: [],
      // 机构选择树中过滤输入框中的内容
      filterText: '',
      detailDialogVisible: false,
      detailDialogTitle: '详情页面',
      defaultProps: {
        // 指定子树为节点对象的某个属性值
        children: 'children',
        // 指定节点标签为节点对象的某个属性值
        label: 'title'
      },

      ruleForm: {
        customerName: '',
        // customerManager: "", // 主办客户经理
        manager: '',
        organization: ''
      },
      // 控制选择客户经理对话框的显示与隐藏
      managerDialogVisible: false,
      // nowTime: '',
      // 表格详情部分 中间标题
      toptitle: '风险暴露超过1亿元（含）的单一客户用信明细表',
      // 表格详情部分 左侧日期
      tableDate: {
        year: '',
        month: ''
      },
      // 表格详情部分 右侧单位
      unit: '',
      // 表格数据源
      tableData: [],
      detailData: [],
      currentDetailNum: '',
      // 分页数据源
      pageInfo: {
        current: 1, // 当前页码
        size: 10,// 每页显示条数
        total: 0// 总条数
      },
      // 分页数据源
      detailPageInfo: {
        current: 1, // 当前页码
        size: 10,// 每页显示条数
        total: 0// 总条数
      }
    }
  },
  mounted: function () {
    this.query()
  },
  methods: {
    query () {
      queryOverOneHundredMillion(this.ruleForm, this.pageInfo).then(res => {
        const datas = res.data.data.records
        this.tableData = datas
        this.pageInfo.total = res.data.data.total
        // this.pageInfo.current = res.data.data.current
        if (datas.length == 0) {
          return
        }
      })
    },
    detailDialog (row) {
      this.detailDialogVisible = true
      this.detailDialogTitle = '【' + row.customerName + '】的业务列表'
      this.currentDetailNum = row.customerNum
      this.getDetailData()
    },
    getDetailData () {
      crdApprove(
        this.detailPageInfo.pagenum,
        this.detailPageInfo.pagesize,
        this.currentDetailNum,//'C005',
        ''//'01000'
      ).then(res => {
        this.detailData = res.data.data.records
        this.detailPageInfo.total = res.data.data.total
      })
    },
    // 获取当前登录人的信息
    getunserInfo () {
      getUserInfo().then(res => {
        if (res.status != 200) {
          return this.$$message.error('获取当前登录人信息失败，请重试')
        }
        this.userInfo = res.data.data
        getDeptTreeManage(this.userInfo.deptId).then(res => {
          if (res.status != 200) {
            return this.$message.error('获取当前登录人信息失败，请重试')
          }
          this.orgData = res.data.data
          // 如果当前登录机构为省联社，默认选择省联社
          if (this.orgData[0].deptLevel == 1) {
            // 如果当前登录机构为省联社，默认选择省联社
            this.currOrg = this.orgData[0].title
          } else if (this.orgData[0].deptLevel == 2) {
            // 如果当前登录机构为市联社下第一个成员行，机构树为该市级下所有成员行
            this.currOrg = this.orgData[0].children[0].title
          } else if (this.orgData[0].deptLevel == 3) {
            // 如果当前登录机构为成员行，机构树只显示成员行
            this.currOrg = this.orgData[0].title
          }
        })
      })
    },
    // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点被点击时的回调,共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身
    handleNodeClick (data) {
      if (data.deptLevel == 1 || data.deptLevel == 3) {
        this.currOrg = data.title
        this.orgValue = data.title
      }
    },

    // 每页总条数的变化，触发这个函数
    sizeChange (newSize) {
      this.pageInfo.size = newSize
      this.query()
    },
    // 当前页码的变化，触发这个函数
    currentChange (newPage) {
      this.pageInfo.current = newPage
      this.query()
    },
    // 每页总条数的变化，触发这个函数
    sizeChange2 (newSize) {
      this.pageInfo.size = newSize
      this.getDetailData()
    },
    // 当前页码的变化，触发这个函数
    currentChange2 (newPage) {
      this.pageInfo.current = newPage
      this.getDetailData()
    }
  }
}
</script>

<style lang="scss" scoped>
// 选择年、月、金额单位部分的样式
.el-form /deep/ {
  display: flex;
  justify-content: flex-start;

  .el-form-item /deep/ {
    .el-form-item__content {
      .el-input {
        width: 150px;

        .el-input__inner {
          width: 180px;
        }
      }
    }
  }

  .el-form-item:first-child {
    .el-form-item__label {
      width: 68px;
    }
  }
}

//表格详情部分
.content {
  // 上方标题部分的样式
  .tableTitle {
    h3 {
      text-align: center;
      font-weight: 700;
      margin-top: 0;
    }

    // .bottomCon {
    //   display: flex;
    //   justify-content: space-between;
    // }
  }

  // 分页功能区的样式
  .el-pagination {
    float: right;
    margin-top: 5px;
  }
}

// dialog样式
.el-dialog__wrapper /deep/ {
  .el-dialog {
    .el-dialog__body {
      padding: 30px 20px 50px;
    }
  }
}
</style>
