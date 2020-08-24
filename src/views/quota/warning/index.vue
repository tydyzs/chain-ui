<!-- 限额管理---限额预警页面 -->
<template>
  <div class="container">
    <!-- 搜索区 -->
    <div class="search">
      <el-row :gutter="10">
        <el-form :model="ruleForm" ref="ruleForm" label-width="80px">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额名称" prop="quotaName">
              <el-input v-model="ruleForm.quotaName" size="small" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item class="warning" label="预警级别" prop="triggerLevel">
              <el-select v-model="ruleForm.triggerLevel" placeholder="--请选择--" clearable size="small">
                <el-option v-for="item in triggerLevelSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="当前机构" prop="useOrgNum">
              <el-select v-if="!treeIf" v-model="ruleForm.useOrgNum" disabled placeholder="请选择">
                <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <tree-select v-if="treeIf" v-model="ruleForm.useOrgNum" :props="props" :options="orgData" :clearable="isClearable"
                :accordion="isAccordion" />
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item class="time" label="触发时间" label-width="80px" prop="value">
              <el-date-picker v-model="ruleForm.value" size="small" type="daterange" range-separator="-"
                start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item class="btn">
              <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
              <el-button type="primary" size="small" icon="el-icon-refresh-right" @click="resetForm('ruleForm')">重置</el-button>
              <el-tooltip class="item" effect="dark" content="12个月以前历史信息" placement="bottom">
                <el-button type="primary" size="small" @click="historyBeforeTwelveMonths">历史</el-button>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <!-- 表格区 -->
    <div class="table">
      <!-- 表格详情部分 -->
      <template>
        <el-table :data="tableData" style="width: 100%;" max-height="450" border @row-dblclick="toWarningMsg"
          :append-to-body="true">
          <el-table-column type="index" label="序号" width="50" align="center" fixed :resizable="false"></el-table-column>
          <el-table-column prop="useOrgNum" label="生效机构" width="180" :resizable="false" align="center">
            <template slot-scope="scope">{{ orgNumDict[scope.row.useOrgNum] }}</template>
          </el-table-column>
          <el-table-column prop="partyName" label="客户名称" align="center" width="180" :resizable="false">
          </el-table-column>
          <el-table-column prop="triggerLevel" label="预警级别" align="center" width="180" :resizable="false">
            <template slot-scope="scope">{{ dicTriggerLevel[scope.row.triggerLevel] }}</template>
          </el-table-column>
          <el-table-column prop="quotaName" label="限额名称" align="center" width="180" :resizable="false"></el-table-column>
          <el-table-column prop="triggerTime" label="触发时间" align="center" width="180" :resizable="false"></el-table-column>
          <el-table-column prop="triggerControlNode" label="触发管控节点" align="center" width="180" :resizable="false">
            <template slot-scope="scope">{{ dicTriggerControlNode[scope.row.triggerControlNode] }}</template>
          </el-table-column>
          <el-table-column prop="nodeMeasure" label="应对措施" align="center" width="180" :resizable="false">
            <template slot-scope="scope">{{ dicNodeMeasure[scope.row.nodeMeasure] }}</template>
          </el-table-column>
          <el-table-column prop="currencyCd" label="限额币种" align="center" width="180" :resizable="false">
            <template slot-scope="scope">{{ dicCurrencyCd[scope.row.currencyCd] }}</template>
          </el-table-column>
          <el-table-column prop="triggerAmt" label="触发当前值（余额/比例）" align="center" width="180" :resizable="false">
            <template slot-scope="scope">{{ scope.row.triggerAmt | NumsFormat }}</template>
          </el-table-column>
          <el-table-column prop="quotaControlAmt" label="预警阀值（余额/比例）" align="center" width="180" :resizable="false">
            <template slot-scope="scope">{{ scope.row.quotaControlAmt | NumsFormat }}</template>
          </el-table-column>
          <el-table-column prop="quotaUsedAmt" label="限额已用（余额/比例）" align="center" width="180" :resizable="false">
            <template slot-scope="scope">{{ scope.row.quotaUsedAmt | NumsFormat }}</template>
          </el-table-column>
          <el-table-column prop="bizNum" label="关联业务编号" align="center" width="180" :resizable="false"></el-table-column>
        </el-table>
      </template>
    </div>
    <!-- 分页区 -->
    <div class="pageination">
      <el-pagination :total="total" :current-page="pageInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import TreeSelect from '@/components/TreeSelect/expand.vue'
import { getList, getHisList } from "@/api/quota/warning";
import { getDictionary, getDept, dictTranslate } from "@/api/system/dict";
import { getDeptTreeManage } from '@/api/system/dept'
import { getUserInfo } from '@/api/user'
export default {
  data () {
    return {
      isClearable: true, // 可清空（可选）
      isAccordion: true, // 可收起（可选）
      props: {
        // 配置项（必选）
        formVal: '',
        value: 'id',
        label: 'title',
        children: 'children',
        disabled: false,
        identifier: ['3'] // 限制层级
      },
      treeIf: false,
      // 当前选中的组件
      // currentComp: 'test1',
      // 选择机构中的数据
      orgs: '',
      orgsValue: '',
      orgData: [], // 选择机构中的机构树数据源
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      filterText: '',
      orgNumDict: [], //机构字典
      dicTriggerLevel: {},
      dicTriggerControlNode: {},
      dicNodeMeasure: {},
      dicCurrencyCd: {},
      //是否是‘历史’
      isHistory: false,
      //触发时间（开始）
      triggerTimeStart: "",
      //触发时间（终止）
      triggerTimeEnd: "",
      useOrgNum: "",
      //数据字典：预警级别
      triggerLevelSelections: [],
      // 当前登录人信息
      userInfo: {},
      // 搜索部分 数据源
      ruleForm: {
        quotaName: "",
        triggerLevel: "",
        useOrgNum: "",
        value: ""
      },
      // 表格详情部分 数据源
      tableData: [],
      // 分页功能数据源
      pageInfo: {
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10
      },
      // 分页总条数
      total: 0
    };
  },
  created () {
    this.getUser();
    // this.dataForTable();//进入页面默认显示最近信息
    this.getAndTranslateDic();
  },
  watch: {
    // 监听 搜索区 当前机构 机构树
    filterText (val) {
      this.$refs.orgTree.filter(val)
    }
  },
  mounted: function () {
    getDictionary('CD000223').then(response => {
      this.triggerLevelSelections = response.data.data;
    });
  },
  methods: {
    //获取字典并且调用字典翻译器
    getAndTranslateDic () {
      getDictionary("CD000223").then(response => {
        this.triggerLevelSelections = response.data.data;

      });
      // 主办机构字典
      dictTranslate('org').then(res => {
        this.orgNumDict = res.data.data
        this.tableData.useOrgNum = this.orgNumDict[this.tableData.useOrgNum]
      });
      dictTranslate('CD000223').then(res => {
        console.log(res, '预警级别字典');
        if (res.status != 200) {
          return this.$message.error('获取预警级别字典失败，请重试')
        }
        this.dicTriggerLevel = res.data.data
      });
      dictTranslate('CD000259').then(res => {
        if (res.status != 200) {
          return this.$message.error('获取触发管控节点字典失败，请重试')
        }
        this.dicTriggerControlNode = res.data.data
      });
      dictTranslate('CD000260').then(res => {
        if (res.status != 200) {
          return this.$message.error('获取应对措施字典失败，请重试')
        }
        this.dicNodeMeasure = res.data.data
      });

      dictTranslate('CD000019').then(res => {
        if (res.status != 200) {
          return this.$message.error('获取应对币种字典失败，请重试')
        }
        this.dicCurrencyCd = res.data.data
      });
    },
    //数据填充表格(不搜索历史)
    dataForTable () {
      getList(
        this.pageInfo.pagenum,
        this.pageInfo.pagesize,
        this.ruleForm.quotaName,
        this.ruleForm.triggerLevel,
        this.ruleForm.useOrgNum,
        // this.useOrgNum='16200',
        this.triggerTimeStart,
        this.triggerTimeEnd,
      ).then(res => {
        console.log(res, "table表格数据");
        const data = res.data.data;
        for (let i = 0; i < data.records.length; i++) {
          const array = data.records[i];
          array.triggerTime = array.triggerTime.substring(0, 10);
        }
        this.tableData = data.records;
        this.total = data.total;
      });
    },
    //数据填充表格(历史)
    dataForHisTable () {
      console.log(
        this.pageInfo.pagenum,
        this.pageInfo.pagesize,
        this.ruleForm.quotaName,
        this.ruleForm.triggerLevel,
        this.triggerTimeStart,
        this.triggerTimeEnd,
        "4444444"
      );
      getHisList(
        this.pageInfo.pagenum,
        this.pageInfo.pagesize,
        this.ruleForm.quotaName,
        this.ruleForm.triggerLevel,
        this.triggerTimeStart,
        this.triggerTimeEnd,
      ).then(res => {
        console.log(res, "lishilishi");
        const data = res.data.data;
        for (let i = 0; i < data.records.length; i++) {
          const array = data.records[i];
          array.triggerTime = array.triggerTime.substring(0, 10);
        }
        this.tableData = data.records;
        this.total = data.total;
      });
    },
    // 获取当前登录人的信息
    getUser () {
      getUserInfo().then(res => {
        // console.log(res, '打印当前登录人信息');
        if (res.status != 200) {
          return this.$message.error('获取当前登录人信息失败，请重试')
        }
        this.userInfo = res.data.data
        getDeptTreeManage(this.userInfo.deptId).then(res => {
          console.log(res, '测试登录机构下的机构树数据');
          if (res.status != 200) {
            return this.$message.error('获取当前登录人信息失败，请重试')
          }
          this.orgData = res.data.data
          console.log('444', this.orgData)
          // this.ruleForm.useOrgNum = this.orgData[0].children[0].children[0].id
          this.ruleForm.useOrgNum = '16200'
          console.log(this.ruleForm.useOrgNum, '机构号');
          this.dataForTable()
          // console.log(this.dataForTable,'表格区');
          this.treeIf = true;
        })
      })
    },
    // 搜索区 选择下拉框中的过滤函数
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 搜索区 选中机构，触发该函数
    handleNodeClick (e) {
      // console.log(e, '测试选择变化');
      if (e.deptLevel == 1 || e.deptLevel == 3) {
        this.ruleForm.useOrgNum = e.title
        this.orgValue = e.title
        // this.getLimit(e.id)
        // this.getLimit(16200)
      }
    },
    //点击搜索按钮
    search () {
      console.log(this.ruleForm.value.length, "rowrow");
      if (this.ruleForm.value.length > 0) {
        const d = new Date(this.ruleForm.value[0]);
        this.triggerTimeStart =
          d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
        const d2 = new Date(this.ruleForm.value[1]);
        this.triggerTimeEnd =
          d2.getFullYear() + "-" + (d2.getMonth() + 1) + "-" + d2.getDate();
        console.log(
          this.triggerTimeStart,
          this.triggerTimeEnd,
          "ruleForm.value"
        );
      }
      if (this.isHistory) {
        this.dataForHisTable();
      } else {
        this.dataForTable();
      }
    },
    //点击12个月
    historyBeforeTwelveMonths () {
      this.isHistory = true;
      this.dataForHisTable();
    },
    //重置按钮
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.isHistory = false;
    },
    // 每页总条数的变化，触发这个函数
    handleSizeChange (newSize) {
      // console.log(newSize,'0000');
      this.pageInfo.pagesize = newSize;
      if (this.isHistory) {
        this.dataForHisTable();
      } else {
        this.dataForTable();
      }
    },
    // 当前页码的变化，触发这个函数
    handleCurrentChange (newPage) {
      // console.log(newPage,'9999');
      this.pageInfo.pagenum = newPage;
      if (this.isHistory) {
        this.dataForHisTable();
      } else {
        this.dataForTable();
      }
    },
    //双击表格跳转到详情页
    toWarningMsg (val) {
      console.log(val, "打印val的数据");
      this.currentRow = val;
      this.$router.push({ name: "预警详情", params: { val: val } });
    }
  },
  components: {
    TreeSelect
  }
};
</script>

<style lang="scss" scoped>
.container {
  padding: 1vh;
}
// 搜索部分 样式
.el-form /deep/ {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .el-form-item {
    margin-bottom: 0;
  }
  .warning {
    .el-select {
      width: 100%;
    }
  }
  .time {
    .el-date-editor {
      width: 100%;
    }
  }
  .btn {
    .el-form-item__content {
      display: flex;
      justify-content: flex-start;
      flex-wrap: nowrap;
    }
  }
  // .el-form-item:nth-child(-n + 2) {
  //   .el-form-item__label {
  //     width: 68px !important;
  //   }
  //   .el-form-item__content {
  //     margin-left: 68px !important;
  //     margin-right: 10px;
  //   }
  // }
  // .el-form-item:last-child {
  //   width: 287px;
  //   // .el-form-item__content {
  //   //   margin-left: 10px !important;
  //   // }
  // }
}
// 表格详情 样式
.el-table /deep/ {
  th,
  td {
    text-align: center;
  }
}
// 分页功能 样式
.el-pagination {
  float: right;
  padding: 10px 0;
}
</style>


