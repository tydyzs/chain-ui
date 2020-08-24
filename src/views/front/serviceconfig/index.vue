<!-- 限额管理-- 服务配置页面 -->
<template>
  <div class="container">
    <div class="operation">
      <el-button type="primary" icon="el-icon-plus" @click="addMsg" size="small">新增</el-button>
      <el-button class="el-icon-delete" type="danger" plain @click="deleteMsg" size="small">删除</el-button>
    </div>
    <!-- 表格区 -->
    <div class="table">
      <!-- 表格详情区 -->
      <el-table :data="tableData" style="width: 100%" size="small" border stripe max-height="500" v-loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" align="center" width="50" fixed :resizable="false" />
        <el-table-column prop="terminalCode" label="终端代码" :resizable="false" align="center" width="150" />
        <el-table-column prop="serviceRole" label="服务角色" :resizable="false" align="center" width="100" />
        <el-table-column prop="serviceCode" label="服务代码" :resizable="false" align="center" width="150" />
        <el-table-column prop="serviceName" label="服务名称" :resizable="false" align="center" width="150" />
        <el-table-column prop="invokeMode" label="调用方式" :resizable="false" align="center" width="150" />
        <el-table-column prop="encodeMode" label="编码方式" :resizable="false" align="center" width="150" />
        <el-table-column prop="messageStyle" label="报文风格" :resizable="false" align="center" width="150" />
        <el-table-column prop="timeout" label="超时时间(秒)" :resizable="false" align="center" width="150" />
        <el-table-column prop="transactionMode" label="事务方式" :resizable="false" align="center" width="150" />
        <el-table-column prop="status" label="是否启用" :resizable="false" align="center" width="110" />
        <el-table-column fixed="right" label="操作" width="150" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-button class="textBtn" type="text" size="small" icon="el-icon-view" @click="showDetail(scope.row)">查看</el-button>
            <el-button class="textBtn" type="text" size="small" icon="el-icon-edit" @click="updateDetail(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <div class="pageination">
        <el-pagination :total="total" :current-page="pageInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="60%" :close-on-click-modal="false" @closed="closeDialogForm('dialogForm')"
      :append-to-body="true">
      <div class="divDialog">
        <el-row>
          <el-form :model="dialogForm" ref="dialogForm" :disabled="isDisabled" :label-width="formLabelWidth" :rules="dialogRules">
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="终端代码" size="small" prop="terminalCode">
                <el-select v-model="dialogForm.terminalCode" placeholder="请选择 终端代码" clearable>
                  <el-option v-for="(item,i) in terminalCodeSelections" :key="i" :label="item.title" :value="item.key" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="服务角色" size="small" prop="serviceRole">
                <el-select v-model="dialogForm.serviceRole" placeholder="请选择 服务角色" clearable>
                  <el-option v-for="(item,i) in serviceRoleSelections" :key="i" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="服务代码" size="small" prop="serviceCode">
                <el-input v-model="dialogForm.serviceCode" autocomplete="off" placeholder="请输入 服务代码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="服务名称" size="small" prop="serviceName">
                <el-input v-model="dialogForm.serviceName" autocomplete="off" placeholder="请输入 服务名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="服务适配器" size="small" prop="serviceAdapter">
                <el-input v-model="dialogForm.serviceAdapter" autocomplete="off" placeholder="请输入 服务适配器"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="调用方式" size="small" prop="invokeMode">
                <el-select v-model="dialogForm.invokeMode" placeholder="请选择 调用方式" clearable>
                  <el-option v-for="(item,i) in invokeModeSelections" :key="i" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="调用接口" size="small" prop="invokeApi">
                <el-input v-model="dialogForm.invokeApi" autocomplete="off" placeholder="请输入 调用接口"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="编码方式" size="small" prop="encodeMode">
                <el-select v-model="dialogForm.encodeMode" placeholder="请选择 编码方式" clearable>
                  <el-option v-for="(item,i) in encodeModeSelections" :key="i" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="报文风格" size="small" prop="messageStyle">
                <el-select v-model="dialogForm.messageStyle" placeholder="请选择 报文风格" clearable>
                  <el-option v-for="(item,i) in messageStyleSelections" :key="i" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="超时时间(秒)" size="small" prop="timeout">
                <el-input-number v-model="dialogForm.timeout" controls-position="right" :min="0"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="事务方式" size="small" prop="transactionMode">
                <el-select v-model="dialogForm.transactionMode" placeholder="请选择 事务方式" clearable>
                  <el-option v-for="(item,i) in transactionModeSelections" :key="i" :label="item.dictValue" :value="item.dictKey" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="版本号" size="small" prop="version">
                <el-input v-model="dialogForm.version" autocomplete="off" placeholder="请输入 版本号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22">
              <el-form-item label="是否启用" size="small" prop="status">
                <el-switch style="display: block" v-model="dialogForm.status" :active-value="1" :inactive-value="2"
                  active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22">
              <el-form-item label="备注" size="small" prop="remark">
                <el-input type="textarea" v-model="dialogForm.remark" autocomplete="off" :autosize="{ minRows: 3, maxRows: 5}"
                  maxlength="200" show-word-limit placeholder="请输入 备注"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
      <div slot="footer" v-if="isShow">
        <el-button type="primary" @click="saveMsg" size="small">保存</el-button>
        <el-button @click="closeDialogForm('dialogForm')" size="small">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, add, update, remove } from '@/api/front/serviceconfig'
import { getTerminalconfig } from '@/api/front/servicerecord'
import { getDictionary } from '@/api/system/dict'
export default {
  data() {
    return {
      multipleSelection: [],
      //新增或编辑
      isAddMsg: true,
      //列表加载属性
      loading: false,
      //表格数据
      tableData: [],
      // 分页数据
      pageInfo: {
        pagenum: 1,
        pagesize: 10
      },
      total: 40,

      //dialog框表单
      title: "",
      dialogForm: {},
      dialogFormVisible: false,
      formLabelWidth: '120px',
      isDisabled: false,
      isShow: false,

      //终端代码
      terminalCodeSelections: [],
      //服务角色
      serviceRoleSelections: [],
      //调用方式
      invokeModeSelections: [],
      //编码方式
      encodeModeSelections: [],
      //报文风格
      messageStyleSelections: [],
      //事务方式
      transactionModeSelections: [],
      //dialog表单校验规则
      dialogRules: {
        terminalCode: [{ required: true, message: '请输入 终端代码', trigger: 'blur' }],
        serviceRole: [{ required: true, message: '请输入 服务角色', trigger: 'blur' }],
        serviceCode: [{ required: true, message: '请输入 服务代码', trigger: 'blur' }],
        serviceName: [{ required: true, message: '请输入 服务名称', trigger: 'blur' }],
        encodeMode: [{ required: true, message: '请输入 编码方式', trigger: 'blur' }],
        messageStyle: [{ required: true, message: '请输入 报文风格', trigger: 'blur' }],
        transactionMode: [{ required: true, message: '请输入 事务方式', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getListCommon();
  },
  methods: {
    getTerminalconfigCommon() {
      getTerminalconfig().then(res => {
        this.terminalCodeSelections = res.data.data
      })
      getDictionary('service_role').then(response => {
        this.serviceRoleSelections = response.data.data
      })
      getDictionary('invoke_mode').then(response => {
        this.invokeModeSelections = response.data.data
      })
      getDictionary('encode_mode').then(response => {
        this.encodeModeSelections = response.data.data
      })
      getDictionary('message_style').then(response => {
        this.messageStyleSelections = response.data.data
      })
      getDictionary('transaction_mode').then(response => {
        this.transactionModeSelections = response.data.data
      })
    },
    //获取表格数据
    getListCommon() {
      this.loading = true
      getList(this.pageInfo.pagenum, this.pageInfo.pagesize).then(res => {
        this.total = res.data.data.total
        this.tableData = res.data.data.records
      }).finally(() => {
        this.loading = false
      })
    },
    //新增服务配置
    addMsg() {
      this.isAddMsg = true
      this.isDisabled = false
      this.title = "新增"
      this.getTerminalconfigCommon()
      this.isShow = true
      this.dialogFormVisible = true
    },
    //删除服务配置
    deleteMsg() {
      if (this.multipleSelection.length == 0) {
        return this.$message.error('请选择一条记录')
      }
      const data = this.multipleSelection
      if (data.length > 0) {
        var str = ''
        for (let i = 0; i < data.length; i++) {
          //拼接即将删除的记录的id
          if (i == 0) {
            str = str + data[i].id
          } else {
            str = str + ',' + data[i].id
          }
        }
        this.$confirm('将删除此条记录，是否确定？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          remove(str).then(res => {
            if (res.status != 200) {
              return this.$message.error('操作失败!')
            }
            this.$message.success('操作成功!')
            this.getListCommon()
          })
        }).catch(() => { })
      }
    },
    //当勾选每条数据时触发的函数
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    //查看某条记录
    showDetail(row) {
      this.isDisabled = true
      this.title = "查看"
      this.getTerminalconfigCommon()
      this.dialogForm = row
      this.isShow = false
      this.dialogFormVisible = true
    },
    //编辑某条记录
    updateDetail(row) {
      this.isAddMsg = false
      this.isDisabled = false
      this.title = "编辑"
      this.getTerminalconfigCommon()
      this.dialogForm = row
      this.isShow = true
      this.dialogFormVisible = true
    },
    //点击保存
    saveMsg() {
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入完整的信息')
        }
        if (this.isAddMsg) {
          add(this.dialogForm).then(res => {
            if (res.status != 200) {
              return this.$message.error('操作失败!')
            }
            this.$message.success('操作成功!')
            this.dialogFormVisible = false
          })
        } else {
          update(this.dialogForm).then(res => {
            if (res.status != 200) {
              return this.$message.error('操作失败!')
            }
            this.$message.success('操作成功!')
            this.dialogFormVisible = false
          })
        }
        this.getListCommon()
      })
    },
    //dialog关闭时触发的函数
    closeDialogForm(formName) {
      this.dialogForm = {}
      this.$refs[formName].clearValidate()
      this.dialogFormVisible = false
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.pageInfo.pagesize = newSize
      this.getListCommon()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(`当前页: ${newPage}`)
      this.pageInfo.pagenum = newPage
      this.getListCommon()
    },
  }
}
</script>

<style lang='scss' scoped>
.container {
  padding: 10px 15px;
  .operation {
    padding-bottom: 10px;
  }
  // 分页区样式
  .pageination {
    float: right;
    padding-top: 2vh;
  }
  .el-dialog {
    .divDialog {
      height: 450px;
      overflow: auto;
      .el-form {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-top: 1vh;
        .el-select {
          width: 100%;
        }
        .el-input-number {
          width: 100%;
        }
      }
    }
  }
}
</style>
