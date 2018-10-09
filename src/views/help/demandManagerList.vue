<template>
  <div class="app-container">
		<div class="conheader clearfix" align="right">
		      <h3>{{$route.meta.title}}</h3>
		</div>
    <div class="filter-container">
    	<span>身份:</span>
      <el-select v-model="listQuery.isPoor" clearable style="width: 160px" class="filter-item" placeholder="受助人身份">
        <el-option v-for="item in isPoorOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <span>状态:</span>
      <el-select v-model="listQuery.demandStatus" clearable style="width: 160px" class="filter-item" value="1" placeholder="需求状态">
        <el-option v-for="item in demandStatusOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <span>姓名:</span>
      <el-input v-model="listQuery.aidedName" placeholder="姓名" style="width: 160px" class="filter-item"></el-input>
      <span>手机号:</span>
      <el-input v-model="listQuery.aidederTel" placeholder="受助人手机号" style="width: 160px" class="filter-item"></el-input>
      <span>身份证号:</span>
      <el-input v-model="listQuery.aidedIdCard" placeholder="受助人身份证号" style="width: 160px" class="filter-item"></el-input>
      <br />
      <span>本人:</span>
      <el-select v-model="listQuery.self" clearable style="width: 160px" class="filter-item" placeholder="是否本人审核">
        <el-option v-for="item in zhuangtai" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <span>需求:</span>
      <el-select v-model="listQuery.helpTypeCode" clearable style="width: 160px" class="filter-item" placeholder="状态">
        <el-option v-for="item in leixing" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <br />
      <span>查询区域:</span>
      <linkage :level="level" :level_list="level_list" @change="linkageChange"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;min-height:400px;"
      height="400"
      @row-click="handleSelectionChange">
      <el-table-column align="center" label="序号" type="index" width="65"/>
      <el-table-column min-width="150" align="center" label="发布时间" prop="create_date"/>
      <el-table-column min-width="150" label="需求标题" prop="demand_title"/>
      <el-table-column width="70" align="center" label="需求类型">
      	<template slot-scope="scope">
	        <p v-if = "scope.row.demand_status == '3'">帮扶中</p>
	        <p v-if = "scope.row.demand_status == '4'">等待提现</p>
	        <p v-if = "scope.row.demand_status == '5'">提现中</p>
	        <p v-if = "scope.row.demand_status == '6'">待发货</p>
	        <p v-if = "scope.row.demand_status == '7'">已发货</p>
	        <p v-if = "scope.row.demand_status == '8'">发布超时</p>
	        <p v-if = "scope.row.demand_status == '9'">帮扶成功</p>
	        <p v-if = "scope.row.demand_status == '10'">帮扶失败</p>
	        <p v-if = "scope.row.demand_status == '11'">已关闭</p>
	      </template>
      </el-table-column>
      <el-table-column width="70" align="center" label="受助人" prop="aideder_name"/>
      <el-table-column width="150" align="center" label="受助人联系方式" prop="aideder_tel"/>
      <el-table-column width="150" align="center" label="发布人" prop="publish_name"/>
      <el-table-column align="center" label="二者关系" prop="user_relation">
      	<template slot-scope="scope">
      		<p v-if = "scope.row.user_relation == '0'">暂无关系</p>
          <p v-if = "scope.row.user_relation == '1'">本人</p>
          <p v-if = "scope.row.user_relation == '2'">我帮助的贫困户</p>
          <p v-if = "scope.row.user_relation == '3'">我认识的贫困户</p>
          <p v-if = "scope.row.user_relation == '4'">儿子</p>
          <p v-if = "scope.row.user_relation == '5'">女儿</p>
          <p v-if = "scope.row.user_relation == '6'">亲戚</p>
          <p v-if = "scope.row.user_relation == '7'">朋友</p>
          <p v-if = "scope.row.user_relation == '8'">丈夫</p>
          <p v-if = "scope.row.user_relation == '9'">妻子</p>
          <p v-if = "scope.row.user_relation == '10'">父亲</p>
          <p v-if = "scope.row.user_relation == '11'">母亲</p>
          <p v-if = "scope.row.user_relation == '12'">邻居</p>
          <p v-if = "scope.row.user_relation == '13'">其他</p>
        </template>
      </el-table-column>
      <el-table-column width="150" align="center" label="发布人联系方式" prop="publish_tel"/>
      <el-table-column width="250" align="center" label="受助人地区" prop="region_name"/>
      <el-table-column width="70" align="center" label="审核人" prop="aideder_name"/>
      <el-table-column width="200" fixed="right" align="center" label="操作" prop="aideder_name">
      	<template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleDetial(scope.row)">详情</el-button>
          <el-button v-if="scope.row.demand_status == '3'" size="mini" type="primary" @click="handleClose(scope.row)">{{guanbi}}</el-button>
          <el-button v-if="scope.row.demand_status == '4'" size="mini" type="primary" @click="handleTips(scope.row)">提醒一下</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    
    <el-dialog :visible.sync="dialogDetail" class="checkDialog" title="需求详情">
      <el-tabs value = "first">
        <el-tab-pane label="需求详情" name="first" style="height:400px;overflow-x: hidden;overflow-y: scroll;line-height: 30px;">
          <div>
            <span class="label">需求ID</span><span>{{ currentItem.id }}</span>
          </div>
          <div>
            <span class="label">受助人</span><span>{{ currentItem.aideder_name }}</span>
          </div>
          <div>
            <span class="label">身份证号码</span><span>{{ currentItem.aideder_idcard }}</span>
          </div>
          <div>
            <span class="label">手机号码</span><span>{{ currentItem.aideder_tel }}</span>
          </div>
          <div>
            <span class="label">所属地区</span><span>{{ currentItem.user_region_name }}</span>
          </div>
          <div>
            <span class="label">发布人</span><span>{{ currentItem.publish_name }}</span>
          </div>
          <div>
            <span class="label">发布人联系方式</span><span>{{ currentItem.publish_tel }}</span>
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
          	<p style="width: 400px;float: left;margin: 6px;">{{ currentItem.demand_coment }}</p>
          </div>
          <div>
            <span class="label">需求证明</span><span>{{ currentItem.prove_num }}次证明</span>
          </div>
          <div v-if = 'currentItem.demand_type == "2"'>
            <span class="label">目标金额</span><span>{{currentItem.target_amount}}元</span>
          </div>
          <div v-if = 'currentItem.demand_type == "2"'>
            <span class="label">已帮扶金额</span><span>{{currentItem.moneycount}}元</span>
          </div>
          <div v-if = 'currentItem.demand_type == "2"'>
            <span class="label">资金用途</span><span>{{currentItem.demand_use}}</span>
          </div>
          <div v-if = "currentItem.bf_detail != null">
          	<div>
	            <span class="label">帮扶详情</span><span>{{currentItem.user_name}}给你帮扶了   物品名称{{currentItem.goods}}</span>
	          </div>
	          <div>
	            <span class="label"></span><span style="display: inline-block; margin-top: 10px;">{{ currentItem.bf_detail }}</span>
	          </div>
	          <div>
	            <span class="label"></span><span style="display: inline-block; margin-top: 10px;">{{ currentItem.record_imgs }}</span>
	          </div>
	          <div>
	            <span class="label"></span><span style="display: inline-block; margin-top: 10px;color:red">爱心人士还剩{{ currentItem.countdown }}送出物品</span>
	          </div>
          </div>
          
          <div v-if = 'currentItem.demand_type == "1"'>
            <span class="label">收货地址</span><span>姓名:{{ currentItem.linkman }}</span>
          </div>
          <div v-if = 'currentItem.demand_type == "1"'>
            <span class="label"></span><span style="display: inline-block; margin-top: 10px;">地址:{{ currentItem.detail_addr }}</span>
          </div>
          <div v-if = 'currentItem.demand_type == "1"'>
            <span class="label"></span><span style="display:inline-block; margin-top: 10px;">电话号码:{{ currentItem.link_tel }}</span>
          </div>
          <div>
            <span v-if ='currentItem.demand_type == "1"' class="label">帮扶方式</span>
            <span v-if = 'currentItem.demand_type == "1" && currentItem.help_pattern == "2"'>快递</span>
            <span v-if = 'currentItem.demand_type == "1" && currentItem.help_pattern == "1"'>面对面</span>
          </div>
          <div v-if = 'currentItem.demand_type == "1" && currentItem.help_pattern == "2"'>
            <span class="label">物流信息</span><span>快递公司:{{ currentItem.express_org }}</span>
          </div>
          <div v-if = 'currentItem.demand_type == "1" && currentItem.help_pattern == "2"'>
            <span class="label"></span><span style="display: inline-block; margin-top: 10px;">快递单号:{{ currentItem.express_no }}</span>
          </div>
          <div v-if = 'currentItem.demand_type == "1" && currentItem.help_pattern == "1"'>
            <span class="label">赠送人信息</span><span>捐赠人:{{ currentItem.donor }}</span>
          </div>
          <div v-if = 'currentItem.demand_type == "1" && currentItem.help_pattern == "1"'>
            <span class="label"></span><span style="display: inline-block; margin-top: 10px;">联系人:{{ currentItem.donor_link_man }}</span>
          </div>
          <div v-if = 'currentItem.demand_type == "1" && currentItem.help_pattern == "1"'>
            <span class="label"></span><span style="display: inline-block; margin-top: 10px;">联系电话:{{ currentItem.donor_link_tel }}</span>
          </div>
          <div v-if = 'currentItem.demand_type == "1" && currentItem.help_pattern == "1"'>
            <span class="label"></span><span style="display: inline-block; margin-top: 10px;">预计捐赠日期: {{ currentItem.donor_date }}</span>
          </div>
          <div v-if="currentItem.bank_name != null">
          	<div v-if = 'currentItem.demand_type == "2"'>
	            <span class="label">收款信息</span><span>姓名: {{ currentItem.bank_name }}</span>
	          </div>
	          <div v-if = 'currentItem.demand_type == "2"'>
	            <span class="label"></span><span style="display: inline-block; margin-top: 10px;">开户行: {{ currentItem.open_bank_name }}</span>
	          </div>
	          <div v-if = 'currentItem.demand_type == "2"'>
	            <span class="label"></span><span style="display: inline-block; margin-top: 10px;">银行卡号: {{ currentItem.bank_no }}</span>
	          </div>
	          <div v-if = 'currentItem.demand_type == "2"'>
	            <span class="label"></span><span style="display: inline-block; margin-top: 10px;">付款方式: 系统自动打款</span>
	          </div>
          </div>
          
          
          
          <div>
            <span class="label">需求动态</span><span></span>
          </div>
          <div>
            <p v-for="item in currentItem2" style="margin-left:6px">{{item.op_date}}<span style="display:inline-block; width:50px"></span>{{item.op_result}}</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="相关图片" name="second" style="height:400px;overflow-x: hidden;overflow-y: scroll;line-height: 30px;">
          <el-carousel :interval="5000" arrow="always">
				    <el-carousel-item v-for="item in relate_pics" :key="item">
				      <h3><img class="imgs" :src="item"></h3>
				    </el-carousel-item>
				  </el-carousel>
        </el-tab-pane>
        <el-tab-pane label="爱心动态" name="third" style="height:400px;overflow-x: hidden;overflow-y: scroll;line-height: 30px;display: none;">
        	<div class="tx">
        		<el-button type="primary" @click="handerCliclAi">发布爱心动态</el-button>
        	</div>
        	
        	<div v-for="item in aiList">
        		<el-row>
						  <el-col :span="24"><div class="grid-content bg-purple-dark"><span style="font-size:16px;padding-right:10px">{{item.publisher_name}}</span><span>{{item.create_date}}</span></div></el-col>
						</el-row>
            <el-row>
						  <el-col :span="24"><div class="grid-content bg-purple pd">{{item.dynamic_comment}}</div></el-col>
						</el-row>
						<el-row>
						  <el-col :span="6" v-for="(item2, index) in item.img" :key="index"><div class="grid-content bg-purple"><img class="wh" v-bind:src="item.img"></div></el-col>
						</el-row>
						<hr />
        	</div>
        	<div class="pagination-container" style="text-align:center">
			      <el-pagination
						  background
						  layout="prev, pager, next"
						  :total="totalAi"
						  @current-change="change">
						</el-pagination>
			    </div> 
        </el-tab-pane>
        <el-tab-pane label="帮扶记录" name="fived" style="height:400px;overflow-x: hidden;overflow-y: scroll;line-height: 30px;">
          <el-table :data = "currentItem4.vos"	style="width: 100%">
			      <el-table-column type="index" align="center" label="序号"  width="50"></el-table-column>
			      <el-table-column prop="user_name" align="center"  label="名称"  width="100"></el-table-column>
			      <el-table-column prop="contribute_time"  align="center" width="150" label="帮扶日期"></el-table-column>
			      <el-table-column v-if="currentItem.demand_type =='2'" prop="paid_money"  align="center" width="150" label="帮扶金额(元)"></el-table-column>
			      <el-table-column prop="hot_degree" align="center" label="爱心热度"/>
			      <el-table-column prop="message" align="center" label="爱心留言">	
			      </el-table-column>
			    </el-table>
			    <!--<h1>我是另一种形式帮扶记录</h1>
			    <el-table
				    :data="currentItem4.vos"
				    style="width: 100%">
				    <el-table-column type="expand">
				      <template slot-scope="props">
				        <el-form label-position="left" inline class="demo-table-expand">
				          <el-form-item label="商品分类">
				            <span>{{ props.row.user_name }}</span>
				          </el-form-item>
				          <el-form-item label="店铺地址">
				            <span>{{ props.row.user_name }}</span>
				          </el-form-item>
				          <el-form-item label="商品描述">
				            <span>{{ props.row.user_name }}</span>
				          </el-form-item>
				        </el-form>
				      </template>
				    </el-table-column>
				    <el-table-column
				      label="捐助人名字"
				      prop="user_name">
				    </el-table-column>
				    <el-table-column
				      label="捐助时间"
				      prop="contribute_time">
				    </el-table-column>
				    <el-table-column
				      label="爱心留言"
				      prop="message">
				    </el-table-column>
				  </el-table>-->
        </el-tab-pane>
        <el-tab-pane label="需求证明" name="ford" style="height:400px;overflow-x: hidden;overflow-y: scroll;line-height: 30px;">
          <el-table :data = "currentItem3.vos"	style="width: 100%">
			      <el-table-column type="index" align="center" label="序号"  width="50"></el-table-column>
			      <el-table-column prop="real_name" align="center"  label="姓名"  width="100"></el-table-column>
			      <el-table-column prop="user_type"  align="center" width="150" label="用户类型"></el-table-column>
			      <el-table-column prop="content" align="center" label="内容"></el-table-column>
			    </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog :visible.sync="dialogAiVisible" title="发布爱心动态">
      <el-form ref="dataForm" :rules="rules" :model="currentItem" label-position="left" label-width="160px" style="width: 500px; margin-left:30px;">
        <el-form-item label="爱心动态">
          <el-input  v-model = "comMent"  type="textarea"  placeholder= "最少输入五个字" :autosize="{ minRows: 4, maxRows: 8}" />
        </el-form-item>
        <el-upload
        	ref= "upload"
        	action = ""
				  accept="image/jpeg,image/gif,image/png"
				  list-type="picture-card"
				  :auto-upload="false"
				  :multiple='true'
				  :limit = "9"
				  :file-list = "fileList"
				  :http-request = "httpRequest"
				  :drag="false">
				  <i class="el-icon-plus"></i>
				  <div slot="tip" class="el-upload__tip">图片最多上传9张，仅支持JPG\JPEG\GIF\PNG格式的图片文件，文件大小不能大于2MB</div>
				</el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="tupianshangchuan('ruleform')">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogFormVisible" title="编辑信息">
      <el-form ref="dataForm" :rules="rules" :model="currentItem" label-position="left" label-width="160px" style="width: 500px; margin-left:30px;">
        <el-form-item label="需求标题" prop="demand_title">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="currentItem.demand_title" />
        </el-form-item>
        <el-form-item label="需求内容" prop="demand_coment">
          <el-input v-model="currentItem.demand_coment"  type="textarea"/>
        </el-form-item>
        <el-form-item label="目标金额" prop="target_amount">
          <el-input v-model="currentItem.target_amount"  type="text"/>
        </el-form-item>
        <el-form-item label="资金用途" prop="remark">
          <el-input v-model="currentItem.remark"  type="text"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData('ruleform')">确定</el-button>
        <el-button v-else type="primary" @click="updateData('ruleform')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves' // 水波纹指令
import linkage from '@/components/linkage'
import { fetchPv, createArticle, updateArticle } from '@/api/article'
import { parseTime } from '@/utils'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
export default {
	name: 'DemandList',
	directives: {
		waves	
	},
	components: {
		linkage
	},
	data() {
		return {
			typeOptions: [],
			level_list: JSON.parse(localStorage.leaderarrs),
      level: localStorage.leaderLevel,
			value7: '',
			activeName: 'first',
			tableKey: 0,
			list: null,
			total: null,
			guanbi: '关闭需求',
			comMent: null,
			isAddImgShow: true,
			imgArr: [],
			listLoading: true,
			dialogAiVisible: false,
			fileList: [],
			fileList2: [],
			dialogStatus:null,
			relate_pics:[],
			listQuery: {
				token: null,
				page: 1,
				pageSize: 20,
				demandStatus: null,
				isPoor: null,
				helpTypeCode: null,
				self: null,
				aidedName: null,
				aidederTel: null,
				aidedIdCard: null,
				pId: "",
        cId: "",
        xId: "",
        vId: "",
        hId: ""
			},
			detail: {},
			props: {
				value: 'id',
				label: 'regionName',
				children: 'cities'
			},
			rules: {
				demand_title: [{
					required: true,
					message: '请输入标题',
					trigger: 'blur'
				}],
				demand_coment: [{
					required: true,
					message: '请输入内容',
					trigger: 'blur'
				}],
				target_amount: [{
					required: true,
					message: '请输入金额',
					trigger: 'blur'
				}],
				remark: [{
					required: true,
					message: '请输入用途',
					trigger: 'blur'
				}]
			},
			demandStatus: [{
				id: '1',
				name: '待审核'
			}, {
				id: '0',
				name: '审核不通过'
			}],
			queryType: [{
				id: 'name',
				name: '姓名'
			}, {
				id: 'idcord',
				name: '身份证号'
			}, {
				id: 'phone',
				name: '贫困户手机号'
			}],
			isPoorOptions: [{
				id: '1',
				name: '贫困户'
			}, {
				id: '0',
				name: '非贫困户'
			}],
			demandStatusOptions: [{
				id: '',
				name: '全部'
			}, {
				id: '3',
				name: '帮扶中'
			}, {
				id: '4',
				name: '等待提现'
			}, {
				id: '5',
				name: '提现中'
			}, {
				id: '6',
				name: '待发货'
			}, {
				id: '7',
				name: '已发货'
			}, {
				id: '8',
				name: '发布超时'
			}, {
				id: '9',
				name: '帮扶成功'
			}, {
				id: '10',
				name: '帮扶失败'
			}, {
				id: '11',
				name: '已关闭'
			}],
			leixing: [{
				id: '',
				name: '全部需求'
			}, {
				id: '1',
				name: '医疗需求'
			}, {
				id: '2',
				name: '教育需求'
			}, {
				id: '3',
				name: '住房需求'
			}, {
				id: '4',
				name: '民生需求'
			}, {
				id: '5',
				name: '物品需求'
			}, {
				id: '6',
				name: '就业需求'
			}],
			zhuangtai: [{
				id: '1',
				name: '本人审核'
			}, {
				id: '0',
				name: '不是本人审核'
			}],
			currentItem: {
				id: '33'
			},
			currentItem2: {
				id: '33'
			},
			currentItem3: { id: '33'},
			currentItem4: { id: '33'},
			dialogDetail: false,
			dialogFormVisible: false,
			options: [{
				value: 'quanbu',
				label: '全部需求',
				children: [{
					value: 'axure',
					label: 'Axure Components'
				}, {
					value: 'sketch',
					label: 'Sketch Templates'
				}, {
					value: 'jiaohu',
					label: '组件交互文档'
				}]
			}, {
				value: 'yiliao',
				label: '医疗需求',
				children: [{
					value: 'axure',
					label: 'Axure Components'
				}, {
					value: 'sketch',
					label: 'Sketch Templates'
				}, {
					value: 'jiaohu',
					label: '组件交互文档'
				}]
			}],
			selectedOptions: [],
			user_level: null,
			aiList: null,
			totalAi: null,
			tips: "提醒一下",
			result:[],
			imgUploadArg: {}
		}
	},
	created() {
		this.getList()
	},
	methods: {
		linkageChange(n) {
      this.listQuery.pId = n[0].id
      this.listQuery.cId = n[1].id
      this.listQuery.xId = n[2].id
      this.listQuery.vId = n[3].id
      this.listQuery.hId = n[4].id
    },
		getCookie(name) {
			name = name + "="
			var start = document.cookie.indexOf(name),
				value = null;
			if(start > -1) {
				var end = document.cookie.indexOf(";", start);
				if(end == -1) {
					end = document.cookie.length;
				}
				value = document.cookie.substring(start + name.length, end);
			}
			return value;
		},
		getList() {
			this.listLoading = true
			console.log('ddddddddd')
			this.listQuery.token = this.getCookie("Admin-Token")
			this.$http.post('/hts/management/myDemends', this.listQuery).then(response => {
				console.log(response)
				this.list = response.list
				this.total = parseInt(response.total)
				this.listLoading = false
			})
		},
		getListCha() {
			this.listLoading = true
			console.log('我管理的需求查询功能')
			this.listQuery.token = this.getCookie("Admin-Token")
			console.log(this.listQuery)
			this.$http.post('/hts/management/myDemends', this.listQuery).then(response => {
				console.log(response)
				this.list = response.list
				this.total = parseInt(response.total)
				this.listLoading = false
			})
		},
		handleFilter() {
			this.listQuery.page = 1
			console.log(this.listQuery.isPoor)
			console.log(9999999)
			this.getListCha()
		},
		handleSizeChange(val) {
			this.listQuery.pageSize = val
			console.log(val)
			this.getList()
		},
		handleCurrentChange(val) {
			this.listQuery.page = val
			this.getList()
		},
		change(val) {
			this.$http.post('hts/help/dynamic', {
				demand_code: this.currentItem.id,
				dynamic_type: 2,
				page: val
			}).then(response => {
				console.log(response)
				this.totalAi = parseInt(response.totals)
				this.aiList = response.vos
				console.log("我是另一页")
			})
		},
	handerCliclAi() {
		console.log("发布爱心动态")
		 this.dialogAiVisible = true
	},
  httpRequest(e) {
		var file = e.file;
		var _this = this;
		if(!/image\/\w+/.test(file.type)) {
			alert('请确保文件为图像类型');
			return false;
		}
		if(file.size > 2 * 1024 * 1024) {
			alert('上传图片不能超过2M');
			return false;
		}
		var reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = function(e) {
			var result = this.result;
			var image = new Image();
			var rate = 1;
			if(file.size >= 200 && file.size <= 500) {
				rate = 0.7;
			} else if(file.size > 500 && file.size <= 1024) {
				rate = 0.5;
			} else if(file.size > 1024) {
				rate = 0.3
			}
			var canvas = document.createElement("canvas");
			var ctx = canvas.getContext('2d');
			image.src = result;
			image.onload = function() {
				var w = image.naturalWidth,
					h = image.naturalHeight;
				canvas.width = w;
				canvas.height = h;
				ctx.drawImage(image, 0, 0, w, h, 0, 0, w, h);
				var data = canvas.toDataURL("image/jpeg", rate);
				console.log("push数组,但是push的string")
				_this.fileList2.push(data)
				console.log(_this.fileList2)
				this.imgUploadArg = {}
				this.imgUploadArg = _this.fileList2.join('-')
				console.log(this.imgUploadArg)
				_this.$http.post('/hts/bfFilesUpload', {
						imgStr: this.imgUploadArg
					})
					.then(response => {
						console.log(response)
						_this.fileList = []
					})
				
			}
		}
	},
	tupianshangchuan() {
		console.log(9990000999)
		console.log(this.comMent)
		if(this.comMent == null){
			this.$message({
				showClose: true,
				message: '最少输入5个字，最多输入100个字',
				type: 'warning'
			})	
		}else if(this.comMent.length >= 5 && this.comMent.length < 100){
			this.$refs.upload.submit()
			this.$http.post('/hts/management/addDynamic', {
				token: this.getCookie("Admin-Token"),
				demandId: this.currentItem.id,
				comment: this.comMent
			}).then(response => {
				this.$message({
					showClose: true,
					message: '发布爱心动态成功',
					type: 'success'
				})
				this.$http.post('/hts/help/dynamic', {
					demand_code: this.currentItem.id,
					dynamic_type: 2
				}).then(response => {
					console.log(response)
					this.totalAi = parseInt(response.totals)
					this.aiList = response.vos
					console.log("我是爱心动态")
				})
				this.comMent = null
				this.dialogAiVisible = false
				this.dialogDetail = false
			})
		}else{
			this.$message({
				showClose: true,
				message: '最少输入5个字，最多输入100个字',
				type: 'warning'
			})
		}
		
	},
	handleCreate() {
		this.resetTemp()
		this.dialogStatus ='create'
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate()
			})
		},
		handleClose() {
			this.$http.post('/hts/management/workbench', {
				token: this.getCookie("Admin-Token")
			}).then(response => {
				console.log("我是管理员等级")
				this.user_level = response.user_level
			})
			this.$http.post('/hts/myDemand/detail', {
				token: this.getCookie("Admin-Token"),
				demandId: this.currentItem.id
			}).then(response => {
				this.currentItem = response
				console.log(this.currentItem.demand_use)
				console.log("我是关闭需求前提")
			})
			console.log(this.currentItem.id)
			if(this.currentItem.help_type_code == '3' && this.user_level >= 3 && this.currentItem.moneycount == 0 ) {
				this.$http.post('/hts/management/demandClose', {
					token: this.getCookie("Admin-Token"),
					demandId: this.currentItem.id
				}).then(response => {
					console.log("我是关闭需求成功")
					this.$message({
						showClose: true,
						message: '关闭成功',
						type: 'success'
					})
				})
					
			} else {
				this.$message({
					showClose: true,
					message: '已有捐款不能关闭需求或者您没有权限',
					type: 'error'
				})
			}
		},
		handleTips() {
			this.$http.post('/hts/management/msgRemind', {
				token: this.getCookie("Admin-Token"),
				demandId: this.currentItem.id
			}).then(response => {
				this.$message({
					showClose: true,
					message: '提醒成功',
					type: 'success',
					duration: 2000
				})
        console.log("本周已提醒")
			})
		},
		handleSelectionChange(val) {
			console.log(JSON.stringify(val))
			console.log(val)
			this.currentItem = val
			console.log(this.currentItem)
			console.log(val.relate_pics)
			if(val.relate_pics == ''){
				this.relate_pics = []
			}else{
				this.relate_pics = val.relate_pics.split(',')
				console.log(this.relate_pics)
			}
			
			
		},
		handleDetial(val) {
			console.log(val.id)
			this.$http.post('/hts/myDemand/detail', {
				token: this.getCookie("Admin-Token"),
				demandId: val.id
			}).then(response => {
				this.currentItem = response
				console.log("我是详情啊啊啊啊啊凄凄切切群")
				console.log(this.currentItem)
			})
			this.$http.post('/hts/help/getDemandProof', {
				token: this.getCookie("Admin-Token"),
				demand_id: val.id
			}).then(response => {
				this.currentItem3 = response
				console.log(this.currentItem3)
				console.log("我是需求证明")
			})
			this.$http.post('/hts/help/helpRecord', {
				token: this.getCookie("Admin-Token"),
				demand_code: val.id
			}).then(response => {
				this.currentItem4 = response
				console.log(this.currentItem4)
				console.log("我是帮扶记录")
			})
			this.$http.post('/hts/management/logs', {
				token: this.getCookie("Admin-Token"),
				demandId: val.id
			}).then(response => {
				this.currentItem2 = response
				console.log("我是日志")
			})
			this.$http.post('/hts/help/dynamic', {
				demand_code: val.id,
				dynamic_type: 2
			}).then(response => {
				console.log(response)
				this.totalAi = parseInt(response.totals)
				this.aiList = response.vos
				console.log("我是爱心动态")
			})
      this.dialogDetail = true
		},
		handleCreate() {
			console.log(JSON.stringify(this.list))
			this.dialogFormVisible = true
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate()
			})
		},
		updateData(dataForm) {
			this.$refs['dataForm'].validate((valid) => {
				if(valid) {
					this.$http.post("hts/myDemand/updateDemand", {
						demandId: this.currentItem.demand_types,
						demand_title: this.currentItem.demand_title,
						help_type_code: this.currentItem.help_type_code,
						demand_coment: this.currentItem.demand_coment,
						target_amount: this.currentItem.target_amount,
						demand_types: this.currentItem.demand_types,
						img: this.currentItem.img_url,
						demand_use: this.currentItem.demand_use,
						demand_use_money: this.currentItem.demand_use_money,
						user_addr_id: this.currentItem.user_addr_id
					}).then(response => {
						console.log(response)
						this.dialogFormVisible = false
						this.$notify({
							title: '成功',
							message: '更新成功',
							type: 'success',
							duration: 2000
						})
					})
				}
			})
		},
		handleChange() {
			console.log(this.selectedOptions)
		}
		
	}
}</script>
<style scoped>.label {
	width: 140px;
	display: inline-block;
	margin: 6px
}

.checkDialog>>>.el-dialog__body {
	padding-top: 0px
}
.filter-container .filter-item{
      margin-bottom: 0;
  }
.filter-container span{
      line-height: 50px;
      font-size: 14px;
}
.center {
	text-align: center
}

.img_span {
	width: 100%;
	float: left;
}

.img_span .imgs {
	display: block;
	width: 100%;
	height: 250px;
}
.pd{
	padding:10px 0px 10px 0px
}
.wh{
	width:100%
}
.tx{
	text-align:center
}
.h4{
	height:400px;overflow-x: hidden;overflow-y: scroll;line-height: 30px;text-align: center;display: none;
}
.el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
    height: 300px;
  }
.el-carousel__item h3 img{
	  display: inline-block;
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
