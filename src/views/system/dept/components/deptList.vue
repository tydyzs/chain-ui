<template>
  <div class="container">
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="ruleForm" :model="ruleForm" label-width="80px" class="ruleForm" size="small">
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="机构名称" prop="deptName">
              <el-input v-model="ruleForm.deptName" placeholder="机构名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="机构全称" prop="fullName">
              <el-input v-model="ruleForm.fullName" placeholder="机构全称" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item label="机构类型" prop="orgType">
              <el-select v-model="ruleForm.orgType" placeholder="机构类型" size="small" clearable>
                <el-option v-for="item in orgTypeData" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey">
                </el-option>
              </el-select>
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
        <el-button v-if="permission.dept_add" type="primary" icon="el-icon-plus" size="small" @click="addOrg()">新 增</el-button>
        <el-button v-if="permission.dept_delete" type="danger" icon="el-icon-delete" size="small" @click="deleteOrg()">删
          除</el-button>
      </div>
      <!-- 表格详情区 -->
      <template>
        <el-table ref="deptTable" :data="dataList" v-loading="loading" style="width: 100%" size="medium" border stripe
          height="440">
          <el-table-column type="selection" width="55" :resizable="false" align="center" />
          <el-table-column type="index" label="序号" :resizable="false" align="center" width="55" />
          <el-table-column v-for="(col) in column" :min-width="col.width" :key="col.key" :label="col.label" :align="col.align"
            :resizable="col.resizable" :prop="col.key" show-overflow-tooltip />
          <el-table-column fixed="right" label="操作" min-width="200" :resizable="false" align="center">
            <template slot-scope="scope">
              <el-button v-if="permission.dept_view" class="textBtn" icon="el-icon-view" @click="viewOrg(scope.row)"
                type="text" size="mini">查看</el-button>
              <el-button v-if="permission.dept_edit" class="textBtn" icon="el-icon-edit" @click="editOrg(scope.row)"
                type="text" size="mini">编辑</el-button>
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
    <dept-detail ref="deptDetail" @afterSave="searchChange()" />
  </div>
</template>
<script>
import { getDeptList, remove } from "@/api/system/dept";
import { getDictionarys } from "@/api/system/dict";
import { mapGetters } from "vuex";
import { getStore } from '@/utils/store'
import deptDetail from "./deptDetail"

export default {
  name: 'deptList',
  components: { deptDetail },
  data () {
    return {
      // =====搜索区数据=====
      // 表单数据源
      ruleForm: {
        deptName: '',
        fullName: '',
        orgType: ''
      },
      loading: false,
      // 表格列头
      column: [{
        key: "id",
        label: "机构号",
        resizable: true,
        width: 80,
        align: "center"
      }, {
        key: "deptName",
        label: "机构名称",
        resizable: true,
        width: 180,
        align: "left"
      }, {
        key: "fullName",
        label: "机构全称",
        width: 220,
        resizable: true,
        align: "left"
      }, {
        key: "parentName",
        label: "上级机构",
        width: 180,
        resizable: true,
        align: "center"
      }, {
        key: "orgType",
        label: "机构类型",
        width: 180,
        resizable: true,
        align: "center"
      }, {
        key: "deptLevel",
        label: "机构等级",
        width: 80,
        resizable: true,
        align: "center"
      }, {
        key: "aeraCode",
        label: "所属地区",
        width: 80,
        resizable: true,
        align: "center"
      }, {
        key: "sort",
        label: "排序",
        width: 80,
        resizable: true,
        align: "center"
      }],
      // =====表格区数据=====

      pageInfo: {
        total: 0,
        pagenum: 1,
        pagesize: 10
      },
      orgTypeData: [],
      orgLevelData: [],
      aeraCodeData: [],
      dataList: [],
      permission: {}
    }
  },
  created () {
    this.init();
  },
  computed: {
    //...mapGetters(["permission"]),
  },
  methods: {
    init () {
      this.permission = getStore({ name: 'permission' })
      this.loadData();


    },
    loadTableData (pageInfo, params) {
      this.loading = true;
      getDeptList(pageInfo.pagenum, pageInfo.pagesize, params).then(res => {
        const data = res.data.data;
        this.pageInfo.total = data.total;
        this.dataList = data.records;
        this.dataList.forEach(item => {
          item.orgType = this.getOrgTypeName(item.orgType);
          item.deptLevel = this.getOrgLevelName(item.deptLevel);
          item.aeraCode = this.getAeraName(item.aeraCode);
        });
        this.loading = false;
      }).finally(() => {
        this.loading = false;
      });
    },
    selectionClear () {
      this.$refs.ruleForm.resetFields()
    },
    getOrgTypeName (orgType) {
      let orgTypeNam = "";
      this.orgTypeData.forEach(item => {
        if (item.dictKey == orgType) {
          orgTypeNam = item.dictValue
        }
      })
      return orgTypeNam;
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
    getAeraName (aeraCode) {
      let aeraName = "";
      this.aeraCodeData.forEach(item => {
        if (item.dictKey == aeraCode) {
          aeraName = item.dictValue
        }
      })
      return aeraName;
    },
    searchChange () {
      this.pageInfo.pagenum = 1;
      this.loadTableData(this.pageInfo, this.ruleForm);
    },
    handleSizeChange (val) {
      this.pageInfo.pagesize = val;
      this.loadTableData(this.pageInfo, this.ruleForm);
    },
    handleCurrentChange (val) {
      this.pageInfo.pagenum = val;
      this.loadTableData(this.pageInfo, this.ruleForm);
    },
    deleteOrg () {
      const selectionList = this.$refs.deptTable.selection;
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
        this.loadTableData(this.pageInfo, this.ruleForm);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      });
    },
    addOrg () {
      this.$refs.deptDetail.showDialog("add", '', this.orgTypeData, this.orgLevelData, this.aeraCodeData);
    },
    viewOrg (row) {
      this.$refs.deptDetail.showDialog("view", row.id, this.orgTypeData, this.orgLevelData, this.aeraCodeData);
    },
    editOrg (row) {
      console.log(row)
      this.$refs.deptDetail.showDialog("edit", row.id, this.orgTypeData, this.orgLevelData, this.aeraCodeData);
    },
    loadData () {
      getDictionarys("CD000221,CD000214,CD000269").then(res => {
        this.aeraCodeData = res.data.data["CD000221"];
        this.orgTypeData = res.data.data["CD000214"];
        this.orgLevelData = res.data.data["CD000269"];
        this.loadTableData(this.pageInfo, this.ruleForm);
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
  // .table {
  /deep/ .el-table__fixed-right .el-table__fixed-body-wrapper .cell {
    line-height: 0 !important;
  }
  /deep/ .el-table__fixed .el-table__fixed-body-wrapper .cell {
    line-height: 0 !important;
  }
  //   .el-table /deep/ {
  //     .textBtn {
  //       color:  #029f4a;
  //     }
  //   }
  // }
  // 分页区样式
  .pageination {
    float: right;
    padding-top: 2vh;
  }
}
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

