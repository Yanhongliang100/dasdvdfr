<template>
  <div class="app-container">
    <el-form :model="formModel" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"  style="text-align: left;">
      <el-form-item label="身份选择" prop="id" :rules="[{ required: true, message: '请选择身份', trigger: 'change' },]">
        <el-select v-model="formModel.id" placeholder="请选择活动区域">
          <el-option v-for="item in levelOptions" :key="'asds'+item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' },]">
        <el-input v-model="formModel.name" placeholder="输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="身份证" prop="uCard">
        <el-input v-model="formModel.uCard" placeholder="输入真实身份证号"></el-input>
      </el-form-item>
      <el-form-item label="负责区域">
        <el-select v-model="formModel.province" placeholder="省" @change="getProv($event)">
          <el-option v-for="(item,index) in province" :key="index" :label="item.regionName" :value="item.id"/>
        </el-select><!--省-->
        <el-select v-model="formModel.town" v-if="formModel.province!==''" placeholder="市"  @change="getTown($event)">
          <el-option v-for="(item,index) in town"  :key="index" :label="item.regionName" :value="item.id"/>
        </el-select><!--市-->
        <el-select v-model="formModel.area" v-if="formModel.town!==''" placeholder="区" @change="getCalm($event)">
          <el-option v-for="(item,index) in area" :key="index" :label="item.regionName" :value="item.id"/>
        </el-select><!--区-->
        <el-select v-model="formModel.calm" v-if="calm.length!==0" placeholder="镇" @change="getBurg($event,calm)">
          <el-option v-for="(item,index) in calm" :key="index" :label="item.regionName" :value="item.id"/>
        </el-select><!--镇-->
        <el-select v-model="formModel.burg" v-if="burg.length!==0" placeholder="村" @change="getRegionName($event,burg)">
          <el-option v-for="(item,index) in burg" :key="index" :label="item.regionName" :value="item.id"/>
        </el-select><!--村-->
      </el-form-item>
      <el-form-item label="输入手机号" prop="uPhone">  
        <el-input v-model="formModel.uPhone" placeholder="输入11位手机号"></el-input>   
      </el-form-item>
      <el-form-item label="设置密码" prop="pass">  
        <el-input v-model="formModel.pass" placeholder="输入8-20位密码，数字、字母或符号至少两种"></el-input>   
      </el-form-item>
      <el-form-item label="短信验证" prop="pass">  
        <el-input v-model="formModel.phoned" placeholder="输入短信验证码" style="width: 254px"></el-input>  
        <el-button type="success" @click="getPhone">获取验证码</el-button> 
      </el-form-item>
      <el-form-item label="验证码" v-if="va" :rules="[{ required: true, message: '验证码不能为空', trigger: 'blur' },]">
        <el-input v-model="formModel.img" placeholder="输入图片验证码" style="width: 254px"></el-input>
        <img :src="path+'mts/graphicCode?markId='+markId" @click="reimg">
      </el-form-item>
      <p style="font-size: 14px">  
        点击提交即同意《中国社会扶贫网用户注册协议》《免责条款》 
      </p>
    </el-form>
    <el-button type="success" style="margin-top: 60px;" @click="loginup">提交</el-button>  
  </div>
</template>

<script type="text/ecmascript-6">
  import linkage from '@/components/linkage'
  import {card,validdateMobile,validpass} from  './rules'
  export default {
    data (){
      let checkcard = (rule,value,callback) => {
        if (!value) {
          return callback(new Error('身份证号不能为空'));
        }else if (card(value)) {
          return callback();
        } else{
          return callback(new Error('请输入正确的身份证号'));
        }
      }
      let checkphone = (rule,value,callback)=>{
        if (!value) {
          return callback(new Error('手机号不能为空'));
        }else if (validdateMobile(value)) {
          return callback();
        } else{
          return callback(new Error('请输入正确的手机号'));
        }
      }
      let checkpass = (rule,value,callback)=> {
        if (!value) {
          return callback(new Error('密码不能为空'));
        } else if (validpass(value)) {
          return callback();
        } else {
          return callback(new Error('请必须且只含有数字和字母，8-20位'));
        }
      }
      return {
        path:"http://www.fp1017.org.cn/",
        markId:1,
        levelOptions: [{ id: 5, name: '村级管理员' }, { id: 4, name: '乡级管理员' }, { id: 3, name: '县级管理员' }, { id: 2, name: '市级管理员' },{ id: 1, name: '省级管理员' }],
        formModel:{
          id:"",
          name:"",
          uCard:"",
          uPhone:"",
          pass:"",
          phoned:"",
          img:"",
          province:"",
          town:"",
          area:"",
          calm:"",
          burg:"",
        },
        town:[],
        province:[],
        area:[],
        calm:[],
        burg:[],
        va:false,
        territory:"",
        rules: {
          uCard:[{required: true,validator: checkcard, trigger: 'blur' }],
          uPhone:[{ required: true,validator: checkphone, trigger: 'blur'}],
          pass:[{ required: true,validator: checkpass, trigger: 'blur'}],
        },
      }
    },
    components: {
      linkage
    },
    created(){
      this.select()
    },
    methods:{
      select(){
        this.$http.post("/eai/authRegion/selectDate",{
          parentId:"100",
          type:1
        }).then(res => {
          this.province=res
        })
      },//省
      getProv(ev){
        this.$http.post("/eai/authRegion/selectDate",{
          parentId:ev,
          type:2
        }).then(res => {
          this.formModel.town=''
          this.formModel.area=""
          this.formModel.calm=""
          this.formModel.burg=""
          this.town=res
        })
      },//市
      getTown(ev){
        this.$http.post("/eai/authRegion/selectDate",{
          parentId:ev,
          type:3
        }).then(res => {
          this.formModel.area=""
          this.area=res
        })
      },//区
      getCalm(ev){
        this.$http.post("/eai/authRegion/selectDate",{
          parentId:ev,
          type:4
        }).then(res => {
          if(res === "此父区划下无子区划"){
            this.calm=[]
            alert(res)
          }else{
            this.formModel.calm=""
            this.calm=res
          }
        })
      },//镇
      getBurg(ev,item){
        this.$http.post("/eai/authRegion/selectDate",{
          parentId:ev,
          type:5
        }).then(res => {
          if(res === "此父区划下无子区划"){
            this.burg=[]
            alert(res)
          }else {
            this.formModel.burg = ""
            this.burg = res
            item.find(res => {
              if(res.id === ev){
                this.territory=res.regionName
              }
            })
          }
        })
      },//村
      getRegionName(ev,item){
        item.find(res => {
          if(res.id === ev){
            this.territory=res.regionName
          }
        })
      },
      loginup(){
        this.$http.post("/hts/management/addAdmin",{
          phone:this.formModel.uPhone,
          pass:this.formModel.pass,
          name:this.formModel.name,
          icode:this.formModel.phoned,
          idcard:this.formModel.uCard,
          identity:this.formModel.id,
          ywNo:1,
          territoryId:this.formModel.calm === ''? this.formModel.burg:this.formModel.calm,
          territory:this.territory
        }).then(res => {
          if(res === "请求成功"){
            alert("注册成功")
          }
        })
      },
      reimg(){
        this.markId = new Date().getTime()
      },
      getPhone(){
        if(!this.formModel.uPhone){
          this.va=false
        }else{
          this.va=true
        }
        //获取时间戳
        this.$http.post('/uts/user/getPhoneCode',{
          phone:this.formModel.uPhone,
          ywNo:1,
          markId:this.markId,
          tcode:this.formModel.img
        }).then(res => {
          if(res.data.code === "SUCCESS"){
            alert("注册成功")
          }
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-form{
    width: 450px;
  }
  .app-container{
    text-align: center;
  }
</style>
