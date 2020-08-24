<!-- 参数管理--串用管理 -->
<template>
  <div class="container">
    <!-- 表格区 -->
    <div class="table">
      <!-- 表格详情区 -->
      <template>
        <el-table :data="tableData" row-key="id" style="width: 100%" size="medium" v-loading="loading" border stripe>
          <el-table-column type="selection" width="55" :resizable="false" align="center" />
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column prop="lstgId" label="串用组ID" :resizable="false" align="center" />
          <el-table-column prop="bizNum" label="串用业务编号" :resizable="false" align="center" />
          <el-table-column prop="customerNum" label="客户编号" :resizable="false" align="center" />
          <el-table-column prop="customerName" label="客户名称" :resizable="false" align="center" />
          <el-table-column prop="borrowAmt" label="串用金额" :resizable="false" align="center" />
          <el-table-column prop="borrowBalance" label="串用余额" :resizable="false" align="center" />
          <el-table-column prop="borrowDate" label="串用日期" :resizable="false" align="center" />
        </el-table>
      </template>
    </div>

    <!-- 分页区 -->
    <div class="pageination">
      <el-pagination :total="pageInfo.total" :current-page="pageInfo.currentPage" :page-sizes="[10, 20, 30, 40]"
        :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { detailPage } from '@/api/arguments/borrow'

export default {
  name: 'borrowDetailList',
  data() {
    return {
      borrowVal: {}, //从上个页面传入的值
      ruleForm: {}, //查询参数
      loading: false,
      //分页数据
      pageInfo: {
        currentPage: 1,
        pageSize: 8,
        total: 0
      },
      // =====表格区数据=====
      tableData: []
    }
  },

  methods: {
    //获取列表数据
    getTableDataList() {
      this.loading = true
      detailPage(
        this.pageInfo.currentPage,
        this.pageInfo.pageSize,
        this.ruleForm
      )
        .then(res => {
          console.log('列表数据', res)
          this.pageInfo.total = res.data.data.total
          this.tableData = res.data.data.records
          // this.getAndTranslateDic();
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.pageInfo.pageSize = newSize
      this.getTableDataList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(`当前页: ${newPage}`)
      this.pageInfo.currentPage = newPage
      this.getTableDataList()
    }
  },
  created() {
    this.borrowVal = JSON.parse(sessionStorage.getItem('borrowVal'))
    console.log('传入参数', this.borrowVal)
    this.ruleForm.lstgId = this.borrowVal.lstgId
    //获取列表数据
    this.getTableDataList()
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 10px 15px;
  .el-table th.gutter {
    display: table-cell !important;
  }
  .el-select {
    display: block;
  }
  // 搜索区样式
  .search {
    .el-form {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .timePick {
        .el-form-item__content {
          .el-input__inner {
            width: 100%;
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
              }
            }
          }
        }
      }
    }
  }
  // 分页区样式
  .pageination {
    float: right;
    padding-top: 2vh;
  }
  // 新增dialog框的样式
  .addDialog {
    .el-dialog {
      .el-dialog__body {
        .el-form {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .timeChoose {
            .el-form-item__content {
              .el-input {
                width: 100%;
              }
            }
          }
          .el-col:nth-child(3) {
            .el-form-item {
              .el-form-item__content {
                .el-cascader {
                  display: block !important;
                }
              }
            }
          }
        }
      }
    }
  }
  // 抽屉区样式
  .lookDrawer {
    .el-drawer {
      .el-form {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        .el-form-item /deep/ {
          .el-form-item__content {
            .el-input {
              .el-input__inner {
                color: #333;
              }
            }
          }
        }
      }
    }
  }
}
</style>
