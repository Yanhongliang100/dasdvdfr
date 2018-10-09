<template>
  <div class="contennt_main">
    <!--<el-row>
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

    </el-row>-->
    <div style="padding: 0 20px;">
    	<el-row :gutter="10">
    		<el-col :span="4">
			  	<div class="box_bot" @mouseleave="leave()" @mouseenter="enter()">
			  		<p class="p_a">管理员级别</p>
			  		<p class="p_d" v-if = "detial2.user_level == '1'">省级管理员</p>
			  		<p class="p_d" v-if = "detial2.user_level == '2'">市级管理员</p>
			  		<p class="p_d" v-if = "detial2.user_level == '3'">县级管理员</p>
			  		<p class="p_d" v-if = "detial2.user_level == '4'">乡级管理员</p>
			  		<p class="p_d" v-if = "detial2.user_level == '5'">村级管理员</p>
			  	</div>
			  </el-col>
			  <el-col :span="4">
			  	<div class="box_bot" @mouseleave="leave()" @mouseenter="enter()">
			  		<p class="p_a">本月帮扶金额</p>
			  		<p class="p_d">{{detial2.bfMoneyCount}}元</p>
			  	</div>
			  </el-col>
			  <el-col :span="4">
			  	<div class="box_bot" @mouseleave="leave()" @mouseenter="enter()">
			  		<p class="p_a">总帮扶金额</p>
			  		<p class="p_d">{{detial2.bfMoneyTotal}}元</p>
			  	</div>
			  </el-col>
			  <el-col :span="4">
			  	<div class="box_bot" @mouseleave="leave()" @mouseenter="enter()">
			  		<p class="p_a">本月帮扶次数</p>
			  		<p class="p_d">{{detial2.bfTimeCount}}次</p>
			  	</div>
			  </el-col>
			  <el-col :span="4">
			  	<div class="box_bot" @mouseleave="leave()" @mouseenter="enter()">
			  		<p class="p_a">总帮扶次数</p>
			  		<p class="p_d">{{detial2.bfTimeTotal}}次</p>
			  	</div>
			  </el-col>
			  <el-col :span="4">
			  	<div class="box_bot" @mouseleave="leave()" @mouseenter="enter()">
			  		<p class="p_a">总邀请数</p>
			  		<p class="p_d">{{detial2.inviteTotal}}次</p>
			  	</div>
			  </el-col>
			  <el-col :span="12">
			  	<div class="box_bot" style="height: 266px;margin-top: 20px;">
			  		<div class="tc">
			  			<img class="img_index" :src="detial.user_pic" />
			  		</div>
			  		<p class="tc ce fs">{{detial.realname}}</p>
			  		<p class="tc ce fs">{{detial2.mobile}}</p>
			  	</div>
			  </el-col>
			  <el-col :span="12">
			  	<el-card style="margin-top: 20px;">
					  <div class="text">
					    <p><span class="m">用户名</span>  <span class="m_span">{{detial2.nick_name}}</span></p>
					    <p><span class="m">姓名</span>  <span class="m_span">{{detial2.realname}}</span></p>
					    <p><span class="m">账号/手机号</span>  <span class="m_span">{{detial2.mobile}}</span></p>
					    <p><span class="m">身份证号</span>  <span class="m_span">{{detial2.idcard }}</span></p>
					    <p>
					    	<span class="m">级别</span>  
					    	<span class="m_span" v-if = "detial2.user_level == '1'">省级管理员</span>
					    	<span class="m_span" v-if = "detial2.user_level == '2'">市级管理员</span>
					    	<span class="m_span" v-if = "detial2.user_level == '3'">县级管理员</span>
					    	<span class="m_span" v-if = "detial2.user_level == '4'">乡级管理员</span>
					    	<span class="m_span" v-if = "detial2.user_level == '5'">村级管理员</span>
					    </p>
					    <p><span class="m">注册时间</span>  <span class="m_span">{{detial2.register_time}}</span></p>
					    <p>
					    	<span class="m">状态</span>
					    	<span class="m_span" v-if = "detial2.user_status == '1'">正常</span>
					    	<span class="m_span" v-if = "detial2.user_status == '0'">冻结</span>
					    </p>
					  </div>
					</el-card>
			  </el-col>
			  <el-col :span="24">
			  	<el-card style="margin-top: 20px;">
					  <div class="text">
					    <div>
					    	<div class="m f_l w_d">负责区域</div>
					    	<div class="m f_l w_dh">
					    	  <p class="m_span m_b" v-for="item in detial2.manageRegions">{{item.region_name}}</p>
					    	</div>	 
					    </div>
					  </div>
					</el-card>
			  </el-col>
			</el-row>
			
    </div>
    
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
      },
      show: 0
    }
  },
  created() {
    this.getDetial()
  },
  methods: {
  	getDetial() {
  		this.$http.post('hts/management/workbench').then(response => {
	        this.detial = response
	        console.log(9999999)
		      this.end()
		      console.log(8888888)
	    })
        
    },
    end(){
    	this.$http.post('hts/management/detail', {userId:this.detial.id}).then(response => {
		        console.log(response)
		        this.detial2 = response
		  })
    },
  	enter() {
  		this.show = 1
  	},
  	leave() {
  		this.show = 0
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
  .fs{
  	font-size: 20px;
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
  /*第二版本*/
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .aaa{
  	p{
  		color: #909399;
  	}
  }
  /*第三版*/
  .text {
    font-size: 14px;
  }
  .box_bot{
  	height: 90px;
  	background-color: #FFFFFF;
  	border-radius: 1%;
  	box-shadow: 0px 2px 12px 0px rgba(0,0,0,0.1);
  }
  .f_l{
  	float: left;
  }
  .w_d{
  	width: 15%;
  }
  .w_dh{
  	width: 75%;
  	margin-left: 25px;
  }
  .m_b{
  	margin-bottom: 10px;
  }
  .p_a{
  	text-align: center; 
  	padding-top: 10px;
  	font-size: 20px;
  	color: #909399;
  }
  .p_d{
  	text-align: center; 
  	padding-top: -20px;
  	font-size: 16px;
  	color: #000;
  }
</style>
