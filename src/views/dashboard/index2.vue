<template>
  <div class="contennt_main">
    <el-row>
	  <el-col :span="8">
	  	<div class="bm">
	  		<div class="tc">
	  			<img class="img_index" :src="detial.user_pic" />
	  		</div>
	  		<div class="tc ptb"><span>{{detial.levelName}}</span>  <span>{{detial.realname}}</span></div>
	  		<div class="tc ptb"><p>{{detial2.mobile}}</p></div>
	  		<div style="overflow: hidden;">
	  			<div class="wd tc bt bl">
	  				<p class="ce">本月帮扶金额</p>
	  				<p>{{detial2.bfMoneyCount}}</p>
	  			</div>
	  			<div class="wd tc bt">
	  				<p class="ce">总帮扶金额</p>
	  				<p>{{detial2.bfMoneyTotal}}</p>
	  			</div>
	  			<div class="wd tc bl bt">
	  				<p class="ce">本月帮扶次数</p>
	  				<p>{{detial2.bfTimeCount}}</p>
	  			</div>
	  			<div class="wd tc bt">
	  				<p class="ce">总帮扶次数</p>
	  				<p>{{detial2.bfTimeTotal}}</p>
	  			</div>
	  		</div>
	  	    <div class="tc bt">
	  	    	<div>
	  	    		<p><span class="ce">总邀请数</span>  <span class="pl">{{detial2.inviteTotal}}</span></p>	
	  	    	</div>
	  	    </div>
	  	</div>
	  </el-col>
	  <el-col :span="16">
	  	<div class="bm">
	  		<p><span class="m">用户名</span>  <span class="m_span">{{detial2.nick_name}}</span></p>
	  	</div>
	  	<div class="bm">
	  		<p><span class="m">姓名</span>  <span class="m_span">{{detial2.realname}}</span></p>
	  	</div>
	  	<div class="bm">
	  		<p><span class="m">账号/手机号</span>  <span class="m_span">{{detial2.mobile}}</span></p>
	  	</div>
	  	<div class="bm">
	  		<p><span class="m">身份证号</span>  <span class="m_span">{{detial2.idcard}}</span></p>
	  	</div>
	  	<div class="bm">
	  		<p>
	  			<span class="m">级别</span>  
	  			<span class="m_span" v-if = "detial2.user_level == '5' ">村级管理员</span>
	  			<span class="m_span" v-if = "detial2.user_level == '4' ">乡级管理员</span>
	  			<span class="m_span" v-if = "detial2.user_level == '3' ">县级管理员</span>
	  			<span class="m_span" v-if = "detial2.user_level == '2' ">市级管理员</span>
	  			<span class="m_span" v-if = "detial2.user_level == '1' ">省级管理员</span>
	  		</p>
	  	</div>
	  	<div class="bm">
	  		<p><span class="m">注册时间</span>  <span class="m_span">{{detial2.register_time}}</span></p>
	  	</div>
	  	<div class="bm">
	  		<p>
	  			<span class="m">状态</span>  
	  			<span class="m_span" v-if = "detial2.user_status == '1'">正常</span>
	  			<span class="m_span" v-if = "detial2.user_status == '0'">冻结</span>
	  		</p>
	  	</div>
	  	<div class="bm">
	  			<div class="m p_top">负责区域</div>  
	  			<div>
	  				<p class="m_span paddr p_bottom" v-for="item in detial2.manageRegions">{{item.region_name}}</p>
	  			</div>
	  	</div>
	  </el-col>
	</el-row>
  </div>  
</template>

<script>

import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  data() {
    return {
      detial:{
      	levelName: "村级管理员"
      },
      detial2:{
      	mobile:"15953100321"
      }
    }
  },
  created() {
    this.getDetial()
  },
  methods: {
  	getDetial() {
  		this.$http.post('hts/management/workbench').then(response => {
	        this.detial = response
		        this.$http.post('hts/management/detail', {userId:this.detial.id}).then(response => {
		        this.detial2 = response
		    })
	    })
        
    }
  	
  }
  
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .contennt_main{
  	width: 100%;
  	min-height: 100vh;
  	background-color: rgb(240, 242, 245);
  }
  .tc{
  	text-align: center;
  }
  .wd{
  	width: 50%;
  	float: left;
  }
  .bm{
  	border: 1px solid #909399;
  	margin: 10px;
  }
  .bt{
  	border-top: 1px solid #909399;
  }
  .bl{
  	border-right: 1px solid #909399;
  }
  .pl{
  	padding-left: 30px;
  }
  .ce{
  	color: #909399;
  }
  .ptb{
  	padding: 5px 0 5px 0;
  }
  .img_index{
  	width: 100px;height: 100px;
  	border-radius: 50%;
  	border: 1px solid #909399;
  	margin-top: 15px;
  	margin-bottom:15px;
  }
  .m{
  	margin: 0 0 0 15px;
  	width: 100px;
  	display: inline-block;
  }
  .m_span{
  	margin: 0 0 0 15px;
  	font-size: 14px;
  	color: #909399;
  }
  .paddr{
  	padding-left: 115px;
  }
  .p_top{
  	padding-top: 15px;
  }
  .p_bottom{
  	padding-bottom: 10px;
  }
</style>
