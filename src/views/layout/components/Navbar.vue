<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <div class="systitle">扶贫干部工作台</div>
    <div class="right-menu">
      <!--<error-log class="errLog-container right-menu-item"/>-->
      <div style="float: left;">
      	<el-button type="text" @click="waitT"><span style="color:#000">待审核需求</span><span class="tips_button">{{$store.state.user.wait}}</span></el-button>
	      <el-button type="text" @click="putForwardT"><span style="color:#E6A23C">可提现需求</span><span class="tips_buttonT">{{totalT}}</span></el-button>
	      <el-button type="text" @click="administratorsT"><span style="color:#F56C6C">管理员审核</span><span class="tips_buttonTr">{{$store.state.user.admin}}</span></el-button>
      </div>
      <el-tooltip content="全屏" effect="dark" placement="bottom">
        <screenfull class="screenfull right-menu-item"/>
      </el-tooltip>

      <!--<el-tooltip content="大小" effect="dark" placement="bottom">-->
        <!--<size-select class="international right-menu-item"/>-->
      <!--</el-tooltip>-->

      <!--<lang-select class="international right-menu-item"/>-->

      <!--<el-tooltip content="theme" effect="dark" placement="bottom">-->
        <!--<theme-picker class="theme-switch right-menu-item"/>-->
      <!--</el-tooltip>-->

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              控制台
            </el-dropdown-item>
          </router-link>
          <!--<a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">-->
            <!--<el-dropdown-item>-->
              <!--github-->
            <!--</el-dropdown-item>-->
          <!--</a>-->
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'

export default {
	data() {
		return {
			total: 0,
			totalT: 0,
			totalTr: 0
		}
	},
  components: {
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  created() {
    this.wait()
    this.putForward()
    this.administrators()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    //待审核需求
    wait() {
    	this.$http.post('hts/management/showList', {
    		pageNum: 1,
    		pageSize: 20,
      	checkStatus:'01'
    	}).then(response => {
        this.$store.commit('SET_WAIT', parseInt(response.total))
        console.log(this.$store.state.user.wait)
      })
    },
    //可提现需求
    putForward() {
			this.$http.post('/hts/management/myDemends', {
				page: 1,
				pageSize: 20,
				demandStatus: 4
			}).then(response => {
				localStorage.totalT = parseInt(response.total)
        this.totalT = localStorage.totalT
			})
    },
    //管理员审核
    administrators() {
    	this.$http.post('/hts/management/isCheck', {
    		page: 1,
        pageSize: 10,
        level: undefined
    	}).then(response => {
    		this.$store.commit('SET_ADMIN', parseInt(response.total))
        console.log(this.$store.state.user.admin)
      })
    },
    waitT() {
    	console.log("跳转到待审核")
    	this.$router.push({ path: '/help/demandCheckList' })
    },
    putForwardT() {
    	console.log("跳转到等待提现")
    	this.$router.push({ path: '/help/demandManagerList' })
    },
    administratorsT() {
    	console.log("跳转到管理员审核")
    	this.$router.push({ path: '/manager/managerCheckList' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tips_button{
	display: inline-block; 
	background-color: #000;
	color: #FFFFFF;
	padding: 5px;
	border-radius: 50%;
	margin-left: 5px;
}
.tips_buttonT{
	display: inline-block; 
	background-color: #E6A23C;
	color: #FFFFFF;
	padding: 5px;
	border-radius: 50%;
	margin-left: 5px;
}
.tips_buttonTr{
	display: inline-block; 
	background-color: #F56C6C;
	color: #FFFFFF;
	padding: 5px;
	border-radius: 50%;
	margin-left: 5px;
}
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
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
