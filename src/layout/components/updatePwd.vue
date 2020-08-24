<template>
    <div class="dialog">
        <el-dialog title="修改密码" :close-on-click-modal="false" :append-to-body="true" :lock-scroll="false" :visible.sync="dialogStatus" width="500px" @close='hideDialog'>
            <el-form :model="updatePwdForm" ref="updatePwdForm" label-width="100px" :rules="rules" size="small">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="原密码" prop="oldPassword">
                            <el-input v-model="updatePwdForm.oldPassword" maxlength="20" auto-complete="off" placeholder="原始密码" size="small" show-password clearable/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input v-model="updatePwdForm.newPassword"  maxlength="20" auto-complete="off" placeholder="新密码" size="small" show-password clearable/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="确认密码" prop="newPassword1">
                            <el-input v-model="updatePwdForm.newPassword1"  maxlength="20" auto-complete="off" placeholder="确认密码" size="small" show-password clearable/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button icon="el-icon-close" size="small" @click="cencel()">取 消</el-button>
                <el-button icon="el-icon-check" type="primary" :loading="loading" size="small" @click="save()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>

import { updatePassword } from '@/api/system/user'

export default {
  name: 'updatePwd',
  data() {
    return {
      dialogStatus: false,
      updatePwdForm: {
        oldPassword: '',
        newPassword: '',
        newPassword1: ''
      },
      loading: false,
      rules: {
        oldPassword: [{ required: true, message: '原密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '新密码', trigger: 'blur' }],
        newPassword1: [{ required: true, message: '确认密码', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {},
    showDialog() {
      this.dialogStatus = true      
    },
    hideDialog() {
      this.dialogStatus = false
      this.$refs.updatePwdForm.resetFields()
    },
    cencel() {
      this.hideDialog()
    },
    save() {
      this.$refs.updatePwdForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.updatePwdForm.newPassword != this.updatePwdForm.newPassword) {
            this.$message({
              type: 'error',
              message: '新密码与确认密码不一致'
            })
            this.loading = false
            return false
          }
          updatePassword(this.updatePwdForm.oldPassword,this.updatePwdForm.newPassword,this.updatePwdForm.newPassword1).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: 'success',
                message: '用户密码更新成功!'
              })
              this.loading = false
              this.hideDialog()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
              this.loading = false
            }
          })
         
        } else {
          return false
        }
      })
    }
  }
}
</script>



