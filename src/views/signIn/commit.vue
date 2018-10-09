<template>
  <div class="app-container">
    <p>您的注册信息已提交，请等待审核，您可使用申请的手机号与密码，登录管理员系统，查看审核状态。</p>

    <p>审核身份：{{msg.user_level | guo}}</p>

    <p>登录账号/手机号：{{msg.mobile}}</p>

    <p>密码：***** </p>

    <p>姓名：{{msg.realname}}</p>

    <p>身份证号：{{msg.idcard}}</p>

    <p> 负责区域：{{msg.region_name}}</p>

    <p style="color: #FF9900">您的注册信息已提交，请等待审核，您可使用申请的手机号与密码，登录管理员系统，查看审核状态。</p>

    <p style="color: #FF9900">如果您还未在中国社会扶贫网APP注册，也可以使用您的手机号与密码进行登录使用。</p>
  </div>
</template>

<script type="text/ecmascript-6">
  import store from '@/store'
  export default {
    data(){
      return{
        msg:{}
      }
    },
    filters:{
      guo(value){
        if(value === 1){
          return "省级管理员"
        }else if (value === 2){
          return "市级管理员"
        }else if (value === 3){
          return "县级管理员"
        }else if (value === 4){
          return "乡级管理员"
        }else{
          return "村级管理员"
        }
      }
    },
    methods:{
      getjson(){
        this.$http.post("/hts/management/viewAdminStatus",{
        }).then(res => {
          this.msg=res
        })
      }
    },
    created(){
      this.getjson()
    }
  }
</script>

<!--<style lang="less" rel="stylesheet/less">-->

<!--</style>-->
