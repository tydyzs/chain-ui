<!-- 额度台账---同业客户360视图页面 -->
<template>
  <div class="viewContainer">
    <!-- 第一层基本信息部分 -->
    <div class="topInfo">
      <!-- 左侧客户名称+证件号码 -->
      <div class="leftCon">
        <template>
          <span>{{ topData.customerName }}</span>
          <span>{{ topData.customerNum }}</span>
        </template>
      </div>
      <!-- 右侧切换机构+查看关系人信息 -->
      <div class="rightCon">
        <span>
          切换机构：
          <el-select v-model="orgValue" placeholder size="mini" @change="selectChange">
            <el-option v-for="(item, i) in orgOptions" :key="i" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </span>
        <!-- <span>
          <el-button type="primary" size="mini">查看关系人信息</el-button>
        </span> -->
      </div>
    </div>
    <!-- 第二层图+表部分 -->
    <div class="chartTable">
      <!-- 第二层 左侧echarts图 -->
      <div class="leftChart" @click="showLeftChart">
        <linegraph v-if="flag1" :id="'pie'" :data="option1" style="height:30vh;"></linegraph>
      </div>
      <!-- 第二层 右侧table表格 -->
      <div class="rightTable">
        <el-table :data="rightTableData" style="width: 100%" size="mini" border>
          <el-table-column prop="crdProductName" label="额度产品" align="center" width="120"></el-table-column>
          <el-table-column prop="limitCredit" label="授信额度" align="center">
            <template slot-scope="scope">
              {{ scope.row.limitCredit | NumsFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="limitUsed" label="已用额度" align="center">
            <template slot-scope="scope">
              {{ scope.row.limitUsed | NumsFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="limitAvi" label="可用额度" align="center">
            <template slot-scope="scope">
              {{ scope.row.limitAvi | NumsFormat }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 第三层表+图部分 -->
    <div class="tableChart">
      <!-- 第三层 左侧table表格 -->
      <div class="leftTabel">
        <el-table :data="leftTableData" style="width: 100%" size="mini" border>
          <el-table-column prop="crdProductName" label="额度产品" align="center"></el-table-column>
          <el-table-column prop="limitCredit" label="授信额度" align="center">
            <template slot-scope="scope">
              {{ scope.row.limitCredit | NumsFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="limitUsed" label="已用额度" align="center">
            <template slot-scope="scope">
              {{ scope.row.limitUsed | NumsFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="limitAvi" label="可用额度" align="center">
            <template slot-scope="scope">
              {{ scope.row.limitAvi | NumsFormat }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 第三层 右侧echarts图 -->
      <div class="rightChart" @click="showLeftChart1">
        <linegraph v-if="flag2" :id="'bar'" :data="option2" style="height:30vh;"></linegraph>
      </div>
    </div>
    <!-- 第二层echarts放大展示dialog框 -->
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :lock-scroll="false" :visible.sync="dialogVisible1" width="70%">
      <linegraph v-if="flag3" :id="'pie1'" :data="option11" style="height:60vh;"></linegraph>
    </el-dialog>
    <!-- 第三层echarts放大展示dialog框 -->
    <el-dialog :append-to-body="true" :close-on-click-modal="false" :lock-scroll="false" :visible.sync="dialogVisible2" width="70%">
      <linegraph v-if="flag4" :id="'bar1'" :data="option22" style="height:60vh;"></linegraph>
    </el-dialog>
  </div>
</template>

<script>
import linegraph from '../../EchartsShow'
import { getOrgByCust } from '@/api/rcd/standBook/corporate'
import { getProvincialUnionList, getMemberList } from "@/api/ledger/same/sameView"
import { thousands } from "@/utils/thousands.js"
export default {
  data () {
    return {
      // ===== 第一层数据源 =====
      // 第一层信息数据源
      topData: {},
      // 第一层中 右侧机构切换默认数据
      orgValue: '',
      // 第一层中 右侧机构切换默认机构号
      // orgNum: '',
      // 第一层中 右侧机构切换机构数据
      orgOptions: [],
      // ===== 第二层数据源 =====
      flag1: false,
      flag2: false,
      flag3: false,
      flag4: false,
      // 控制第二层echarts放大展示dialog框 显示与隐藏
      dialogVisible1: false,
      // 控制第三层echarts放大展示dialog框 显示与隐藏
      dialogVisible2: false,
      // 第二层 左侧echarts图数据
      option1: {
        title: {
          text: '省联社额度结构图',
          subtext: '额度品种维度',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b}:{c}({d}%) <br/> 已用额度:30(10%)  <br/> 可用额度:100(90%) "
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: []
        },
        series: [
          {
            name: '额度品种',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            label: {
              normal: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 18,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 30
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: []
          }
        ]
      },
      option11: {
        title: {
          text: '省联社额度结构图',
          subtext: '额度品种维度',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b}:{c}({d}%) <br/> 已用额度:30(10%)  <br/> 可用额度:100(90%) "
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: []
        },
        series: [
          {
            name: '额度品种',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            label: {
              normal: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 18,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 30
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: []
          }
        ]
      },
      rightTableData: [],
      // ===== 第三层数据源 =====
      // 第三层左侧table表格数据
      leftTableData: [],
      // 第三层右侧echarts图数据
      option2: {
        title: {
          text: '成员行额度结构图',
          subtext: '额度品种维度',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b}:{c}({d}%) <br/> 已用额度:30(10%)  <br/> 可用额度:100(90%) "
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: []
        },
        series: [
          {
            name: '额度品种',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            label: {
              normal: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 18,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 30
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: []
          }
        ]
      },
      option22: {
        title: {
          text: '成员行额度结构图',
          subtext: '额度品种维度',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{b}:{c}({d}%) <br/> 已用额度:30(10%)  <br/> 可用额度:100(90%) "
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: []
        },
        series: [
          {
            name: '额度品种',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            label: {
              normal: {
                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                backgroundColor: '#eee',
                borderColor: '#aaa',
                borderWidth: 1,
                borderRadius: 4,
                // shadowBlur:3,
                // shadowOffsetX: 2,
                // shadowOffsetY: 2,
                // shadowColor: '#999',
                // padding: [0, 7],
                rich: {
                  a: {
                    color: '#999',
                    lineHeight: 18,
                    align: 'center'
                  },
                  hr: {
                    borderColor: '#aaa',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 16,
                    lineHeight: 30
                  },
                  per: {
                    color: '#eee',
                    backgroundColor: '#334455',
                    padding: [2, 4],
                    borderRadius: 2
                  }
                }
              }
            },
            data: []
          }
        ]
      },
    }
  },
  created () {
    // console.log(this.$route.params.val, "打印传递值")
    // this.topData = this.$route.params.val
    this.topData = JSON.parse(sessionStorage.getItem("sameval"))
    // this.orgValue = this.$route.params.val.orgNum
    // this.orgNum = '01000'
    // console.log(this.topData,'传递过来的值');
    this.getOrgs();
    this.getTableData();
  },
  methods: {
    getTableData () {
      //省联社图标数据获取
      getProvincialUnionList(this.topData.customerNum).then(res => {
        const datas = res.data.data;
        this.rightTableData = datas;
        this.option1.legend.data = this.rightTableData.map(item => {
          return item.crdProductName
        })
        this.option1.series[0].data = this.rightTableData.map(item => {
          return { value: item.limitCredit, name: item.crdProductName }
        })
        this.flag1 = true
      });
      //成员行数据获取
      getMemberList(this.topData.customerNum, this.orgValue).then(res => {
        const datas = res.data.data;
        this.leftTableData = datas;
        this.option2.legend.data = this.leftTableData.map(item => {
          return item.crdProductName
        })
        this.option2.series[0].data = this.leftTableData.map(item => {
          return { value: item.limitCredit, name: item.crdProductName }
        })
        this.flag2 = true;
      });
    },
    // 获取该客户下的机构
    getOrgs () {
      getOrgByCust(this.topData.customerNum).then(res => {
      //   console.log(res, '测试机构接口');
      // })
      // getOrgByCust('C002').then(res => {
        // console.log(res, '测试机构接口11');
        if (res.status != 200) {
          return this.$message.error('获取机构数据失败，请重试')
        }
        const datas = res.data.data
        this.orgOptions = datas.map(item => {
          return { value: item.id, label: item.deptName }
        })
        console.log(this.orgOptions, '机构切换数据');
        let arr = this.orgOptions.filter(item => {
          return item.value == this.topData.orgNum
        })
        console.log(arr, '111');
        this.orgValue = arr[0].label
        this.getProvince(this.topData.customerNum)
        // this.getProvince('C008')
        this.getMember(this.topData.customerNum,this.orgOptions[1].value)
        // this.getMember('C008', '10800')
      })
    },
    // 公共方法，查询省联社查询额度明细
    getProvince (e) {
      getProvincialUnionList(e).then(res => {
        console.log(res, '省联社额度明细');
        if (res.status != 200) {
          return this.$message.error('获取省联社额度明细数据失败，请重试')
        }
        const datas = res.data.data
        this.rightTableData = datas
        // echarts数据
        this.option1.legend.data = datas.map(item => {
          return item.crdProductName
        })
        this.option1.series[0].data = datas.map(item => {
          return { value: item.limitCredit, name: item.crdProductName}
        })
        this.flag1 = true
      })
    },
    // 公共方法，查询成员行额度明细
    getMember (a, b) {
      getMemberList(a, b).then(res => {
        console.log(res, '成员行额度明细');
        if (res.status != 200) {
          return this.$message.error('获取成员行额度明细数据失败，请重试')
        }
        const datas = res.data.data
        // this.leftTableData = datas
        this.leftTableData = JSON.parse(JSON.stringify(datas))
        thousands(this.leftTableData)
        // echarts数据
        this.option2.legend.data = datas.map(item => {
          return item.crdProductName
        })
        this.option2.series[0].data = datas.map(item => {
          return { value: item.limitCredit, name: item.crdProductName}
        })
        this.flag2 = true
      })
    },
    // 切换机构，触发该函数
    selectChange (e) {
      console.log(e,'切换机构');
      this.getMember(this.topData.customerNum,e)
      // this.getMember('C008','10800')
    },
    // 点击第二层 左侧echarts图，放大展示
    showLeftChart () {
      this.option11.legend.data = this.rightTableData.map(item => {
        return item.crdProductName
      });
      this.option11.series[0].data = this.rightTableData.map(item => {
        return { value: item.limitCredit, name: item.crdProductName }
      });
      this.flag3 = true;
      this.dialogVisible1 = true;
    },
    // 点击第二层 左侧echarts图，放大展示
    showLeftChart1 () {
      this.option22.legend.data = this.leftTableData.map(item => {
        return item.crdProductName
      })
      this.option22.series[0].data = this.leftTableData.map(item => {
        return { value: item.limitCredit, name: item.crdProductName }
      })
      this.flag4 = true;
      this.dialogVisible2 = true;
    },
  },
  components: {
    linegraph
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/ledgerView.scss';
.viewContainer {
  // 第三层 表+图 样式
  .tableChart {
    display: flex;
    justify-content: space-between;
    .leftTabel {
      width: 30%;
    }
    .rightChart {
      width: 68%;
    }
  }
}
</style>
