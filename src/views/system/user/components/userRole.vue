<template>
  <div class="dialog">
    <el-dialog title="用户角色设置" :close-on-click-modal="false" :append-to-body="true" :lock-scroll="false" :visible.sync="dialogStatus" width="40%" @close='hideDialog'>
      <el-form :model="userRoleForm" :rules="userRoleRules" ref="userRoleForm" label-width="100px" class="tableForm">
        <!-- 机构名称 -->
        <el-form-item label="机构名称" prop="deptId">
          <tree-select ref="orgTree" :props="props" :options="orgTreeData" :value="userRoleForm.deptId" :clearable="isClearable" :accordion="isAccordion" @getValue="getValue($event)" />
        </el-form-item>
        <!-- 名称 -->
        <el-form-item label="所属角色" prop="roleId">
          <el-select v-model="userRoleForm.roleId" multiple style="width:100%" placeholder="请选择" size="small" clearable>
            <el-option v-for="item in roleData" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>       
      </el-form>
       <!-- 按钮 -->
       <span slot="footer" class="dialog-footer">
         <el-button icon="el-icon-close" size="small" @click="hideDialog()">取 消</el-button>
          <el-button icon="el-icon-check" size="small" :loading="loading" type="primary" @click="save">确定</el-button>
       </span>
    </el-dialog>
  </div>
</template>

<script>
import common from '@/config/common.json'
import { getDeptTree } from '@/api/system/dept'
import { getRoleTreeByDeptLevel } from '@/api/system/role'
import { getUserRoleById, addUserRole, updateUserRole } from '@/api/system/user'

import TreeSelect from '@/components/TreeSelect'

export default {
  name: 'userRole',
  components: { TreeSelect },
  data() {
    return {
      loading : false,
      userRoleForm: {},
      roleData: [],
      dialogStatus: false,
      actionType: '',
      orgTreeData: [],
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: {
        // 配置项（必选）
        value: 'id',
        label: 'title',
        children: 'children',
        disabled: false
      },
      userRoleRules: {
        deptName: [{ required: true, message: '所属机构', trigger: 'blur' }],
        roleId: [{ required: true, message: '所属角色', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      //装入机构树
      this.loadOrgData()
    },
    loadOrgData() {
      getDeptTree('000000').then(res => {
        this.orgTreeData = res.data.data
      })
    },
    async loadRoleData(deptId) {
      this.userRoleForm['roleId'] = []
      getRoleTreeByDeptLevel(deptId).then(res => {
        this.roleData = res.data.data
      })
    },
    getValue(value) {
      this.userRoleForm.deptId = value
      //更新角色列表
      if (value != null && value != '') {
        this.loadRoleData(value)
      }
    },
    showDialog(actionType, id, userId) {
      this.actionType = actionType
      this.title = common[actionType]
      this.dialogStatus = true
      console.log(this.orgTreeData)
      if (id != null && id != '') {
        getUserRoleById(id).then(res => {
          let roleId = res.data.data.roleId
          this.loadRoleData(res.data.data.deptId)
          this.userRoleForm = res.data.data
          this.userRoleForm.roleId = roleId.split(',')
        })
      } else {
        this.userRoleForm.userId = userId
        // this.userRoleForm.roleId = {}
      }
      this.$nextTick(()=>{
          this.$refs['userRoleForm'].clearValidate();        
      })
    },
    hideDialog() {
      for(let k in this.userRoleForm){
         this.userRoleForm[k] = null
      }
      this.roleData = []
      this.$refs.orgTree.clearHandle()
      this.dialogStatus = false
    },
    save() {
      this.$refs.userRoleForm.validate(valid => {
        if (valid) {
          this.loading = true
          let roles = this.userRoleForm.roleId
          this.userRoleForm.roleId = this.userRoleForm.roleId.join()
          if (this.actionType == 'add') {
            addUserRole(this.userRoleForm).then(res => {
              if (res.status !== 200) {
                return this.$message.error('添加用户角色失败，请重试')
              }
              this.$message.success('操作成功')
              this.loading = false
              this.$emit('afterSave')
              this.hideDialog()
            })
          } else if (this.actionType == 'edit') {
            updateUserRole(this.userRoleForm).then(res => {
              if (res.status !== 200) {
                return this.$message.error('添加用户角色失败，请重试')
              }
              this.$message.success('操作成功')
              this.loading = false
              this.$emit('afterSave')
              this.hideDialog()
            })
          }
        }
      })
    }
  }
}
</script>

