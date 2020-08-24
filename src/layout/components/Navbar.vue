<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
     
    <top-menus class="breadcrumb-container"/>
    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <div class="right-menu">
      <!-- 当前机构+ 机构切换 -->
      <el-dropdown class="toggle" @command="handleCommand">
        <span class="el-dropdown-link" style="color:#fff">
          <em>当前机构：{{ nowOrg }}</em>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in orgLists" :key="index" :command="index">{{item}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 显示屏幕锁 -->
      <!-- <el-tooltip v-if="showLock" effect="light" placement="bottom">
        <div class="top-bar__item">
          <top-lock></top-lock>
        </div>
      </el-tooltip> -->
      <!-- 鼠标悬停，显示详细个人信息 -->
      <el-tooltip class="userInfo" effect="light" placement="bottom">
        <div slot="content">
          账号: {{ userMsg.account }}
          <br>
          <br>
          姓名: {{ userMsg.realName }}
          <br>
          <br>
          角色: {{ userMsg.userName }}
          <br>
          <br>
          运营时间：{{ userMsg.runTime }}
        </div>
        <i
          class="el-icon-s-custom"
          style="color: #fff;font-size: 20px;cursor: pointer;"
        ></i>
      </el-tooltip>
      <el-tooltip effect="light" content="修改密码" placement="bottom">
        <i class="el-icon-lock" style="color: #fff;font-size: 20px;cursor: pointer;" @click="updataPwd"></i>
      </el-tooltip>
      <!-- 退出系统 -->
      <el-tooltip class="loginOut" effect="light" content="退出登录" placement="bottom">
        <i class="el-icon-switch-button" style="color: #fff;font-size: 20px;cursor: pointer;" @click="logout"></i>
      </el-tooltip>
    </div>
    <update-pwd ref="updatePwd"/>
  </div>
</template>

<script>
import { mapGetters,mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import TopMenus from '@/components/TopMenus'
import TopLock from '@/components/TopLock'
import updatePwd from './updatePwd'
import defaultSettings from '@/settings'
import { runTime, getUserInfo, bigLogOut,toggle } from "@/api/user"
import { getDeptsByAccount } from "@/api/login"
import { formatRoutes } from "@/store/modules/permission"

export default {
  components: {
    Breadcrumb,
    Hamburger,
    TopMenus,
    TopLock,
    updatePwd
  },
  data () {
    return {      
      userMsg: {
        account: "", // 账号
        realName: "", // 用户姓名
        userName: "", // 用户角色
        runTime: "" // 营业时间
      },
      title : defaultSettings.title,
      nowOrg: "", // 当前机构
      orgLists: [], // 当前账号下的机构列表
      logins: {}, // 登录参数集合
      orgs: [] // 机构列表集合，用于机构切换时，获取机构ID
    }
  },
  created() {
    this.getTime();
    this.getUser();
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    ...mapState({
      showLock: state => state.app.showLock
    })
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    handleCommand(command) {
      if(this.nowOrg == this.orgLists[command]){
        return ;
      }
      const h = this.$createElement;
        this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '当前机构为： '),
          h('span', { style: 'color: #029f4a' }, this.nowOrg),
          h('span', null, '，是否确定切换机构为：'),
          h('span', { style: 'color: #029f4a' }, this.orgLists[command])
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';
            let org = {}
            org = this.orgs.filter(item => {
              return item.deptName == this.orgLists[command]
            })
            this.logins.deptId = org[0].deptId
            //关闭所有Tab页              
            this.$store.dispatch('loginOrgSwitch',org[0].deptId).then(res => {
                this.$emit("orgSwitch")  
            })
            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 500);
          } else {
            done();
          }
        }
      }).then(() => {
        this.nowOrg = this.orgLists[command]
        this.$message({
          type: 'success',
          message: '切换机构成功'
        })
      })
    },
    toUserInfo() {
    },
     // 获取营业时间，并渲染到页面上
    getTime() {
      runTime().then(res => {
        let run = res.data;
        this.userMsg.runTime = run.substring(0, run.indexOf(" "));
      });
    },
    getUser() {
      getUserInfo().then(res => {
        if (res.status !== 200) {
          return this.$message.error("获取用户信息失败");
        }
        const info = res.data.data

        let { tenantId, account, password, type, deptId } = { tenantId: info.tenantId, account: info.account, password: info.password, type: 'account', deptId: info.deptId }
        this.logins = { tenantId, account, password, type, deptId }
        this.nowOrg = info.deptName
        this.userMsg.account = info.account
        this.userMsg.realName = info.realName
        this.userMsg.userName = info.roleName

        getDeptsByAccount(info.account).then(res => {
          this.orgs = res.data.data
          this.orgLists = this.orgs.map(item => {
            return item.deptName;
          });
        });
      });
    },
    updataPwd(){
        this.$refs.updatePwd.showDialog();
    },
    // 退出系统
    logout() {
      this.$confirm("您确定退出系统吗？","提示", {
        confirmButtonText: "确 定",
        cancelButtonText: "取 消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          this.$emit("logOut") 
          this.$router.push({ path: "/login" });
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.right-menu {
  .userInfo,
  .loginOut {
    margin: 0 5px;
  }
  .toggle {
    height: 45px;
    .el-dropdown-link {
      em {
        font-style: normal;
        font-size: 13px;
      }
    }
  }
}
.navbar {
  height: 70px;
  overflow: hidden;
  position: relative;
  background: #029F4A;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 66px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
    padding-top: 5px;
    .main-title {
      padding: 25px 0 0 0;
      display: inline-block;
      margin: 0 30px 0 0;
      cursor: auto;
      color: #fff;
      font-weight: 400;
      font-size: 18px;
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 70px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 20px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 15px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
