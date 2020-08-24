<template>
  <div class="dialog">
    <el-dialog :title="title" :close-on-click-modal="false" :append-to-body="true" :lock-scroll="false" :visible.sync="dialogStatus" width="50%" @close='hideDialog'>
      <el-form :model="orgForm" :disabled="actionType=='view'" ref="orgForm" label-width="100px" :rules="rules" size="small">
        <el-row>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="机构号" prop="id">
              <el-input v-model="orgForm.id" maxlength="32" placeholder="机构号" size="small" clearable/>
            </el-form-item>
          </el-col>

          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="机构名称" prop="deptName">
              <el-input v-model="orgForm.deptName" maxlength="200" placeholder="机构名称" size="small" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="机构全称" prop="fullName">
              <el-input v-model="orgForm.fullName" maxlength="200" placeholder="机构全称" size="small" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="上级机构" prop="parentId">
              <tree-select ref="parentOrgTree" :props="props" :options="orgTreeData" :value="orgForm.parentId" :clearable="isClearable" :accordion="isAccordion" @getValue="getValue($event)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="机构类型" prop="orgType">
              <el-select v-model="orgForm.orgType" style="width:100%" placeholder="请选择" size="small" clearable>
                <el-option v-for="item in orgTypeData" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="机构等级" prop="deptLevel">
              <el-select v-model="orgForm.deptLevel" style="width:100%" placeholder="请选择" size="small" clearable>
                <el-option v-for="item in orgLevelData" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="所属地区" prop="aeraCode">
              <el-select v-model="orgForm.aeraCode" style="width:100%" placeholder="请选择" size="small" clearable>
                <el-option v-for="item in aeraCodeData" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey">
                </el-option>
              </el-select>
            </el-form-item>            
          </el-col>
          <el-col :span="4" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="排序" prop="sort">
              <el-input-number style="width:100%" placeholder="排序" v-model="orgForm.sort" controls-position="right" :min="1" :max="1000" size="small" clearable />
            </el-form-item>
          </el-col>
          </el-row>
        <el-row>
          <el-col :span="4" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="orgForm.remark" maxlength="255" placeholder="备注" size="small" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" size="small" @click="cencel()">取 消</el-button>
        <el-button icon="el-icon-check" v-if="actionType!='view'" type="primary" :loading="loading" size="small" @click="save()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import TreeSelect from '@/components/TreeSelect'
import common from '@/config/common.json'
import { getDeptTree, add, getDept } from '@/api/system/dept'
export default {
  name: 'deptDetail',
  components: { TreeSelect },
  data() {
    return {
      title: '',
      loading: false,
      dialogStatus: false,
      actionType: '',
      orgTypeData: [],
      aeraCodeData:[],
      orgLevelData: [],
      orgForm: {},
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: {
        // 配置项（必选）
        value: 'id',
        label: 'title',
        children: 'children',
        disabled: false
      },
      // 选项列表（必选）
      orgTreeData: [],
      rules: {
        id: [{ required: true, message: '机构号', trigger: 'blur' }],
        deptName: [{ required: true, message: '机构名称', trigger: 'blur' }],
        fullName: [{ required: true, message: '机构全称', trigger: 'blur' }],
        parentId: [{ required: true, message: '父级机构', trigger: 'change' }],
        orgType: [{ required: true, message: '机构类型', trigger: 'change' }],
        deptLevel: [{ required: true, message: '机构等级', trigger: 'change' }],
        aeraCode: [{ required: true, message: '所属地区', trigger: 'change' }],
        sort: [{ required: true, message: '排序', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getDeptTree('000000').then(res => {
        this.orgTreeData = res.data.data
      })

    },
    showDialog(actionType, id, orgTypeData, orgLevelData,aeraCodeData) {
      this.actionType = actionType
      this.title = common[actionType]
      this.dialogStatus = true
      this.props.disabled = (actionType != 'add' || id == '01000')
      this.orgTypeData = orgTypeData
      this.orgLevelData = orgLevelData
      this.aeraCodeData = aeraCodeData
      if (id != null && id != '') {
        getDept(id).then(res => {
          if (res.data.code == 200) {
            this.orgForm = res.data.data
          }
        })
      }
      this.$nextTick(() => {
        this.$refs['orgForm'].clearValidate()
      })
    },
    hideDialog() {
      this.orgForm = {}
      this.dialogStatus = false
      this.$refs.parentOrgTree.clearHandle()
    },
    cencel() {
      this.hideDialog()
    },
    save() {
      this.$refs.orgForm.validate(valid => {
        if (valid) {
          this.loading = true
          add(this.orgForm).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
              this.loading = false
              this.$emit('afterSave')
              this.hideDialog()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
              this.loading = false
            }
          }),
            error => {
              this.loading = false
              console.log(this.error)
            }
        } else {
          return false
        }
      })
    },
    getValue(value) {
      this.orgForm.parentId = value
    }
  }
}
</script>



