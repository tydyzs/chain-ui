<!-- 限额管理-- 限额参数页面 -->

<!-- 表格详情区 -->
<template>
  <div class="container">
    <!-- 搜索区内容 -->
    <el-form :inline="true" :model="ruleForm" class="demo-form-inline" size="small">
      <!--      <el-form-item label="生效日期">-->
      <!--        <el-date-picker v-model="ruleForm.useDate" type="date" placeholder="选择日期">-->
      <!--        </el-date-picker>-->
      <!--      </el-form-item>-->
      <el-form-item label="生效日期">
        <el-date-picker v-model="ruleForm.useDates" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="所属机构">
        <!-- <el-select v-model="currOrg" placeholder="请选择当前机构">
          <el-option :value="orgValue" style="height: auto">
            <el-input placeholder="输入关键字进行搜索" v-model="filterText"></el-input>
            <el-tree class="filter-tree" :data="orgData" :props="defaultProps" :filter-node-method="filterNode" ref="orgTree"
              @node-click="handleNodeClick"></el-tree>
          </el-option>
        </el-select>-->
        <el-select v-if="!treeIf" v-model="ruleForm.useOrgNum" disabled placeholder="请选择">
          <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <tree-select v-if="treeIf" id="rFuseOrgNum" v-model="ruleForm.useOrgNum" :props="props" :options="orgData" :clearable="isClearable"
          :accordion="isAccordion" />
      </el-form-item>
      <el-form-item label="生效状态">
        <el-select v-model="ruleForm.netState" placeholder="生效状态">
          <el-option label="生效" value="1"></el-option>
          <el-option label="失效" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  icon="el-icon-search"  @click="getTableData">搜索</el-button>
      </el-form-item>
    </el-form>

    <!-- 新增按钮 -->
    <el-button type="primary" @click="add" size="small">新增</el-button>

    <!-- 表格主要内容 -->
    <el-table :data="tableData"  v-loading="loading" border size="small" max-height="450">
      <el-table-column type="index" label="序号" width="60" :resizable="false" align="center" />
      <el-table-column prop="useDate" label="生效日期" :resizable="false" align="center" />
      <el-table-column prop="useOrgName" label="生效机构" :resizable="false" align="center">
        <!-- <template slot-scope="scope">{{ orgNumDict[scope.row.useOrgNum] }}</template> -->
      </el-table-column>
      <el-table-column prop="netCapital" label="资本净额" :resizable="false" align="center">
        <template slot-scope="scope">{{ scope.row.netCapital | NumsFormat }}</template>
      </el-table-column>
      <el-table-column prop="netPrimaryCapital" label="一级资本净额" :resizable="false" align="center">
        <template slot-scope="scope">{{ scope.row.netPrimaryCapital | NumsFormat }}</template>
      </el-table-column>
      <el-table-column prop="netAssets" label="净资产" :resizable="false" align="center">
        <template slot-scope="scope">{{ scope.row.netAssets | NumsFormat }}</template>
      </el-table-column>
      <el-table-column prop="netState" label="生效状态" :filters="[{ text: '生效', value: '1' }, { text: '失效', value: '2' }]"
        :filter-method="filterState" filter-placement="bottom-end" :resizable="false" align="center" :formatter="stateFormat">
        <!-- <template slot-scope="scope">
          <el-tag :type="scope.row.netState === '0' ? 'primary' : 'success'" disable-transitions>{{scope.row.netState}}
          </el-tag>
        </template>-->
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="250" :resizable="false" align="center">
        <template slot-scope="scope">
          <el-button class="textBtn" type="text" icon="el-icon-view" @click="remove(scope.row)">删除</el-button>
          <el-button class="textBtn" type="text" icon="el-icon-user" @click="edit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页内容 -->
    <el-pagination class="pageination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="page.current" :page-size="page.size" :total="page.total" :page-sizes="[10,20,30,40]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>

    <el-dialog :title="title" :visible.sync="addDialogVisible" :append-to-body="true" @close="editForm={}" width="700px">
      <el-form :model="editForm" :inline="true" ref="detailfrom" :rules="formRules" label-width="100px">
        <el-form-item label="生效机构" class="selectClass" prop="useOrgNum">
          <!-- <el-select v-model="currOrg" placeholder="请选择当前机构">
            <el-option :value="orgValue" style="height: auto">
              <el-input placeholder="输入关键字进行搜索" v-model="filterText"></el-input>
              <el-tree class="filter-tree" :data="orgData" :props="defaultProps" :filter-node-method="filterNode" ref="orgTree"
                @node-click="handleNodeClick"></el-tree>
            </el-option>
          </el-select>-->
          <el-select v-if="!treeIf" v-model="editForm.useOrgNum" disabled placeholder="请选择">
            <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <tree-select v-if="treeIf" id="useOrgNum" ref="selTree" v-model="editForm.useOrgNum" :props="editProps" :options="orgData" :clearable="isClearable"
            :accordion="isAccordion" />
        </el-form-item>
        <el-form-item label="生效日期" class="dateClass" prop="useDate">
          <el-date-picker v-model="editForm.useDate" type="month" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
            placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="资本净额">
          <el-input-number v-model="editForm.netCapital" :controls="false" clearable></el-input-number>
        </el-form-item>
        <el-form-item label="一级资本净额">
          <el-input-number v-model="editForm.netPrimaryCapital" :controls="false" clearable></el-input-number>
        </el-form-item>
        <el-form-item label="净资产">
          <el-input-number  v-model="editForm.netAssets" :controls="false" clearable></el-input-number>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="editForm.netState" active-color="#13ce66"  active-value="1"
            inactive-value="2" clearable></el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.remark" type="textarea" autocomplete="off" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false;editForm={}">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import TreeSelect from '@/components/TreeSelect/expand.vue'
import { list, save, remove, detail } from '@/api/quota/capital'
import { getUserInfo } from '@/api/user'
import { getDeptTreeManage } from '@/api/system/dept'
import { dictTranslate } from '@/api/system/dict'

export default {
  data () {
    return {
      treeIf: false,
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      title:"添加",
      loading:false,
      props: {
        // 配置项（必选）
        formVal: '',
        value: 'id',
        label: 'title',
        children: 'children',
        disabled: false,
        identifier: [] // 限制层级
      },
      editProps:{
        formVal: '',
        value: 'id',
        label: 'title',
        children: 'children',
        disabled: false,
        identifier: ["3"] // 限制层级
      },
      pickerOptions: {
        disabledDate (time) {
          //return time.getTime() <= Date.now()  //防止本机时间不对，注释掉
        }
      },
      orgNumDict: [], //机构字典
      ruleForm: {
        useDates: [],
        useOrgNum: null,
        netState: null
      },
      page: {
        current: 1,
        size: 10,
        total: 0
      },
      formRules:{
        useOrgNum:[{ required: true, message: '生效机构' }],
        useDate:[{ required: true, message: '生效日期' }]
      },
      tableData: [],
      addDialogVisible: false,
      editForm: {},
      orgValue: '', // 机构选择 下拉框选中的数据
      orgData: [], // 机构选择树的数据
      currOrg: '', // 机构选择 input框中的数据
      filterText: '', // 机构选择树中过滤输入框中的内容
      defaultProps: {
        // 指定子树为节点对象的某个属性值
        children: 'children',
        // 指定节点标签为节点对象的某个属性值
        label: 'title'
      }
    }
  },
  created () {
    this.getTableData()
    this.getUserInfo()  // 获取当前登录人信息
    this.dictTranslateCommon()
  },
  methods: {
    //重置form
    resetForm (formName) {
      console.log('清空表单')
      this.$refs[formName].resetFields()
    },
    // 字典翻译
    dictTranslateCommon () {
      // 主办机构字典
      dictTranslate('org').then(res => {
        this.orgNumDict = res.data.data
        this.tableData.useOrgNum = this.orgNumDict[this.tableData.useOrgNum]
      })
    },
    stateFormat (row) {
      if (row.netState === '1') {
        return '生效'
      } else if (row.netState === '2') {
        return '失效'
      }
    },
    // 获取table表格数据
    getTableData () {
     if(this.ruleForm.useDates != null && this.ruleForm.useDates.length >1 ){
         this.ruleForm.useDateStart = this.ruleForm.useDates[0];
         this.ruleForm.useDateEnd = this.ruleForm.useDates[1];
         this.ruleForm.useDates = null;
     }
      this.loading = true;
      list(this.page, this.ruleForm).then(res => {
        this.page.total = res.data.data.total
        this.tableData = res.data.data.records
        this.loading = false;
      })
    },
    save () {
      // this.editForm.useOrgNum = this.orgValues
        this.$refs.detailfrom.validate(valid => {
          if (valid) {
              save(this.editForm).then(res => {
                this.addDialogVisible = false
                if (res.status != 200) {
                  return this.$message.error('操作失败')
                } else {
                  return this.$message.success('操作成功!')
                }
              })
              .then(() => {
                this.getTableData()
              })
          }
        })
    },
    add(){
      this.editForm = {
           useDates: [],
          useOrgNum: null,
          netState: null
      };
      this.title = "添加";
      this.addDialogVisible = true
      this.$refs.selTree.clearHandle();
       this.$refs["detailfrom"].resetFields();
    },
    edit (row) {
      detail(row.netCapitalNum).then(res => {
        this.editForm = res.data.data
      })
      this.title = "修改";
      this.addDialogVisible = true
    },
    remove (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return remove(row.netCapitalNum)
        })
        .then(() => {
          this.getTableData()
          this.$message.success('删除成功!')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '删除失败'
          })
        })
    },
    // 监听 size 改变的事件
    handleSizeChange (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.page.size = newSize
      this.getTableData()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      console.log(`当前页: ${newPage}`)
      this.page.current = newPage
      this.getTableData()
    },
    filterState (value, row) {
      return row.netState === value
    },
    // 节点被点击时的回调,共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身
    handleNodeClick (data) {
      console.log(data, '限额分析页面，打印data的值')
      if (data.deptLevel == 1 || data.deptLevel == 3) {
        this.currOrg = data.id
        this.orgValue = data.value
      }
    },
    // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 获取当前登录人的信息
    getUserInfo () {
      getUserInfo().then(res => {
        // console.log(res, '打印当前登录人信息');
        if (res.status != 200) {
          return this.$$message.error('获取当前登录人信息失败，请重试')
        }
        this.userInfo = res.data.data
        getDeptTreeManage(this.userInfo.deptId).then(res => {
          // console.log(res, '测试登录机构下的机构树数据');
          if (res.status != 200) {
            return this.$message.error('获取当前登录人信息失败，请重试')
          }
          this.orgData = res.data.data
          // 如果当前登录机构为省联社，默认选择省联社
          if (this.orgData[0].deptLevel == 1) {
            // 如果当前登录机构为省联社，默认选择省联社
            // console.log(this.orgData[0].deptLevel,'打印机构级别');
            this.useOrgNum = this.orgData[0].id
            this.orgValue = this.orgData[0].value
          } else if (this.orgData[0].deptLevel == 2) {
            // 如果当前登录机构为市联社下第一个成员行，机构树为该市级下所有成员行
            // console.log(this.orgData[0].deptLevel,'打印机构级别');
            this.useOrgNum = this.orgData[0].children[0].id
            this.orgValue = this.orgData[0].children[0].value
          } else if (this.orgData[0].deptLevel == 3) {
            // 如果当前登录机构为成员行，机构树只显示成员行
            console.log(this.orgData, '打印机构级别')
            this.useOrgNum = this.orgData[0].id
            this.orgValue = this.orgData[0].value
          }
          this.treeIf = true
        })
      })
    }
  },
  components: {
    TreeSelect
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 1vh 2vh;
}
.el-table /deep/ {
  margin-top: 2vh;
  td,th {
    padding: 3px 0;
  }
  .el-table__fixed-right {
    thead {
      tr {
        th:last-child {
          font-size: 14px;
          font-weight: 400;
          color: #606266;
        }
      }
    }
    tbody {
      .el-table__row {
        td:last-child {
          .cell {
            .el-button {
              span {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
  }
}
.selectClass /deep/ {
  input {
    padding-right: 16px !important;
    height: 38px;
  }
}
.dateClass /deep/ {
  input {
    padding-right: 0px !important;
    width: 185px;
  }
}
// 分页区样式
.pageination {
  float: right;
  padding-top: 2vh;
}
</style>
