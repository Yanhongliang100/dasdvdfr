<template>
  <div class="login-container wrap">
    <div class="login-main">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <div class="top-header">
          <div class="header-wrap">
          </div>
        </div>
        <div class="login-form clearfix">
          <div class="login-left">
            <img src="./fupin.jpg">
          </div>
          <div class="login-right">
            <div class="logo-title clearfix">
              <a class="pull-right reg" @click="zhuce">管理员注册</a>
              <h3>用户登录</h3>
            </div>
            <div class="form-con">
              <el-form-item prop="username">
                <el-input
                  class="form-control"
                  v-model="loginForm.username"
                  name="username"
                  type="text"
                  auto-complete="on"
                  placeholder="手机号或用户名"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  class="form-control pass"
                  :type="passwordType"
                  v-model="loginForm.password"
                  name="password"
                  auto-complete="on"
                  placeholder="请输入密码"
                  @keyup.enter.native="handleLogin" />
                <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
              </el-form-item>
              <div class="operate-link clearfix">
                <a class="pull-left" href="">忘记密码？</a>
              </div>
              <el-button :loading="loading" type="primary" class="button" @click.native.prevent="handleLogin">登录</el-button>
            </div>
            <div class="thr-account">
              <div class="icon qq" @click="wechatHandleClick('wechat')">
                微信
              </div>
              <div class="icon wb" @click="tencentHandleClick('tencent')">
                微信登录
              </div>
              <div class="icon wx" @click="weiboHandleClick('weibo')">
                微博登录
              </div>
            </div>
          </div>
        </div>
        <div class="footer-copy">
          <p>指导单位：国务院扶贫办社会扶贫司、国务院扶贫办信息中心  京ICP备：17067839-2 中国社会扶贫网 版权所有</p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import openWindow from '@/utils/openWindow'
  export default {
    name: 'Login',
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('The password can not be less than 6 digits'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loginRules: {
          username: [{ required: true, trigger: 'blur' }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }]
        },
        passwordType: 'password',
        loading: false,
        showDialog: false
      }
    },
    created() {
      // window.addEventListener('hashchange', this.afterQRScan)
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      zhuce(){
        this.$router.push({
          path:"/signIn/signIn"
        })
      },
      weiboHandleClick(thirdpart){
        this.$store.commit('SET_AUTH_TYPE', thirdpart)
        const appid = 'xxxxx'
        const redirect_uri = encodeURIComponent('xxx/redirect?redirect=' + window.location.origin + '/authredirect')
        const url = 'https://api.weibo.com/oauth2/authorize?client_id='+appid+'&response_type=code&redirect_uri='+redirect_uri
        openWindow(url, thirdpart, 540, 540)
      },
      wechatHandleClick(thirdpart) {
        this.$store.commit('SET_AUTH_TYPE', thirdpart)
        const appid = 'xxxxx'
        const redirect_uri = encodeURIComponent('xxx/redirect?redirect=' + window.location.origin + '/authredirect')
        const url = 'https://open.weixin.qq.com/connect/qrconnect?appid=' + appid + '&redirect_uri=' + redirect_uri + '&response_type=code&scope=snsapi_login#wechat_redirect'
        openWindow(url, thirdpart, 540, 540)
      },
      tencentHandleClick(thirdpart) {
        this.$store.commit('SET_AUTH_TYPE', thirdpart)
        const client_id = 'xxxxx'
        const redirect_uri = encodeURIComponent('xxx/redirect?redirect=' + window.location.origin + '/authredirect')
        const url = 'https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirect_uri
        openWindow(url, thirdpart, 540, 540)
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
              this.loading = false
              this.getManagerLevel()
              this.$router.push({ path: '/' })
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      getManagerLevel() {
        this.$http
          .post('hts/management/workbench')
          .then(data => {
            this.data = data
            // 管理员级别
            localStorage.leaderLevel = this.data.user_level
            const arrs = []
            for (let i = 0; i < this.data.regionName.length; i++) {
              const regionNames = this.data.regionName[i].regionName.replace(/[ ]/g, ',')
              const regionNameArr = regionNames.split(',')
              // 缓存管理员级别ID
              const obj = {
                id: this.data.regionName[i].id,
                regionName: ''
              }
              // 根据管理员的级别缓存对应的区域名称
              switch (this.data.user_level) {
                case 1:
                  obj.regionName = regionNameArr[0]
                  break
                case 2:
                  obj.regionName = regionNameArr[1]
                  break
                case 3:
                  obj.regionName = regionNameArr[2]
                  break
                case 4:
                  obj.regionName = regionNameArr[3]
                  break
                case 5:
                  obj.regionName = regionNameArr[4]
                  break
              }
              arrs.push(obj)
            }
            localStorage.leaderarrs = JSON.stringify(arrs)
          })
      },
      afterQRScan() {
        // const hash = window.location.hash.slice(1)
        // const hashObj = getQueryObject(hash)
        // const originUrl = window.location.origin
        // history.replaceState({}, '', originUrl)
        // const codeMap = {
        //   wechat: 'code',
        //   tencent: 'code'
        // }
        // const codeName = hashObj[codeMap[this.auth_type]]
        // if (!codeName) {
        //   alert('第三方登录失败')
        // } else {
        //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
        //     this.$router.push({ path: '/' })
        //   })
        // }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .clearfix:after {
    display: block;
    content: "";
    clear: both;
    visibility: hidden;
    height: 0;
  }
  .clearfix {
    zoom: 1;
  }
  .el-input--small{
    .el-input__inner{
      height: 40px !important;
      border-radius: 0;
      padding-left: 35px;
      padding-right: 10px;
      background-position: 14px center;
      background-repeat: no-repeat;
      background-image: url(./icon-username.jpg);
    }
    &.pass{
      .el-input__inner{
        background-image: url(./icon-userpsw.jpg);
      }
    }
  }
  .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label{
    position: relative;
    .show-pwd{
      position: absolute;
      right: 4%;
      top: 15%;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .login-container{
    background: url(./login-bg.jpg) no-repeat;
    background-size: cover;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    display: table;
    .login-main{
      display: table-cell;
      vertical-align: middle;
      padding-top: 30px;
      *{
        box-sizing: border-box;
      }
      .top-header {
        height: 90px;
        left: 0;
        right: 0;
        position: absolute;
        top: 0;
        background: #fff;
        border-bottom: 1px solid #ddd;
        .header-wrap {
          width: 1200px;
          margin: 0 auto;
          background: url(./logo.png) no-repeat left 14px;
          height: 90px;
        }
      }
      .login-form {
        height: 380px;
        width: 1200px;
        margin: 0 auto;
        background: #fff;
        box-shadow: 0 0 50px rgba(0, 0, 0, 0.25);
        .login-left {
          float: left;
        }
        .login-right {
          width: 415px;
          height: 388px;
          float: right;
          background: #fff;
          position: relative;
          padding: 28px 38px;
          a.reg {
            display: inline-block;
            padding-bottom: 5px;
            padding-top: 3px;
            border-bottom: 1px solid #e46216;
            color: #e46216;
            float: right;
            cursor: pointer;
          }
          h3 {
            margin-bottom: 20px;
            font-size: 24px;
            font-weight: normal;
            color: #444;
            margin-top: 0;
          }
          .form-control{
           /deep/ .el-input__inner{border-color:#dcdfe6;border-radius: 0;line-height: 36px;height:36px}
           /deep/ input:-webkit-autofill{background: #fff}
            .el-input__inner{
              background-position: 14px center;
              background-repeat: no-repeat;
              background-color: #ffffff;
              border: 1px solid #e3e3e3;
              width: 100%;
              border-radius: 0;
            }
          }
          .button{
            border: 0;
            display: inline-block;
            line-height: 44px;
            text-align: center;
            font-size: 18px;
            padding: 0 20px;
            border-radius: 0px;
            width: 100%;
            background-color: #e66817;
            color: #ffffff!important;
            transition: all 0.3s;
          }
          .operate-link{
            margin-bottom: 18px;
            .pull-left{
              color: #666;
              font-size: 14px;
            }
          }
          .thr-account {
            text-align: center;
            padding-top: 30px;
            .icon{
              display: inline-block;
              padding: 50px 20px 0 20px;
              background-repeat: no-repeat;
              background-position: center top;
              background-size: 40px;
              opacity: 0.9;
              transition: all 0.5s;
              font-size: 14px;
              &.qq{
                background-image: url(./qq.png);
              }
              &.wb{
                background-image: url(./weibo.png);
              }
              &.wx{
                background-image: url(./weixin.png);
              }
            }
          }
        }
      }
      .footer-copy {
        position: absolute;
        bottom: 0;
        height: 48px;
        line-height: 48px;
        left:0;
        right:0;
        overflow: hidden;
        text-align: center;
        background: #fff;
        border-top: 1px solid #ddd;
        p{
          color: #666;
          margin: 0;
          font-size: 14px;
        }
      }
    }
  }
</style>
