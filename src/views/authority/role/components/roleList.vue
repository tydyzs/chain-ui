<template>
  <div class="container">
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="ruleForm" :model="ruleForm" label-width="80px" class="ruleForm" size="small">
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="ruleForm.roleName" placeholder="角色名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="角色别名" prop="roleAlias">
              <el-input v-model="ruleForm.roleAlias" placeholder="角色别名" clearable />
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
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addRole()">新 增</el-button>
        <el-button type="danger" icon="el-icon-delete" size="small" @click="deleteRole()">删 除</el-button>
        <el-button type="primary" icon="el-icon-setting" size="small" @click="setPermissions()">权限设置</el-button>
      </div>
      <!-- 表格详情区 -->
      <template>
        <el-table ref="roleTable" :data="dataList" style="width: 100%" v-loading="loading" size="medium" border stripe
          height="440">
          <el-table-column type="selection" width="55" :resizable="false" align="center" />
          <el-table-column type="index" label="序号" align="center" width="55" />
          <el-table-column v-for="(col) in column" :min-width="col.width" :key="col.key" :label="col.label" :align="col.align"
            :resizable="col.resizable" :prop="col.key" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作" min-width="200" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-button icon="el-icon-view" class="textBtn" @click="viewRole(scope.row)" type="text" size="mini">查看</el-button>
              <el-button icon="el-icon-edit" class="textBtn" @click="editRole(scope.row)" type="text" size="mini">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 分页区 -->
    <div class="pageination">
      <el-pagination :total="pageInfo.total" :current-page="pageInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.pagesize"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" />
    </div>
    <role-detail ref="roleDetail" @afterSave="searchChange()" />
    <role-permissions ref="permissionsDetail" @afterSave="searchChange()" />
  </div>
</template>
<script>
import { getList, remove } from "@/api/system/role";
import { getDictionary } from "@/api/system/dict";
import roleDetail from "./roleDetail"
import {getStore} from '@/utils/store'
import rolePermissions from "./rolePermissions"
import { mapGetters } from "vuex";

export default {
  name: 'roleList',
  components: { roleDetail, rolePermissions },
  data () {
    return {
      // =====搜索区数据=====
      // 表单数据源
      ruleForm: {
        roleName: '',
        roleAlias: ''
      },
      loading: true,
      // 表格列头
      column: [{
        key: "roleName",
        label: "角色名称",
        resizable: true,
        width: 240,
        align: "left"
      }, {
        key: "roleAlias",
        label: "角色别名",
        width: 240,
        resizable: true,
        align: "left"
      }, {
        key: "parentName",
        label: "上级角色",
        width: 240,
        resizable: true,
        align: "left"
      }, {
        key: "deptLevel",
        label: "机构等级",
        width: 120,
        resizable: true,
        align: "center"
      }, {
        key: "sort",
        label: "排序",
        width: 120,
        resizable: true,
        align: "center"
      }],
      pageInfo: {
        total: 0,
        pagenum: 1,
        pagesize: 10
      },
      orgTypeData: [],
      orgLevelData: [],
      dataList: [],
      permission:{}
    }
  },
  created () {
    this.init();
  },
  computed: {
   // ...mapGetters(["permission"]),
  },
  methods: {
    init () {
      this.permission = getStore({name: 'permission'})
      //装入机构等级数据
      this.loadOrgLevel();
      //装入表格数据
      this.loadData(this.pageInfo, this.ruleForm);
    },
    loadData (pageInfo, params) {
      this.loading = true;
      getList(pageInfo.pagenum, pageInfo.pagesize, params).then(res => {
        const data = res.data.data;
        this.pageInfo.total = data.total;
        this.dataList = data.records;
        this.dataList.forEach(item => {
          item.deptLevel = this.getOrgLevelName(item.deptLevel);
        });
      }).finally(() => {
        this.loading = false;
      });
    },
    selectionClear () {
      this.$refs.ruleForm.resetFields()
    },
    getOrgLevelName (orgLevel) {
      let orgLevelNam = "";
      this.orgLevelData.forEach(item => {
        if (item.dictKey == orgLevel) {
          orgLevelNam = item.dictValue
        }
      })
      return orgLevelNam;
    },
    searchChange () {
      this.pageInfo.pagenum = 1;
      this.loadData(this.pageInfo, this.ruleForm);
    },
    handleSizeChange (val) {
      this.pageInfo.pagesize = val;
      this.loadData(this.pageInfo, this.ruleForm);
    },
    handleCurrentChange (val) {
      this.pageInfo.pagenum = val;
      this.loadData(this.pageInfo, this.ruleForm);
    },
    deleteRole () {
      const selectionList = this.$refs.roleTable.selection;
      if (selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      let ids = [];
      selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return remove(ids.join(","));
      }).then(() => {
        this.loadData(this.pageInfo, this.ruleForm);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      });
    },
    addRole () {
      this.$refs.roleDetail.showDialog("add", '', this.orgLevelData);
    },
    viewRole (row) {
      this.$refs.roleDetail.showDialog("view", row.id, this.orgLevelData);
    },
    editRole (row) {
      this.$refs.roleDetail.showDialog("edit", row.id, this.orgLevelData);
    },
    setPermissions () {
      const selectionList = this.$refs.roleTable.selection;
      if (selectionList.length !== 1) {
        this.$message.warning("只能选择一条数据");
        return;
      }
      let ids = [];
      selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      this.$refs.permissionsDetail.showDialog(ids);
    },
    async loadOrgLevel () {
      getDictionary("CD000269").then(res => {
        this.orgLevelData = res.data.data;
      });
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
}
</style>
