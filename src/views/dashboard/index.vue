<!-- 接口管理-- 服务配置页面 -->
<template>
  <div class="welContainer">
    <!-- 头部信息 -->
    <div class="headMsg">
      <h2>{{ dayTime }}好，{{ currentUser.realName }}&nbsp;&nbsp;&nbsp;&nbsp;当前营业日期：{{ workDate }}</h2>
      <p>当前登录机构：{{ currentUser.deptName }}&nbsp;&nbsp;&nbsp;&nbsp;当前角色：{{ currentUser.roleName }}</p>
    </div>
    <!-- 主要内容区域 -->
    <div class="main">
      <!-- 左侧彩图部分 -->
      <div class="mainLeft">
        <!-- 进度条文字部分 -->
        <div class="progressText">
          <span class="text"><i>{{quota.quotaNameA}}</i><i>指标总额：{{quota.quotaTotalSumA}}</i></span>
          <span class="text"><i>{{quota.quotaNameB}}</i><i>指标总额：{{quota.quotaTotalSumB}}</i></span>
          <span class="text"><i>{{quota.quotaNameC}}</i><i>指标总额：{{quota.quotaTotalSumC}}</i></span>
        </div>
        <!-- 进度条 -->
          <div class="progress" @click="toMsg" title="点击跳转到限额台账页面">
            <el-tooltip placement="bottom" effect="light" :offset="-120">
              <div slot="content">指标总额：{{quota.quotaTotalSumA}}<br/>指标已用：{{quota.quotaUsedAmtA}} <br/>指标可用：{{quota.quotaFreeAmtA}}</div>
              <el-progress :percentage="quota.quotaUsedRatioA" color="#1bc98e" :text-inside="true" :stroke-width="20"></el-progress>
            </el-tooltip>
            <el-tooltip placement="bottom" effect="light" :offset="-120">
              <div slot="content">指标总额：{{quota.quotaTotalSumB}}<br/>指标已用：{{quota.quotaUsedAmtB}} <br/>指标可用：{{quota.quotaFreeAmtB}}</div>
              <el-progress :percentage="quota.quotaUsedRatioB" color="#e64758" :text-inside="true" :stroke-width="20"></el-progress>
            </el-tooltip>
            <el-tooltip placement="bottom" effect="light" :offset="-120">
              <div slot="content">指标总额：{{quota.quotaTotalSumC}}<br/>指标已用：{{quota.quotaUsedAmtC}} <br/>指标可用：{{quota.quotaFreeAmtC}}</div>
              <el-progress :percentage="quota.quotaUsedRatioC" color="#b29fff" :text-inside="true" :stroke-width="20"></el-progress>
            </el-tooltip>
          </div>
        <!-- 带水印方块图 -->
        <div class="cardData">
          <!-- 敞口额度 -->
          <el-card style="background-color: #1bc98e;">
            <div class="cardLeft">
              <h3>总授信额度</h3>
              <h2>{{crd.limitCredit}}</h2>
              <p>{{crd.limitAvi}}</p>
              <p class="last">可用授信额度</p>
            </div>
            <div class="cardRight">
              <el-tag size="mini" title="点击跳转到机构视图页面" style="background-color: #60d9b0;" @click="toOrganization">详情</el-tag><br><br>
              <span class="watermark1">授信</span>
            </div>
          </el-card>
          <!-- 授信敞口余额 -->
          <el-card style="background-color: #e64758;">
            <div class="cardLeft">
              <h3>总敞口额度</h3>
              <h2>{{crd.approveExpAmount}}</h2>
              <p>{{crd.expAvi}}</p>
              <p class="last">可用敞口额度</p>
            </div>
            <div class="cardRight">
              <el-tag size="mini" title="点击跳转到机构视图页面" style="margin-top:3px;background-color: #ee7f8a;" @click="toOrganization">详情</el-tag><br><br>
              <span class="watermark2">敞口</span>
            </div>
          </el-card>
          <!-- 贷款敞口余额 -->
          <el-card style="background-color: #b29fff;">
            <div class="cardLeft">
              <h3>授信敞口余额</h3>
              <h2>{{crd.creditExpBalance}}</h2>
              <p>{{crd.loanExpBalance}}</p>
              <p class="last">贷款敞口余额</p>
            </div>
            <div class="cardRight">
              <el-tag size="mini" title="点击跳转到机构视图页面" style="background-color: #c9bcff;" @click="toOrganization">详情</el-tag><br><br>
              <span class="watermark3">余额</span>
            </div>
          </el-card>
        </div>
      </div>
      <!-- 右侧表格列表部分 -->
      <div class="mainRight">
        <el-table :data="tableData" @row-click="viewNotice" height="350px" style="width: 100%">
          <el-table-column label="通知公告">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>通知标题: {{scope.row.title}}</p>
                <p>通知类型: {{scope.row.categoryName}}</p>
                <p>发布日期: {{scope.row.releaseTime}}</p>
                <p>通知内容: {{scope.row.content}}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{scope.row.title}}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 点击右侧表格每一行，弹出详情dialog框 -->
    <el-dialog title="通知内容" :append-to-body="true" :visible.sync="dialogVisible" width="50%">
      <el-form ref="form"  disabled :model="form" label-width="80px">
        <el-form-item label="通知标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="通知类型">
          <el-input v-model="form.categoryName"></el-input>
        </el-form-item>
        <el-form-item label="发布日期">
          <el-input v-model="form.releaseTime"></el-input>
        </el-form-item>
        <el-form-item label="通知内容">
          <el-input type="textarea" :rows="8" v-model="form.content"></el-input>
          <!-- <el-input v-model="form.content"></el-input> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfo, runTime } from "@/api/user"
import { getList,page } from "@/api/dept/notice"
import { getStatisOrg,getHomeQuota } from "@/api/dashboard/wel"

export default {
  data () {
    return {
      //当前登录用户信息
      currentUser: {},
      //当前营业时间的上午、下午、晚上
      dayTime: '',
      //当前营业时间
      workDate: '',

      //额度数据
      crd:{limitCredit:0,limitAvi:0,approveExpAmount:0,expAvi:0,creditExpBalance:0,loanExpBalance:0},
      //限额数据
      quota:{userOrgNum:'',
            quotaNumA:'',quotaNameA:'',quotaUsedRatioA:0,quotaFreeAmtA:0,quotaUsedAmtA:0,quotaTotalSumA:0,
            quotaNumB:'',quotaNameB:'',quotaUsedRatioB:0,quotaFreeAmtB:0,quotaUsedAmtB:0,quotaTotalSumB:0,
            quotaNumC:'',quotaNameC:'',quotaUsedRatioC:0,quotaFreeAmtC:0,quotaUsedAmtC:0,quotaTotalSumC:0},

      // 主要内容区 右侧表格数据
      tableData: [],
      // 通知公告查询条件
      noticeParam: { createDept: "" },
      // 控制dialog框的显示与隐藏
      dialogVisible: false,
      // dialog框中的表单数据
      form: {}
    }
  },
  created () {
    this.getWorkDate()
    this.getuser()
  },
  methods: {
    // 获取当前营业时间
    getWorkDate () {
      runTime().then(res => {
        // console.log('营业时间为:', res)
        if (res.status != 200) {
          return this.$message.error('获取营业时间失败，请重试')
        }
        let run = res.data
        this.workDate = run.substring(0, 10)
        let dayTime = run.substring(11, 13)
        if (dayTime >= 18) {
          this.dayTime = '晚上'
        } else if (dayTime > 12 && dayTime < 18) {
          this.dayTime = '下午'
        } else {
          this.dayTime = '上午'
        }
      })
    },
    //获取登录人信息
    getuser () {
      getUserInfo().then(res => {
        // console.log("用户数据：", res)
        this.currentUser = res.data.data
        this.noticeParam.createDept = res.data.data.deptId
        this.getNoticeList() //获取通知内容；
        this.getCrd()//获取额度数据
        this.getQuota()//获取限额数据
      })
    },
    //获取额度数据
    getCrd(){
      getStatisOrg(this.currentUser.deptId).then(res => {
        // console.log("额度数据：", res)
        this.crd = res.data.data
      })
    },

    //获取限额
    getQuota(){
      getHomeQuota('16200').then(res => {
        // console.log("限额数据：", res)
        this.quota = res.data.data
        console.log(this.quota.quotaUsedRatioA,'0000');
      })
    },

    //获取通知列表
    getNoticeList () {
      // console.log("通知查询条件：", this.noticeParam)
      page(1, 999, this.noticeParam).then(res => {
        // console.log("通知查询结果：", res)
        this.tableData = res.data.data.records
      })
    },
    //查看通知详情
    viewNotice (e) {
      // console.log("查看通知：", e);
      this.dialogVisible = true
      this.form = e
    },
    // 点击详情，跳转到360视图下的机构视图页面
    toOrganization () {
      // console.log('测试详情跳转按钮');
      this.$router.push({ name: '机构视图' })
    },
    // 点击进度条，触发该函数，跳转到限额台账页面
    toMsg () {
      // console.log('测试跳转按钮');
      this.$router.push({ name: '限额台账' })
    }
  }
}
</script>

<style lang="scss" scoped>
.welContainer {
  // 头部信息部分 样式
  .headMsg {
    border-bottom: 1px solid #ccc;
    h2 {
      font-weight: 400;
    }
    p,
    h2 {
      margin-left: 2vw;
    }
  }
  // 主要内容部分 样式
  .main {
    display: flex;
    justify-content: space-around;
    // 左侧彩图部分 样式
    .mainLeft {
      width: 80%;
      // 进度条文字 样式
      .progressText {
        display: flex;
        justify-content: space-around;
        .text {
          display: flex;
          justify-content: space-between;
          width: 30%;
          margin: 8vh 0 1vh 0;
          i {
            font-style: normal;
            font-size:14px;
          }
        }
      }
      // 进度条 样式
      .progress {
        display: flex;
        justify-content: space-around;
        .el-progress {
          width: 30%;
          cursor: pointer;
        }
      }
      // 带水印方块图 样式
      .cardData /deep/ {
        display: flex;
        justify-content: space-around;
        margin-top: 8vh;
        .el-card {
          width: 31.5%;
          color: #fff;
          h2,
          h3,
          p {
            margin: 0 0 2vh 0;
          }
          h3 {
            font-weight: 400;
          }
          h2 {
            font-size: 35px;
            position: relative;
            z-index: 3;
          }
          .last {
            margin: 0;
          }
          .el-card__body {
            display: flex;
            justify-content: space-between;
            .cardRight {
              text-align: right;
              .el-tag {
                background-color: #ccc;
                color: #fff;
                cursor: pointer;
                border: none;
                z-index: 999;
              }
              .watermark1 {
                border: 2px solid #31ce99;
                color: #31ce99;
              }
              .watermark2 {
                border: 2px solid #e85968;
                color: #e85968;
              }
              .watermark3 {
                border: 2px solid #baa8ff;
                color: #baa8ff;
              }
              .watermark1,
              .watermark2,
              .watermark3 {
                display: block;
                border-radius: 50%;
                padding: 15px;
                font-size: 40px;
                transform: rotate(-35deg);
                -ms-transform: rotate(-35deg);
                -webkit-transform: rotate(-35deg);
              }
            }
          }
        }
      }
    }
    // 右侧表格列表部分
    .mainRight {
      width: 18%;
      border-left: 1px solid #ccc;
    }
  }
}
</style>
