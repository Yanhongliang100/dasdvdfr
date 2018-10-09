<template>
  <div class="app-container">
    <div class="conheader clearfix" align="right">
      <h3>{{$route.meta.title}}</h3>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-star-on" @click="demandDetail">详情和审核</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="editDemand">编辑</el-button>
    </div>
    <div class="filter-container">
    	<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;审核：</span>
      <el-select v-model="showList.checkStatus" clearable style="width: 160px" class="filter-item" placeholder="是否审核">
        <el-option v-for="item in levelOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <span>贫困户：</span>
      <el-select v-model="showList.isPoor" clearable style="width: 160px" class="filter-item" placeholder="是否贫困户">
        <el-option v-for="item in isPoor" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <span>本人：</span>
      <el-select v-model="showList.isOneself" clearable style="width: 160px" class="filter-item" placeholder="是否本人">
        <el-option v-for="item in isOneself" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;min-height:400px;"
      height="400"
      @row-click="handleSelectionChange">
      <el-table-column align="center" label="序号" type="index" width="45" prop="id"/>

      <el-table-column width="150" label="需求标题" prop="demand_title"/>
      <el-table-column width="70" align="center" label="需求类型" prop="help_type_code">
	      <template slot-scope="scope">
	        <p v-if = "scope.row.help_type_code == '1'">医疗需求</p>
	        <p v-if = "scope.row.help_type_code == '2'">教育需求</p>
	        <p v-if = "scope.row.help_type_code == '3'">住房需求</p>
	        <p v-if = "scope.row.help_type_code == '4'">民生需求</p>
	        <p v-if = "scope.row.help_type_code == '5'">物品需求</p>
	        <p v-if = "scope.row.help_type_code == '6'">就业需求</p>
	      </template>
      </el-table-column>
      <el-table-column width="70" align="center" label="受助人" prop="aideder_name"/>
      <el-table-column width="150" align="center" label="受助人联系方式" prop="aideder_tel"/>
      <el-table-column width="150" align="center" label="受助人身份证号" prop="aideder_idcard"/>
      <el-table-column width="200" align="center" label="受助人地区" prop="region_name"/>
      <el-table-column width="200" align="center" label="是否贫困户" prop="is_poor">
        <template slot-scope="scope">
          <p v-if = "scope.row.is_poor == '1'">贫困户</p>
          <p v-if = "scope.row.is_poor == '0'">非贫困户</p>
        </template>
      </el-table-column>
      <el-table-column width="120" align="center" label="二者关系" prop="user_relation">
      	<template slot-scope="scope">
          <p v-if = "scope.row.user_relation == '01'">本人</p>
          <p v-if = "scope.row.user_relation == '02'">我帮助的贫困户</p>
          <p v-if = "scope.row.user_relation == '03'">我认识的贫困户</p>
          <p v-if = "scope.row.user_relation == '04'">儿子</p>
          <p v-if = "scope.row.user_relation == '05'">女儿</p>
          <p v-if = "scope.row.user_relation == '06'">亲戚</p>
          <p v-if = "scope.row.user_relation == '07'">朋友</p>
          <p v-if = "scope.row.user_relation == '08'">丈夫</p>
          <p v-if = "scope.row.user_relation == '09'">妻子</p>
          <p v-if = "scope.row.user_relation == '10'">父亲</p>
          <p v-if = "scope.row.user_relation == '11'">母亲</p>
          <p v-if = "scope.row.user_relation == '12'">邻居</p>
          <p v-if = "scope.row.user_relation == '13'">其他</p>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" label="发布人联系方式" prop="publish_tel"/>
      <el-table-column width="100" align="center" label="审核状态" prop="review_status_name"/>
      <el-table-column width="70" align="center" label="发布人" prop="publish_name"/>
      <el-table-column width="150" align="center" label="发布时间" prop="create_date"/>
      <el-table-column width="100" fixed="right" align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="demandDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>

    <el-dialog :visible.sync="dialogDetail" class="checkDialog" title="审核需求">
      <el-tabs v-model="activeName">
        <el-tab-pane label="需求详情" name="first" style="height:400px;overflow-x: hidden;overflow-y: scroll;line-height: 30px;">
          <div>
            <span class="label">需求ID</span><span>{{currentItem.id}}</span>
          </div>
          <div>
            <span class="label">受助人</span><span>{{currentItem.aideder_name}}</span>
          </div>
          <div>
            <span class="label">受助人身份证号码</span><span>{{currentItem.aideder_idcard}}</span>
          </div>
          <div>
            <span class="label">受助人手机号码</span><span>{{currentItem.aideder_tel}}</span>
          </div>
          <div>
            <span class="label">所属地区</span><span>{{currentItem.region_name}}</span>
          </div>
          <div>
            <span class="label">发布人</span><span>{{currentItem.publish_name}}</span>
          </div>
          <div>
            <span class="label">发布人联系方式</span><span>{{currentItem.publish_tel}}</span>
          </div>
          <div>
            <span class="label">发布人与受助人关系</span>
            <span v-if = "currentItem.user_relation == '01'">本人</span>
            <span v-if = "currentItem.user_relation == '02'">我帮扶的贫困户</span>
            <span v-if = "currentItem.user_relation == '03'">我认识的贫困户</span>
            <span v-if = "currentItem.user_relation == '04'">儿子</span>
            <span v-if = "currentItem.user_relation == '05'">女儿</span>
            <span v-if = "currentItem.user_relation == '06'">亲戚</span>
            <span v-if = "currentItem.user_relation == '07'">朋友</span>
            <span v-if = "currentItem.user_relation == '08'">丈夫</span>
            <span v-if = "currentItem.user_relation == '09'">妻子</span>
            <span v-if = "currentItem.user_relation == '10'">父亲</span>
            <span v-if = "currentItem.user_relation == '11'">母亲</span>
            <span v-if = "currentItem.user_relation == '12'">邻居</span>
            <span v-if = "currentItem.user_relation == '13'">其他</span>
          </div>
          <div style="overflow: auto;">
          	<p style="width: 140px;float: left;margin: 6px;">需求详情</p>
          	<p style="width: 400px;float: left;margin: 6px;">{{currentItem.demand_coment}}</p>
          </div>
          <div v-if = 'currentItemTwo.demand_type == "2"'>
            <span class="label">目标金额</span><span>{{currentItem.target_amount}}</span>
          </div>
          <div v-if = 'currentItemTwo.demand_type == "2"'>
            <span class="label">资金用途</span><span>{{currentItemTwo.demand_use}}</span>
          </div>
          <div>
            <span class="label">需求动态</span><span></span>
          </div>
          <div>
            <p v-for="item in currentItemThree" style="margin-left:6px">{{item.op_date}}<span style="display:inline-block; width:50px"></span>{{item.op_result}}</p>
          </div>
          <div style="position: absolute;left: 200px;bottom: 30px;" v-if = "currentItem.review_status =='0'" class="center">
          	<el-button type="primary" @click="handleShenhe()">审核通过</el-button>
          	<el-button type="danger" @click="handleShenheError()">审核不通过</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="相关图片" name="second" style="height:400px;overflow-x: hidden;overflow-y: scroll;line-height: 30px;display: none;">
          <el-carousel :interval="2000" arrow="always">
				    <el-carousel-item v-for="item in relate_pics" :key="item">
				      <h3><img class="imgs" :src="item"></h3>
				    </el-carousel-item>
				  </el-carousel>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :visible.sync="what" class="checkDialog" title="审核不通过原因">
    	<el-form :model="opinions" :rules="rulesTwo" ref="ruleForm" style="height: 150px;">
    		<el-form-item prop="opinion">
			    <el-input type="textarea" v-model="opinions.opinion" :autosize="{ minRows: 6, maxRows:8}" placeholder="请输入原因"></el-input>
			  </el-form-item>
    	</el-form>
    	<div class="center">
          	<el-button @click="handlequxiao()">取消</el-button>
          	<el-button type="primary" @click="handlequeren()">确认</el-button>
      </div>
    </el-dialog >

    <el-dialog :visible.sync="dialogFormVisible" title="编辑需求">
      <el-form ref="dataForm" :rules="rules" :model="currentItem" label-position="left" label-width="160px" style="width: 500px; margin-left:30px;">
      	<el-form-item label="受助人" prop="aideder_name">
          <el-input v-model="currentItem.aideder_name" readonly type="text" />
        </el-form-item>
        <el-form-item label="受助人身份证号" prop="aideder_idcard">
          <el-input v-model="currentItem.aideder_idcard" readonly type="number" />
        </el-form-item>
        <el-form-item label="受助人电话号码" prop="aideder_tel">
          <el-input v-model="currentItem.aideder_tel" readonly type="number" />
        </el-form-item>
        <el-form-item label="需求标题" prop="demand_title">
          <el-input v-model="currentItem.demand_title" type="text" />
        </el-form-item>
        <el-form-item label="需求内容" prop="demand_coment">
          <el-input v-model="currentItem.demand_coment"  type="textarea" :autosize="{ minRows: 5, maxRows: 10}"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData('ruleform')">确定</el-button>
        <el-button v-else type="primary" @click="updateData('ruleform')">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'

export default {
  name: 'DemandCheckList',
  directives: {
    waves
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
      	token : '',
        pageNum: 1,
        pageSize: 20,
        level: undefined,
        name: undefined,
        mobile: undefined
      },
      showList: {
      	token : '',
      	pageNum: 1,
        pageSize: 20,
      	checkStatus:'01',
      	isPoor:null,
      	isOneself: null
      },
      activeName: 'first',
      levelOptions: [{ id: "01", name: '未审核' }, { id: "02", name: '审核未通过' }],
      isPoor: [{ id: 1, name: '贫困户' }, { id: 0, name: '非贫困户' }],
      isOneself: [{ id: 1, name: '本人' }, { id: 0, name: '不是本人' }],
      showReviewer: false,
      currentItem: { id: '33' },
      currentItemTwo: {},
      currentItemThree: {},
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '错误',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogDetail: false,
      relate_pics: [],
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rulesTwo: {
      	opinion: [
            { required: true, message: '请输入审核不通过原因', trigger: 'blur' },
            { min: 5, max: 100, message: '最少5个字符，最多100个字符', trigger: 'blur' }      
        ]
      },
      rules: {
      	name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        demand_title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        demand_coment: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        target_amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入用途', trigger: 'blur' }]
      },
      downloadLoading: false,
      shenhe:false,
      what:false,
      opinions: {
      	opinion: ''
      },
      user_level: null
    }
  },
  created() {
    this.getList()
    this.getListCha()
  },
  methods: {
    getList() {
      this.listLoading = true
      console.log('去读数据')
      this.showList.token = this.getCookie("Admin-Token")
      this.$http.post('/hts/management/showList', this.showList).then(response => {
        console.log(response)
        this.list = response.list
        this.total = parseInt(response.total)
        this.listLoading = false
      })
    },
    getCookie(name){
		    name = name + "="
		    var start = document.cookie.indexOf(name),
		        value = null;
		    if(start>-1){
		        var end = document.cookie.indexOf(";",start);
		        if(end == -1){
		            end = document.cookie.length;
		        }
		        value = document.cookie.substring(start+name.length,end);
		    }
		    return value;
		},
    getListCha() {
    	this.showList.token = this.getCookie('Admin-Token')
    	
    	console.log("我是showList")
    	this.$http.post('hts/management/showList', this.showList).then(response => {

        console.log(response)
        console.log("我是查询的结果")
        this.list = response.list
        this.total = parseInt(response.total)
        this.listLoading = false
      })
    },
    handleFilter() {
    	console.log(this.showList)
      this.getListCha() 
    },
    handleShenhe(){
      this.$http.post('/hts/management/isPass', {
      	id: this.currentItem.id,
    		tocken: this.getCookie('Admin-Token'),
    		isCheck: 1
    	}).then(response => {
        console.log('确认审核')
        var wait = this.$store.state.user.wait - 1
        console.log(wait)
        this.$store.commit('SET_WAIT', wait)
        this.dialogDetail = false
        this.$message({
	        message: '操作成功',
	        type: 'success'
	      })
        this.listLoading = false
        this.getList()
     })	
    },
    handlequxiao(){
    	this.what = false
    },
    handlequeren(){
    	console.log(this.opinions.opinion.length)
    	if(this.opinions.opinion.length >= 5 && this.opinions.opinion.length <= 100){
    		this.$http.post('hts/management/isPass', {
		      	id: this.currentItem.id,
		    		tocken: this.getCookie('Admin-Token'),
		    		isCheck: 0,
		    		opinion: this.opinion
		    	}).then(response => {
		        console.log(JSON.stringify(response))
		        var wait2 = this.$store.state.user.wait - 1
		        this.$store.commit('SET_WAIT', wait2)
		        this.what = false
		        this.dialogDetail =false
		        this.$message({
			        message: '操作成功',
			        type: 'success'
			      })
		        this.getList()
		     })	
    	}
    		
    },
    handleShenheError(){
    	this.what = true;
    },
    handleSizeChange(val) {
      this.showList.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
    	console.log(val)
      this.showList.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleSelectionChange(val) {
      this.currentItem = val
      console.log(val.relate_pics)
      console.log(val)
      console.log(11111111111)
      if(val.relate_pics == '') {
      	this.relate_pics = []
      }else{
      	this.relate_pics = val.relate_pics.split(',')
      	console.log(this.relate_pics)
      }
      this.$http.post('hts/help/detail', { demand_id: this.currentItem.id }).then(response => {
        this.currentItemTwo = response
        console.log("我是详情啊啊啊啊啊")
        console.log(this.currentItemTwo)
      })
      this.$http.post('/hts/management/logs', {
				
				demandId: this.currentItem.id
			}).then(response => {
				this.currentItemThree = response
				console.log("我是日志啊啊啊啊")
			})
    },
    editDemand() {
      this.$http.post('/hts/management/workbench').then(response => {
				console.log("我是管理员等级")
				this.user_level = response.user_level
				console.log( response )
				if(this.user_level >= 3){
					this.dialogFormVisible = true
					console.log("我是管理员等级22222")
		      this.$nextTick(() => {
		        this.$refs['dataForm'].clearValidate()
		      })
//		      this.$message({
//						showClose: true,
//						message: '修改成功',
//						type: 'success'
//					})
				}else{
					this.dialogFormVisible = false
					console.log("我是管理员等级11111")
					this.$message({
						showClose: true,
						message: '抱歉，您没有权限',
						type: 'danger'
					})
				}
			})
      
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
//    this.temp = Object.assign({}, row)  copy obj
      this.$http.post('hts/help/detail', { demand_id: row.id }).then(response => {
        console.log(response)
        this.currentItem = response
        conso
        console.log(this.currentItem)
        this.dialogDetail = true
      })
    },
    updateData(dataForm) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http.post("/hts/management/editDemand",{
          	
          	demandId : this.currentItem.id,
          	demand_title: this.currentItem.demand_title,
          	demand_coment: this.currentItem.demand_coment
          }).then(response => {
          	console.log("我是编辑更新")
            console.log(response)
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    demandDetail() {
      console.log(this.$router)
      this.dialogDetail = true
      // this.$router.push('/help/demandManagerList')
    }
  }
}
</script>
<style scoped>
  .label {width:140px;display:inline-block;margin:6px}
  .checkDialog >>> .el-dialog__body{padding-top:0px }
  .center{text-align: center}
  .img_span{width: 100%;float: left;}
  .img_span .imgs{
  	display:block;width:100%;height: 250px;
 	}
 	.filter-container .filter-item{
      margin-bottom: 0;
  }
 	.filter-container span{
      line-height: 50px;
      font-size: 14px;
  }
  
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
    height:300px;
  }
  .el-carousel__item h3 img{
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    width: 100%;
    height: 100%;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
