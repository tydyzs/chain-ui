<!-- 参数管理--串用管理 -->
<template>
  <div class="container">
    <!-- 搜索区 -->
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="ruleForm" :model="ruleForm" :rules="ruleFromRules" label-width="100px" class="ruleForm" size="small">
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="串用组名称" prop="lstgName">
              <el-input v-model="ruleForm.lstgName" placeholder="串用组名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="串用组类型" prop="lstgType">
              <el-select v-model="ruleForm.lstgType" placeholder="串用组类型" size="small" p clearable>
                <el-option v-for="item in lstgTypeSelection" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
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
        <el-button v-if="permission.borrow_add" type="primary" icon="el-icon-plus" size="small" @click="addForm">新 增
        </el-button>
        <el-button v-if="permission.borrow_delete" type="danger" icon="el-icon-delete" size="small" @click="remove">删 除
        </el-button>
      </div>
      <!-- 表格详情区 -->
      <template>
        <el-table :data="tableData" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          @selection-change="selectChange" style="width: 100%" size="medium" v-loading="loading" border stripe>
          <el-table-column type="selection" width="55" :resizable="false" align="center" />
          <el-table-column type="index" label="序号" align="center" width="50" />
          <el-table-column prop="lstgName" label="串用组名称" :resizable="false" width="200" align="left" />
          <el-table-column prop="lstgTypeName" label="串用组类型" :resizable="false" align="center">
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.lstgTypeName }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="crdDetailPrdName" label="额度产品" :resizable="false" align="center" />
          <el-table-column prop="lstgPrdName" label="串用额度产品" :resizable="false" align="center" width="180" />
          <el-table-column prop="proLimit" label="串用比例上限" :resizable="false" align="center" />
          <el-table-column prop="orgName" label="机构" :resizable="false" align="center" />
          <el-table-column prop="userName" label="经办人" :resizable="false" align="center" />
          <el-table-column label="操作" width="200" fixed="right" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-button v-if="permission.borrow_view" class="textBtn" type="text" icon="el-icon-zoom-in" size="mini"
                @click="view(scope.row)">查看</el-button>
              <el-button v-if="permission.borrow_edit" class="textBtn" type="text" icon="el-icon-edit" size="mini"
                @click="edit(scope.row)">编辑</el-button>
              <el-button v-if="permission.borrow_detail" class="textBtn" type="text" icon="el-icon-view" size="mini"
                @click="detail(scope.row)">串用明细</el-button>
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
      <el-dialog title="串用组信息" :visible.sync="addDialogVisible" :close-on-click-modal="false"
        :lock-scroll="false" @closed="closeAddForm('addRuleForm')" width="60%">
        <el-form :model="addRuleForm" ref="addRuleForm" :rules="addRuleFormRules" :disabled="addFormDisabled"
          label-width="120px" class="addRuleForm">
          <el-form-item prop="lstgId" v-if="false">
            <el-input v-model="addRuleForm.lstgId" v-if="false" clearable />
          </el-form-item>

          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="串用组名称" prop="lstgName">
              <el-input v-model="addRuleForm.lstgName" placeholder="请输入 串用组名称" size="small" clearable />
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item class="lstgType" label="串用组类型" prop="lstgType">
              <el-select v-model="addRuleForm.lstgType" placeholder="请选择" size="small" @change="lstgTypeChanged"
                clearable>
                <el-option v-for="item in lstgTypeSelection" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" v-if="customerVisible">
            <el-form-item label="客户编号" prop="customerNum">
              <el-input v-model="addRuleForm.customerNum" clearable :disabled="true" size="small">
                <el-button slot="append" icon="el-icon-search" @click="chooseCustomer" :disabled="false"></el-button>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12" v-if="customerVisible">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="addRuleForm.customerName" size="small" :disabled="true" />
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="额度产品" prop="crdDetailPrd">
              <tree-select :props="props" :options="crdTree" :value="addRuleForm.crdDetailPrd" :clearable="true"
                :accordion="true" @getValue="getCrdDetailPrd($event)" />
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="串用额度产品" prop="lstgPrd" width="500px">
              <tree-select :props="props" :options="crdTree" :value="addRuleForm.lstgPrd" :clearable="true" :accordion="true"
                @getValue="getLstgPrd($event)" />
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="串用比例上限" prop="proLimit">
              <el-input-number v-model="addRuleForm.proLimit" :min="0" :max="100" placeholder="请输入 串用比例上限" size="small"
                clearable />
            </el-form-item>
          </el-col>

          <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="addRuleForm.remark" placeholder="请输入 备注" type="textarea" size="small" clearable />
            </el-form-item>
          </el-col>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <span slot="footer" class="dialog-footer">
            <el-button icon="el-icon-close" size="small" @click="closeAddForm('addRuleForm')">
              取
              消
            </el-button>
            <el-button type="primary" icon="el-icon-check" size="small" v-if="addFormToolsVisiable" @click="submit()">确
              定</el-button>
          </span>
        </span>
      </el-dialog>
    </div>

    <!-- 客户选择dialog框 -->
    <el-dialog class="customerDialog" title="请选择客户" :visible.sync="customerDialogVisible" :lock-scroll="false" width="70%" height="410"
      @closed="closeCustomerDialog">
      <!-- 查询条件 -->
      <div class="search">
        <el-form :model="customerForm" ref="customerForm" label-width="100px">
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="customerForm.customerName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="证件号码" prop="certNum">
              <el-input v-model="customerForm.certNum" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item>
              <el-button type="primary" @click="getCustomerList" size="small">查询</el-button>
              <el-button @click="clearCustomer('customerForm')" size="small">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <!-- 详细表格信息 -->
      <div class="table">
        <template>
          <el-table :data="customerList" style="width: 100%" height="400" v-loading="customerLoading" border stripe>
            <el-table-column type="index" label="序号" align="center" width="50" />
            <el-table-column prop="customerName" label="客户名称"></el-table-column>
            <el-table-column prop="customerNum" label="客户编号" />
            <el-table-column prop="certTypeName" label="证件类型" />
            <el-table-column prop="certNum" label="证件号码" />
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="makeSureCustomer(scope.row)" type="text" size="small">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <!-- 分页功能区 -->
      <!-- <div class="pageination"> -->
      <el-pagination class="pageination" @size-change="customerSizeChange" @current-change="customerCurrentChange"
        :current-page="customerPageInfo.pageNum" :page-sizes="[10]" :page-size="customerPageInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="customerPageInfo.total" style="float: right;margin: 1vh 0;">
      </el-pagination>
      <!-- </div> -->
    </el-dialog>
  </div>
</template>

<script>
import TreeSelect from '@/components/TreeSelect'
import common from '@/config/common.json'
import {
  getList,
  page,
  remove,
  submit,
  customerPage
} from '@/api/arguments/borrow'
import { getDictionary, dictTranslate } from '@/api/system/dict'
import { getTreeData } from '@/api/arguments/product'
import { getStore } from '@/utils/store'

export default {
  name: 'borrow',
  components: { TreeSelect },
  data () {
    return {
      permission: {}, //页面按钮权限控制
      lstgTypeDict: [], //菜单类型下拉选项
      lstgTypeSelection: [], //菜单类型下拉选项
      // 列表查询参数
      ruleForm: {},
      loading: false,
      customerLoading: false,
      // 表单内容校验规则
      ruleFromRules: {},
      loading: true,
      //分页数据
      pageInfo: {
        currentPage: 1,
        pageSize: 8,
        total: 0
      },

      //客户查询条件
      customerForm: {},
      customerList: [],
      //客户选择分页数据
      customerPageInfo: {
        currentPage: 1,
        pageSize: 8,
        total: 0
      },
      customerDialogVisible: false, //客户查询可见性

      // =====表格区数据=====
      tableData: [],
      // =====新增dialog框可见性、可编辑性
      addDialogVisible: false,
      addFormDisabled: false,
      addFormToolsVisiable: true,
      customerVisible: true,
      //列表选择的内容
      multipleSelection: [],

      //新增、修改、查看的表单
      addRuleForm: {},

      //新增、修改、查看的表单校验规则
      addRuleFormRules: {
        lstgName: [{ required: true, message: '串用组名称', trigger: 'blur' }],
        lstgType: [{ required: true, message: '串用组类型', trigger: 'blur' }],
        crdDetailPrd: [
          { required: false, message: '额度产品', trigger: 'change' }
        ],
        lstgPrd: [{ required: false, message: '串用额度', trigger: 'change' }],
        proLimit: [{ required: true, message: '串用比例上限', trigger: 'blur' }]
      },

      crdTree: [],
      //上级菜单选项的父子数据
      props: {
        // 配置项（必选）
        value: 'CRD_PRODUCT_NUM',
        label: 'label',
        children: 'children',
        disabled: false
      }
    }
  },

  methods: {
    //获取列表数据
    getTableDataList () {
      this.loading = true
      page(this.pageInfo.currentPage, this.pageInfo.pageSize, this.ruleForm)
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

    //下拉选项翻译
    getAndTranslateDic () {
      // //菜单类型列表翻译
      // dictTranslate('borrow_category').then(res => {
      //   this.menuType = res.data.data
      // })
      //菜单类型下拉选项
      getDictionary('CD000275').then(res => {
        console.log('串用组类型', res)
        this.lstgTypeSelection = res.data.data
      })
    },

    //搜索按钮
    searchInfo () {
      console.log('查询参数：', this.ruleForm)
      this.getTableDataList()
    },

    // 点击搜索区的重置按钮，触发该函数，重置表单内容
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.ruleForm = {}
    },
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

    getCrdDetailPrd (value) {
      this.addRuleForm.crdDetailPrd = value
      console.log('额度产品', this.addRuleForm.crdDetailPrd)
    },
    getLstgPrd (value) {
      this.addRuleForm.lstgPrd = value
    },
    // 点击新增按钮，触发该函数
    addForm () {
      this.addRuleForm = {}
      this.addDialogVisible = true
      this.addFormToolsVisiable = true
      this.addFormDisabled = false
      this.formDictionary()
    },
    // 点击查看按钮，触发该函数
    view (e) {
      console.log(e, '查看参数')
      this.addDialogVisible = true
      this.addFormToolsVisiable = false
      this.addFormDisabled = true
      this.addRuleForm = e
      this.formDictionary(e)
      this.lstgTypeChanged()
    },
    // 点击编辑按钮，触发该函数
    edit (e) {
      console.log(e, '编辑参数')
      this.addDialogVisible = true
      this.addFormToolsVisiable = true
      this.addFormDisabled = false
      this.addRuleForm = e
      this.formDictionary(e)
      this.lstgTypeChanged()
    },

    //表单字典翻译
    formDictionary (e) {
      //菜单选择树
      getTreeData().then(res => {
        console.log('额度产品选择树', res)
        this.crdTree = res.data.data
      })
    },

    //新增、编辑页面点击确定按钮事件
    submit () {
      this.$refs.addRuleForm.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入完整的信息')
        }
        console.log('三级额度产品', this.addRuleForm.crdDetailPrd)
        //如果额度产品是数组，自取数组中最后一条记录
        if (this.addRuleForm.crdDetailPrd instanceof Array) {
          let pidLength = this.addRuleForm.crdDetailPrd.length
          this.addRuleForm.crdDetailPrd = this.addRuleForm.crdDetailPrd[
            pidLength - 1
          ]
        }
        //如果串用额度产品是数组，自取数组中最后一条记录
        if (this.addRuleForm.lstgPrd instanceof Array) {
          let pidLength = this.addRuleForm.lstgPrd.length
          this.addRuleForm.lstgPrd = this.addRuleForm.lstgPrd[pidLength - 1]
        }
        console.log('新增参数', this.addRuleForm)
        submit(this.addRuleForm).then(res => {
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
    closeAddForm (formName) {
      this.addRuleForm = {}
      this.$refs[formName].clearValidate()
      this.addDialogVisible = false
    },
    //列表选中后的触发事件
    selectChange (e) {
      this.multipleSelection = e
    },

    remove () {
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
          ids = ids + ',' + data[i].lstgId
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

    //串用组类型变化时，触发的事件
    lstgTypeChanged () {
      if (this.addRuleForm.lstgType == '2') {
        //串用组类型为单一客户串用时，客户信息无法编辑
        this.customerVisible = true
        this.addRuleForm.customerNum = ''
        this.addRuleForm.customerName = ''
      } else {
        this.customerVisible = false
      }
    },
    // 搜索客户
    chooseCustomer () {
      this.customerPageInfo.currentPage = 1
      this.customerPageInfo.pageSize = 10
      this.getCustomerList()
      this.customerDialogVisible = true
    },
    //关闭客户选择器
    closeCustomerDialog () {
      this.customerForm = {}
    },
    // 点击重置按钮，重置input中的内容(客户)
    clearCustomer () {
      this.$refs['customerForm'].resetFields()
    },
    //选择客户确定
    makeSureCustomer (row) {
      console.log(row, '打印选择客户的信息')
      this.addRuleForm.customerNum = row.customerNum
      this.addRuleForm.customerName = row.customerName
      this.customerDialogVisible = false
    },
    //获取客户列表数据
    getCustomerList () {
      this.customerLoading = true
      customerPage(
        this.customerPageInfo.currentPage,
        this.customerPageInfo.pageSize,
        this.customerForm
      )
        .then(res => {
          console.log('客户列表数据', res)
          this.customerPageInfo.total = res.data.data.total
          this.customerList = res.data.data.records
        })
        .finally(() => {
          this.customerLoading = false
        })
    },

    // 监听 pagesize 改变的事件
    customerSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.customerPageInfo.pageSize = val
      this.getCustomerList()
    },
    // 监听 页码值 改变的事件
    customerCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.customerPageInfo.currentPage = val
      this.getCustomerList()
    },
    detail (val) {
      // console.log('测试按钮');
      this.$router.push({ name: 'borrowDetailList', params: { val: val } })
      sessionStorage.setItem('borrowVal', JSON.stringify(val))
    }
  },
  created () {
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
  // .el-select {
  //   display: block !important;
  // }
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
      th.has-gutter {
        display: table-cell !important;
      }
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
    padding-top: 1vh;
  }
  // 新增dialog框的样式
  .addDialog /deep/ {
    .el-dialog__wrapper {
      .el-dialog__body {
        .el-form {
          .el-form-item__content {
            .el-select,
            .el-input-number {
              width: 100%;
            }
            .el-input-group {
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
  .customerDialog /deep/ {
    .el-dialog__body {
      padding: 30px 20px 60px !important;
    }
  }
}
</style>
