<!-- 接口管理-- 交易记录页面 -->
<template>
  <div class="container">
    <!-- <h3>服务配置页面</h3> -->
    <!-- <searchView></searchView> -->
    <div class="search">
      <el-row>
        <el-form ref="ruleForm" :model="ruleForm" label-width="80px" class="ruleForm" size="small">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="请求终端" prop="requestorCode">
              <el-select v-model="ruleForm.requestorCode" placeholder="请选择" clearable>
                <el-option v-for="(item,i) in requestorCodeSelections" :key="i" :label="item.title" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="响应终端" prop="responderCode">
              <el-select v-model="ruleForm.responderCode" placeholder="请选择" clearable>
                <el-option v-for="(item,i) in responderCodeSelections" :key="i" :label="item.title" :value="item.key" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="处理状态" prop="status">
              <el-select v-model="ruleForm.status" placeholder="请选择" clearable>
                <el-option v-for="(item,i) in statusSelections" :key="i" :label="item.dictValue" :value="item.dictKey" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="创建时间" prop="createTimeArray">
              <el-date-picker v-model="ruleForm.createTimeArray" type="datetimerange" :picker-options="pickerOptions"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right" value-format="yyyy-MM-dd hh:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="开始日期" prop="startCreateTime" v-if="false" key="1">
              <el-input v-model="ruleForm.startCreateTime"></el-input>
            </el-form-item>
            <el-form-item label="结束日期" prop="endCreateTime" v-if="false" key="2">
              <el-input v-model="ruleForm.endCreateTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchInfo">搜索</el-button>
              <el-button icon="el-icon-refresh-right" @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <!-- 表格区 -->
    <div class="table">
      <!-- 表格详情区 -->
      <el-table :data="tableData" style="width: 100%" size="small" border stripe max-height="400" v-loading="loading">
        <el-table-column type="index" label="序号" align="center" width="50" fixed :resizable="false" />
        <el-table-column prop="requestorName" label="请求终端" :resizable="false" align="center" width="150" />
        <el-table-column prop="responderName" label="响应终端" :resizable="false" align="center" width="100" />
        <el-table-column prop="statusName" label="处理状态" :resizable="false" align="center" width="150">
          <template slot-scope="scope">
            <el-tag :type="scope.row.statusName === '处理成功' ? 'success' : scope.row.statusName === '处理失败' ? 'danger' : 'warning'"
              disable-transitions>{{scope.row.statusName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="serviceTime" label="交易时间" :resizable="false" align="center" width="150" />
        <el-table-column prop="createTime" label="创建时间" :resizable="false" align="center" width="150" />
        <el-table-column prop="updateTime" label="修改时间" :resizable="false" align="center" width="150" />
        <el-table-column prop="serviceCode" label="服务代码" :resizable="false" align="center" width="150" />
        <el-table-column prop="serviceSn" label="交易流水号" :resizable="false" align="center" width="150" />
        <el-table-column prop="bizSn" label="业务流水号" :resizable="false" align="center" width="150" />
        <el-table-column prop="retryCount" label="重试次数" :resizable="false" align="center" width="110" />
        <el-table-column fixed="right" label="操作" width="100" :resizable="false" align="center">
          <template slot-scope="scope">
            <el-button class="textBtn" type="text" size="small" icon="el-icon-view" @click="showDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <div class="pageination">
        <el-pagination :total="total" :current-page="pageInfo.pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="pageInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </div>
    <el-dialog title="详情" :visible.sync="dialogFormVisible" width="60%">
      <div class="divDialog">
        <el-row>
          <el-form :model="detailForm" :disabled="true" :label-width="formLabelWidth">
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="请求终端" size="small">
                <el-input v-model="detailForm.requestorName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="响应终端" size="small">
                <el-input v-model="detailForm.responderName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22">
              <el-form-item label="请求报文" size="small">
                <el-input type="textarea" v-model="detailForm.requestMessage" :autosize="{ minRows: 3, maxRows: 15}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="22">
              <el-form-item label="响应报文" size="small">
                <el-input type="textarea" v-model="detailForm.responseMessage" :autosize="{ minRows: 3, maxRows: 15}"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="处理状态" size="small">
                <el-input v-model="detailForm.statusName" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="服务代码" size="small">
                <el-input v-model="detailForm.serviceCode" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="交易流水号" size="small">
                <el-input v-model="detailForm.serviceSn" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="交易时间" size="small">
                <el-input v-model="detailForm.serviceTime" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="创建时间" size="small">
                <el-input v-model="detailForm.createTime" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="修改时间" size="small">
                <el-input v-model="detailForm.updateTime" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="业务流水号" size="small">
                <el-input v-model="detailForm.bizSn" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="11" :sm="11" :md="11" :lg="11" :xl="11">
              <el-form-item label="重试次数" size="small">
                <el-input v-model="detailForm.retryCount" autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import searchView from '../components/search'
import { getTerminalconfig, getList2 } from '@/api/front/servicerecord'
import { getDictionary } from '@/api/system/dict'
export default {
  data() {
    return {
      //dialog框表单
      detailForm: {},
      dialogFormVisible: false,
      formLabelWidth: '120px',
      //列表加载属性
      loading: false,
      //表格数据
      tableData: [],
      // 分页数据
      pageInfo: {
        pagenum: 1,
        pagesize: 10
      },
      total: 40,

      //=======================搜索区所用=========================
      //请求终端
      requestorCodeSelections: [],
      //响应终端
      responderCodeSelections: [],
      //处理状态
      statusSelections: [],
      //时间选择器
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },

      // 搜索表单数据源
      ruleForm: {
        createTimeArray: []
      },
    }
  },
  created() {
    this.getTerminalconfigCommon()
    this.getTableData()
  },
  methods: {
    //=========================以下为搜索区相关函数==========================
    // 点击搜索区的重置按钮，触发该函数，重置表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.ruleForm = {}
    },
    // 点击搜索按钮触发该事件
    searchInfo() {
      this.pageInfo.pagenum = 1
      this.pageInfo.pagesize = 10
      this.getTableData()
    },
    // 获取table表格数据
    getTableData() {
      this.loading = true
      if (this.ruleForm.createTimeArray !== undefined && this.ruleForm.createTimeArray.length == 2) {
        this.ruleForm.startCreateTime = this.ruleForm.createTimeArray[0];
        this.ruleForm.endCreateTime = this.ruleForm.createTimeArray[1];
      }
      getList2(this.pageInfo.pagenum, this.pageInfo.pagesize, this.ruleForm).then(res => {
        console.log(res, '1234')
        this.total = res.data.data.total
        this.tableData = res.data.data.records
      }).finally(() => {
        this.loading = false
      })
    },

    //获取下拉框数据
    getTerminalconfigCommon() {
      getTerminalconfig().then(res => {
        this.requestorCodeSelections = res.data.data
        this.responderCodeSelections = res.data.data
      })
      getDictionary('front_status').then(response => {
        this.statusSelections = response.data.data
      })
    },
    //=========================以上为搜索区相关函数==========================
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(`每页 ${newSize} 条`)
      this.pageInfo.pagesize = newSize
      this.getTableData()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(`当前页: ${newPage}`)
      this.pageInfo.pagenum = newPage
      this.getTableData()
    },
    //点击查看，打开dialog框
    showDetail(row) {
      this.dialogFormVisible = true
      this.detailForm = row
    }
  },

  // components: {
  //   searchView
  // }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 10px 15px;
  // 搜索区样式
  .search {
    .el-form /deep/ {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .el-col {
        .el-form-item {
          .el-select {
            width: 100%;
          }
          .el-form-item__label {
            // color: #252525;
            font-weight: normal;
          }
        }
      }
      .el-col:last-child {
        .el-form-item {
          .el-form-item__content {
            display: flex;
            .el-button {
              margin-right: 10px;
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
  .el-dialog {
    .divDialog {
      height: 450px;
      overflow: auto;
      .el-form {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin-top: 1vh;
        // .el-form-item {
        //   .el-input {
        //     width: 120%;
        //   }
        // }
      }
    }
  }
}
</style>
