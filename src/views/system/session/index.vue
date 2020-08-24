<template>
  <div class="container">
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="selectForm" :model="selectForm" label-width="82px" class="selectForm" size="small">
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="登录用户号" prop="account">
              <el-input v-model="selectForm.account" placeholder="登录用户号" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" @click="searchChange()">搜索</el-button>
              <el-button icon="el-icon-refresh-right" @click="selectionClear()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <!-- 表格区 -->
    <div class="table">
      <!-- 表格详情区 -->
      <template>
        <el-table ref="deptTable" v-loading="loading" :data="dataList" style="width: 100%" size="medium" border stripe
          height="440">
          <el-table-column type="selection" width="55" :resizable="false" align="center" />
          <el-table-column type="index" label="序号" align="center" width="55" />
          <el-table-column v-for="(col) in column" :min-width="col.width" :key="col.key" :label="col.label" :align="col.align"
            :resizable="col.resizable" :prop="col.key" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作" min-width="200" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-button icon="el-icon-delete" class="textBtn" @click="handleDelete(scope.row)" type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 分页区 -->
    <div class="pageination">
      <el-pagination :total="pageInfo.total" :current-page="pageInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.pagesize"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" />
    </div>
  </div>
</template>

<script>
import { getList, remove } from '@/api/system/session'
import { mapGetters } from 'vuex'

export default {
  name: 'sessionList',
  data () {
    return {
      loading: true,
      selectForm: {},
      pageInfo: {
        total: 0,
        pagenum: 1,
        pagesize: 10
      },
      column: [
        {
          label: 'IP地址',
          key: 'actionClientIp',
          resizable: true,
          width: 230,
          align: 'center'
        },
        {
          label: '登录用户号',
          key: 'account',
          resizable: true,
          width: 230,
          align: 'center'
        },
        {
          label: '登录用户名',
          key: 'userName',
          resizable: true,
          width: 230,
          align: 'center'
        },
        {
          label: '登录机构',
          key: 'orgName',
          resizable: true,
          width: 300,
          align: 'left'
        }
      ],
      dataList: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      //装入表格数据
      this.loadData(this.pageInfo, this.selectForm)
    },
    loadData (page, params) {
      this.loading = true;
      getList(page.pagenum, page.pagesize, params).then(res => {
        const data = res.data.data
        this.pageInfo.total = data.total
        this.dataList = data.records
      }).finally(() => {
        this.loading = false;
      });
    },
    handleDelete (row) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(row.account)
        })
        .then(() => {
          this.loadData(this.pageInfo, this.selectForm)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    searchChange () {
      this.pageInfo.pagenum = 1
      this.loadData(this.pageInfo, this.selectForm)
    },
    handleSizeChange (val) {
      this.pageInfo.pagesize = val
      this.loadData(this.pageInfo, this.selectForm)
    },
    handleCurrentChange (val) {
      this.pageInfo.pagenum = val
      this.loadData(this.pageInfo, this.selectForm)
    },
    selectionClear () {
      this.$refs["selectForm"].resetFields()
    }
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
}
</style>
