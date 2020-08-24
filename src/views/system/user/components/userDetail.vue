<template>
  <div class="dialog">
    <el-dialog :title="title" :close-on-click-modal="false" :append-to-body="true" :lock-scroll="false" :visible.sync="dialogStatus" width="60%" @close='hideDialog'>
      <!-- 上方主表单 -->
      <el-row :gutter="10">
        <el-form :model="userForm" :disabled="actionType=='view'" :rules="rules" ref="userForm" label-width="100px" class="topForm">
          <!-- 登录账号 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="登录账号" prop="account">
              <el-input v-model="userForm.account" maxlength="20" size="small" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- 用户昵称 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="用户昵称" prop="name">
              <el-input v-model="userForm.name"  maxlength="10" size="small" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- 用户姓名 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="用户姓名" prop="realName">
              <el-input v-model="userForm.realName"  maxlength="10" size="small" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- 手机号码 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model.number="userForm.phone" maxlength="11" size="small" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- 电子邮箱 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="userForm.email" maxlength="25" size="small" clearable></el-input>
            </el-form-item>
          </el-col>
          <!-- 用户性别 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="用户性别" prop="sex">
              <el-select v-model="userForm.sex" style="width:100%" placeholder="请选择" size="small" clearable>
                <el-option v-for="item in sexData" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 用户生日 -->
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="用户生日" prop="birthday">
              <el-date-picker v-model="userForm.birthday" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" size="small" :editable="false" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <!-- 下方表格内容 -->
      <div class="downTable">
        <div class="btns" v-if="actionType!='view'" style="margin-bottom: 2vh;">
          <el-button  v-if="permission.user_role" type="primary" size="small" icon="el-icon-plus" @click="addUserRole">新 增</el-button>
        </div>
        <el-table ref="userRoleTable"
          v-loading = "loading"
         :data="tableData" style="width: 100%" stripe border height="220" empty-text>
          <!-- 机构名称 -->
          <el-table-column prop="deptName" label="机构名称" width="220" align="center"></el-table-column>
          <!-- 是否主机构 -->
          <el-table-column prop="isMasterOrg" label="是否主机构" width="100" align="center">
            <template slot-scope="scope">
              <el-switch :disabled="actionType=='view' || scope.row.isMasterOrg == 1" v-model="scope.row.isMasterOrg" :active-value="1" :inactive-value="0" @change="turnSwitch(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <!-- 所属角色 -->
          <el-table-column prop="roleName" label="所属角色" align="center">
            <template slot-scope="scope">
              <el-tag type="success">{{scope.row.roleName}}</el-tag>
            </template>
          </el-table-column>
          <!-- 操作栏 -->
          <el-table-column v-if="actionType!='view'" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button v-if="permission.user_role"  type="text" :loading="saveLoading" icon="el-icon-edit" class="textBtn" size="small" @click="editTable(scope.row)">编辑</el-button>
              <el-button v-if="permission.user_role"  type="text" icon="el-icon-delete" class="textBtn" size="small" @click="removeTable(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- dialog框底部内容 -->
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" size="small" @click="dialogStatus = false">取 消</el-button>
        <el-button icon="el-icon-check" size="small" v-if="actionType!='view'" type="primary" @click="submit">保 存</el-button>
        
      </span>
      <user-role ref="userRoleDetail" @afterSave="refrshRoleList()" />
    </el-dialog>
  </div>
</template>
<script>
import common from '@/config/common.json'
import { getUser, add, update, updateRole, masterOrgSwitch, roleList, removeUserRole } from '@/api/system/user'
import { getDictionary } from '@/api/system/dict'
import {mapGetters} from "vuex";
import {getStore} from '@/utils/store'
import userRole from './userRole'

export default {
  name: 'userDetail',
  components: { userRole },
  data() {
    var checkphone = (rule, value, callback) => {
      if (value != null && !this.isCellPhone(value)) {
        callback(new Error('请输入正确的手机号!'))
      } else {
        callback()
      }
    }
    var checkEmail = (rule, value, callback) => {
      if (value != null && !this.isCellEmail(value)) {
        callback(new Error('请输入正确的邮箱地址!'))
      } else {
        callback()
      }
    }
    return {
      title: '',
      loading: false,
      saveLoading:false,
      dialogStatus: false,
      actionType: '',
      userForm: {},
      tableData: [],
      sexData: [],
      rules: {
        account: [{ required: true, message: '登录帐号', trigger: 'blur' }],
        name: [{ required: true, message: '用户姓名', trigger: 'blur' }],
        realName: [{ required: true, message: '用户昵称', trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        phone: [{ validator: checkphone, trigger: 'blur' }]
      },
      permission:{}
    }
  },
  created() {
    this.init()
  },
  computed: {
    //..mapGetters(["permission"]),
  },
  methods: {
    init() {
      this.permission = getStore({name: 'permission'})
      this.loadSexData()
    },
    isCellPhone(val) {
      if (val != "" && !/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
        return false
      } else {
        return true
      }
    },
    isCellEmail(val) {
      if (val != "" && !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val)) {
        return false
      } else {
        return true
      }
    },
    showDialog(actionType, id) {
      this.actionType = actionType
      this.title = common[actionType]
      this.dialogStatus = true
      if (id != null && id != '') {
        getUser(id).then(res => {
          if (res.data.code == 200) {
            this.userForm = res.data.data
          }
        })
        this.loadRoleData(id)
      } else {
        this.userForm = {}
        this.tableData = []
        // this.$refs.userForm.resetFields()
      }
      this.$nextTick(()=>{
          this.$refs['userForm'].clearValidate();        
      })
    },
    hideDialog() {
      this.userForm = {}
      this.dialogStatus = false
      if(this.actionType == "add"
      && this.userForm.id!=null && this.userForm.id!= ""){
        this.$emit('afterSave')
      }
    },
    refrshRoleList() {
      this.loadRoleData(this.userForm.id)
    },
    loadRoleData(id) {
      this.loading = true
      roleList(id).then(res => {
        this.loading = false;
        this.tableData = res.data.data
      }).finally(() =>{
        this.loading = false;
      });
    },
    submit() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.saveLoading = true
          if (this.actionType == 'add') {
            this.save("add")
          } else if (this.actionType == 'edit') {
            this.update()
          }
        } else {
          return false
        }
      })
    },
    update() {
      this.userForm.roleId = null;
      this.userForm.deptId = null;
      update(this.userForm).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: 'success',
            message: '用户更新成功!'
          })
          this.saveLoading = false
           this.$emit('afterSave')
          this.hideDialog()
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
          this.saveLoading = false
        }
      }),
        error => {
          this.saveLoading = false
        }
    },
    save(type) {
      add(this.userForm).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: 'success',
            message: '用户新增成功!'
          })
          this.saveLoading = false
          if(type == "addRole"){
            this.userForm.id = res.data.data.id
            this.$refs.userRoleDetail.showDialog('add', '', this.userForm.id)
            this.actionType = "edit"
          }else{
            this.hideDialog()
            this.$emit('afterSave')
          }
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
           this.saveLoading = false
        }
      }),
        error => {
           this.saveLoading = false
        }
    },
    addUserRole() {
      if(this.userForm.id == null){
        this.$refs.userForm.validate(valid => {
          if (valid) {
            this.saveLoading = true
            this.save("addRole")
          } else {
            return false
          }
        })
      }else{
        this.$refs.userRoleDetail.showDialog('add', '', this.userForm.id)
      }

    },
    editTable(row) {
      this.$refs.userRoleDetail.showDialog('edit', row.id, this.userForm.id)
    },
    removeTable(row) {
      if(row.isMasterOrg === 1){
        this.$message.warning('主机构不能删除，请先将主机构切换成其它机构！')
        return
      }
      this.$confirm('确定将当前数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return removeUserRole(row.id)
        })
        .then(() => {
          this.loadRoleData(this.userForm.id)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    turnSwitch(row) {
      masterOrgSwitch(row.id).then(res => {
        if (res.status != 200) {
          return this.$message.error('切换主机构失败，请重试')
        } else {
          this.loadRoleData(this.userForm.id)
          this.userForm.deptId = row.deptId;
          this.userForm.roleId = row.roleId;
        }
      })
    },
    async loadSexData() {
      getDictionary('CD000004').then(res => {
        this.sexData = res.data.data
      })
    }
  }
}
</script>
