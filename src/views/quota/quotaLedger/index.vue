<!-- 限额管理-- 限额台账页面 -->
<template>
  <div class="ledgerCon">
    <!-- 搜索区 -->
    <div class="search">
      <el-row :gutter="10">
        <el-form ref="searchForm" :model="searchForm" label-width="80px" class="searchForm" size="small">
          <!-- 当前机构 -->
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="当前机构" prop="orgNum">
              <el-select v-if="!treeIf" v-model="searchForm.orgNum" disabled placeholder="请选择">
                <el-option v-for="item in []" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <tree-select v-if="treeIf" v-model="searchForm.orgNum" :props="props" :options="orgData" :clearable="isClearable"
                :accordion="isAccordion" />
            </el-form-item>
          </el-col>
          <!-- 当前限额 -->
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="当前限额" prop="certType">
              <el-select v-model="searchForm.certType" placeholder="请选择当前限额" size="small">
                <el-option v-for="(item, i) in limitDatas" :key="i" :label="item.quotaName" :value="item.quotaNum"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 按钮 -->
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="searchData">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <!-- 第一层数据展示区 -->
    <div class="topData">
      <div class="databox" style="width: 22%;">
        <p>已用比例(%)</p>
        <h3 style="color: #029f4a;font-size: 30px;margin: 7px 0;">{{ topData.quotaUsedRatio + '%' }}</h3>
        <i @click="showDetail">限额详情</i>
      </div>
      <div class="databox" style="width: 22%;">
        <p>已用金额(亿元)</p>
        <h3 style="color: #029f4a;font-size: 30px;margin: 7px 0;">{{ topData.quotaUsedAmt | NumsFormat }}</h3>
      </div>
      <div class="databox" style="width: 17%;">
        <p>观察值(亿元/%)</p>
        <h3 style="color: #e3e320;">{{ topData.quotaObserve }}</h3>
      </div>
      <div class="databox" style="width: 17%;">
        <p>预警值(亿元/%)</p>
        <h3 style="color: #f7bb7c;">{{ topData.quotaWarning }}</h3>
      </div>
      <div class="databox" style="width: 17%;">
        <p>控制值(亿元/%)</p>
        <h3 style="color: red;">{{ topData.quotaController }}</h3>
      </div>
    </div>
    <!-- 第二层图+表区域 -->
    <div class="chartTable">
      <!-- 第二层左侧echarts图 -->
      <div class="leftChart" @click="showLeftEcharts">
        <linegraph v-if="flag1" :id="'linebar'" :data="option1" style="height:230px;"></linegraph>
      </div>
      <!-- 第二层右侧table表格 -->
      <div class="rightTable">
        <el-table :data="rightTableData" style="width: 100%" size="mini" border stripe>
          <el-table-column align="center" :resizable="false" prop="limitAnalyze" label="限额分析"></el-table-column>
          <el-table-column align="center" :resizable="false" prop="units" label="单位：亿元、%"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 第三层表+图区域 -->
    <div class="tableChart">
      <!-- 第三层左侧table表格 -->
      <div class="leftTable">
        <p>累计触发次数</p>
        <el-table :data="leftTableData" style="width: 100%" border stripe size="small">
          <el-table-column align="center" :resizable="false" prop="none" label width="58vw"></el-table-column>
          <el-table-column align="center" :resizable="false" prop="month" label="本月" width="58vw"></el-table-column>
          <el-table-column align="center" :resizable="false" prop="year" label="本年" width="58vw"></el-table-column>
          <el-table-column align="center" :resizable="false" prop="history" label="历史" width="58vw"></el-table-column>
        </el-table>
      </div>
      <!-- 第三层中间echarts图 -->
      <div class="middChart" @click="showmiddChart">
        <linegraph v-if="flag2" :id="'bar'" :data="option2" style="height:220px;"></linegraph>
      </div>
      <!-- 第三层右侧table表格 -->
      <div class="rightTables">
        <p>
          <span>最近五次预警触发</span>
          <span class="more" @click="toWarning">更多</span>
        </p>
        <el-table :data="rightTablesData" style="width: 100%" border stripe size="small">
          <el-table-column align="center" :resizable="false" prop="warning" label="预警级别"></el-table-column>
          <el-table-column align="center" :resizable="false" prop="businessLink" label="业务环节"></el-table-column>
          <el-table-column align="center" :resizable="false" prop="businessId" label="业务编号"></el-table-column>
          <el-table-column align="center" :resizable="false" prop="customer" label="客户"></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 显示限额详情 弹出dialog框 -->
    <el-dialog title="限额详情" :visible.sync="detailDialogVisible" width="60%">
      <!-- 历史记录 -->
      <div class="history">
        <el-button type="primary" size="small" @click="toHistory">历史记录</el-button>
      </div>
      <!-- 表单部分 -->
      <div class="hisForm">
        <el-form ref="hisForm" :model="hisForm" label-width="120px">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="集中度限额编号">
              <el-input v-model="hisForm.quotaNum" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额名称">
              <el-input v-model="hisForm.quotaName" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额指标类型">
              <el-input v-model="hisForm.quotaIndexType" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="生效机构">
              <el-input v-model="hisForm.useOrgNum" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额已用金额">
              <el-input v-model="hisForm.quotaUsedAmt" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额可用金额">
              <el-input v-model="hisForm.quotaFreeAmt" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额已用比率">
              <el-input v-model="hisForm.quotaUsedRatio" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额可用比率">
              <el-input v-model="hisForm.quotaFreeRatio" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额生效日期">
              <el-input v-model="hisForm.startDate" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额失效日期">
              <el-input v-model="hisForm.invalidDate" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="历史触发次数">
              <el-input v-model="hisForm.hisFrequency" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额状态">
              <el-input v-model="hisForm.quotaState" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <!-- 表格部分 -->
      <div class="hisTable">
        <el-table :data="hisTableData" style="width: 100%" border stripe size="small">
          <el-table-column type="index" label="#" width="50" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="quotaLevel" label="阀值层级" width="80" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="quotaControl" label="阀值" width="150" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="controlNode" label="管控节点" align="center" :resizable="false"></el-table-column>
          <el-table-column prop="nodeMeasure" label="阀值层级在管控节点的应对措施" align="center" :resizable="false"></el-table-column>
        </el-table>
      </div>
      <!-- 限额指标详情 -->
      <div class="limitMsg">
        <p>限额指标详情</p>
        <el-form ref="limitForm" :model="limitForm" label-width="140px">
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额指标编号">
              <el-input v-model="limitForm.quotaIndexNum" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额指标名称">
              <el-input v-model="limitForm.quotaIndexName" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额类型">
              <el-input v-model="limitForm.quotaType" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额计算方式">
              <el-input v-model="limitForm.computingMethod" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="统计口径">
              <el-input v-model="limitForm.quotaIndexCaliber" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="限额计算对象">
              <el-input v-model="limitForm.computingTarget" size="small" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="限额指标">
              <!-- <el-input v-model="limitForm.name" size="small" disabled></el-input> -->
              <el-input type="textarea" v-model="limitForm.name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-form-item label="补充说明">
              <!-- <el-input v-model="limitForm.explainInfo" size="small" disabled></el-input> -->
              <el-input type="textarea" v-model="limitForm.explainInfo" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
    </el-dialog>
    <!-- 第二层 左侧echarts图 放大展示区 -->
    <el-dialog :visible.sync="dialogVisible1" width="70%">
      <linegraph v-if="flag3" :id="'leftChart1'" :data="option11" style="height:400px;"></linegraph>
    </el-dialog>
    <!-- 第三层 中间echarts图 放大展示区 -->
    <el-dialog :visible.sync="dialogVisible2" width="70%">
      <linegraph v-if="flag4" :id="'middChart1'" :data="option22" style="height:500px;"></linegraph>
    </el-dialog>
  </div>
</template>

<script>
import TreeSelect from '@/components/TreeSelect/expand.vue'
import linegraph from '../../EchartsShow'
import { getDeptTreeManage } from '@/api/system/dept'
import { getUserInfo } from '@/api/user'
import {
  limitList,
  analyzeData,
  analyzeDetail,
  quotaData
} from '@/api/rcd/limitManager/limitBook'
import { getList } from '@/api/quota/warning'
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
      vtreeIf: true,
      treeIf: false,
      // 当前登录人信息
      userInfo: {},
      // 搜索区 表单数据
      searchForm: {
        orgNum: '',
        certType: ''
      },
      // 搜索区 机构选择下拉框的数据
      orgValue: '',
      // 搜索区 机构选择框中过滤搜索内容
      filterText: '',
      // 搜索区 机构选择树的数据
      orgData: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      // 搜索区 当前限额数据
      limitDatas: [],
      // echarts 节流阀
      flag1: false,
      flag2: false,
      // 第一层 数据源
      topData: {},
      // 第一层 控制 显示详情 dialog框的显示与隐藏
      detailDialogVisible: false,
      // 第一层 限额详情dialog框中 表单 数据
      hisForm: {
        quotaNum: '',
        quotaName: '',
        quotaIndexType: '',
        useOrgNum: '',
        quotaUsedAmt: '',
        quotaFreeAmt: '',
        quotaUsedRatio: '',
        quotaFreeRatio: '',
        startDate: '',
        invalidDate: '',
        hisFrequency: '',
        quotaState: ''
      },
      // 第一层 限额详情dialog框中 表格 数据
      hisTableData: [
        {
          quotaLevel: '控制值',
          quotaControl: '',
          controlNode: '',
          nodeMeasure: ''
        },
        {
          quotaLevel: '预警值',
          quotaControl: '',
          controlNode: '',
          nodeMeasure: ''
        },
        {
          quotaLevel: '观察值',
          quotaControl: '',
          controlNode: '',
          nodeMeasure: ''
        }
      ],
      // 第一层 限额详情dialog框中 限额指标详情 数据
      limitForm: {
        quotaIndexNum: '',
        quotaIndexName: '',
        quotaType: '',
        computingMethod: '',
        quotaIndexCaliber: '',
        computingTarget: '',
        name: '',
        explainInfo: ''
      },
      // 限额指标编号，用于跳转到历史记录，将限额指标编号作为参数发起get网络请求
      quotaNum: '',
      // echarts 月份数据
      month: [],
      // 第二层 左侧echarts图数据
      option1: {
        title: {
          text: '限额趋势变化',
          top: '2%',
          left: '1%',
          textStyle: {
            fontSize: '16',
            fontWeight: '400'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          // data: ["本月值", "较上月增量", "较上月增速"],
          data: ['本月值', '较上月增速'],
          // selected: { "较上月增量": false },
          top: '8%'
        },
        grid: {
          top: '40%',
          left: '3%',
          right: '3%',
          bottom: 'auto',
          // bottom: '2%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            // data: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额（亿元）',
            // min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
              formatter: '{value} '
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '比例',
            // min: 0,
            // max: 25,
            // interval: 5,
            axisLabel: {
              formatter: '{value} %'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '本月值',
            type: 'bar',
            data: [],
            // data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            itemStyle: {
              normal: {
                color: '#029f4a'
              }
            }
          },
          // {
          //   name: "较上月增量",
          //   type: "bar",
          //   data: [],
          //   // data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          //   itemStyle: {
          //     normal: {
          //       color: "#c86532"
          //     }
          //   }
          // },
          {
            name: '较上月增速',
            type: 'line',
            yAxisIndex: 1,
            data: [],
            // data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
            itemStyle: {
              normal: {
                color: '#7fb2b8'
              }
            }
          }
        ]
      },
      // 第二层 控制第二层echarts dialog框的 显示与隐藏
      dialogVisible1: false,
      flag3: false,
      // 第二层 dialog框中的 echarts图数据
      option11: {
        title: {
          text: '限额趋势变化',
          top: '1%',
          textStyle: {
            fontSize: '16',
            fontWeight: '400'
          }
        },
        grid: {
          // top: '10%',
          left: '3%',
          right: '3%',
          bottom: 'auto',
          bottom: '2%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        legend: {
          // data: ["本月值", "较上月增量", "较上月增速"],
          data: ['本月值', '较上月增速'],
          // selected: { "较上月增量": false },
          top: '6%'
        },
        xAxis: [
          {
            type: 'category',
            data: [],
            // data: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '金额（亿元）',
            // min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
              formatter: '{value} '
            },
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '比例',
            // min: 0,
            // max: 25,
            // interval: 5,
            axisLabel: {
              formatter: '{value} %'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '本月值',
            type: 'bar',
            data: [],
            // data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
            itemStyle: {
              normal: {
                color: '#029f4a'
              }
            }
          },
          // {
          //   name: "较上月增量",
          //   type: "bar",
          //   data: [],
          //   // data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
          //   itemStyle: {
          //     normal: {
          //       color: "#c86532"
          //     }
          //   }
          // },
          {
            name: '较上月增速',
            type: 'line',
            yAxisIndex: 1,
            data: [],
            // data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2],
            itemStyle: {
              normal: {
                color: '#7fb2b8'
              }
            }
          }
        ]
      },
      // 第二层 左侧echarts本月数据
      option1Data: [],
      // 第二层 右侧table表格数据
      rightTableData: [
        {
          limitAnalyze: '本月值',
          units: '',
          temp: 'quotaUsedAmt'
        },
        {
          limitAnalyze: '上月值',
          units: '',
          temp: 'lastQuotaUsedAmt'
        },
        {
          limitAnalyze: '较上月增量',
          units: '',
          temp: 'monthToMonthAmt'
        },
        {
          limitAnalyze: '较上月增速',
          units: '',
          temp: 'monthToMonthRatio'
        },
        {
          limitAnalyze: '较上年增量',
          units: '',
          temp: 'lastYearAmt'
        },
        {
          limitAnalyze: '较上年增速',
          units: '',
          temp: 'lastYearRatio'
        },
        {
          limitAnalyze: '较同期增量',
          units: '',
          temp: 'yearToYearAmt'
        },
        {
          limitAnalyze: '较同期增速',
          units: '',
          temp: 'yearToYearRatio'
        }
      ],
      // 第三层 左侧table表格数据
      leftTableData: [
        {
          none: '观察',
          month: '',
          monthStr: 'hisFrequencyA3',
          year: '',
          yearStr: 'hisFrequencyA2',
          history: '',
          historyStr: 'hisFrequencyA'
        },
        {
          none: '预警',
          month: '',
          monthStr: 'hisFrequencyB3',
          year: '',
          yearStr: 'hisFrequencyB2',
          history: '',
          historyStr: 'hisFrequencyB'
        },
        {
          none: '控制',
          month: '',
          monthStr: 'hisFrequencyC3',
          year: '',
          yearStr: 'hisFrequencyC2',
          history: '',
          historyStr: 'hisFrequencyC'
        },
        {
          none: '总计',
          month: '',
          monthStr: 'hisFrequencyMonth',
          year: '',
          yearStr: 'hisFrequencyYear',
          history: '',
          historyStr: 'hisFrequency'
        }
      ],
      // 第三层 中间图表的数据源
      option2: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['观察', '预警', '控制'],
          top: '8%'
        },
        grid: {
          top: '35%',
          left: '3%',
          right: '3%',
          bottom: 'auto%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: [],
          // data: ['1月', '', '3月', '', '5月', '', '7月', '', '9月', '', '11月', ''],
          axisTick: {
            interval: 1
          },
          axisLabel: {
            interval: 0
          },
          axisLine: {
            onZero: true
          }
        },
        series: [
          {
            name: '观察',
            type: 'bar',
            stack: '总量',
            data: []
            // data: [100, 110, 90, 110, 85, 210, 200, 110, 100, 130, 220, 200]
          },
          {
            name: '预警',
            type: 'bar',
            stack: '总量',
            data: []
            // data: [200, 130, 135, 140, 250, 245, 240, 125, 200, 210, 215, 210]
          },
          {
            name: '控制',
            type: 'bar',
            stack: '总量',
            data: []
            // data: [100, 210, 200, 110, 140, 230, 310, 180, 120, 210, 260, 410]
          }
        ]
      },
      // 第三层 控制第三层echarts dialog框的 显示与隐藏
      dialogVisible2: false,
      flag4: false,
      // 第三层 dialog框中的 echarts图数据
      option22: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          data: ['观察', '预警', '控制']
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: [],
          // data: ['1月', '', '3月', '', '5月', '', '7月', '', '9月', '', '11月', ''],
          axisTick: {
            interval: 1
          },
          axisLabel: {
            interval: 0
          },
          axisLine: {
            onZero: true
          }
        },
        series: [
          {
            name: '观察',
            type: 'bar',
            stack: '总量',
            data: []
            // data: [100, 110, 90, 110, 85, 210, 200, 110, 100, 130, 220, 200]
          },
          {
            name: '预警',
            type: 'bar',
            stack: '总量',
            data: []
            // data: [200, 130, 135, 140, 250, 245, 240, 125, 200, 210, 215, 210]
          },
          {
            name: '控制',
            type: 'bar',
            stack: '总量',
            data: []
            // data: [100, 210, 200, 110, 140, 230, 310, 180, 120, 210, 260, 410]
          }
        ]
      },
      // 第三层 中间echarts本月数据
      option2Data: [],
      // 第三层 右侧table表格数据
      rightTablesData: [
        {
          warning: '观察',
          businessLink: '授信申请',
          businessId: '856123',
          customer: '武则天'
        },
        {
          warning: '预警',
          businessLink: '授信审批',
          businessId: '841269',
          customer: '秦始皇'
        },
        {
          warning: '控制',
          businessLink: '放款申请',
          businessId: '145784',
          customer: '朱元璋'
        },
        {
          warning: '观察',
          businessLink: '合同申请',
          businessId: '159634',
          customer: '唐太宗'
        },
        {
          warning: '预警',
          businessLink: '合同审批',
          businessId: '284756',
          customer: '努尔哈赤'
        }
      ],
      // 第三层 右侧表格发起网络请求所需要的参数
      warningInfo: {
        current: 1,
        size: 5,
        quotaName: '',
        triggerLevel: '',
        triggerTimeStart: '',
        triggerTimeEnd: ''
      }
    }
  },
  created () {
    this.getunserInfo()
  },
  watch: {
    // 监听 搜索区 当前机构 机构树
    filterText (val) {
      this.$refs.orgTree.filter(val)
    }
  },
  methods: {
    // 获取当前登录人的信息
    getunserInfo () {
      getUserInfo().then(res => {
        // console.log(res, '打印当前登录人信息');
        if (res.status != 200) {
          return this.$message.error('获取当前登录人信息失败，请重试')
        }
        this.userInfo = res.data.data
        getDeptTreeManage(this.userInfo.deptId).then(res => {
          // console.log(res, '测试登录机构下的机构树数据');
          if (res.status != 200) {
            return this.$message.error('获取当前登录人信息失败，请重试')
          }
          this.orgData = res.data.data
          // console.log('444', this.orgData)
          // console.log(this.orgData,'1111');
          // 如果当前登录机构为省联社，默认选择省联社
          if (this.orgData[0].deptLevel == 1) {
            // 如果当前登录机构为省联社，默认选择省联社
            // console.log(this.orgData[0].deptLevel, '打印机构级别')
            this.searchForm.orgNum = this.orgData[0].id
            this.props.formVal = this.orgData[0].title
            // console.log('props', this.props)
            this.getLimit(this.orgData[0].id)
            // this.getLimit(16200)
          } else if (this.orgData[0].deptLevel == 2) {
            // 如果当前登录机构为市联社下第一个成员行，机构树为该市级下所有成员行
            // console.log(this.orgData[0].deptLevel, '打印机构级别')
            this.searchForm.orgNum = this.orgData[0].children[0].id
            this.props.formVal = this.orgData[0].children[0].title
          } else if (this.orgData[0].deptLevel == 3) {
            // 如果当前登录机构为成员行，机构树只显示成员行
            // console.log(this.orgData[0].deptLevel, '打印机构级别')
            this.searchForm.orgNum = this.orgData[0].id
            this.props.formVal = this.orgData[0].title
            this.getLimit(this.orgData[0].id)
            // this.getLimit(16200)
          }
          this.vtreeIf = false
          this.treeIf = true
        })
      })
    },
    // 公共方法 选择当前限额类型后，获取对应的限额数据
    getDatas (i) {
      analyzeDetail(i).then(res => {
        // console.log(res,'限额详情接口数据');
        if (res.status != 200) {
          return this.$message.error('获取限额详情数据失败，请重试')
        }
        this.topData = res.data.data
        // console.log(this.topData,'限额详情');
      })
    },
    // 公共方法 获取当前登录机构或者所选机构下的限额选项数据
    getLimit (e) {
      // console.log(e,'打印参数');
      limitList(e).then(res => {
        console.log(res, '测试机构下限额选项')
        if (res.status != 200) {
          return this.$message.error('获取机构下的限额清单数据失败，请重试')
        }
        this.limitDatas = res.data.data
        // console.log(this.limitDatas[0].quotaName,'1111');
        this.searchForm.certType = this.limitDatas[0].quotaName
        this.warningInfo.quotaName = this.limitDatas[0].quotaName
        // console.log(this.warningInfo,'参数');
        this.getWarnInfo(
          this.warningInfo.current,
          this.warningInfo.size,
          this.warningInfo.quotaName,
          this.warningInfo.triggerLevel,
          this.warningInfo.triggerTimeStart,
          this.warningInfo.triggerTimeEnd
        )
        let obj = this.limitDatas.filter(item => {
          return item.quotaName == this.searchForm.certType
        })
        // console.log(obj,'0000');
        this.getDatas(obj[0].quotaNum)
        this.getanalyze(obj[0].quotaNum)
        this.getDetail(obj[0].quotaNum)
        // this.getQuota(obj[0].quotaNum)
        setTimeout(() => {
          this.getQuota(this.searchForm.certType)
          // this.getQuota('CI20191226536693')
        }, 200)
      })
    },
    // 公共方法 查询限额分析（含累计触发次数）
    getanalyze (e) {
      analyzeData(e).then(res => {
        // console.log(res,'限额分析数据');
        if (res.status != 200) {
          return this.$message.error('获取限额分析数据失败，请重试')
        }
        const datas = res.data.data
        // console.log(datas,'含累计次数限额分析数据');

        // 第二层 左侧echarts本月数据
        this.option1Data = {
          quotaUsedAmt: datas.quotaUsedAmt,
          monthToMonthAmt: datas.monthToMonthAmt,
          monthToMonthRatio: datas.monthToMonthRatio
        }
        // console.log(this.option1Data,'二层echarts本月数据');
        // 第三层 中间echarts本月数据
        this.option2Data = {
          hisFrequencyA3: datas.hisFrequencyA3,
          hisFrequencyB3: datas.hisFrequencyB3,
          hisFrequencyC3: datas.hisFrequencyC3
        }
        // console.log(this.option2Data,'三层数据补充');

        // 赋值第二层右侧table数据
        for (let i = 0, len = this.rightTableData.length; i < len; i++) {
          this.rightTableData[i].units = datas[this.rightTableData[i].temp]
        }
        // 赋值第三层左侧table数据
        for (let j = 0, len = this.leftTableData.length; j < len; j++) {
          this.leftTableData[j].month = datas[this.leftTableData[j].monthStr]
          this.leftTableData[j].year = datas[this.leftTableData[j].yearStr]
          this.leftTableData[j].history =
            datas[this.leftTableData[j].historyStr]
        }
      })
    },
    // 公共方法 查询限额和预警次数最近12月的趋势变化
    getQuota (e) {
      quotaData(e).then(res => {
        // console.log(res,'打印第二层echarts图数据');
        if (res.status != 200) {
          return this.$message.error('获取限额预警数据失败，请重试')
        }
        const datas = res.data.data
        // console.log(datas, '打印限额预警数据111');

        // 获取echarts月份
        this.getMonth(datas)
        // console.log(this.month,'打印月份');
        // 第二层 echarts月份数据
        this.option1.xAxis[0].data = this.month
        // 第二层 dialog中echarts月份数据
        this.option11.xAxis[0].data = this.month
        // 第三层 echarts月份数据
        this.option2.xAxis.data = this.month
        // 第三层 dialog中echarts月份数据
        this.option22.xAxis.data = this.month
        // console.log( this.option1.xAxis[0].data,'二层月份');
        // console.log(this.option2.xAxis.data,'三层月份');

        // 第二层echarts数据 本月值
        this.option1.series[0].data = datas.map(item => {
          return item.quotaUsedAmt
        })
        this.option1.series[0].data.push(this.option1Data.quotaUsedAmt)
        // 第二层dialog中echarts数据 本月值
        this.option11.series[0].data = datas.map(item => {
          return item.quotaUsedAmt
        })
        this.option11.series[0].data.push(this.option1Data.quotaUsedAmt)

        // // 第二层echarts数据 较上月增量
        // this.option1.series[1].data = datas.map(item => {
        //   return item.monthToMonthAmt
        // })
        // this.option1.series[1].data.push(this.option1Data.monthToMonthAmt)
        // // 第二层dialog中echarts数据 较上月增量
        // this.option11.series[1].data = datas.map(item => {
        //   return item.quotaUsedAmt
        // })
        // this.option11.series[1].data.push(this.option1Data.quotaUsedAmt)

        // 第二层echarts数据 较上月增速
        this.option1.series[1].data = datas.map(item => {
          return item.monthToMonthRatio
        })
        this.option1.series[1].data.push(this.option1Data.monthToMonthRatio)
        // 第二层dialog中echarts数据 较上月增速
        this.option11.series[1].data = datas.map(item => {
          return item.quotaUsedAmt
        })
        this.option11.series[1].data.push(this.option1Data.quotaUsedAmt)
        // console.log(this.option1.series[0].data,'00000');
        this.flag1 = true

        // 第三层echarts数据 观察值数据
        this.option2.series[0].data = datas.map(item => {
          return item.hisFrequencyA3
        })
        this.option2.series[0].data.push(this.option2Data.hisFrequencyA3)
        // 第三层dialog中echarts数据 观察值数据
        this.option22.series[0].data = datas.map(item => {
          return item.hisFrequencyA3
        })
        this.option22.series[0].data.push(this.option2Data.hisFrequencyA3)

        // 第三层echarts数据 预警值数据
        this.option2.series[1].data = datas.map(item => {
          return item.hisFrequencyB3
        })
        this.option2.series[1].data.push(this.option2Data.hisFrequencyB3)
        // 第三层dialog中echarts数据 预警值数据
        this.option22.series[1].data = datas.map(item => {
          return item.hisFrequencyB3
        })
        this.option22.series[1].data.push(this.option2Data.hisFrequencyB3)

        // 第三层echarts数据 控制值数据
        this.option2.series[2].data = datas.map(item => {
          return item.hisFrequencyC3
        })
        this.option2.series[2].data.push(this.option2Data.hisFrequencyC3)
        // 第三层dialog中echarts数据 控制值数据
        this.option22.series[2].data = datas.map(item => {
          return item.hisFrequencyC3
        })
        this.option22.series[2].data.push(this.option2Data.hisFrequencyC3)
        this.flag2 = true
      })
    },
    // 公共方法 获取echarts月份数据
    getMonth (datas) {
      let months = datas.map(item => {
        return item.totalMonth.replace(/\b(0+)/gi, '')
      })
      if (months[months.length - 1] == '12') {
        months.push('1')
      } else {
        let month = parseInt(months[months.length - 1]) + parseInt(1) + ''
        months.push(month)
      }
      months = months.map(item => {
        return item + '月'
      })
      this.month = months
    },
    // 公共方法 查询限额详情
    getDetail (e) {
      analyzeDetail(e).then(res => {
        // console.log(res, '限额详情数据');
        if (res.status != 200) {
          return this.$message.error('获取限额详情数据失败，请重试')
        }
        const datas = res.data.data
        this.hisForm = datas
        this.limitForm = datas
        this.quotaNum = datas.quotaNum
      })
    },
    // 公共方法 查询限额预警信息
    getWarnInfo (a, b, c, d, e, f) {
      // console.log(...e,'展开参数');
      getList(a, b, c, d, e, f).then(res => {
        // console.log(res, '打印限额预警信息数据');
        if (res.status != 200) {
          return this.$message.error('获取限额预警信息数据失败，请重试')
        }
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
        this.searchForm.orgNum = e.title
        this.orgValue = e.title
        this.getLimit(e.id)
        // this.getLimit(16200)
      }
    },
    // 搜索区 点击 搜索 按钮，触发该函数
    searchData () {
      // console.log(this.searchForm)
      this.warningInfo.quotaName = this.searchForm.certType
      this.getWarnInfo(
        this.warningInfo.current,
        this.warningInfo.size,
        this.warningInfo.quotaName,
        this.warningInfo.triggerLevel,
        this.warningInfo.triggerTimeStart,
        this.warningInfo.triggerTimeEnd
      )
      // console.log(this.warningInfo,'参数1')
      this.getDatas(this.searchForm.certType)
      this.getanalyze(this.searchForm.certType)
      this.getDetail(this.searchForm.certType)
      // this.getQuota(obj[0].quotaNum)
      setTimeout(() => {
        this.getQuota(this.searchForm.certType)
        // this.getQuota('CI20191226536693')
      }, 200)
    },
    // 第一层 点击限额详情，触发该函数，展示详情信息
    showDetail () {
      // console.log('测试按钮');
      this.detailDialogVisible = true
    },
    // 第一层 点击限额详情dialog框中 历史记录 按钮，触发该函数
    toHistory () {
      // console.log('测试历史记录按钮');
      const val = this.quotaNum
      this.$router.push({ name: '历史记录', params: { val: val } })
    },
    // 第二层 点击第二层左侧echarts图，触发该函数
    showLeftEcharts () {
      // console.log('测试按钮');
      this.flag3 = true
      this.dialogVisible1 = true
    },
    // 第三层 点击第三层中间echarts图，触发该函数
    showmiddChart () {
      this.flag4 = true
      this.dialogVisible2 = true
    },
    // 第三层 点击 更多 按钮，跳转到 限额预警 页面
    toWarning () {
      this.$router.push({ name: '限额预警页面' })
    }
  },
  components: {
    linegraph,
    TreeSelect
  }
}
</script>

<style lang="scss" scoped>
.ledgerCon {
  padding: 1vh 0.5vw;
  .el-table th.gutter {
    display: table-cell !important;
  }
  .el-select {
    display: block;
  }
  // 搜索区样式
  .search {
    border: 1px solid #ccc;
    box-shadow: 1px 1px 4px #ccc;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    -ms-border-radius: 5px;
    -o-border-radius: 5px;
    .el-form /deep/ {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      transform: translateY(25%);
      // .el-col {
      //   .el-form-item {
      //     .el-form-item__label {
      //       // color: #252525;
      //       font-weight: normal;
      //     }
      //   }
      // }
    }
  }
  // 第一层数据展示区 样式
  .topData {
    display: flex;
    justify-content: space-between;
    margin: 1vh 0;
    // border: 1px solid #ccc;
    // 五个数据视图的样式
    .databox {
      border: 1px solid #dfd8d8;
      // border: 1px solid #eee;
      margin: 2px;
      text-align: center;
      background-color: #fff;
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
      box-shadow: 1px 1px 4px #ccc;
      p {
        margin: 5px 0;
      }
      h3 {
        margin: 14px 0;
      }
    }
    .databox:first-child {
      position: relative;
      i {
        position: absolute;
        top: 2px;
        left: 7px;
        font-style: normal;
        font-size: 12px;
        text-decoration: underline;
        cursor: pointer;
        color: #029f4a;
      }
    }
  }
  // 第二层图+表区域 样式
  .chartTable {
    display: flex;
    justify-content: space-between;
    .leftChart,
    .rightTable {
      border: 1px solid #dfd8d8;
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
      box-shadow: 1px 1px 4px #ccc;
    }
    .leftChart {
      width: 70%;
    }
    .rightTable {
      width: 28%;
    }
  }
  // 第三层表+图区域 样式
  .tableChart {
    display: flex;
    justify-content: space-between;
    margin: 1vh 0;
    .leftTable,
    .middChart,
    .rightTables {
      border: 1px solid #dfd8d8;
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
      box-shadow: 1px 1px 4px #ccc;
    }
    .leftTable {
      width: 19%;
      p {
        margin: 1vh 0;
        text-align: center;
      }
    }
    .middChart {
      width: 43%;
    }
    .rightTables {
      width: 34%;
      p {
        margin: 1vh 0;
        padding: 0 1vw;
        display: flex;
        justify-content: space-between;
        .more {
          color: #029f4a;
          text-decoration: underline;
          cursor: pointer;
          font-size: 14px;
        }
      }
    }
  }
  // 限额详情 dialog 样式
  .el-dialog__wrapper /deep/ {
    .el-dialog {
      height: 950px;
      // 历史记录 样式
      .history {
        display: flex;
        justify-content: flex-end;
      }
      // 表单部分 样式
      .hisForm {
        margin: 10px 0 0 0;
        .el-form {
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .el-form-item {
            .el-form-item__label {
              font-weight: normal;
            }
            .el-form-item__content {
              .el-input {
                .el-input__inner {
                  color: #333;
                }
              }
            }
          }
        }
      }
      // 限额指标详情 样式
      .limitMsg {
        p {
          font-size: 16px;
        }
        .el-form {
          .el-form-item {
            .el-form-item__label {
              font-weight: normal;
            }
            .el-form-item__content {
              .el-input {
                .el-input__inner {
                  color: #333;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
