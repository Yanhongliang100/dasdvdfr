<template>
  <div class="app-container">
    <div class="conheader clearfix" align="right">
      <h3>{{$route.meta.title}}</h3>
    </div>
    <!-- <div align="right" style="margin-bottom:5px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-star-on" >详情和审核</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" >编辑</el-button>
    </div> -->
    <div class="filter-container">
      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类型：</span>
      <el-select v-model="listQuery.level" clearable style="width: 160px" class="filter-item" placeholder="管理员级别">
        <el-option v-for="item in levelOptions" :key="'asd'+item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <span>姓名：</span>
      <el-input v-model="listQuery.name" style="width: 160px;" class="filter-item" placeholder="姓名"/>
      <span>手机：</span>
      <el-input v-model="listQuery.mobile" style="width: 160px;" class="filter-item" placeholder="手机号"/>
      <span>身份证：</span>
      <el-input v-model="listQuery.idcard" style="width: 190px;" class="filter-item" placeholder="身份证"/>
        </br>
      <span>管理区域：</span>
      <linkage :level="level" :level_list="level_list" @change="linkageChange"/>
      <el-button v-waves class="" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      ref="table"
      :key="tableKey"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;min-height:400px;"
      height="auto"
      @row-click="open"
      @current-change="">
      <el-table-column type="expand" label="负责区域">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="负责区域 :">
              <span v-for="item in props.row.region" :key="'id'+item.id">{{ item.region_name }}</br></span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column min-width="50" label="ID" prop="id"/>
      <el-table-column width="70" align="center" label="姓名" prop="realname"/>
      <el-table-column width="100" align="center" label="手机号" prop="mobile"/>
      <el-table-column min-width="50" align="center" label="身份证号" prop="idcard"/>
      <el-table-column :formatter="levelFn" width="70" align="center" label="级别"/>
      <el-table-column :show-overflow-tooltip="true" width="150" align="center" label="开通时间" prop="register_date"/>
      <el-table-column :formatter="statusFn" min-width="70" align="center" label="状态"/>
      <el-table-column width="150" align="center" label="操作" prop="aideder_name">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click.stop="edit(scope.row.id)">编辑</el-button>
          <el-button size="mini" type="primary" @click.stop="statussSwitch(scope.row.id,scope.row.user_status)">{{scope.row.user_status==1?'冻结':'启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total,  prev, pager, next, jumper" @current-change="pagefn"/>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" title="扶贫干部详情及修改" >
      <el-form ref="dataForm" :model="currentItem" label-position="left" label-width="100px" style=" margin-left:30px;">
        <el-form-item label="id" prop="type">
          <el-input v-model="currentItem.id" :readonly="true" type="text" style="width:200px"/>
        </el-form-item>
        <el-form-item label="姓名" prop="type">
          <el-input v-model="currentItem.realname" readonly type="text" style="width:200px"/>
        </el-form-item>
        <el-form-item label="身份证号码" prop="type">
          <el-input v-model="currentItem.idcard" :readonly="true" type="text" style="width:200px"/>
        </el-form-item>
        <el-form-item label="手机号码" prop="type">
          <el-input v-model="currentItem.mobile" :readonly="true" type="text" style="width:200px"/>
        </el-form-item>
        <el-form-item label="注册时间" prop="type">
          <el-input v-model="currentItem.register_time" :readonly="true" type="text" style="width:200px"/>
        </el-form-item>
        <el-form-item label="级别" prop="type">
          <el-select v-model="currentItem.user_level">
              <el-option v-for="item in levelOptions" :key="'asds'+item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="type">
          <el-radio-group v-model="currentItem.user_status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">冻结</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="负责区域" prop="type">
          <div class="" v-for="(item,index) in currentItem.manageRegions" :key="item.id">
              <linkage :readonly="item.readonly"
                       :index="index"
                       :level="level"
                       :level_list="level_list"
                       @change="detailchange"
                       :province_region_id="item.province_region_id"
                       :city_region_id="item.city_region_id"
                       :county_region_id="item.county_region_id"
                       :village_region_id="item.village_region_id"
                       :hamlet_region_id="item.hamlet_region_id" />
              <template v-if="item.id">
                  <el-button type="primary" icon="el-icon-edit-outline"  @click="update(index)">{{item.readonly?'修改':'确定'}}</el-button>
                  <el-button type="danger" icon="el-icon-error"  @click="deletes(index)">删除</el-button>
              </template>
              <el-button v-else type="success" icon="el-icon-circle-plus"  @click="successadd(index)">添加</el-button>
          </div>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="add">追加管理员区域</el-button>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="end">关闭</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="">确定</el-button>
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
import linkage from '@/components/linkage'

export default {
  name: 'DemandCheckList',
  components: {
    linkage
  },
  directives: {
    waves
  },
  data() {
    return {
      level_list: JSON.parse(localStorage.leaderarrs),
      level: localStorage.leaderLevel,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        province_region_id: '',
        city_region_id: '',
        county_region_id: '',
        village_region_id: '',
        hamlet_region_id: '',
        page: 1,
        limit: 10,
        level: undefined,
        name: undefined,
        mobile: undefined,
        id: undefined
      },
      activeName: 'first',
      levelOptions: [{ id: 5, name: '村级管理员' }, { id: 4, name: '乡级管理员' }, { id: 3, name: '县级管理员' }, { id: 2, name: '市级管理员' },{ id: 1, name: '省级管理员' }],
      currentItem: { id: '33' },
      dialogFormVisible: false,
      dialogDetail: false,
      relate_pics: [],
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
    }
  },
  computed:{
      user_level(){
          return this.currentItem.user_level
      },
      user_status(){
          return this.currentItem.user_status
      }
  },
  watch:{
      user_level(n,v){
          if(n === '' || v === undefined || n === undefined){
              return
          }
          this.modify()
      },
      user_status(n,v){
          if(n === '' || v === undefined || n === undefined){
              return
          }
          this.modify()
      }
  },
  created() {
    this.getList()
  },
  methods: {
    statussSwitch(id,s){
        let status=s
        if(status==1){
            status=0
        }else{
            status=1
        }
        let data={
            userId:id,
            user_status:status
        }
        this.$http.post('/hts/management/editOffice',data ).then(res => {
            this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
            });
            this.getList()
        })
    },
    end(){
        this.dialogFormVisible=false;
        this.getList()
    },
    modify(){
        let data={
            userId:this.currentItem.id,
            user_level:this.currentItem.user_level,
            user_status:this.currentItem.user_status
        }
        this.$http.post('/hts/management/editOffice',data ).then(res => {
            this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success'
            });
        })
    },
    update(i){
      if(!this.currentItem.manageRegions[i].readonly){
          //点击确认修改
          this.$http.post('/hts/management/editManageRegion', this.currentItem.manageRegions[i]).then(res => {
              this.currentItem.manageRegions[i].readonly=!this.currentItem.manageRegions[i].readonly;
              this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success'
                });
          })
      }else{
          this.currentItem.manageRegions[i].readonly=!this.currentItem.manageRegions[i].readonly
      }
    },
    deletes(i){
      this.$http.post('/hts/management/delManageRegion', {
          regionId:this.currentItem.manageRegions[i].id
      }).then(res => {
          this.currentItem.manageRegions.splice(i,1)
          this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            });
      })
    },
    successadd(i){
        this.$http.post('/hts/management/addManageRegion', this.currentItem.manageRegions[i]).then(res => {
            this.$set(this.currentItem.manageRegions[i],'id', res)
            this.$set(this.currentItem.manageRegions[i],'readonly', true)
            this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success'
              });
        })
  },
    add(){ //追加区域
        let data={}
        this.currentItem.manageRegions.push(data)
    },
    edit(id){ //编辑
        this.getManageDetal(id)
    },
    getManageDetal(id){
        this.currentItem={}
        this.dialogFormVisible=true;
        this.$http.post('/hts/management/detail', {
            userId:id
        }).then(res => {
            this.currentItem=res
            for(let i=0;i<this.currentItem.manageRegions.length;i++){
                this.$set(this.currentItem.manageRegions[i],'readonly', true)
            }
        }).catch(res=>{

        })
    },
    detailchange(n,i){
        let str=''
        for(let i=0;i<n.length;i++){
             str+=n[i].regionName+' '
        }
        let data={
            region_name:str,
            user_id:this.currentItem.id,
            province_region_id : n[0].id,
            city_region_id : n[1].id,
            county_region_id : n[2].id,
            village_region_id : n[3].id,
            hamlet_region_id : n[4].id
        }
        Object.assign(this.currentItem.manageRegions[i],data)
    },
    linkageChange(n) {
      this.listQuery.province_region_id = n[0].id
      this.listQuery.city_region_id = n[1].id
      this.listQuery.county_region_id = n[2].id
      this.listQuery.village_region_id = n[3].id
      this.listQuery.hamlet_region_id = n[4].id
    },
    status(num) {
      if (num == 1) {
        return '正常'
      } else {
        return '冻结'
      }
    },
    levelFn(n) {
      switch (n.user_level) {
        case 1:
          return '省级'
        case 2:
          return '市级'
        case 3:
          return '县级'
        case 4:
          return '乡级'
        case 5:
          return '村级'
      }
    },
    statusFn(s){
        return s.user_status==1?'正常':'冻结'
    },
    open(q) {
      this.$refs.table.toggleRowExpansion(q)
    },
    getList() {
      this.listLoading = true
      this.$http.post('/hts/management/group', this.listQuery).then(res => {
        this.list = res.list
        this.total = parseInt(res.totals)
        this.listLoading = false
      })
    },
    pagefn(index) {
      this.listQuery.page = index
      this.getList()
    }

  }
}
</script>
<style scoped>
  .label {width:140px;display:inline-block;margin:6px}
  .checkDialog >>> .el-dialog__body{padding-top:0px }
  .filter-container span{
      line-height: 50px;
      font-size: 14px;
  }
  .filter-container .filter-item{
      margin-bottom: 0;

  }
  .el-dialog__wrapper >>> .el-dialog{
      width: 1190px;
  }
</style>
