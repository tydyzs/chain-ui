<!-- 页面搜索区组件 -->
<template>
  <div>
    <div class="search">
      <el-row :gutter="10">
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
            <el-form-item label="创建时间" prop="createTime">
              <el-date-picker v-model="ruleForm.createTime" type="datetimerange" :picker-options="pickerOptions"
                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchInfo">搜索</el-button>
              <!-- <exportExcel :headerArr="header" :excelContent="content" :excelTableData="alltableData" :excelTitle="title"></exportExcel> -->
              <el-button class="el-icon-delete" @click="resetForm('ruleForm')">清空</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
  </div>
</template>

<script>
import { getTerminalconfig, getList } from '@/api/front/servicerecord'
import { getDictionary } from '@/api/system/dict'
export default {
  name: 'Search',
  data() {
    return {
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
        requestorCode: '',
        responderCode: '',
        status: '',
        createTime: ''
      },
    }
  },
  created() {
    this.getTerminalconfigCommon()
    this.getTableData()
  },
  methods: {
    // 点击搜索区的清空按钮，触发该函数，清空表单内容
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 点击搜索按钮触发该事件
    searchInfo() {
      this.getTableData()
    },
    // 获取table表格数据
    getTableData() {
      this.loading = true
      getList().then(res => {
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
    }
  },
}
</script>

<style lang='scss' scoped>
</style>
