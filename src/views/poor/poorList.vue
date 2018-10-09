<template>
  <div class="app-container">
    <div class="conheader clearfix" align="right">
      <h3>{{$route.meta.title}}</h3>
    </div>
    <div class="filter-container">
      <el-form :model="listQuery">
        <el-form-item>
          <span class="inputTip">用户类型:</span>
          <el-select v-model="listQuery.level" clearable style="width: 160px" class="filter-item" placeholder="用户类型" >
            <el-option v-for="item in relations" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span class="inputTip">姓名:</span>
          <el-input v-model="listQuery.name" label="姓名" style="width: 160px;" class="filter-item gapStyle" placeholder="姓名"/>
          <span class="inputTip">手机号码:</span>
          <el-input v-model="listQuery.mobile" label="手机号码" style="width: 160px;" class="filter-item gapStyle" placeholder="手机号码"/>
          <span class="inputTip">身份证号:</span>
          <el-input v-model="listQuery.idcard" label="身份证号" style="width: 160px;" class="filter-item gapStyle" placeholder="身份证号"/>
        </el-form-item>
        <el-form-item>
          <span class="inputTip">所在区域:</span>
          <linkage :level="level" :level_list="level_list" @change="linkageChange"/>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table v-loading="listLoading" :key="tableKey" :data="list" border highlight-current-row>
      <!-- <el-table-column :index="indexMethod" align="center" label="序号" type="index" width="65"/> -->
      <el-table-column align="center" label="序号" type="index"/>
      <el-table-column align="center" label="id" prop="id"/>
      <el-table-column align="center" label="姓名" prop="aided_person_name"/>
      <el-table-column align="center" label="手机号码" prop="aided_person_tel"/>
      <el-table-column align="center" label="身份证号" prop="idcard"/>
      <el-table-column align="center" label="用户类型" prop="userType"/>
      <el-table-column align="center" label="发起人" prop="userType"/>
      <el-table-column align="center" label="所在区域" prop="region_name"/>
      <el-table-column align="center" label="操作" min-width="160px" >
        <template slot-scope="scope">
          <el-button size="mini" type="text">查看需求</el-button>
          <el-button size="mini" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination v-if="total>0" :current-page="listQuery.page" :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="timestamp">
          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date"/>
        </el-form-item>
        <el-form-item prop="title">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item >
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;"/>
        </el-form-item>
        <el-form-item>
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="Please input"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">11</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">11</el-button>
        <el-button v-else type="primary" @click="updateData">11</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">11</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import linkage from '@/components/linkage'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'PoorList',
  directives: {
    waves
  },
  components:{linkage},
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
      level_list: this.$store.state.user.leaderarrs,
      level: this.$store.state.user.leaderLevel,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: true,
      detailEdit: false,
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
        id: undefined,
        idcard: undefined
      },
      relations: [],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.$http.post('hts/poor/search', this.listQuery).then(response => {
        // console.log('查询列表',response)
        this.list = response.list
        this.total = parseInt(response.total)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      }).catch(function(error) {
        console.log('出错' + error.message)
        console.log(error)
      })
    },
    linkageChange(n) {
      this.listQuery.province_region_id = n[0].id
      this.listQuery.city_region_id = n[1].id
      this.listQuery.county_region_id = n[2].id
      this.listQuery.village_region_id = n[3].id
      this.listQuery.hamlet_region_id = n[4].id
    },
    handleFilter() {
      // 查询触发
      this.listQuery.page = 1
      this.getList()
    },
    handleSizeChange(val) {
      // 每页条数改变触发
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      // 当前页数改变触发
      this.listQuery.page = val
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
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
    }
  }
}
</script>
<style scoped>
  .filter-container .filter-item{margin-bottom: 0}
  .gapStyle{margin: 0 7px 0 0;}
  .inputTip{display: inline-block;width:80px;margin-right: 7px;font-size:14px;color:#606266;text-align: right;font-weight: 500;}
</style>
