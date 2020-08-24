<!-- 系统管理--顶部管理页面 -->
<template>
  <div class="container">
    <!-- 搜索区 -->
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="ruleForm" :model="ruleForm" :rules="ruleFromRules" label-width="80px" class="ruleForm" size="small">
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
        <el-button  v-if="permission.topmenu_add" type="primary" icon="el-icon-plus" size="small" @click="addForm">新 增</el-button>
        <el-button  v-if="permission.topmenu_delete" type="danger" icon="el-icon-delete" size="small" @click="remove">删 除</el-button>
        <el-button  v-if="permission.topmenu_setting" type="warning" icon="el-icon-s-tools" size="small" @click="handleMenuSetting">菜单配置</el-button>
      </div>
      <!-- 表格详情区 -->
      <template>
        <el-table :data="tableData" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          @selection-change="selectChange" style="width: 100%" size="medium" v-loading = "loading" border stripe>
          <el-table-column type="selection" width="55" :resizable="false" align="center" />
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column prop="name" label="菜单名称" :resizable="false" width="200" align="left" />
          <el-table-column prop="source" label="菜单图标" :resizable="false" align="center">
            <template slot-scope="scope">
              <i :class="scope.row.source"></i>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="菜单编号" :resizable="false" align="center" />
          <!-- <el-table-column prop="alias" label="菜单别名" :resizable="false" align="center" /> -->
          <el-table-column prop="sort" label="菜单排序" :resizable="false" align="center" />
          <el-table-column label="操作" width="150" fixed="right" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-button v-if="permission.topmenu_view"  class="textBtn" type="text" icon="el-icon-zoom-in" size="mini" @click="view(scope.row)">查看</el-button>
              <el-button v-if="permission.topmenu_edit"  class="textBtn" type="text" icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>

    <!-- 分页区 -->
    <div class="pageination">
      <el-pagination :total="pageInfo.total" :current-page="pageInfo.currentPage" :page-sizes="[10, 20, 30, 40]"
        :page-size="pageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <!-- 点击新增按钮，页面弹出dialog框 -->
    <div class="addDialog">
      <el-dialog title="菜单信息"  :append-to-body="true" :visible.sync="addDialogVisible" :close-on-click-modal="false" :lock-scroll="false"
        @closed="closeAddForm('addRuleForm')" width="60%">
        <el-form :model="addRuleForm" ref="addRuleForm" :rules="addRuleFormRules" :disabled="addFormDisabled"
          label-width="100px" class="addRuleForm">

          <el-form-item prop="id" v-if="false">
            <el-input v-model="addRuleForm.id" v-if="false" clearable />
          </el-form-item>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="addRuleForm.name"   maxlength="5" show-word-limit placeholder="请输入 菜单名称" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="菜单图标" prop="source">
              <icon-select v-model="addRuleForm.source" size="small" />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="菜单编号" prop="code">
              <el-input v-model="addRuleForm.code" placeholder="请输入 菜单编号" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="菜单排序" prop="sort">
              <el-input-number v-model="addRuleForm.sort" :min="1" :max="10" placeholder="请输入 菜单排序" size="small"
                clearable />
            </el-form-item>
          </el-col>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeAddForm('addRuleForm')">取 消</el-button>
            <el-button type="primary" size="small" v-if="addFormToolsVisiable" @click="addTopMenu()">确 定</el-button>
          </span>
        </span>
      </el-dialog>
    </div>

    <!-- 菜单配置dialog框 -->
    <div class="addDialog">
      <el-dialog title="下级菜单配置" :append-to-body="true" :lock-scroll="false" :visible.sync="menuDialogVisible" width="345px">
        <el-tree :data="menuGrantList" show-checkbox node-key="id" ref="treeMenu" :default-checked-keys="menuTreeObj"
          :props="props">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button icon="el-icon-close" size="small" @click="closeAddForm('addRuleForm')">取 消</el-button>
          <el-button type="primary" icon="el-icon-check" size="small" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDictionary, dictTranslate } from '@/api/system/dict'
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  grant,
  grantTree,
  getTopTree
} from '@/api/system/topmenu'
import {getStore} from '@/utils/store'
import IconSelect from '@/components/IconSelect'

export default {
  name: 'topMenu',
  components: { IconSelect },
  data () {
    return {
      permission:{},//页面按钮权限控制
      ruleForm: {},// 列表查询参数
      ruleFromRules: {}, // 查询参数表单内容校验规则
      //分页数据
      pageInfo: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      loading:false,
      //表格区数据
      tableData: [],
      //列表已选择的数据
      selectionList: [],
      // 监听 pageSize 改变的事件
      handleSizeChange (newSize) {
        console.log(`每页 ${newSize} 条`)
        this.pageInfo.pageSize = newSize
        this.getTableDataList()
      },
      // 监听 页码值 改变的事件
      handleCurrentChange (newPage) {
        console.log(`当前页: ${newPage}`)
        this.pageInfo.currentPage = newPage
        this.getTableDataList()
      },
      // =====新增dialog框可见性、可编辑性
      addDialogVisible: false,
      addFormDisabled: false,
      addFormToolsVisiable: true,

      //新增、修改、查看的表单
      addRuleForm: {},
      //新增、修改、查看的表单校验规则
      addRuleFormRules: {
        name: [{ required: true, message: '菜单名称', trigger: 'blur' }],
        code: [{ required: true, message: '菜单编号', trigger: 'blur' }],
        source: [{ required: true, message: '菜单图标', trigger: 'blur' }],
        sort: [{ required: true, message: '菜单排序', trigger: 'blur' }]
      },

      //菜单配置对话框可见性
      menuDialogVisible: false,
      //菜单选择树
      menuTreeObj: [],
      //已配置（选中）的菜单
      menuGrantList: [],
      //菜单
      props: {
        label: 'title',
        value: 'key'
      }
    }
  },
  computed: {
    ids () {
      let ids = []
      this.selectionList.forEach(ele => {
        ids.push(ele.id)
      })
      return ids.join(',')
    }
  },
  methods: {
    //字典翻译器
    getAndTranslateDic () {
      //菜单选择树
      tree().then(res => {
        console.log('菜单选择树', res)
        this.menuTree = res.data.data
      })
    },
    //搜索按钮
    searchInfo () {
      console.log('查询参数：', this.ruleForm)
      this.getTableDataList()
    },

    // 点击搜索区的清空按钮，触发该函数，清空表单内容
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },

    //获取列表数据
    getTableDataList () {
      this.loading=true
      getList(
        this.pageInfo.currentPage,
        this.pageInfo.pageSize,
        this.ruleForm
      ).then(res => {
        console.log('列表数据', res)
        this.pageInfo.total = res.data.data.total
        this.tableData = res.data.data.records
      }).finally( () =>{
          this.loading = false;
      });
    },

    //列表选中后的触发事件
    selectChange (e) {
      this.selectionList = e
    },
    // 点击新增按钮，触发该函数
    addForm () {
      if(this.pageInfo.total>=5){
        console.log('当前菜单数量：'+this.pageInfo.total);
        return this.$message.error('最多只能添加5个顶部菜单!')
      }
      this.addDialogVisible = true
      this.addFormToolsVisiable = true
      this.addFormDisabled = false
    },
    // 点击查看按钮，触发该函数
    view (e) {
      console.log(e, '查看参数')
      this.addDialogVisible = true
      this.addFormToolsVisiable = false
      this.addFormDisabled = true
      this.addRuleForm = e
    },
    // 点击编辑按钮，触发该函数
    edit (e) {
      console.log(e, '编辑参数')
      this.addDialogVisible = true
      this.addFormToolsVisiable = true
      this.addFormDisabled = false
      this.addRuleForm = e
    },
    remove () {
      console.log('选择的内容', this.selectionList, this.selectionList.length)
      if (this.selectionList.length == 0) {
        return this.$message.error('请选择一条记录')
      }
      this.$confirm('将删除选中的记录，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = this.selectionList
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
          },
          error => {
            console.log('错误消息', error)
            this.$message.error('操作失败!')
          }
        )
      })
    },
    //新增、编辑页面点击确定按钮事件
    addTopMenu () {
      this.$refs.addRuleForm.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入完整的信息')
        }
        console.log('新增参数', this.addRuleForm)
        add(this.addRuleForm).then(res => {
          console.log('新增返回结果', res)
          if (res.status != 200) {
            return this.$message.error('操作失败!')
          }
          this.$message.success('操作成功!')
          this.addDialogVisible = false
          //this.getTableDataList()
        })
      })
    },
    //dialog框关闭时触发的事件
    closeAddForm(formName) {
      this.addRuleForm = {}
      this.$refs[formName].clearValidate()
      this.addDialogVisible=false
      this.menuDialogVisible=false
    },

    //菜单配置取消按钮事件
    cancel(){
      this.menuDialogVisible=false
    },

    //点击菜单配置按钮的事件
    handleMenuSetting () {
      if (this.selectionList.length !== 1) {
        this.$message.warning('只能选择一条数据')
        return
      }
      this.menuTreeObj = []
      grantTree().then(res => {
        this.menuGrantList = res.data.data.menu
        getTopTree(this.ids).then(res => {
          this.menuTreeObj = res.data.data.menu
          this.menuDialogVisible = true
        })
      })
    },

    //菜单配置确定按钮事件
    submit () {
      const menuList = this.$refs.treeMenu.getCheckedKeys().join(',')
      grant(this.ids, menuList).then(() => {
        this.menuDialogVisible = false
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      })
    }
  },
  created () {
    //权限控制
    this.permission = getStore({name: 'permission'})
    console.log("权限数据：",this.permission)
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
