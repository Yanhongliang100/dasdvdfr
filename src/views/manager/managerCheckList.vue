<template>
  <div class="app-container">
    <div class="conheader clearfix" align="right">
      <h3>{{$route.meta.title}}</h3>
    </div>
    <div class="filter-container">
      <span>类型：</span>
      <el-select v-model="listQuery.level" clearable style="width: 160px" class="filter-item" placeholder="管理员级别">
        <el-option v-for="item in levelOptions" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
      <span>姓名：</span>
      <el-input v-model="listQuery.name" style="width: 160px;" class="filter-item" placeholder="姓名"/>
      <span>手机：</span>
      <el-input v-model="listQuery.mobile" style="width: 160px;" class="filter-item" placeholder="手机号"/>
      <span>身份证 :</span>
      <el-input v-model="listQuery.id" style="width: 190px;" class="filter-item" placeholder="身份证"/>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getList">查询</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      fit
      highlight-current-row
      style="width: 100%;min-height:400px;"
      height="400"
      @current-change="">
      <el-table-column align="center" label="序号" type="index" width="45" prop="id"/>
      <el-table-column min-width="10" label="姓名" prop="realname"/>
      <el-table-column :formatter="levelFn" width="70" align="center" label="申请级别"/>
      <el-table-column width="100" align="center" label="手机号" prop="mobile"/>
      <el-table-column width="170" align="center" label="身份证号" prop="idcard"/>
      <el-table-column min-width="50" align="center" label="负责区域" prop="region_name"/>
      <el-table-column width="170" align="center" label="申请日期" prop="apply_date"/>
      <el-table-column width="160" align="center" label="操作" prop="aideder_name">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="examine(scope.row.id,1)">通过</el-button>
          <el-button size="mini" type="primary" @click="examine(scope.row.id,2)">不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination :current-page="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" :total="total" background layout="total,  prev, pager, next, jumper" @current-change="pagefn"/>
    </div>
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

  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        level: undefined,
        name: undefined,
        mobile: undefined,
        id: undefined
      },
      activeName: 'first',
      levelOptions: [{ id: '1', name: '乡级管理员' }, { id: '0', name: '村级管理员' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      currentItem: { id: '33' },
      dialogFormVisible: false,
      dialogDetail: false,
      relate_pics: [],
      dialogStatus: '',
      dialogPvVisible: false,
      pvData: [],
      tableKey:0,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    console.log(this.levelOptions)
  },
  methods: {
      examine(id,status){
          let data={
              id,
              status,
          }
        if(status==2){
            this.$prompt('请输入不通过原因', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(({ value }) => {
              data.check_opinion=value
              this.approve(data)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '取消输入'
              });
            });
        }else{
            this.approve(data)
        }

    },
      approve(data){
          this.$http.post('/hts/management/approve',data).then(res => {
              this.$message({
                type: 'success',
                message: '成功 '
              });
          })
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
    pagefn(index) {
      this.listQuery.page = index
      this.getList()
  },
    getList() {
      this.listLoading = true
      this.$http.post('/hts/management/isCheck', this.listQuery).then(res => {
        this.list = res.list
        this.total = parseInt(res.total)
        this.listLoading = false
      })
    }
  }
}
</script>
<style scoped>
  .label {width:140px;display:inline-block;margin:6px}
  .checkDialog >>> .el-dialog__body{padding-top:0px }
  .filter-container .filter-item{
      margin-bottom: 0;
  }
  .filter-container span{
      line-height: 50px;
      font-size: 14px;
  }
</style>
