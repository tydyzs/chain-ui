<template>
  <div class="container">
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="ruleForm" :model="ruleForm" label-width="130px" class="ruleForm" size="small">
          <!-- <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="用户昵称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="用户昵称" clearable/>
            </el-form-item>
          </el-col> -->
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="用户帐号/用户姓名" prop="account">
              <el-input v-model="ruleForm.account" placeholder="用户帐号/用户姓名" clearable/>
            </el-form-item>
          </el-col>
          <!-- <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="用户名" prop="realName">
              <el-input v-model="ruleForm.realName" placeholder="用户名" clearable/>
            </el-form-item>
          </el-col> -->
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
           <el-form-item label="所属机构" prop="deptName">
              <el-input v-model="ruleForm.deptName" placeholder="机构名称" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
           <el-form-item label="主管机构" prop="manageName">
              <el-input v-model="ruleForm.manageName" placeholder="主管机构" clearable/>
            </el-form-item>
          </el-col>

          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item>
              <el-button icon="el-icon-search" type="primary" @click="searchChange()">搜索</el-button>
              <el-button icon="el-icon-refresh-right" @click="selectionClear()">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <!-- 表格区 -->
    <div class="table">
      <!-- 表头按钮区 -->
      <div class="btns" style="margin-bottom: 2vh;">
        <el-button v-if="permission.user_add" type="primary" icon="el-icon-plus" size="small" @click="add()">新 增</el-button>
        <el-button v-if="permission.user_delete" type="danger" icon="el-icon-delete" size="small" @click="del()">删 除</el-button>
        <el-button v-if="permission.user_reset" type="primary" icon="el-icon-refresh" size="small" @click="pwsReset()">密码重置</el-button>
      </div>
      <!-- 表格详情区 -->
      <template>
        <el-table ref="userTable" :data="dataList" style="width: 100%" size="medium"
         v-loading = "loading"
         border stripe height="440">
          <el-table-column type="selection" width="55" :resizable="false" align="center" />
          <el-table-column type="index" label="序号" align="center" width="55" />
          <el-table-column v-for="(col) in column" :min-width="col.width" :key="col.key" :label="col.label" :align="col.align" :resizable="col.resizable" :prop="col.key" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作" min-width="200" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-button v-if="permission.user_view" icon="el-icon-view" class="textBtn" @click="view(scope.row)" type="text" size="mini">查看</el-button>
              <el-button v-if="permission.user_edit" icon="el-icon-edit" class="textBtn" @click="edit(scope.row)" type="text" size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 分页区 -->
    <div class="pageination">
      <el-pagination :total="pageInfo.total" :current-page="pageInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.pagesize" @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" />
    </div>
    <user-detail ref="userDetail" @afterSave="searchChange()" />
  </div>
</template>
<script>
import { getList, resetPassword,remove } from '@/api/system/user'
import { getDictionary } from '@/api/system/dict'
import userDetail from "./userDetail"
import {getStore} from '@/utils/store'
import {mapGetters} from "vuex";
import { getDeptTree } from '@/api/system/dept'
import { getInfo } from '@/api/user'

export default {
  name: 'userList',
  components: { userDetail },
  data() {
    return {
      // =====搜索区数据=====
      // 表单数据源
      ruleForm: {
        name: ''
      },
      loading: false,
      // 表格列头
      column: [
        {
          key: 'account',
          label: '登录账号',
          resizable: true,
          width: 160,
          align: 'center'
        },
        {
          key: 'name',
          label: '用户昵称',
          resizable: true,
          width: 160,
          align: 'left'
        },
        {
          key: 'realName',
          label: '用户姓名',
          width: 160,
          resizable: true,
          align: 'left'
        },
        {
          key: 'roleName',
          label: '所属角色',
          width: 160,
          resizable: true,
          align: 'center'
        },
        {
          key: 'deptName',
          label: '所属机构',
          width: 200,
          resizable: true,
          align: 'center'
        },
         {
          key: 'manageName',
          label: '主管机构',
          width: 200,
          resizable: true,
          align: 'center'
        },
        {
          key: 'phone',
          label: '手机号码',
          width: 200,
          resizable: true,
          align: 'center'
        }
      ],
      // =====表格区数据=====

      pageInfo: {
        total: 0,
        pagenum: 1,
        pagesize: 10
      },
      dataList: [],
      permission:{}
    }
  },
  created() {
    this.init()
    // this.ruleForm = JSON.parse(sessionStorage.getItem("userListFormData")) || {}
  },
  computed: {
    // ...mapGetters(["permission"]),
  },
  methods: {
    init() {
      //装入表格数据
      this.permission = getStore({name: 'permission'})
      this.loadData(this.pageInfo, this.ruleForm)

      // getInfo().then(res => {
      //   this.permission = getStore({name: 'permission'})
      //   this.loadData(this.pageInfo, this.ruleForm)
      //   this.ruleForm.deptName = res.data.data.deptName
      //   sessionStorage.setItem('userListFormData', JSON.stringify(this.ruleForm))
      // })
      getDeptTree('000000').then(res => {
        this.orgTreeData = res.data.data
      })
    },
    loadData(pageInfo, params) {
      this.loading = true
      getList(pageInfo.pagenum, pageInfo.pagesize, params).then(res => {
        const data = res.data.data
        this.pageInfo.total = data.total
        this.dataList = data.records
      }).finally( () =>{
          this.loading = false;
      });
    },
    selectionClear() {
      this.$refs.ruleForm.resetFields()

      // sessionStorage.clear()
      // this.ruleForm = {}
    },
    searchChange() {
      this.pageInfo.pagenum = 1
      this.loadData(this.pageInfo, this.ruleForm)
      // console.log(this.ruleForm.account,'0000');
      // if (this.ruleForm.account == undefined && this.ruleForm.deptName == undefined && this.ruleForm.manageName == undefined) {
      //   console.log('断点1');
      //   this.init()
      // } else {
      //   console.log('断点2');
      //   this.pageInfo.pagenum = 1
      //   this.loadData(this.pageInfo, this.ruleForm)
      // }
    },
    handleSizeChange(val) {
      this.pageInfo.pagesize = val
      this.loadData(this.pageInfo, this.ruleForm)
    },
    handleCurrentChange(val) {
      this.pageInfo.pagenum = val
      this.loadData(this.pageInfo, this.ruleForm)
    },
    del() {
      const selectionList = this.$refs.userTable.selection
      if (selectionList.length === 0) {
        this.$message.warning('请选择至少一条数据')
        return
      }
      let ids = []
      selectionList.forEach(ele => {
        ids.push(ele.id)
      })
      this.$confirm('确定将选择数据删除?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(ids.join(','))
        })
        .then(() => {
          this.loadData(this.pageInfo, this.ruleForm)
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    },
    add() {
      this.$refs.userDetail.showDialog("add",'');
    },
    view(row) {
      this.$refs.userDetail.showDialog("view",row.id);
    },
    edit(row) {
      this.$refs.userDetail.showDialog("edit",row.id);
    },
    pwsReset() {
      const selectionList = this.$refs.userTable.selection
      if (selectionList.length === 0) {
        this.$message.warning('请选择至少一条数据')
        return
      }
      let ids = []
      selectionList.forEach(ele => {
        ids.push(ele.id)
      })
      this.$confirm('确定将选择账号密码重置为123456?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return resetPassword(ids.join(','))
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        })
    }
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
}
// 新增dialog框的样式
.dialog {
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

