<!-- 客户授信集中度简表 -->
<template>
  <div>
    <!-- 选择年、月、金额单位 部分 -->
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <!-- 选择月 -->
      <el-form-item label="查询年月" prop="pickMonth">
        <el-date-picker v-model="pm" type="month" value-format="yyyy-MM" placeholder="选择月" size="small" :editable="false"></el-date-picker>
      </el-form-item>
      <!-- 选择金额单位 -->
      <el-form-item label="金额单位" prop="moneyUnit">
        <el-select v-model="ruleForm.moneyUnit" placeholder="选择金额单位" size="small">
          <el-option label="万" value="wan"></el-option>
          <el-option label="亿" value="yi"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="query" type="primary" icon="el-icon-search" size="small">搜索</el-button>
        <el-button type="primary" size="small" @click="dowmloadExcel">导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格详情部分 -->
    <div class="content">
      <!-- 表格上方标题部分 -->
      <div class="tableTitle">
        <!-- 中间标题 -->
        <h3>{{ toptitle }}</h3>
        <p class="bottomCon">
          <span>日期： {{ tableDate.year }} 年 {{ tableDate.month }} 月</span>
          <span>单位：{{unit}}</span>
        </p>
      </div>
      <!-- 表格内容部分（余额） -->
      <div :style="amt_style" class="tableContent">
        <el-table :data="tableInfo" style="width: 100%" max-height="400">
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column prop="quotaIndexName" label="集中度指标" width="250" align="center"></el-table-column>
          <el-table-column label="实际授信情况" align="center">
            <el-table-column prop="quotaUsedAmt" label="余额" width="120" align="center">
              <template slot-scope="scope">{{ scope.row.quotaUsedAmt | NumsFormat }}</template>
            </el-table-column>
            <el-table-column prop="quotaUsedRatio" label="占比" width="120" align="center">
              <template slot-scope="scope">{{ scope.row.quotaUsedRatio + '%' }}</template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="管控指标" align="center">
            <el-table-column prop="observeValue" label="观察值(余额/占比)" width="144" align="center">
              <template slot-scope="scope">{{ scope.row.observeValue | NumsFormat }}</template>
            </el-table-column>
            <el-table-column prop="warnValue" label="预警值(余额/占比)" width="144" align="center">
              <template slot-scope="scope">{{ scope.row.warnValue | NumsFormat }}</template>
            </el-table-column>
            <el-table-column prop="controlValue" label="控制值(余额/占比)" width="144" align="center">
              <template slot-scope="scope">{{ scope.row.controlValue | NumsFormat }}</template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <p style="padding: 0; margin: 5px 0 0 0 ;font-size: 14px;">注：占比是指占我行资本净额的比例</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { creditConcentration,downRcmCusQuotaRpt,getWorkDateMap} from '@/api/rcd/limitAnalyse/limitAnalyse'

  export default {
    data() {
      return {
        amt_style: { display: 'block' },
        ratio_style: { display: 'none' },
        // 选择年、月、单位金额 数据源
        ruleForm: {
          pickMonth: '',
          moneyUnit: 'wan'
        },
        pm: '',
        // 表格详情部分 中间标题
        toptitle: '客户授信集中度简表',
        // 表格详情部分 左侧日期
        tableDate: {
          year: '',
          month: ''
        },
        // 表格详情部分 右侧单位
        unit: '万元',
        tableInfo: []
      }
    },
    props: ['selectionOrgId'],

    created() {
      //首次进页面显示年月
      this.getWorkDate()
    },
    mounted: function() {
      this.query()
    },
    methods: {
      query() {
        var date = this.pm == '' ? null : this.pm
        console.log('选择查询时间', date)
        if (date != null) {
          this.tableDate.year = date.substr(0, 4)
          this.tableDate.month = date.substr(5, 6)
        } else {
          this.tableDate.year = null;
          this.tableDate.month = null;
        }
        if (this.ruleForm.moneyUnit == 'wan') {
          this.unit = '万元'
        } else {
          this.unit = '亿元'
        }
        creditConcentration(
          this.selectionOrgId,
          this.tableDate.year,
          this.tableDate.month,
          this.ruleForm.moneyUnit
        ).then(res => {
          const datas = res.data.data.records
          this.tableInfo = datas
          if (datas.length == 0) {
            return
          }
          this.tableDate.month = datas[0].totalMonth
          this.tableDate.year = datas[0].totalYear

        })
      },

      // 点击导出按钮，触发该函数
      dowmloadExcel() {
        var year = this.tableDate.year,
          month = this.tableDate.month
        var date = this.pm == '' ? null : this.pm
        console.log('选择查询时间', date)
        if (date != null) {
          year = date.substr(0, 4)
          month = date.substr(5, 6)
          this.tableDate.year = year
          this.tableDate.month = month
        }
        if (this.ruleForm.moneyUnit == 'wan') {
          this.unit = '万元'
        } else {
          this.unit = '亿元'
        }
        downRcmCusQuotaRpt(this.selectionOrgId,
          year,
          month,
          this.ruleForm.moneyUnit
        ).then(res => {
          const content = res
          const blob = new Blob([content])
          const fileName = '客户授信集中度简表' + new Date().getTime() + '.xlsx'
          if ('download' in document.createElement('a')) { // 非IE下载
            const elink = document.createElement('a')
            elink.download = fileName
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
          } else { // IE10+下载
            navigator.msSaveBlob(blob, fileName)
          }
        })
      },
      //获取当前营业日期
      getWorkDate() {
        getWorkDateMap().then( res => {
          this.tableDate.year = res.data.year;
          this.tableDate.month = res.data.month;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  // 选择年、月、金额单位部分的样式
  .el-form /deep/ {
    display: flex;
    justify-content: space-between;

    .el-form-item {
      .el-form-item__content {
        .el-input {
          width: 150px;

          .el-input__inner {
            width: 150px;
          }
        }
      }
    }
  }

  //表格详情部分
  .content {
    // 上方标题部分的样式
    .tableTitle {
      h3 {
        text-align: center;
        font-weight: 700;
        margin-top: 0;
      }

      .bottomCon {
        display: flex;
        justify-content: space-between;
      }
    }
  }

</style>
