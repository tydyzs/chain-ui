<!-- 系统管理--字典管理 -->
<template>
  <div class="container">
    <!-- 搜索区 -->
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="ruleForm" :model="ruleForm" label-width="80px" class="ruleForm" size="small">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="字典名称" prop="dictValue">
              <el-input v-model="ruleForm.dictValue" placeholder="字典名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="分类编号" prop="code">
              <el-input v-model="ruleForm.code" placeholder="分类编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="分类名称" prop="codeCn">
              <el-input v-model="ruleForm.codeCn" placeholder="分类名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="字典备注" prop="remark">
              <el-input v-model="ruleForm.remark" placeholder="字典备注" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" @click="query">搜索</el-button>
              <el-button icon="el-icon-refresh-right" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <!-- 表格区 -->
    <div class="table">
      <!-- 表头按钮区 -->
      <div class="btns" style="margin-bottom: 2vh;">
        <el-button v-if="permission.dict_add"  icon="el-icon-plus" type="primary" size="small" @click="add">新 增</el-button>
        <el-button v-if="permission.dict_delete" icon="el-icon-delete" type="danger" size="small" @click="removeFrom">删 除</el-button>
      </div>
      <!-- 表格详情区 -->
      <template>
        <el-table :data="tableData" style="width: 100%" size="medium" border stripe max-height="400" @selection-change="selectChange">
          <el-table-column type="selection" width="55" :resizable="false" align="center" />
          <el-table-column type="index" label="序号" :resizable="false" align="center" width="50" />
          <el-table-column prop="dictKey" label="字典键值" :resizable="false" align="center" />
          <el-table-column prop="dictValue" label="字典名称" :resizable="false" align="center" />
          <el-table-column prop="parentName" label="上级名称" :resizable="false" align="center" />
          <el-table-column prop="remark" label="字典备注" :resizable="false" align="center" />
          <el-table-column label="操作" width="150" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-button v-if="permission.dict_view" type="text" size="small" icon="el-icon-zoom-in" @click="view(scope.row)">查看</el-button>
              <el-button v-if="permission.dict_edit" type="text" size="small" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 分页区 -->
    <div class="pageination">
      <el-pagination :total="total" :current-page="pageInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 点击新增按钮，页面弹出dialog框 -->
    <div class="addDialog">
      <el-dialog title="字典信息" :append-to-body="true" :visible.sync="addDialogVisible" :lock-scroll="false" :close-on-click-modal="false"
        width="60%" @closed="resetAddForm('addRuleForm')">
        <el-form :model="addRuleForm" ref="addRuleForm" :rules="addRuleFormRules" :disabled="addFormDisabled"
          label-width="100px" class="addRuleForm">
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" v-if="fieldVisiable">
            <el-form-item label="分类编号" prop="code">
              <el-input v-model="addRuleForm.code" placeholder="请输入 分类编号" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" v-if="fieldVisiable">
            <el-form-item label="分类名称" prop="codeCn">
              <el-input v-model="addRuleForm.codeCn" placeholder="请输入 分类名称" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="字典键值" prop="dictKey">
              <el-input v-model="addRuleForm.dictKey" placeholder="请输入 字典键值" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="字典名称" prop="dictValue">
              <el-input v-model="addRuleForm.dictValue" placeholder="请输入 字典名称" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="上级字典" prop="parentId">
              <tree-select ref="dictTree" :props="props" :options="dictData" :value="addRuleForm.parentId" :clearable="isClearable" :accordion="isAccordion" @getValue="getValue($event)" />
              <!-- <el-select v-model="addRuleForm.parentName" placeholder="请选择上级字典" @change="selectDictChange" size="small">
                <el-option :value="parentValue" style="height: auto">
                  <el-input placeholder="输入关键字进行搜索" v-model="filterText" ></el-input>
                  <el-tree class="filter-tree" :data="dictData" :props="defaultProps" :filter-node-method="filterNode"
                    ref="dictTree" @node-click="handleNodeClick"></el-tree>
                </el-option>
              </el-select> -->
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" v-if="false">
            <el-form-item label="上级字典ID" prop="parentId">
              <el-input v-model="addRuleForm.parentId" size="small" clearable />
            </el-form-item>
          </el-col> -->
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="字典排序" prop="sort">
              <el-input-number style="width:100%" placeholder="排序" v-model="addRuleForm.sort" controls-position="right" :min="1" :max="1000" size="small" clearable />
            </el-form-item>
            <!-- <el-form-item label="字典排序" prop="sort">
              <el-input v-model="addRuleForm.sort" placeholder="请输入 字典排序" size="small" clearable />
            </el-form-item> -->
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="字典备注" prop="remark">
              <el-input v-model="addRuleForm.remark" size="small" clearable />
            </el-form-item>
          </el-col>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button icon="el-icon-close" size="small" @click="resetAddForm('addRuleForm')">取 消</el-button>
          <el-button icon="el-icon-check" type="primary" size="small" @click="addOrUpdataDict" v-if="addFormToolsVisiable">确 定</el-button>
        </span>
      </el-dialog>
    </div>

  </div>
</template>

<script>
import TreeSelect from '@/components/TreeSelect'
import {
  getList,
  remove,
  addOrUpdata,
  dictTranslateToTree,
  getDictDetail
} from '@/api/system/dict'
import {getStore} from '@/utils/store'
export default {
  components: { TreeSelect },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {
    return {
      permission:{},
      // =====搜索区数据=====
      ruleForm: {
        dictValue: '',
        code: '',
        codeCn: '',
        remark: ''
      },
      //列表选择的内容
      multipleSelection: [],
      // 字典选择树的数据
      dictData: [],
      // defaultProps: {
      //   children: 'children',
      //   label: 'title'
      // },
      // 字典选择框中过滤搜索内容
      filterText: '',
      // 字典选择下拉框的数据
      parentValue: '',

      // =====表格区数据=====
      tableData: [],
      pageInfo: {
        pagenum: 1,
        pagesize: 10
      },
      total: 0,

      props: {
        // 配置项（必选）
        value: 'id',
        label: 'title',
        children: 'children',
        disabled: false
      },
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）


      // =====新增dialog框数据
      addDialogVisible: false,
      addFormToolsVisiable: false,
      fieldVisiable: false,
      addFormDisabled: true,

      addRuleForm: {
        code: '',
        codeCn: '',
        dictKey: '',
        dictValue: '',
        parentId: '',
        sort: '',
        remark: ''
      },
      addRuleFormRules: {
        code: [{ required: true, message: '请输入 分类编号', trigger: 'blur' }],
        codeCn: [
          { required: true, message: '请输入 分类名称', trigger: 'blur' }
        ],
        dictKey: [
          { required: true, message: '请输入 字典键值', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '请输入 字典名称', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择 上级字典', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.permission = getStore({name: 'permission'})
    // 进入页面默认查询所有
    this.query(this.pageInfo)
    this.dictToTree()
  },

  methods: {
    // 字典树
    dictToTree(code) {
      dictTranslateToTree(code).then(res => {
        this.dictData = res.data.data
        console.log('上级字典树:', this.dictData)
      })
    },

    // 改变上级字典选项，触发该函数
    selectDictChange(e) {
      console.log(e, '测试下拉框选择方法')
    },
    // // 选择下拉框中的过滤函数
    // filterNode(value, data) {
    //   if (!value) return true
    //   return data.label.indexOf(value) !== -1
    // },
    // // 选中字典，触发该函数
    // handleNodeClick(e) {
    //   console.log(e, '测试选择变化')
    //   this.addRuleForm.parentName = e.title
    //   this.parentValue = e.title
    //   this.addRuleForm.parentId = e.id
    //   this.dictToTree(e.code)
    // },

    // 查询字典
    query(pageInfo) {
      getList(pageInfo.pagenum, pageInfo.pagesize, this.ruleForm).then(res => {
        if (res.status != 200) {
          return this.$message.error('查询失败！')
        }
        console.log('字典数据', res)
        const datas = res.data.data
        this.tableData = datas.records
        this.total = datas.total
        this.pageInfo.pagenum = datas.current
        this.pageInfo.pagesize = datas.size
      })
    },

    //列表选中后的触发事件
    selectChange(e) {
      this.multipleSelection = e
    },

    // 删除
    removeFrom() {
      console.log(
        '选择的内容',
        this.multipleSelection,
        this.multipleSelection.length
      )
      if (this.multipleSelection.length == 0) {
        return this.$message.error('请选择一条记录')
      }
      this.$confirm('将删除此条记录，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = this.multipleSelection
        var ids = ''
        for (let i = 0; i < data.length; i++) {
          ids = ids + ',' + data[i].id
        }
        ids = ids.substring(1)
        console.log('需要删除的ID', ids)
        remove(ids).then(res => {
          console.log('删除返回结果', res)
          if (res.status != 200) {
            return this.$message.error('操作失败!')
          }
          this.$message.success('操作成功!')
          this.query(this.pageInfo)
        })
      }).catch(() => {})
    },

    // 新增或更新字典
    addOrUpdataDict() {
      this.$refs.addRuleForm.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入完整的信息')
        }
        console.log('新增参数', this.addRuleForm)
        addOrUpdata(this.addRuleForm).then(res => {
          console.log('新增返回结果', res)
          if (res.status != 200) {
            return this.$message.error('操作失败!')
          }
          this.$message.success('操作成功!')
          this.addDialogVisible = false
          this.query(this.pageInfo)
        })
      })
    },

    // 字典翻译

    // 点击搜索区的清空按钮，触发该函数，清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.pageInfo.pagesize = newSize
      this.query(this.pageInfo)
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(`当前页: ${newPage}`)
      this.pageInfo.pagenum = newPage
      this.query(this.pageInfo)
    },
    // 点击新增按钮，触发该函数
    add() {
      this.addDialogVisible = true
      this.addFormToolsVisiable = true
      this.addFormDisabled = false
    },
    // 点击新增dialog框中 取消 按钮，触发该函数
    resetAddForm(formName) {
      this.query(this.pageInfo)
      this.$refs.addRuleForm.resetFields()
      this.addRuleForm = {}
      this.addDialogVisible = false
      this.addFormToolsVisiable = false
      this.fieldVisiable = false
      this.addFormDisabled = true
    },
    // 点击编辑按钮，触发该函数
    edit(e) {
      console.log(e, '编辑')
      this.addRuleForm = e
      if (e.id != null && e.id != '') {
        getDictDetail(e.id).then(res => {
          if (res.data.code == 200) {
            this.addRuleForm = res.data.data
          }
        })
      }
      this.addDialogVisible = true
      this.addFormToolsVisiable = true
      this.addFormDisabled = false

    },
    // 点击查看按钮，触发该函数
    view(e) {
      console.log(e, '查看')
      this.addRuleForm = e
      if (e.id != null && e.id != '') {
        getDictDetail(e.id).then(res => {
          if (res.data.code == 200) {
            this.addRuleForm = res.data.data
          }
        })
      }
      this.addDialogVisible = true
      this.addFormToolsVisiable = false
      this.fieldVisiable = true
      this.addFormDisabled = true
    },
    getValue(value) {
      this.addRuleForm.parentId = value
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
      td, th {
        padding: 5px 0;
      }
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
  .el-dialog__wrapper /deep/ {
    .el-dialog {
      height: 380px !important;
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
