<!-- 登录页内容 -->
<template>
  <div class="loginContainer">
    <!-- 登录框 -->
    <div class="loginCon">
      <!-- 左侧图片 -->
      <div class="leftCon">
        <img src="../../assets/bg_image/login_left2.png" />
      </div>
      <!-- 右侧登录表单 -->
      <div class="rightCon">
        <!-- 头部标题区 -->
        <div class="topTitle">
          <!-- 带logo的图片 -->
          <span class="titleBg">
            <img src="../../assets/bg_image/login_right.png" />
          </span>
          <br />
          <!-- 纯文字部分 -->
          <span class="titleText">统一授信系统</span>
        </div>
        <!-- 登录表单区 -->
        <div class="formCon">
          <el-form
            ref="loginRuleForm"
            :model="loginRuleForm"
            :rules="loginRules"
            label-width="100px"
            class="loginRuleForm"
          >
            <el-form-item prop="account">
              <el-input
                v-model="loginRuleForm.account"
                placeholder="请输入账号"
                clearable
                @blur="getDeptList()"
              >
                <!-- <i slot="prefix" class="icon-quanxian"></i> -->
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                placeholder="请输入密码"
                v-model="loginRuleForm.password"
                clearable
                type="password"
              >
                <!-- <i slot="prefix" class="icon-mima"></i> -->
              </el-input>
            </el-form-item>
            <el-form-item v-if="deptShow" prop="deptId">
              <!-- 新增 机构选择 -->
              <el-select
                @visible-change="deptIdChange"
                default-first-option
                v-model="loginRuleForm.deptId"
                placeholder="请选择机构"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-top: 8%;">
              <el-button
                style="background-color: #029f4a;color: #fff;width: 100%;"
                @click="handleLogin()"
              >登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDeptsByAccount } from '@/api/login'
export default {
  name: 'Login',
  data() {
    return {
      loginRuleForm: {
        account: '',
        password: '',
        type: 'account',
        deptId: '' // 用户所属主机构
      },
      deptShow: true,
      options: {},
      loginRules: {
        account: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      },
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    var _this = this
    document.onkeydown = function() {
      var key = window.event.keyCode

      if (key === 13) {
        _this.handleLogin()
      }
    }
  },
  mounted() {
    var _this = this
    this.getDeptList()
  },
  methods: {
    deptIdChange(e) {
      var _this = this
      // 机构下拉框出现时，如果账号有值，机构无值（为初始账号回显）
      if (!e) {
        return
      }
      var userAgent = navigator.userAgent //取得浏览器的userAgent字符串

      //判断是否Firefox浏览器
      if (userAgent.indexOf('Firefox') > -1) {
        _this.getDeptList()
      }
      //判断是否Chrome浏览器
      // if (userAgent.indexOf('Chrome') > -1) {
      //   console.log('Chrome')
      // }

      //判断是否IE浏览器
      if (!!window.ActiveXObject || 'ActiveXObject' in window) {
        _this.getDeptList()
      }
    },
    getDeptList() {
      this.options = []
      this.loginRuleForm.deptId = ''
      if (this.loginRuleForm.account !== '') {
        getDeptsByAccount(this.loginRuleForm.account).then(res => {
          this.options = res.data.data
          if (this.options.length <= 1) {
            this.deptShow = false
          } else {
            this.deptShow = true
          }
          var _this = this
          var val = this.options[0].deptId
          setTimeout(function() {
            _this.loginRuleForm.deptId = val
          }, 100)
        })
      }
    },
    handleLogin() {
      this.$refs.loginRuleForm.validate(valid => {
        if (valid) {
          if (!this.loginRuleForm.deptId) {
            return this.$message.error('请选择机构')
          } else {
            const loading = this.$loading({
              lock: true,
              text: '登录中,请稍后。。。',
              spinner: 'el-icon-loading'
            })
            this.$store
              .dispatch('LoginByUsername', this.loginRuleForm)
              .then(res => {
                this.$router.push({ path: '/' })
                loading.close()
              })
              .catch(() => {
                loading.close()
              })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.loginContainer {
  width: 100%;
  height: 100%;
  background: url(../../assets/bg_image/login_big1.jpg) no-repeat;
  background-size: cover;
  // 登录框样式
  .loginCon {
    display: flex;
    justify-content: flex-start;
    width: 50%;
    height: 70%;
    border: 1px solid red;
    overflow: hidden;
    border-radius: 12px;
    -webkit-border-radius: 12px;
    -moz-border-radius: 12px;
    -ms-border-radius: 12px;
    -o-border-radius: 12px;
    transform: translate(50%, 25%);
    // 左侧图片样式
    .leftCon {
      width: 50%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
      }
    }
    // 右侧登录表单样式
    .rightCon {
      width: 50%;
      height: 100%;
      background-color: #fff;
      // 头部标题样式
      .topTitle {
        // 带logo图片样式
        .titleBg {
          display: block;
          width: 100%;
          height: 12vh;
          margin-top: 4vh;
          img {
            width: 100%;
          }
        }
        // 纯文字部分样式
        .titleText {
          display: block;
          width: 100%;
          font-size: 2vw;
          text-align: center;
          margin-top: 3vh;
        }
      }
      // 登录表单区样式
      .formCon {
        width: 90%;
        margin-top: 5vh;
        .el-form /deep/ {
          .el-form-item {
            .el-form-item__content {
              margin-left: 40px !important;
              input {
                border-top: none;
                border-left: none;
                border-right: none;
              }
              .el-input {
                .el-input__inner {
                  border-radius: 0 !important;
                  padding: 0 15px 0 20px;
                  font-size: 0.8vw;
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
