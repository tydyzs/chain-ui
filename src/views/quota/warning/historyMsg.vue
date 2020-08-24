<template>
  <div>
    <!-- 顶部表单 -->
    <!--<el-form class="tableMsg" :model="ruleForm" ref="ruleForm" label-width="140px" style="margin-top: 20px;margin-bottom: -15px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="限额名称">
            <el-input v-model="ruleForm.quotaName" size="small" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="限额状态">
            <el-select v-model="ruleForm.quotaState" size="small" disabled>
              <el-option v-for="item in quotaStateSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="限额指标名称">
            <el-input v-model="ruleForm.quotaIndexName" size="small" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-top:-15px">
        <el-col :span="8">
          <el-form-item label="生效机构">
            <el-input v-model="ruleForm.useOrgNum" size="small" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="限额类型">
            <el-select v-model="ruleForm.quotaType" size="small" disabled>
              <el-option v-for="item in quotaTypeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="限额指标类型">
            <el-select v-model="ruleForm.quotaIndexType" size="small" disabled>
              <el-option v-for="item in quotaIndexTypeSelections" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>-->
    <!-- 当前参数 -->
    <!--<el-card>
      <span class="msgTitle" style="margin-top: -10px">
        <i class="iconfont iconnavicon"></i> 当前参数
      </span>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="quotaLevel" label="阈值层级" align="center">
          <template slot-scope="scope">{{ dicQuotaLevel[scope.row.quotaLevel] }}</template>
        </el-table-column>
        <el-table-column prop="amtOrRatio" label="阈值" align="center"></el-table-column>
        <el-table-column prop="quotaControlType" label="阈值类型" align="center">
          <template slot-scope="scope">{{ dicQuotaControlType[scope.row.quotaControlType] }}</template>
        </el-table-column>
        <el-table-column prop="controlNode" label="管控节点" width="300" align="center">
          <template slot-scope="scope">{{ dicControlNode[scope.row.controlNode] }}</template>
        </el-table-column>
        <el-table-column prop="nodeMeasure" label="应对措施" align="center">
          <template slot-scope="scope">{{ dicNodeMeasure[scope.row.nodeMeasure] }}</template>
        </el-table-column>
      </el-table>
    </el-card>-->
    <!-- 修改记录 -->
    <el-card>
      <span class="msgTitle" style="margin-top: -10px">
        <i class="iconfont iconnavicon"></i> 修改记录
      </span>
      <el-table :data="historyMain" border style="width: 100%;" max-height="300" @cell-click="getHistoryDetail">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="维护时间" align="center" style="color:#029f4a"></el-table-column>
        <el-table-column prop="userNum" label="维护人" align="center">
          <template slot-scope="scope">{{ dicUserNum[scope.row.userNum] }}</template>
        </el-table-column>
        <el-table-column prop="orgNum" label="维护机构" align="center">
          <template slot-scope="scope">{{ dicModOrgNum[scope.row.orgNum] }}</template>
        </el-table-column>
        <el-table-column prop="quotaState" label="历史状态" align="center">
          <template slot-scope="scope">{{ dicQuotaState[scope.row.quotaState] }}</template>
        </el-table-column>
      </el-table>
      <div style="border-left:1px solid #dcdfe6;float:right">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfo.current"
                       :page-sizes="[5,10,20,30]" :page-size="pageInfo.size" layout="total, sizes, prev, pager, next, jumper"
                       :total="pageInfo.total"></el-pagination>
      </div>
    </el-card>
    <el-card class="box-card">
      <span class="msgTitle" style="margin-top: -10px">
        <i class="iconfont iconnavicon"></i> 修改详情
      </span>
      <!-- 下级表格 -->
      <el-table :data="historyDetail" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column prop="quotaLevel" label="阈值层级" align="center">
          <template slot-scope="scope">{{ dicQuotaLevel[scope.row.quotaLevel] }}</template>
        </el-table-column>
        <el-table-column prop="amtOrRatio" label="阈值" align="center"></el-table-column>
        <el-table-column prop="quotaControlType" label="阈值类型" align="center">
          <template slot-scope="scope">{{ dicQuotaControlType[scope.row.quotaControlType] }}</template>
        </el-table-column>
        <el-table-column prop="controlNode" label="管控节点" align="center">
          <template slot-scope="scope">{{ dicControlNode[scope.row.controlNode] }}</template>
        </el-table-column>
        <el-table-column prop="nodeMeasure" label="应对措施" align="center">
          <template slot-scope="scope">{{ dicNodeMeasure[scope.row.nodeMeasure] }}</template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
  import { getHisList, getHisDetail } from '@/api/rcm/manager'
  import { getDictionary, dictTranslate } from '@/api/system/dict'

  export default {
    data() {
      return {
        dicQuotaLevel: [],
        dicQuotaControlType: [],
        dicControlNode: [],
        dicNodeMeasure: [],
        dicUserNum: [],
        dicModOrgNum: [],
        dicQuotaState: [],
        //字典
        quotaStateSelections: [],
        quotaIndexTypeSelections: [],
        quotaTypeSelections: [],

        ruleForm: {},
        //当前参数表格数据
        tableData: [],
        historyDetail: [],
        //历史修改记录
        historyMain: [],
        // 分页内容
        pageInfo: {
          current: 1,
          size: 5,
          total: 0
        }
      }
    },
    methods: {
      getHisList() {
        const quotaNum = this.$route.params.val
        getHisList(quotaNum, this.pageInfo.current, this.pageInfo.size).then(res => {
          this.historyMain = res.data.data.records
          this.pageInfo.total = res.data.data.total
        })
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        this.pageInfo.size = newSize
        this.getHisList()
      },
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        this.pageInfo.current = newPage
        this.getHisList()
      },
      //点击行，底部表格做出反应
      getHistoryDetail(row) {
        getHisDetail(row.hisId).then(res => {
          this.historyDetail = res.data.data
          this.translateParams()
        })
      },

      //翻译各种阈值参数
      translateParams() {
        dictTranslate('CD000223').then(res => {
          if (res.status != 200) {
            return this.$message.error('获取阈值层级字典失败，请重试')
          }
          this.dicQuotaLevel = res.data.data
        })
        dictTranslate('CD000258').then(res => {
          if (res.status != 200) {
            return this.$message.error('获取阈值类型字典失败，请重试')
          }
          this.dicQuotaControlType = res.data.data
        })
        //管控节点可能为逗号分割，需要循环翻译 todo
        dictTranslate('CD000259').then(res => {
          if (res.status != 200) {
            return this.$message.error('获取管控节点字典失败，请重试')
          }
          this.dicControlNode = res.data.data
        })
        dictTranslate('CD000260').then(res => {
          if (res.status != 200) {
            return this.$message.error('获取应对措施字典失败，请重试')
          }
          this.dicNodeMeasure = res.data.data
        })
      }
    },
    mounted() {
      this.getHisList()
      getDicAndload(this)//获取字典方法
    },
    created() {
      this.translateParams()
      dictTranslate('userId').then(res => {
        if (res.status != 200) {
          return this.$message.error('获取维护人字典失败，请重试')
        }
        this.dicUserNum = res.data.data
      })
      dictTranslate('org').then(res => {
        if (res.status != 200) {
          return this.$message.error('获取机构字典失败，请重试')
        }
        this.dicModOrgNum = res.data.data
      })
      dictTranslate('CD000261').then(res => {
        if (res.status != 200) {
          return this.$message.error('获取历史状态字典失败，请重试')
        }
        this.dicQuotaState = res.data.data
      })
    }
  }

  function getDicAndload(obj) {
    getDictionary({ code: 'CD000261' }).then(response => {
      obj.quotaStateSelections = response.data.data
    })
    getDictionary({ code: 'CD000253' }).then(response => {
      obj.quotaIndexTypeSelections = response.data.data
    })
    getDictionary({ code: 'CD000148' }).then(response => {
      obj.quotaTypeSelections = response.data.data
    })
  }
</script>

<style lang="scss" scoped>
  /deep/ .msgTitle {
    display: block;
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 16px;
    padding-left: 5px;

    i {
      font-size: 24px;
      vertical-align: middle;
    }

    .el-button {
      margin-left: 10px;
    }
  }

  /deep/ .tableMsg {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    /deep/ .el-form-item {
      /deep/ .el-form-item__content {
        /deep/ .el-input {
          /deep/ .el-input__inner {
            width: 200px;
            color: #333;
          }
        }
      }
    }
  }

  /deep/ .el-card {
    .el-card__body {
      .el-table {
        /deep/ .el-table__body-wrapper {
          .el-table__body {
            .el-table_2_column_7 {
              color: #029f4a;
              text-decoration: underline;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
</style>

