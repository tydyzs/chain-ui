<template>
  <div class="permissionsDialog">
    <el-dialog title="角色权限配置" :close-on-click-modal="false" :append-to-body="true" :visible.sync="box" width="345px">
      <el-tabs type="border-card" style="height:350px;overflow-y:auto">
        <el-tab-pane label="菜单权限">
          <el-tree :data="menuGrantList" show-checkbox node-key="id" ref="treeMenu" :default-checked-keys="menuTreeObj" :props="props">
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="数据权限">
          <el-tree :data="dataScopeGrantList" show-checkbox node-key="id" ref="treeDataScope" :default-checked-keys="dataScopeTreeObj" :props="props">
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="接口权限">
          <el-tree :data="apiScopeGrantList" show-checkbox node-key="id" ref="treeApiScope" :default-checked-keys="apiScopeTreeObj" :props="props">
          </el-tree>
        </el-tab-pane>
      </el-tabs>

      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="box = false">取 消</el-button>
        <el-button icon="el-icon-check" type="primary" :loading="loading" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getRole, grant, grantTree } from '@/api/system/role'

export default {
  name: 'rolePermissions',
  data() {
    return {
      dialogStatus: false,
      box: false,
      loading: false,
      activeName: 'tab_menu',
      props: {
        label: 'title',
        value: 'key'
      },
      idarray: [],
      menuGrantList: [],
      dataScopeGrantList: [],
      apiScopeGrantList: [],
      apiGrantList: [],
      menuTreeObj: [],
      dataScopeTreeObj: [],
      apiScopeTreeObj: []
    }
  },
  created() {},
  methods: {
    showDialog(idarray) {
      this.idarray = idarray
      this.dialogStatus = true
      this.menuTreeObj = []
      this.dataScopeTreeObj = []
      this.apiScopeTreeObj = []
      let ids = idarray.join(',')
      grantTree().then(res => {
        this.menuGrantList = res.data.data.menu
        this.dataScopeGrantList = res.data.data.dataScope
        this.apiScopeGrantList = res.data.data.apiScope
        getRole(ids).then(res => {
          this.menuTreeObj = res.data.data.menu
          this.dataScopeTreeObj = res.data.data.dataScope
          this.apiScopeTreeObj = res.data.data.apiScope
          this.box = true
        })
      })
    },
    submit() {
      this.loading = true
      const menuList = this.$refs.treeMenu.getCheckedKeys()
      const dataScopeList = this.$refs.treeDataScope.getCheckedKeys()
      const apiScopeList = this.$refs.treeApiScope.getCheckedKeys()
      grant(this.idarray, menuList, dataScopeList, apiScopeList)
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.loading = false
          this.$emit('afterSave')
          this.box = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
// 新增dialog框的样式
.orgDialog {
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
</style>


