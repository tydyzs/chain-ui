<!-- 系统管理--菜单管理页面 -->
<template>
  <div class="container">
    <!-- 搜索区 -->
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="ruleForm" :model="ruleForm" :rules="ruleFromRules" label-width="80px" class="ruleForm"
          size="small">
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="菜单名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="菜单编号" prop="code">
              <el-input v-model="ruleForm.code" placeholder="菜单编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="菜单类型" prop="category">
              <el-select v-model="ruleForm.category" placeholder="菜单类型" size="small" p clearable>
                <el-option v-for="item in menuTypeDict" :key="item.dictKey" :label="item.dictValue"
                  :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="6" :xl="5">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchInfo('ruleForm')">搜索</el-button>
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
        <el-button v-if="permission.menu_add" type="primary" icon="el-icon-plus" size="small" @click="addForm">新 增
        </el-button>
        <el-button v-if="permission.menu_delete" type="danger" icon="el-icon-delete" size="small" @click="remove">删 除
        </el-button>
      </div>
      <!-- 表格详情区 -->
      <template>
        <el-table :data="tableData" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          @selection-change="selectChange" style="width: 100%" size="medium" v-loading="loading" lazy :load="load" border stripe
          >
          <el-table-column type="selection" width="55" :resizable="false" align="center" />
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column prop="name" label="菜单名称" :resizable="false" width="200" align="left" />

          <el-table-column prop="path" label="路由地址" :resizable="false" align="center" />
          <el-table-column prop="source" label="菜单图标" :resizable="false" align="center">
            <template slot-scope="scope">
              <i :class="scope.row.source"></i>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="菜单类型" :resizable="false" align="center">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.categoryName }}</el-tag>
                <!-- <el-tag size="medium">{{ menuType[scope.row.category] }}</el-tag> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="菜单编号" :resizable="false" align="center" />
          <!-- <el-table-column prop="alias" label="菜单别名" :resizable="false" align="center" /> -->
          <el-table-column prop="sort" label="菜单排序" :resizable="false" align="center" />
          <el-table-column label="操作" width="150" fixed="right" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-button v-if="permission.menu_view" class="textBtn" type="text" icon="el-icon-zoom-in" size="mini"
                @click="view(scope.row)">查看
              </el-button>
              <el-button v-if="permission.menu_edit" class="textBtn" type="text" icon="el-icon-edit" size="mini"
                @click="edit(scope.row)">编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <!-- 分页区 -->
    <!-- <div class="pageination">
      <el-pagination :total="pageInfo.total" :current-page="pageInfo.currentPage" :page-sizes="[10, 20, 30, 40]"
        :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div> -->

    <!-- 点击新增按钮，页面弹出dialog框 -->
    <div class="addDialog">
      <el-dialog title="菜单信息" :append-to-body="true" :visible.sync="addDialogVisible" :close-on-click-modal="false"
        :lock-scroll="false" @closed="closeAddForm('addRuleForm')" width="60%">
        <el-form :model="addRuleForm" ref="addRuleForm" :rules="addRuleFormRules" :disabled="addFormDisabled"
          label-width="100px" class="addRuleForm">

          <el-form-item prop="id" v-if="false">
            <el-input v-model="addRuleForm.id" v-if="false" clearable />
          </el-form-item>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="addRuleForm.name" placeholder="请输入 菜单名称" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="addRuleForm.path" placeholder="请输入 路由地址" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="上级菜单" prop="parentId">
              <el-cascader placeholder="试试搜索上级菜单" size="small" v-model="addRuleForm.parentId" :options="menuTree"
                :props="defaultProps" filterable clearable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="菜单类型" prop="category">
              <el-select v-model="addRuleForm.category" placeholder="请选择" size="small" clearable @change="categoryChanged">
                <el-option v-for="item in menuTypeDict" :key="item.dictKey" :label="item.dictValue"
                  :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="菜单图标" prop="source">
              <icon-select ref="iconSel" v-model="addRuleForm.source" :disabled="sourceVisible" size="small"/>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="菜单编号" prop="code">
              <el-input v-model="addRuleForm.code" placeholder="请输入 菜单编号" size="small" clearable />
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="菜单别名" prop="alias">
              <el-input v-model="addRuleForm.alias" placeholder="请输入 菜单别名" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="菜单排序" prop="sort">
              <el-input-number v-model="addRuleForm.sort" :min="1" :max="9999999" placeholder="请输入 菜单排序" size="small"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="菜单备注" prop="remark">
              <el-input v-model="addRuleForm.remark" placeholder="请输入 菜单备注" type="textarea" size="small" clearable />
            </el-form-item>
          </el-col>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <span slot="footer" class="dialog-footer">
            <el-button icon="el-icon-close" size="small" @click="closeAddForm('addRuleForm')">取
              消</el-button>
            <el-button type="primary" icon="el-icon-check" size="small" v-if="addFormToolsVisiable" @click="addMenu()">确 定
            </el-button>
          </span>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDictionary, dictTranslate } from '@/api/system/dict'
import { getUserInfo } from '@/api/user'
import { getList, remove, update, add, getMenu, tree } from '@/api/system/menu'
import { getStore } from '@/utils/store'
import IconSelect from '@/components/IconSelect'

export default {
  name: 'Menu',
  components: { IconSelect },
  data() {
    return {
      icon: '',
      permission: {}, //页面按钮权限控制
      menuTypeDict: [], //菜单类型下拉选项
      menuType: [], //菜单类型下拉选项
      // 列表查询参数
      ruleForm: {},
      loading: false,
      // 表单内容校验规则
      ruleFromRules: {},
      loading: true,
      //分页数据
      pageInfo: {
        currentPage: 1,
        pageSize: 8,
        total: 0
      },

      // =====表格区数据=====
      tableData: [],
      // =====新增dialog框可见性、可编辑性
      addDialogVisible: false,
      addFormDisabled: false,
      addFormToolsVisiable: true,
      sourceVisible:true,
      //列表选择的内容
      multipleSelection: [],

      //新增、修改、查看的表单
      addRuleForm: {},

      //新增、修改、查看的表单校验规则
      addRuleFormRules: {
        name: [{ required: true, message: '菜单名称', trigger: 'blur' }],
        path: [{ required: false, message: '路由地址', trigger: 'blur' }],
        parentId: [{ required: true, message: '上级菜单', trigger: 'blur' }],
        source: [{ required: false, message: '菜单图标', trigger: 'blur' }],
        code: [{ required: true, message: '菜单编号', trigger: 'blur' }],
        category: [{ required: true, message: '菜单类型', trigger: 'blur' }],
        alias: [{ required: true, message: '菜单别名', trigger: 'blur' }],
        sort: [{ required: true, message: '菜单排序', trigger: 'blur' }]
      },
      menuTree: [],

      //上级菜单选项的父子数据
      defaultProps: {
        children: 'children',
        label: 'title',
        checkStrictly: true
      }
    }
  },

  methods: {
    //获取列表数据
    getTableDataList() {
      this.loading = true
      this.ruleForm.parentId='0'
      getList(this.ruleForm)
        .then(res => {
          console.log('列表数据', res)
          this.pageInfo.total = res.data.data.total
          this.tableData = res.data.data
          // this.getAndTranslateDic();
        })
        .finally(() => {
          this.loading = false
        })
    },

    //懒加载下级菜单数据
    load(tree, treeNode, resolve) {
       console.log("tree",tree.id)
       this.ruleForm.parentId=tree.id
        getList(this.ruleForm)
        .then(res => {
          console.log('resolve', res)
          resolve(res.data.data)
        })
    },

    //下拉选项翻译
    getAndTranslateDic() {
      // //菜单类型列表翻译
      // dictTranslate('menu_category').then(res => {
      //   this.menuType = res.data.data
      // })
      //菜单类型下拉选项
      getDictionary('menu_category').then(res => {
        console.log('菜单类型', res)
        this.menuTypeDict = res.data.data
      })
    },

    //搜索按钮
    searchInfo() {
      console.log('查询参数：', this.ruleForm)
      this.getTableDataList()
    },

    // 点击搜索区的清空按钮，触发该函数，清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm = {}
    },

    // 点击新增按钮，触发该函数
    addForm() {
      this.addRuleForm = {}
      this.addDialogVisible = true
      this.addFormToolsVisiable = true
      this.addFormDisabled = false
      this.formDictionary()
    },
    // 点击查看按钮，触发该函数
    view(e) {
      console.log(e, '查看参数')
      this.addDialogVisible = true
      this.addFormToolsVisiable = false
      this.addFormDisabled = true
      this.addRuleForm = e
      this.categoryChanged()
      this.formDictionary(e)
    },
    // 点击编辑按钮，触发该函数
    edit(e) {
      console.log(e, '编辑参数')
      this.addDialogVisible = true
      this.addFormToolsVisiable = true
      this.addFormDisabled = false
      this.addRuleForm = e
      this.categoryChanged()
      this.formDictionary(e)
    },

    //表单字典翻译
    formDictionary(e) {
      // this.addRuleForm.category = this.menuTypeDict[e.category]//通知类型
      //菜单选择树
      tree().then(res => {
        console.log('菜单选择树', res)
        this.menuTree = res.data.data
      })
    },

    //新增、编辑页面点击确定按钮事件
    addMenu() {
      this.$refs.addRuleForm.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入完整的信息')
        }
        console.log('上级ID', this.addRuleForm.parentId)
        //如果上级菜单是数组，自取数组中最后一条记录
        if (this.addRuleForm.parentId instanceof Array) {
          let pidLength = this.addRuleForm.parentId.length
          this.addRuleForm.parentId = this.addRuleForm.parentId[pidLength - 1]
        }
        console.log('新增参数', this.addRuleForm)
        add(this.addRuleForm).then(res => {
          console.log('新增返回结果', res)
          if (res.status != 200) {
            return this.$message.error('操作失败!')
          }
          this.$message.success('操作成功!')
          this.addDialogVisible = false
          this.getTableDataList()
        })
      })
    },

    //dialog框关闭时触发的事件
    closeAddForm(formName) {
      this.addRuleForm = {}
      this.$refs[formName].clearValidate()
      this.$refs.iconSel._close();
      this.addDialogVisible = false
    },
    //列表选中后的触发事件
    selectChange(e) {
      this.multipleSelection = e
    },

    remove() {
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
        console.log('需要删除的ID', ids)
        remove(ids).then(
          res => {
            console.log('删除返回结果', res)
            if (res.status != 200) {
              return this.$message.error('操作失败!')
            }
            this.$message.success('操作成功!')
            this.getTableDataList()
            this.addRuleForm = {}
          },
          error => {
            console.log('错误消息', error)
            this.$message.error('操作失败!')
          }
        )
      })
    },
    //菜单类型变化时，触发的事件
    categoryChanged(){
      if(this.addRuleForm.category=='2'){//菜单类型为按钮时，菜单图标无法编辑
        this.sourceVisible=true
        this.addRuleForm.source='';
      }else{
        this.sourceVisible=false
      }
    }
  },
  created() {
    //权限控制
    this.permission = getStore({ name: 'permission' })
    //获取列表数据
    this.getTableDataList()
    //下拉选项处理
    this.getAndTranslateDic()
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
