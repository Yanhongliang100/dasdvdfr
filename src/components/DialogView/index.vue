<template lang="html">
    <div class="">
        <el-dialog
          title="新增收货地址"
          :visible.sync="dialogVisible"
          width="1034px"
          :before-close="handleClose">
          <el-form ref="dataForm" :model="currentItem" label-position="left" label-width="100px" style=" margin-left:30px;" :rules="rules">
            <el-form-item label="联系人" prop="linkman">
              <el-input v-model="currentItem.linkman"   style="width:200px"/>
            </el-form-item>
            <el-form-item label="联系电话" prop="link_tel" >
              <el-input v-model.number="currentItem.link_tel"  style="width:200px"/>
            </el-form-item>
            <el-form-item label="邮编" prop="postcode">
              <el-input v-model.number="currentItem.postcode"  type="text" style="width:200px"/>
            </el-form-item>
            <el-form-item label="所在区域" prop="type">
              <linkage :level="level" :level_list="level_list" @change="linkageChange" :province_region_id="allid.province_region_id" :city_region_id="allid.city_region_id" :county_region_id="allid.county_region_id" :village_region_id="allid.village_region_id" :hamlet_region_id="allid.hamlet_region_id" />
            </el-form-item>
            <el-form-item label="详细地址" prop="detail_addr">
                <el-input v-model="currentItem.detail_addr"  type="textarea" :autosize="{ minRows: 4, maxRows: 10}" style="width:500px"/>
            </el-form-item>
            <el-form-item label="设为默认地址" prop="type">
              <el-radio-group v-model="currentItem.is_default">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="end">取 消</el-button>
            <el-button type="primary" @click="sub">保 存</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import linkage from '@/components/linkage'
export default {
    components:{
        linkage
    },
    props:['dialogVisible','id','data'],
    data(){
        return {
            level_list: [],
            level: 1,
            currentItem:{},
            allid:{
                province_region_id:'',
                city_region_id:'',
                county_region_id:'',
                village_region_id:"",
                hamlet_region_id:"",
                region_name:''
            },
            rules: {
                linkman:[
                    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
                    { min: 2, max: 6, message: '长度在2至6个字段', trigger: 'blur' },
                ],
                link_tel: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    {
                        validator: function (rule, value, callback) {
                          var MobileRegex = /^1[0-9]{10}$/;
                          if (!MobileRegex.test(value)) {
                                  callback(new Error('手机号码格式不正确！'))
                          } else {
                                  callback();
                          }
                     },
                     trigger: 'blur'
                   }
                ],
                detail_addr:[
                    { required: true, message: '请输入详细地址', trigger: 'blur' },
                    { min: 2, max: 30, message: '长度在2至30个字段', trigger: 'blur' },
                ],
                postcode: [
                    // { type:'number',message:'请输入纯数字'},
                    // { minlength: 1, maxlength: 6, message: '长度在 6个数字' }
                    // { min: 3, max: 6, message: '长度在 6个数字' },
                    { validator: function (rule, value, callback) {
                        var MobileRegex = /^[0-9]{6}$/;
                          if (!MobileRegex.test(value)) {
                                  callback(new Error('请输入6位纯数字邮政编码'))
                          } else {
                                  callback();
                          }
                     }, trigger: 'blur'
                   }
                ],
            }
        }
    },
    watch:{
      dialogVisible(n){
        if(n){
          this.init()
        }
      }
    },
    methods: {
        init(){
          if(this.data){
            this.currentItem=this.data;
            this.allid.province_region_id=this.data.province_region_id
            this.allid.city_region_id=this.data.city_region_id
            this.allid.county_region_id=this.data.county_region_id
            this.allid.village_region_id=this.data.village_region_id
            this.allid.hamlet_region_id=this.data.hamlet_region_id
          }else{
            this.allid.province_region_id=''
            this.allid.city_region_id=''
            this.allid.county_region_id=''
            this.allid.village_region_id=''
            this.allid.hamlet_region_id=''
          }
        },
        sub(){
            this.$refs['dataForm'].validate((valid) => {
              if (valid) {
                  
                  if(this.data){//修改
                      let data={
                        id:this.id,
                        linkman:this.currentItem.linkman,
                        linkTel:this.currentItem.link_tel,
                        detailAddr:this.currentItem.detail_addr,
                        isDefault:this.currentItem.is_default,
                        postcode:this.currentItem.postcode,
                      }
                      Object.assign(data,this.allid)
                      this.$http.post('/hts/poor/addressEdit',data).then(res => {
                          this.$message({
                            type: 'success',
                            message: '成功 '
                          });
                          this.$emit('Preservation')
                          this.end()
                      })
                  }else{//新增
                      let data={
                        userId:this.id,
                        linkman:this.currentItem.linkman,
                        linkTel:this.currentItem.link_tel,
                        detailAddr:this.currentItem.detail_addr,
                        isDefault:this.currentItem.is_default,
                        postcode:this.currentItem.postcode,
                      }
                      Object.assign(data,this.allid)
                      this.$http.post('/hts/poor/addressSave',data).then(res => {
                          this.$message({
                            type: 'success',
                            message: '成功 '
                          });
                          this.$emit('Preservation')
                          this.end()
                      })
                  }
              } else {
                console.log('error submit!!');
                return false;
              }
            });
        },
        linkageChange(n){
            // console.log(n);
            this.allid.province_region_id=n[0].id
            this.allid.city_region_id=n[1].id
            this.allid.county_region_id=n[2].id
            this.allid.village_region_id=n[3].id
            this.allid.hamlet_region_id=n[4].id
            this.allid.region_name=''
            for(let i=0;i<n.length;i++){
                this.allid.region_name+=n[i].regionName+' '
            }
        },
        end(){
            this.currentItem={}
            this.$emit('update:dialogVisible', false);
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
              .then(_ => {
                  this.end()
                // done();
              })
              .catch(_ => {});
        }
    }
}
</script>

<style lang="scss">

</style>
