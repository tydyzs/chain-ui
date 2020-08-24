<!-- 工作台--通知公告页面 -->
<template>
  <div id="container">
    <!-- 搜索区 -->
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" class="ruleForm" size="small">
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="通知标题" prop="title">
              <el-input v-model="ruleForm.title" placeholder="通知标题" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="通知类型" prop="category">
              <el-select v-model="ruleForm.category" placeholder="通知类型" size="small" p clearable>
                <el-option v-for="item in noticeTypeDict" :key="item.dictKey" :label="item.dictValue"
                  :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="发布日期" prop="releaseTime" class="timePick">
              <el-date-picker v-model="ruleForm.releaseTime" type="date" value-format="yyyy-MM-dd" placeholder="发布日期"
                :picker-options="pickerOptions"></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :xs="5" :sm="5" :md="5" :lg="6" :xl="5">
            <el-form-item>
              <el-button icon="el-icon-search" type="primary"  @click="getTableDataList()">搜索</el-button>
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
        <el-button v-if="permission.notice_add" type="primary" icon="el-icon-plus" size="small" @click="addForm">新 增
        </el-button>
        <el-button v-if="permission.notice_delete" type="danger" icon="el-icon-delete" size="small" @click="remove">删 除
        </el-button>
      </div>
      <!-- 表格详情区 -->
      <template>
        <el-table :data="tableData" @selection-change="selectChange" style="width: 100%" size="small"
          v-loading="loading" border stripe>
          <el-table-column type="selection" width="55" :resizable="false" align="center" />
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column prop="title" label="通知标题" :resizable="false" align="center" />
          <el-table-column prop="category" label="通知类型" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>通知类型: {{scope.row.categoryName}}</p>
                <p>通知日期: {{scope.row.releaseTime}}</p>
                <!-- <p>通知内容: {{scope.row.content}}</p>  -->
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{scope.row.categoryName}}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="releaseTime" label="发布日期" :resizable="false" align="center" />
          <el-table-column prop="createUserName" label="发布人" :resizable="false" align="center"></el-table-column>
          <el-table-column prop="createDeptName" label="发布机构" :resizable="false" align="center"></el-table-column>
          <!-- <el-table-column prop="content" label="通知内容" :resizable="false" align="center" /> -->
          <el-table-column label="操作" width="150" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-button v-if="permission.notice_edit" class="textBtn" type="text" icon="el-icon-zoom-in" size="mini"
                @click="view(scope.row)">查看
              </el-button>
              <el-button v-if="permission.notice_view" class="textBtn" type="text" icon="el-icon-edit" size="mini"
                @click="edit(scope.row)">编辑
              </el-button>
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
      <el-dialog title="通知信息" :append-to-body="true" :visible.sync="addDialogVisible" :close-on-click-modal="false"
        @closed="closeAddForm('addRuleForm')" :lock-scroll="false" width="60%">
        <el-form :model="addRuleForm" ref="addRuleForm" :rules="addRuleFormRules" :disabled="addFormDisabled"
          label-width="100px" class="addRuleForm">
          <el-form-item prop="id" v-if="false">
            <el-input v-model="addRuleForm.id" v-if="false" clearable />
          </el-form-item>

          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="通知标题" prop="title">
              <el-input v-model="addRuleForm.title" placeholder="请输入 通知标题" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="通知类型" prop="category">
              <el-select v-model="addRuleForm.category" placeholder="请输入 通知类型" size="small" clearable>
                <el-option v-for="item in noticeTypeDict" :key="item.dictKey" :label="item.dictValue"
                  :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="发布日期" prop="releaseTime" class="timeChoose">
              <el-date-picker v-model="addRuleForm.releaseTime" type="date" value-format="yyyy-MM-dd"
                placeholder="请输入 发布日期" size="small" :picker-options="pickerOptions" clearable></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col v-if="addFormDeptVisiable" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="发布机构" prop="title">
              <el-input v-model="addRuleForm.createDeptName" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col v-if="addFormUserVisiable" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="发布人" prop="title">
              <el-input v-model="addRuleForm.createUserName" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="通知内容" prop="content">
              <!-- 富文本编辑器 -->
              <quill-editor v-model="addRuleForm.content" :disabled="addFormDisabled"></quill-editor>
            </el-form-item>
          </el-col>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button icon="el-icon-close" size="small" @click="closeAddForm('addRuleForm')">取 消</el-button>
          <el-button icon="el-icon-check" v-if="addFormToolsVisiable" type="primary" size="small" @click="addNotcie()">
            确定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getDictionary, dictTranslate } from '@/api/system/dict'
import {
  getList,
  remove,
  update,
  add,
  getNotice,
  page
} from '@/api/dept/notice'
import { getUserInfo } from '@/api/user'
import { getStore } from '@/utils/store'

export default {
  name: 'Notice',
  data() {
    return {
      permission: {}, //页面按钮权限控制
      currenctUser: {}, //当前登录的用户信息
      noticeTypeDict: [], //通知类型下拉字典
      dictNotcieType: [], //通知类型列表字典
      userDict: [], //列表中用户字典
      orgDict: [], //列表中机构字典
      // =====搜索区数据=====
      ruleForm: {
        title: '',
        category: '',
        releaseTime: '',
        createDept: ''
      },
      //时间选择器
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      // 表单内容校验规则
      rules: {
        title: [{ required: false, message: '通知标题', trigger: 'blur' }],
        category: [{ required: false, message: '通知类型', trigger: 'blur' }],
        releaseTime: [{ required: false, message: '通知时间', trigger: 'blur' }]
      },
      loading: false,
      // =====表格区数据=====
      tableData: [],

      //分页数据
      pageInfo: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },

      addDialogVisible: false, //dialog框可见性
      addFormDisabled: false, //dialog框可编辑性
      addFormToolsVisiable: true, //dialog框确定按钮
      addFormDeptVisiable: true, //dialog框机构可见性
      addFormUserVisiable: true, //dialog框用户可见性
      //列表选择的内容
      multipleSelection: [],
      //新增、修改、查看的表单
      addRuleForm: {},
      //新增、修改、查看的表单校验规则
      addRuleFormRules: {
        title: [
          { required: true, message: '请输入 通知标题', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请输入 通知类型', trigger: 'blur' }
        ],
        releaseTime: [
          { required: true, message: '请输入 通知时间', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入 通知内容', trigger: 'blur' }
        ]
      }
    }
  },

  methods: {
    getuser() {
      getUserInfo().then(res => {
        console.log('当前用户数据：', res)
        this.currenctUser = res.data.data
        this.ruleForm.createDept = res.data.data.deptId
        this.getTableDataList() //取通知列表
      })
    },

    //获取列表数据
    getTableDataList() {
      this.loading = true
      console.log('查询参数：', this.ruleForm)
      this.ruleForm.createDept = this.currenctUser.deptId
      page(this.pageInfo.currentPage, this.pageInfo.pageSize, this.ruleForm)
        .then(res => {
          console.log('列表数据', res)
          this.pageInfo.total = res.data.data.total
          this.tableData = res.data.data.records
        })
        .finally(() => {
          this.loading = false
        })
    },

    //字典翻译器
    getAndTranslateDic() {
      //通知类型下拉的字典
      getDictionary('notice').then(res => {
        console.log('通知类型字典', res)
        this.noticeTypeDict = res.data.data
      })
      // //通知类型
      // dictTranslate('notice').then(res => {
      //   console.log('通知字典，', res)
      //   this.dictNotcieType = res.data.data
      // })
      // //用户ID
      // dictTranslate('userId').then(res => {
      //   console.log('用户字典', res)
      //   this.userDict = res.data.data
      // })
      // //机构
      // dictTranslate('org').then(res => {
      //   console.log('机构字典', res)
      //   this.orgDict = res.data.data
      // })
    },

    // 点击搜索区的清空按钮，触发该函数，清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm = {}
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
    },
    // 点击新增按钮，触发该函数
    addForm() {
      this.addRuleForm = {}
      this.addDialogVisible = true //对话框显示
      this.addFormToolsVisiable = true //确定按钮显示
      this.addFormDisabled = false //表单可编辑
      this.addFormDeptVisiable = false
      this.addFormUserVisiable = false
    },

    //新增、编辑页面点击确定按钮事件
    addNotcie() {
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
          this.getTableDataList()
        })
      })
    },

    //dialog框关闭时触发的事件
    closeAddForm(formName) {
      this.addRuleForm = {}
      this.$refs[formName].clearValidate()
      this.addDialogVisible = false
    },

    // 点击查看按钮，触发该函数
    view(e) {
      console.log(e, '查看参数')
      this.addDialogVisible = true //对话框显示
      this.addFormToolsVisiable = false //确定按钮隐藏
      this.addFormDisabled = true //表单不可编辑
      this.addFormDeptVisiable = true
      this.addFormUserVisiable = true
      this.addRuleForm = e
      //    this.formDictionary(e)
    },
    // 点击编辑按钮，触发该函数
    edit(e) {
      console.log('当前登录用户信息，', this.currenctUser)
      console.log('本条通知的用户', e.createUser)
      if (this.currenctUser.id != e.createUser) {
        return this.$message.error('仅创建人有权限编辑!')
      }
      console.log(e, '编辑参数')
      this.addDialogVisible = true //对话框显示
      this.addFormToolsVisiable = true //确定按钮显示
      this.addFormDisabled = false //表单可编辑
      this.addFormDeptVisiable = false
      this.addFormUserVisiable = false
      this.addRuleForm = e
      //   this.formDictionary(e)
    },

    //表单字典翻译
    formDictionary(e) {
      //this.addRuleForm = e
      // this.addRuleForm.createDeptName = this.orgDict[e.createDept]
      // this.addRuleForm.createUserName = this.userDict[e.createUser]
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
          if (this.currenctUser.id != data[i].createUser) {
            return this.$message.error('仅创建人有权限删除!')
          }
          ids = ids + ',' + data[i].id
        }
        console.log('需要删除的ID', ids)
        remove(ids).then(res => {
          console.log('删除返回结果', res)
          if (res.status != 200) {
            return this.$message.error('操作失败!')
          }
          this.$message.success('操作成功!')
          this.getTableDataList()
        })
      }).catch(() => {})
    }
  },
  created() {
    //权限控制
    this.permission = getStore({ name: 'permission' })
    console.log('权限数据：', this.permission)
    //获取当前登录机构
    this.getuser()
    //字典转码
    this.getAndTranslateDic()
  }
}
</script>

<style lang="scss" scoped>
// 新增dialog框的样式
.el-dialog {
  .el-dialog__body {
    .el-form {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .timeChoose {
        .el-form-item__content {
          .el-date-editor.el-input {
            // background: blue;
            width: auto !important;
          }
        }
      }
    }
  }
}
#container {
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
