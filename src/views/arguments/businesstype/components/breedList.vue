<template>
  <div class="container">
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="ruleForm" size="small">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="业务品种编号" prop="productNum">
              <el-input v-model="ruleForm.productNum" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="业务品种名称" prop="productName">
              <el-input v-model="ruleForm.productName" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="授信系统" prop="creditSystem">
              <el-select v-model="ruleForm.creditSystem" placeholder="--请选择--" size="small" clearable>
                <el-option v-for="(item, i) in sysNoSelection" :key="i" :label="item.terminalName" :value="item.terminalCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="业务品种状态" prop="productStatusCd">
              <el-select v-model="ruleForm.productStatusCd" placeholder="--请选择--" size="small" clearable>
                <el-option v-for="item in productStatusCdSelection" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="额度占用方式" prop="limitUsedType">
              <el-select v-model="ruleForm.limitUsedType" placeholder="--请选择--" size="small" clearable>
                <el-option v-for="item in limitUsedTypeSelection" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" @click="searchChange">搜索</el-button>
              <el-button icon="el-icon-refresh-right" @click="resetForm">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <!-- 表格区 -->
    <div class="table">
      <!-- 表头按钮区 -->
      <div class="btns" style="margin-bottom: 2vh;">
        <el-button v-if="permission.business_add" icon="el-icon-plus" type="primary" size="small" @click="addBreed">新 增</el-button>
        <el-button v-if="permission.business_delete" icon="el-icon-delete" type="danger" size="small" @click="removeFrom">删
          除</el-button>
      </div>
      <!-- 表格详情区 -->
      <template>
        <el-table ref="breepTable" :data="tableData" style="width: 100%" size="medium" border stripe height="400"
          v-loading="loading">
          <el-table-column fixed="left" type="selection" :resizable="false" align="center" />
          <el-table-column type="index" label="序号" :resizable="false" align="center" width="55" />
          <el-table-column prop="productNum" label="业务品种编号" :resizable="false" align="center" width="130" />
          <el-table-column prop="productName" label="业务品种名称" :resizable="false" align="center" width="130" />
          <el-table-column prop="limitUsedTypeName" label="产品额度占用方式" :resizable="false" align="center" width="140">
            <!-- <template slot-scope="scope">{{ limitUsedTypeDict[scope.row.limitUsedType] }}</template> -->
          </el-table-column>
          <el-table-column prop="riskExposureTypeName" label="风险暴露类型" :resizable="false" align="center" width="130">
            <!-- <template slot-scope="scope">{{ riskExposureTypeDict[scope.row.riskExposureType] }}</template> -->
          </el-table-column>
          <el-table-column prop="productStatusCdName" label="业务品种状态" :resizable="false" align="center" width="130">
            <!-- <template slot-scope="scope">{{ productStatusCdDict[scope.row.productStatusCd] }}</template> -->
          </el-table-column>
          <el-table-column prop="creditSystem" label="授信系统" :resizable="false" align="center" width="130">
            <template slot-scope="scope">{{ sysNoDict[scope.row.creditSystem] }}</template>
          </el-table-column>
          <el-table-column prop="createTimeStr" label="创建日期" :resizable="false" align="center" width="130" />
          <el-table-column prop="updateTimeStr" label="修改日期" :resizable="false" align="center" width="130" />
          <el-table-column prop="createUserName" label="创建人" :resizable="false" align="center" width="130" />
          <el-table-column prop="createDeptName" label="创建机构" :resizable="false" align="center" width="130" />
          <el-table-column fixed="right" label="操作" width="250" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-button v-if="permission.business_view" class="textBtn" type="text" size="mini" icon="el-icon-zoom-in"
                @click="viewBreed(scope.row)">查看</el-button>
              <el-button v-if="permission.business_edit" class="textBtn" type="text" size="mini" icon="el-icon-edit"
                @click="editBreed(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 分页区 -->
    <div class="pageination">
      <el-pagination :total="pageInfo.total" :current-page="pageInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <breed-detail ref="breedDetail" @afterSave="searchChange()" />
  </div>
</template>
<script>
import { dictTranslate, getDictionary } from '@/api/system/dict'
import {
  queryBusinessType,
  listSystemDistinct,
  getList,
  remove,
  update,
  add
} from '@/api/arguments/businessType'
import { getStore } from '@/utils/store'
import common from '@/config/common.json'
import breedDetail from './breedDetail'

export default {
  name: 'breedList',
  components: { breedDetail },
  data() {
    return {
      // =====搜索区数据=====

      //列表加载属性
      loading: false,

      // 来源系统字典
      sysNoDict: [],

      // 产品状态下拉框内容
      productStatusCdSelection: [],
      // 产品额度占用方式下拉框内容
      limitUsedTypeSelection: [],
      // 来源系统下拉框内容
      sysNoSelection: [],
      // 风险暴露类型下拉框内容
      riskExposureTypeSelection: [],
      // 表内外标志下拉框内容
      inoutTableSelection: [],

      // 表单数据源
      ruleForm: {
        productNum: '',
        productName: '',
        creditSystem: '',
        productStatusCd: '',
        limitUsedType: ''
      },
      // =====表格区数据=====
      tableData: [],
      // =====表格区数据=====
      pageInfo: {
        total: 0,
        pagenum: 1,
        pagesize: 10
      },
      permission: {}
    }
  },
  created() {
    // 页面初始化
    this.init()
  },

  methods: {
    init() {
      // 角色权限按钮
      this.permission = getStore({ name: 'permission' })
      // 装入表格详情区数据
      this.getTableData(this.pageInfo, this.ruleForm)
      // 下拉选择框的字典翻译
      this.getDict()
      // 表格详情区的字典翻译
      this.dictTranslateCommon()
    },

    // 获取table表格数据
    getTableData(pageInfo, params) {
      this.loading = true
      getList(pageInfo.pagenum, pageInfo.pagesize, params)
        .then(res => {
          console.log('获取table表格数据', res)
          const datas = res.data.data
          this.tableData = datas.records
          this.pageInfo.total = datas.total
          this.pageInfo.pagenum = datas.current
          this.pageInfo.pagesize = datas.size
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 下拉选翻译
    getDict() {
      getDictionary('CD000178').then(res => {
        console.log('获取产品状态', res)
        this.productStatusCdSelection = res.data.data
      })
      getDictionary('CD000179').then(res => {
        console.log('获取产品额度占用方式', res)
        this.limitUsedTypeSelection = res.data.data
      })
      getDictionary('CD000177').then(res => {
        console.log('获取风险暴露类型', res)
        this.riskExposureTypeSelection = res.data.data
      })
      getDictionary('CD000187').then(res => {
        console.log('获取表内外标志', res)
        this.inoutTableSelection = res.data.data
      })
      listSystemDistinct().then(res => {
        console.log('获取来源系统', res)
        this.sysNoSelection = res.data.data
      })
    },

    // 翻译
    dictTranslateCommon() {
      // 来源系统
      dictTranslate('system').then(res => {
        console.log('来源系统', res)
        this.sysNoDict = res.data.data
        this.tableData.creditSystem = this.sysNoDict[this.tableData.creditSystem]
      })
    },

    // 点击搜索区的清空按钮，触发该函数，清空表单内容
    resetForm() {
      this.$refs.ruleForm.resetFields()
      // this.getTableData(this.pageInfo, this.ruleForm)
    },

    searchChange() {
      this.pageInfo.pagenum = 1
      this.getTableData(this.pageInfo, this.ruleForm)
    },
    // 监听 每页数据条数 改变的事件
    handleSizeChange(val) {
      this.pageInfo.pagesize = val
      this.getTableData(this.pageInfo, this.ruleForm)
    },
    // 监听 页码 改变的事件
    handleCurrentChange(val) {
      this.pageInfo.pagenum = val
      this.getTableData(this.pageInfo, this.ruleForm)
    },

    // 删除
    removeFrom() {
      const selectionList = this.$refs.breepTable.selection
      if (selectionList.length === 0) {
        this.$message.warning('请选择至少一条数据')
        return
      }
      let ids = []
      selectionList.forEach(ele => {
        ids.push(ele.productNum)
      })
      this.$confirm('将删除此条记录，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(ids.join(','))
        })
        .then(() => {
          this.getTableData(this.pageInfo, this.ruleForm)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        }).catch(() => {})
    },

    addBreed() {
      this.$refs.breedDetail.showDialog(
        'add',
        '',
        this.productStatusCdSelection,
        this.limitUsedTypeSelection,
        this.riskExposureTypeSelection,
        this.inoutTableSelection,
        this.sysNoSelection
      )
    },
    viewBreed(row) {
      this.$refs.breedDetail.showDialog(
        'view',
        row.productNum,
        this.productStatusCdSelection,
        this.limitUsedTypeSelection,
        this.riskExposureTypeSelection,
        this.inoutTableSelection,
        this.sysNoSelection
      )
    },
    editBreed(row) {
      this.$refs.breedDetail.showDialog(
        'edit',
        row.productNum,
        this.productStatusCdSelection,
        this.limitUsedTypeSelection,
        this.riskExposureTypeSelection,
        this.inoutTableSelection,
        this.sysNoSelection
      )
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
  // .search {
  //   .el-form {
  //     display: flex;
  //     justify-content: flex-start;
  //     flex-wrap: wrap;
  //     .timePick {
  //       .el-form-item__content {
  //         .el-input__inner {
  //           width: 100%;
  //         }
  //       }
  //     }
  //   }
  // }
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
      .el-col:last-child {
        .el-form-item {
          .el-form-item__content {
            display: flex;
            .el-button {
              margin-right: 10px;
            }
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
  //   .el-table /deep/ {
  //     .textBtn {
  //       color:  #029f4a;
  //     }
  //   }
  // }
  // 分页区样式
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

