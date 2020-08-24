<template>
  <div class="dialog">
    <el-dialog :title="title" :close-on-click-modal="false" :append-to-body="true" :lock-scroll="false" :visible.sync="addDialogVisible"
      width="50%" @close="hideDialog">
      <el-form :model="addRuleForm" :disabled="actionType=='view'" ref="addRuleForm" label-width="120px" :rules="addRuleFormRules"
        size="small">
        <el-row>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="业务品种编号" prop="productNum">
              <el-input v-model="addRuleForm.productNum" placeholder="请输入 业务品种编号" :disabled="numIsDisabled" size="small"
                clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="授信系统" prop="creditSystem">
              <el-select v-model="addRuleForm.creditSystem" placeholder="--请选择--" style="width:100%" @change="checkSelect"
                size="small" clearable>
                <el-option v-for="(item, i) in sysNoSelection" :key="i" :label="item.terminalName" :value="item.terminalCode" />
              </el-select>
              <el-button icon="el-icon-search" type="primary" size="small" @click="query" v-if="queryVisiable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="业务品种名称" prop="productName">
              <el-input v-model="addRuleForm.productName" size="small" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="用信系统" prop="useSystem">
              <el-select v-model="addRuleForm.useSystem" placeholder="--请选择--" style="width:100%" size="small"
                clearable>
                <el-option v-for="(item, i) in sysNoSelection" :key="i" :label="item.terminalName" :value="item.terminalCode" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="风险暴露类型" prop="riskExposureType">
              <el-select v-model="addRuleForm.riskExposureType" placeholder="--请选择--" style="width:100%" size="small"
                clearable>
                <el-option v-for="item in riskExposureTypeSelection" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="业务品种状态" prop="productStatusCd">
              <el-select v-model="addRuleForm.productStatusCd" placeholder="--请选择--" style="width:100%" size="small"
                clearable>
                <el-option v-for="item in productStatusCdSelection" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="额度占用方式" prop="limitUsedType">
              <el-select v-model="addRuleForm.limitUsedType" placeholder="--请选择--" style="width:100%" :disabled="isDisabled"
                size="small" clearable>
                <el-option v-for="item in limitUsedTypeSelection" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="表内外标志" prop="inoutTable">
              <el-select v-model="addRuleForm.inoutTable" placeholder="--请选择--" style="width:100%" size="small"
                clearable>
                <el-option v-for="item in inoutTableSelection" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="说明" prop="productDescr">
              <el-input v-model="addRuleForm.productDescr" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入 说明" size="small" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span slot="footer" class="dialog-footer">
          <el-button icon="el-icon-close" size="small" @click="hideDialog">取 消</el-button>
          <el-button icon="el-icon-check" size="small" type="primary" v-if="actionType=='add'" :loading="handleloading"
            @click="addForm">确 定</el-button>
          <el-button icon="el-icon-check" size="small" type="primary" v-if="actionType=='edit'" :loading="handleloading"
            @click="updateForm">确 定</el-button>
        </span>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getBreed,
  queryBusinessType,
  remove,
  update,
  add
} from '@/api/arguments/businessType'
import common from '@/config/common.json'
export default {
  name: 'breedDetail',
  data() {
    return {
      title: '',
      handleloading: false,
      // 弹出框是否可见
      addDialogVisible: false,
      // 来源系统后的查询按钮是否可见
      queryVisiable: false,
      // 额度占用方式是否不可编辑
      isDisabled: true,
      // 业务品种编号是否 不可编辑
      numIsDisabled: false,
      // 弹出框用途
      actionType: '',
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
      // 弹出框数据源
      addRuleForm: {
        productNum: '',
        creditSystem: '',
        productName: '',
        useSystem: '',
        productType: '',
        custType: '',
        guaranteeType: '',
        limitUsedType: '',
        riskExposureType: '',
        inoutTable: '',
        productStatusCd: '',
        productDescr: ''
      },
      addRuleFormRules: {
        productNum: [
          { required: true, message: '请输入 业务品种编号', trigger: 'blur' }
        ],
        productName: [
          { required: true, message: '请输入 业务品种名称', trigger: 'blur' }
        ],
        creditSystem: [
          { required: true, message: '请选择 授信系统', trigger: 'change' }
        ],
        useSystem: [
          { required: true, message: '请选择 用信系统', trigger: 'change' }
        ],
        riskExposureType: [
          { required: true, message: '请选择 风险表露类型', trigger: 'change' }
        ],
        inoutTable: [
          { required: true, message: '请选择 表内外标志', trigger: 'change' }
        ],
        productStatusCd: [
          { required: true, message: '请选择 业务品种状态', trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    showDialog(
      actionType,
      id,
      productStatusCdSelection,
      limitUsedTypeSelection,
      riskExposureTypeSelection,
      inoutTableSelection,
      sysNoSelection
    ) {
      this.actionType = actionType
      this.title = common[actionType]
      this.addDialogVisible = true
      this.productStatusCdSelection = productStatusCdSelection
      this.limitUsedTypeSelection = limitUsedTypeSelection
      this.riskExposureTypeSelection = riskExposureTypeSelection
      this.inoutTableSelection = inoutTableSelection
      this.sysNoSelection = sysNoSelection
      if (actionType == 'edit') {
        console.log(actionType)
        this.numIsDisabled = true
      }
      if (id != null && id != '') {
        getBreed(id).then(res => {
          if (res.data.code == 200) {
            console.log(res.data.data)
            this.addRuleForm = res.data.data
            if (this.addRuleForm.creditSystem == '0007') {
              this.queryVisiable = true
              this.isDisabled = false
            }
          }
        })
      }
      this.$nextTick(() => {
        this.$refs['addRuleForm'].clearValidate()
      })
    },
    hideDialog() {
      this.addRuleForm = {productNum: '',
                          creditSystem: '',
                          productName: '',
                          useSystem: '',
                          productType: '',
                          custType: '',
                          guaranteeType: '',
                          limitUsedType: '',
                          riskExposureType: '',
                          inoutTable: '',
                          productStatusCd: '',
                          productDescr: ''}
      this.addDialogVisible = false
      this.isDisabled = true
      this.queryVisiable = false
      this.numIsDisabled = false
    },

    // 来源系统选择信贷时，有查询按钮
    checkSelect(e) {
      console.log('弹出框中选择的来源系统', e)
      if (e == '0007') {
        this.queryVisiable = true
        this.isDisabled = false
      } else {
        this.queryVisiable = false
        this.isDisabled = true
      }
    },

    // 查询业务品种
    query() {
      console.log('查询业务品种编号', this.addRuleForm.productNum)
      if (this.addRuleForm.productNum == '') {
        return this.$message.warning('请输入业务品种编号！')
      }
      queryBusinessType(this.addRuleForm.productNum).then(res => {
        console.log('查询业务品种信息', res)
        this.addRuleForm.productName = res.data.data.productName
        this.$message.success('查询成功')
      })
    },

    addForm() {
      this.$refs.addRuleForm.validate(valid => {
        if (!valid) {
          return this.$message.error('请输入完整的信息')
        }
        this.handleloading = true
        add(this.addRuleForm)
          .then(
            res => {
              console.log('新增结果', res)
              if (res.status != 200) {
                return this.$message.error(res.data.msg)
              }
              this.$message.success('操作成功!')
              this.$emit('afterSave')
              this.addDialogVisible = false
            },
            error => {
              return this.$message.error('操作失败!')
            }
          )
          .finally(() => {
            this.handleloading = false
          })
      })
    },
    updateForm() {
      this.$refs.addRuleForm.validate(valid => {
        if (!valid) {
          return this.$message.warning('请输入完整的信息')
        }
        this.handleloading = true
        update(this.addRuleForm)
          .then(
            res => {
              console.log('更新结果', res)
              if (res.status != 200) {
                return this.$message.error(res.data.msg)
              }
              this.$message.success('操作成功!')
              this.$emit('afterSave')
              this.addDialogVisible = false
            },
            error => {
              return this.$message.error('操作失败!')
            }
          )
          .finally(() => {
            this.handleloading = false
          })
      })
    }
  }
}
</script>



