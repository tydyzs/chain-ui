<!-- 全客户（集团客户）明细表 组件页面 -->
<template>
  <div>
    <!-- 客户名称、客户经理，管护机构 部分 -->
    <el-form :model="ruleForm" ref="ruleForm">
      <!-- 客户名称 -->
      <el-form-item label="客户名称" prop="customerName">
        <el-input v-model="ruleForm.customerName" size="small" @focus="checkMsg" clearable></el-input>
      </el-form-item>
      <!-- 客户经理 -->
      <!-- <el-form-item label="客户经理" prop="manager">
        <el-input v-model="ruleForm.manager" size="small" clearable></el-input>
      </el-form-item> -->
      <!-- 管护机构 -->
      <!-- <el-form-item label="管护机构" prop="organization">
        <el-input v-model="ruleForm.organization" size="small" clearable></el-input>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" size="small" @click="getList">查询</el-button>
        <el-button type="primary" size="small" @click="export2Excel">导出</el-button>
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
        </p>-->
      </div>
      <!-- 表格内容部分 -->
      <!-- 点击上方的查询按钮，表格中显示对应的数据，双击数据行，跳转到详情页 -->
      <div class="tableContent"></div>
      <el-table :data="tableContent" border style="width: 100%" max-height="440">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="customerName" label="客户名称" width="430"></el-table-column>
        <!-- 贷款余额 需要根据数值的大小，从大到小进行默认排序 -->
        <el-table-column prop="unuse" label="贷款余额（亿元）" width="260"></el-table-column>
        <!-- 较上月变化 该内容的数值，需要根据上月数值相比，有一个带颜色的上箭头或者下箭头 -->
        <el-table-column prop="newchange" label="较上月变化（亿元）"></el-table-column>
      </el-table>

      <!-- 隐藏的表格，用来做导出用 -->
      <el-table :data="excelTableData" border style="width: 100%" max-height="440" v-if="flag">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="customerName" label="客户名称" width="430"></el-table-column>
        <!-- 贷款余额 需要根据数值的大小，从大到小进行默认排序 -->
        <el-table-column prop="unuse" label="贷款余额（亿元）" width="260">
          <template slot-scope="scope">{{ scope.row.unuse | NumsFormat }}</template>
        </el-table-column>
        <!-- 较上月变化 该内容的数值，需要根据上月数值相比，有一个带颜色的上箭头或者下箭头 -->
        <el-table-column prop="newchange" label="较上月变化（亿元）">
          <template slot-scope="scope">{{ scope.row.newchange | NumsFormat }}</template>
        </el-table-column>
      </el-table>

      <!-- 分页功能区 -->
      <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="pageInfo.current" :page-sizes="[10, 20, 30, 40]"
                     :page-size="pageInfo.size" layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.total"></el-pagination>
      <!-- 客户名称 下方的dialog框 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="15%">
        <span>这是一段信息</span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { queryGroupCustomer } from '@/api/rcd/limitAnalyse/limitAnalyse'
  import { export_json_to_excel } from '../../../../../public/Export2Excel.js'

  export default {
    data() {
      return {
        ruleForm: {
          customerName: ''
          // manager: '',
          // organization: ''
        },
        // nowTime: '',
        // 表格详情部分 中间标题
        toptitle: '全客户（集团客户）明细表',
        // 表格数据源
        tableContent: [],
        // 隐藏的表格数据源
        excelTableData: [],
        // 控制隐藏表格的显示与隐藏，一般不显示
        flag: false,
        // 分页数据源
        pageInfo: {
          current: 1, // 当前页码
          size: 10, // 每页显示条数
          total: 0 // 总条数
        },
        dialogVisible: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      // 获取表格数据列表
      getList() {
        queryGroupCustomer(this.ruleForm, this.pageInfo).then(res => {
          if (res.status != 200) {
            return this.$message.error('获取数据列表失败，请重试')
          }
          this.tableContent = res.data.data.records
          this.pageInfo.total = res.data.data.total
        })
      },
      // 客户名称 input框获取焦点时触发该函数
      checkMsg() {
        // console.log(this.ruleForm.customerName,'打印input的值');
        // this.dialogVisible = true
      },
      // 点击清空按钮，触发该函数，清空input框中的内容
      clean(formName) {
        //  console.log('测试清空按钮');
        this.$refs[formName].resetFields()
      },
      export2Excel() {
        require.ensure([], () => {
          const tHeader = ['客户名称', '贷款余额（亿元）', '较上月变化（亿元）'] // 对应表格输出的中文title
          const filterVal = ['customerName', 'loanExpBalance', 'change'] // 对应表格输出的数据
          const list = this.excelTableData // 表格data
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '全客户（单一客户）明细表') // 对应下载文件的名字
        })

      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },

      // 每页总条数的变化，触发这个函数
      sizeChange(newSize) {
        this.pageInfo.size = newSize
        this.getList()
      },
      // 当前页码的变化，触发这个函数
      currentChange(newPage) {
        this.pageInfo.current = newPage
        this.getList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  // 选择客户名称，客户经理，管护机构部分的样式
  .el-form /deep/ {
    display: flex;
    justify-content: flex-start;

    .el-form-item /deep/ {
      .el-form-item__content {
        .el-input {
          width: 150px;

          .el-input__inner {
            width: 150px;
          }
        }
      }
    }

    // input框向左靠齐
    .el-form-item:nth-child(-n + 3) {
      .el-form-item__label {
        width: 68px !important;
      }

      .el-form-item__content {
        margin-left: 68px !important;
        margin-right: 10px;
      }
    }

    // 三个按钮向input框靠齐
    .el-form-item:last-child {
      .el-form-item__content {
        margin-left: 50px !important;
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
</style>
