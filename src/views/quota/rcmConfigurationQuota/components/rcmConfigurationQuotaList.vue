<template>
  <div class="container">
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="params" :model="params" label-width="100px" class="params" size="small">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额指标编号" prop="quotaIndexNum">
              <el-input v-model="params.quotaIndexNum" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额指标名称" prop="quotaIndexName">
              <el-input v-model="params.quotaIndexName" placeholder="请输入内容" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额类型" prop="quotaType">
              <el-select v-model="params.quotaType" placeholder="请选择" clearable>
                <el-option v-for="(item,i) in quotaTypeData" :key="i" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额指标类型" prop="quotaIndexType">
              <el-select v-model="params.quotaIndexType" placeholder="请选择" clearable>
                <el-option v-for="(item,i) in quotaIndexTypeData" :key="i" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="指标状态" prop="quotaIndexState">
              <el-select v-model="params.quotaIndexState" placeholder="请选择" clearable>
                <el-option v-for="(item,i) in quotaIndexStateData" :key="i" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>            
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
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
      <!-- 表头按钮区 -->
      <div class="btns" style="margin-bottom: 2vh;">
        <el-button type="primary" icon="el-icon-plus" size="small" @click="add()">新 增</el-button>
      </div>
      <!-- 表格详情区 -->
      <template>
        <el-table ref="deptTable" :data="dataList" v-loading="loading" style="width: 100%" size="medium" border stripe
          height="400">
          <el-table-column type="index" label="序号" :resizable="false" align="center" width="55" />
          <el-table-column v-for="(col) in column" :min-width="col.width" :key="col.key" :label="col.label" :align="col.align"
            :resizable="col.resizable" :prop="col.key" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作" width="260" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-button :disabled="permission.rcmConfigurationQuota_view? false : true" @click="view(scope.row)" type="text"
                class="textBtn" size="mini">查看</el-button>
              <el-button :disabled="permission.rcmConfigurationQuota_edit? false : true" @click="edit(scope.row)" type="text"
                class="textBtn" size="mini">修改</el-button>
              <el-button :disabled="permission.rcmConfigurationQuota_enable? false : true" @click="enable(scope.row)"
                type="text" class="textBtn" size="mini">启用</el-button>
              <el-button :disabled="permission.rcmConfigurationQuota_stop? false : true" @click="disable(scope.row)"
                type="text" class="textBtn" size="mini">停用</el-button>
              <el-button :disabled="permission.rcmConfigurationQuota_remove? false : true" @click="del(scope.row)" type="text"
                class="textBtn" size="mini">删除</el-button>
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
    <rcm-configuration-quota-detail ref="detail" @afterSave="searchChange()" />
  </div>
</template>
<script>
import { getList, remove, usable, unusable } from '@/api/quota/rcmConfigurationQuota/rcmConfigurationQuota'
import { mapGetters } from 'vuex'
import { getStore } from '@/utils/store'
import { getDictionarys } from '@/api/system/dict'
import { getListData } from '@/utils/treeCustomize.js'
import rcmConfigurationQuotaDetail from './rcmConfigurationQuotaDetail'
import { debuglog } from 'util';

export default {
  name: 'rcmConfigurationQuotaList',
  components: { rcmConfigurationQuotaDetail },
  data () {
    return {
      quotaTypeData: [],
      quotaIndexTypeData: [],
      quotaIndexStateData: [],
      dictData: {},
      params: {
        quotaIndexNum: '',
        quotaIndexName: '',
        quotaType: '',
        quotaIndexType: ''
      },
      loading: false,
      // 表格列头
      column: [
        {
          key: 'quotaIndexNum',
          label: '限额指标编号',
          resizable: true,
          width: 160,
          align: 'center'
        },
        {
          key: 'quotaIndexName',
          label: '限额指标名称',
          resizable: true,
          width: 360,
          align: 'left'
        },
        {
          key: 'quotaType',
          label: '限额类型',
          width: 140,
          resizable: true,
          align: 'left'
        },
        {
          key: 'quotaIndexType',
          label: '限额指标类型',
          width: 140,
          resizable: true,
          align: 'center'
        },
        {
          key: 'quotaIndexState',
          label: '指标状态',
          width: 120,
          resizable: true,
          align: 'center'
        }
      ],
      pageInfo: {
        total: 0,
        pagenum: 1,
        pagesize: 10
      },
      dataList: [],
      permission: {}
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.permission = getStore({ name: 'permission' })
      this.loadData()
    },
    loadTableData (pageInfo, params) {
      this.loading = true
      this.params.quotaIndexNum = this.params.quotaIndexNum == '' ? null : this.params.quotaIndexNum
      this.params.quotaIndexName = this.params.quotaIndexName == '' ? null : this.params.quotaIndexName
      this.params.quotaType = this.params.quotaType == '' ? null : this.params.quotaType
      this.params.quotaIndexType = this.params.quotaIndexType == '' ? null : this.params.quotaIndexType
      getList(pageInfo.pagenum, pageInfo.pagesize, params)
        .then(res => {
          const data = res.data.data
          this.dataList = data.records
          this.pageInfo.total = data.total
          this.dataList.forEach(item => {
            item.quotaType = this.getQuotaTypeName(item.quotaType)
            item.quotaIndexType = this.getQuotaIndexTypeName(item.quotaIndexType)
            item.quotaIndexState = this.getQuotaIndexStateName(item.quotaIndexState)
          })
          this.loading = false
        })
    },
    getQuotaTypeName (quotaType) {
      let quotaTypeName = ''
      this.quotaTypeData.forEach(item => {
        if (item.dictKey == quotaType) {
          quotaTypeName = item.dictValue
        }
      })
      return quotaTypeName
    },
    getQuotaIndexTypeName (quotaIndexType) {
      let quotaIndexTypeName = ''
      this.quotaIndexTypeData.forEach(item => {
        if (item.dictKey == quotaIndexType) {
          quotaIndexTypeName = item.dictValue
        }
      })
      return quotaIndexTypeName
    },
    getQuotaIndexStateName (quotaIndexState) {
      let quotaIndexStateName = ''
      this.quotaIndexStateData.forEach(item => {
        if (item.dictKey == quotaIndexState) {
          quotaIndexStateName = item.dictValue
        }
      })
      return quotaIndexStateName
    },
    selectionClear () {
      this.$refs.params.resetFields()
    },
    searchChange () {
      this.pageInfo.pagenum = 1
      this.loadTableData(this.pageInfo, this.params)
    },
    handleSizeChange (val) {
      this.pageInfo.pagesize = val
      this.loadTableData(this.pageInfo, this.params)
    },
    handleCurrentChange (val) {
      this.pageInfo.pagenum = val
      this.loadTableData(this.pageInfo, this.params)
    },
    del (row) {
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(row.quotaIndexNum)
        })
        .then(() => {
          this.loadTableData(this.pageInfo, this.params)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    add () {
      this.$refs.detail.showDialog('add', '', this.quotaTypeData, this.quotaIndexTypeData, this.quotaIndexStateData)
    },
    view (row) {
      this.$refs.detail.showDialog('view', row.quotaIndexNum, this.quotaTypeData, this.quotaIndexTypeData, this.quotaIndexStateData)
    },
    edit (row) {
      this.$refs.detail.showDialog('edit', row.quotaIndexNum, this.quotaTypeData, this.quotaIndexTypeData, this.quotaIndexStateData)
    },
    enable (row) {
      this.$confirm('确定启用当前选择的数据?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return usable(row.quotaIndexNum)
        })
        .then(() => {
          this.loadTableData(this.pageInfo, this.params)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    disable (row) {
      this.$confirm('确定禁用当前选择的数据?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return unusable(row.quotaIndexNum)
        })
        .then(() => {
          this.loadTableData(this.pageInfo, this.params)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    loadData () {
      getDictionarys("CD000252,CD000253,CD000254").then(res => {
        if (res.data.data != null) {
          this.quotaTypeData = res.data.data["CD000252"]
          this.quotaIndexTypeData = res.data.data["CD000252"]
          this.quotaIndexStateData = res.data.data["CD000254"]
          this.loadTableData(this.pageInfo, this.params)
        }
      })
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
  // .table {
  /deep/ .el-table__fixed-right .el-table__fixed-body-wrapper .cell {
    line-height: 0 !important;
  }
  /deep/ .el-table__fixed .el-table__fixed-body-wrapper .cell {
    line-height: 0 !important;
  }
  .pageination {
    float: right;
    padding-top: 2vh;
  }
}
.dialog {
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
      }
    }
  }
}
</style>
