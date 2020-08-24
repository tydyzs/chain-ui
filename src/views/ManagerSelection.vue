<template>
  <div>
    <el-button slot="append" icon="el-icon-search" @click="chooseManager"></el-button>
    <!-- 客户经理选择dialog框 -->
    <el-dialog class="managerDialog" title="请选择客户经理" :visible.sync="managerDialogVisible" width="70%" height="400"
      @closed="closeDialog" :append-to-body="true">
      <!-- 查询条件 -->
      <div class="search">
        <el-form :model="managerForm" ref="managerForm" label-width="100px">
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="用户名称" prop="realName">
              <el-input v-model="managerForm.realName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="用户编号" prop="account">
              <el-input v-model="managerForm.account" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item>
              <el-button type="primary" @click="queryMsg" size="small">查询</el-button>
              <el-button @click="clearMsg('managerForm')" size="small">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <!-- 详细表格信息 -->
      <div class="table">
        <template>
          <el-table :data="managerMsg" style="width: 100%" height="400">
            <el-table-column prop="realName" label="客户经理名称" width="180"></el-table-column>
            <el-table-column prop="account" label="客户经理编号" width="180"></el-table-column>
            <el-table-column prop="deptName" label="所属机构名称"></el-table-column>
            <el-table-column prop="roleName" label="所属角色"></el-table-column>
            <el-table-column fixed="right" label="操作">
              <template slot-scope="scope">
                <el-button @click="makeSure(scope.row)" type="text" size="small">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <!-- 分页功能区 -->
      <!-- <div class="pageination"> -->
      <el-pagination class="pageination" @size-change="managerSizeChange" @current-change="managerCurrentChange"
        :current-page="managerPageInfo.pageNum" :page-sizes="[10]" :page-size="managerPageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="managerTotal"></el-pagination>
      <!-- </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { getManagerList } from '@/api/user'
export default {
  name: 'managerSelect', //组件命名
  data() {
    return {
      // 客户经理编号
      managerNum: '',
      // 客户经理dialog框中，详细信息表格中的数据源
      managerMsg: [],
      // 客户经理选择器搜索条件form
      managerForm: {},
      // 客户经理dialog框
      managerDialogVisible: false,
      // 客户经理dialog中的分页信息
      managerPageInfo: { pageNum: 1, pageSize: 10 },
      // 客户经理dialog中数据总条数
      managerTotal: 40
    }
  },
  created() {},
  methods: {
    //获取客户经理信息
    getUserMsgList() {
      getManagerList(
        this.managerPageInfo.pageNum,
        this.managerPageInfo.pageSize,
        this.managerForm.account,
        this.managerForm.realName
      ).then(res => {
        console.log(res, '获取客户经理信息')
        this.managerMsg = res.data.data.records
        this.managerTotal = res.data.data.total
      })
    },
    // =============以下方法函数为选择客户经理相关的内容=============
    // 点击确定按钮，确认选择用户名称
    makeSure(row) {
      console.log(row, '打印row的信息')
      console.log(row.realName, '打印客户名称')
      this.ruleForm.userNum = row.realName
      this.managerNum = row.account
      this.managerDialogVisible = false
    },
    // 点击重置按钮，清空input中的内容
    clearMsg(formName) {
      this.$refs['managerForm'].resetFields()
    },
    // dialog框关闭后
    closeDialog() {
      this.managerForm.account = ''
      this.managerForm.realName = ''
    },
    // 点击查询按钮，触发该函数，根据input中的值显示对应的信息
    queryMsg() {
      this.getUserMsgList()
    },
    // 点击搜索框右侧放大镜选择客户经理，触发该函数
    chooseManager() {
      this.managerPageInfo.pageNum = 1
      this.managerPageInfo.pagesize = 10
      this.getUserMsgList()
      this.managerDialogVisible = true
    },
    // ====选择客户经理dialog中的分页功能====
    // 监听 pagesize 改变的事件
    managerSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.managerPageInfo.pageSize = val
      this.getUserMsgList()
    },
    // 监听 页码值 改变的事件
    managerCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.managerPageInfo.pageNum = val
      this.getUserMsgList()
    }
  }
}
</script>

<style lang="scss" scoped>
.managerDialog {
  // 搜索区样式
  .search {
    .el-form /deep/ {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .el-col {
        .el-form-item {
          .el-form-item__label {
            // color: #252525;
            font-weight: normal;
          }
        }
      }
    }
  }
  // 表格区样式
  .table {
    /deep/ .el-table__fixed-right .el-table__fixed-body-wrapper .cell {
      line-height: 0 !important;
    }
    /deep/ .el-table__fixed .el-table__fixed-body-wrapper .cell {
      line-height: 0 !important;
    }
    .el-table /deep/ {
      // th.has-gutter {
      //   display: table-cell !important;
      // }
      .el-table__header-wrapper {
        border-bottom: 1px solid #ebeef5;
        .has-gutter {
          tr {
            th {
              .cell {
                color: #252525;
                font-weight: normal;
              }
            }
          }
        }
      }
      .el-table__fixed-right {
        .el-table__fixed-header-wrapper {
          .el-table__header {
            tr {
              th:last-child {
                .cell {
                  color: #252525;
                }
              }
            }
          }
        }
      }
      .textBtn {
        color: #029f4a;
      }
    }
  }
  // 分页区样式
  .pageination {
    float: right;
    padding-top: 2vh;
  }
  .lookDrawer {
    .el-drawer {
      .lookRuleForm /deep/ {
        justify-content: flex-start !important;
      }
    }
  }
}
</style>
