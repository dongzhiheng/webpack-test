<template>
  <div class="v-container">
    <navbar></navbar>
    <div class="job-box">
      <div class="job-company">
        <div v-if="identity==1">
          <p>
            <i class="icon-overlapping"></i>委托</p>
          <ul class="depute">
            <li v-bind:class="{active:index==wtSwitch}" v-for="(company,index) in companyList" v-on:click="getThisPositions(company,1,index,'entrust')">
              <small class="square"></small>
              <span v-text="company.tob_company_name"></span>
              <!--<label class="tipnum" v-text="company.position_count"></label>-->
            </li>
            <li v-show="companyList.length==0" :style="{color:'#999'}">暂无委托公司</li>
          </ul>
        </div>
        <div v-else="">
          <p>
            <i class="icon-overlapping"></i>本地
            <i v-show="selfCompanyList.length != 0" @click="openPost(selfCompany)" class="icon-add"></i>
          </p>
          <ul class="local">
            <li v-bind:class="{active:index==bdSwitch}" v-for="(selfCompany,index) in selfCompanyList" v-on:click="getThisPositions(selfCompany,0,index,'local')">
              <small class="square"></small>
              <span v-text="selfCompany.company_name"></span>
            </li>
          </ul>
          <div @click="openPost()" class="create-position-btn" v-show="selfCompanyList.length == 0">+ 发布职位</div>
        </div>
      </div>
      <div class="job-inner">
        <div class="statusTab" v-if="identity==1">
          <span v-bind:class="{active:currentStatus==1}" v-on:click="changePositionStatus(company,1,'entrust')">进行中(<label v-text="normalTotal"></label>)</span>
          <span v-bind:class="{active:currentStatus==0}" v-on:click="changePositionStatus(company,0,'entrust')">已关闭(<label v-text="closeTotal"></label>)</span>
        </div>
        <div class="statusTab" v-else="">
          <span v-bind:class="{active:selfCurrentStatus==0}" v-on:click="changePositionStatus(selfCompany,0,'local')">进行中(<label v-text="selfNormalTotal"></label>)</span>
          <span v-bind:class="{active:selfCurrentStatus==4}" v-on:click="changePositionStatus(selfCompany,4,'local')">已关闭(<label v-text="selfCloseTotal"></label>)</span>
        </div>
        <ul class="job-list" v-show="!isloading" v-if="identity==1">
          <li v-for="(position,index) in positionList">
            <div class="job-info">
              <div v-show="currentStatus==1">
                <span class="job-status dai" v-if="position.resume_ing==0">待推</span>
                <span class="job-status jinxing" v-else="">进行</span>
              </div>
              <div v-show="currentStatus==0">
                <span class="job-status closed" v-if="position.operater==1">关闭</span>
                <span class="job-status gameover" v-else="">结束</span>
              </div>
              <div>
                <div class="job-type">
                  <!--<router-link :to="{ name: 'positionView', params: { id: position.id }}">-->
                    <strong @click="openView(position.id,company.tob_parent_id,wtSwitch)" v-text="position.name"></strong>
                  <!--</router-link>-->
                  <label v-show="currentStatus==1">
                    <el-dropdown trigger="click" @command="openDialog(position.id,position.name,'trust')">
                      <span class="el-dropdown-link">
                        <i class="icon-more"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                          <el-button type="text">关闭职位</el-button>
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </label>
                  <!--<router-link :to="{ name: 'archivesUploadPid', params: { pid: position.id }}">-->
                    <i class="icon-send" v-show="currentStatus==1" @click="recommendDialog(position.id,company)">推荐</i>
                  <!--</router-link>-->
                  <label v-show="currentStatus==0">
                    <i class="icon-open" @click="openDialog(position.id,position.name,'openEntrust')" v-show="position.operater==1">开启职位</i>
                    <el-dialog title="提示" v-model="dialogOe" size="tiny" class="close-dialog">
                      <span>确定开启{{thisOePosition.name}}职位？</span>
                      <span slot="footer" class="dialog-footer">
                        <span @click="dialogOe = false" class="cd-button">取 消</span>
                        <span type="primary" @click="openPosition(thisOePosition.id,'openEntrust')" class="cd-button cd-button-primary">确 定</span>
                      </span>
                    </el-dialog>
                  </label>
                </div>
                <div class="job-detail">
                  <i class="icon-person" v-show="position.number"></i>
                  <span v-show="position.number">招聘<label v-text="position.number"></label>人</span>
                  <i class="icon-tag" v-show="position.bumen"></i>
                  <span v-text="position.bumen"></span>
                  <i class="icon-location" v-show="position.city"></i>
                  <span v-text="position.city"></span>
                  <i class="icon-clock" v-show="position.created_at"></i>
                  <span v-show="position.created_at">
                    <label v-text="position.created_at"></label>发布</span>
                </div>
              </div>
            </div>
            <div class="recommend-state">
              <label>
                <strong>已推荐
                  <span v-text="position.resume_ing"></span>人</strong>
              </label>
              <label>已Offer
                <span v-text="position.resume_success"></span>人</label>
              <label>未录取
                <span v-text="position.resume_fail"></span>人</label>
            </div>
          </li>
        </ul>
        <ul class="job-list local" v-show="!isloading" v-else="">
          <li v-for="(position,index) in selfPositionList">
            <div class="job-info">
              <div class="job-type">
                <!--<router-link :to="{ name: 'positionView', params: { id: position.id }}">-->
                  <strong @click="openView(position.id)" v-text="position.name"></strong>
                <!--</router-link>-->
              </div>
              <div class="job-more">
                <div class="btn-group" v-show="selfCurrentStatus == 0">
                  <!--<router-link :to="{ name: 'positionView', params: { id: position.id }}">-->
                  <span @click="openView(position.id)" class="btn btn-border">匹配(<span>{{position.talent_recommend_count | recommendCount}}</span>)</span>
                  <!--</router-link>-->
                  <el-dropdown trigger="click" @command="openDialog(position.id,position.name,'local')">
                    <span class="el-dropdown-link">
                      <i class="icon-more"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <el-button type="text">关闭职位</el-button>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-dialog title="提示" v-model="dialogCl" size="tiny" class="close-dialog">
                    <span>确定关闭{{thisSelfPosition.name}}职位？</span>
                    <span slot="footer" class="dialog-footer">
                      <span @click="dialogCl = false" class="cd-button">取 消</span>
                      <span type="primary" @click="closePosition(thisSelfPosition.id,'local')" class="cd-button cd-button-primary">确 定</span>
                    </span>
                  </el-dialog>
                </div>
                <div class="btn-group" v-show="selfCurrentStatus == 4">
                  <span class="btn btn-border" @click="openDialog(position.id,position.name,'delete')">删除</span>
                  <el-dialog title="提示" v-model="dialogIsDelete" size="tiny" class="close-dialog">
                    <span>确定删除{{thisdeletePosition.name}}职位？</span>
                    <span slot="footer" class="dialog-footer">
                      <span @click="dialogIsDelete = false" class="cd-button">取 消</span>
                      <span type="primary" @click="deletePosition(thisdeletePosition.id)" class="cd-button cd-button-primary">确 定</span>
                    </span>
                  </el-dialog>
                  <span class="btn btn-bg" @click="openDialog(position.id,position.name,'openLocal')">开启</span>
                  <el-dialog title="提示" v-model="dialogOl" size="tiny" class="close-dialog">
                    <span>确定开启{{thisOlPosition.name}}职位？</span>
                    <span slot="footer" class="dialog-footer">
                      <span @click="dialogOl = false" class="cd-button">取 消</span>
                      <span type="primary" @click="openPosition(thisOlPosition.id,'openLocal')" class="cd-button cd-button-primary">确 定</span>
                    </span>
                  </el-dialog>
                </div>
              </div>
              <div class="job-detail">
                <i class="icon-person"></i>
                <span>招聘
                  <label>{{position.number}}</label>人</span>
                <i class="icon-tag"></i>
                <span>{{position.bumen}}</span>
                <i class="icon-location"></i>
                <span>{{position.city}}</span>
                <i class="icon-clock"></i>
                <span>
                  <label v-text="position.created_at"></label>发布</span>
              </div>
            </div>
          </li>
        </ul>
        <!--职位列表为空-->
        <div class="resume_empty" v-show="!isloading">
          <div v-if="identity==1">
            <div v-show="currentStatus==1">
              <div v-show="normalTotal==0">
                <img src="../../assets/img/match.png" alt="">
                <p>暂无委托职位</p>
              </div>
            </div>
            <div v-show="currentStatus==0">
              <div v-show="closeTotal==0">
                <img src="../../assets/img/match.png" alt="">
                <p>暂无委托职位</p>
              </div>
            </div>
          </div>
          <div v-else="">
            <div v-show="selfCurrentStatus==0">
              <div v-show="selfNormalTotal==0">
                <img src="../../assets/img/match.png" alt="">
                <p>暂未发布职位</p>
                <span v-show="selfCompanyList.length != 0" @click="openPost(selfCompany)" class="cd-button cd-button-primary">发布职位</span>
              </div>
            </div>
            <div v-show="selfCurrentStatus==4">
              <div v-show="selfCloseTotal==0">
                <img src="../../assets/img/match.png" alt="">
                <p>暂无已关闭职位</p>
              </div>
            </div>
          </div>
        </div>
        <loading :loading='isloading'></loading>
        <!--委托进行中关闭职位-->
        <el-dialog title="提示" v-model="dialogCe" size="tiny" class="close-dialog">
          <span>确定关闭{{thisPosition.name}}职位？</span>
          <span slot="footer" class="dialog-footer">
            <span @click="dialogCe = false" class="cd-button">取 消</span>
            <span type="primary" @click="closePosition(thisPosition.id,'trust')" class="cd-button cd-button-primary">确 定</span>
          </span>
        </el-dialog>
        <!--推荐dialog-->
        <el-dialog title="提示" v-model="dialogTui" size="tiny" class="close-dialog">
          <span>进入上传简历，并向企业推荐简历流程</span>
          <span slot="footer" class="dialog-footer">
            <span @click="dialogTui = false" class="cd-button">取 消</span>
            <router-link :to="{ name: 'archivesUploadPid', params: { pid: positionId },query: { cid: cid,on: wtSwitch}}"><span type="primary" class="cd-button cd-button-primary cd-recommend"> 确 定</span></router-link>
          </span>
        </el-dialog>
        <!--分页-->
        <div class="block myPagination" v-show="count > 20">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="20" layout="prev, pager, next" :total="count">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import navbar from '../../components/Navbar/navbar.vue'
  import loading from '../../components/Loading/loading.vue'
  import '../../assets/css/position/index.scss';
  import ejax from '../../assets/js/ejax';
  import Cookies from 'js-cookie'

  export default {
    name: 'position',
    data () {
      return{
        identity: '',
        dialogTui:false,
        positionId:'0',
        cid:'',
        wtSwitch: '0',
        bdSwitch: '0',
        companyList:{},
        selfCompanyList:{},
        positionList:[],
        selfPositionList:[],
        total:0,
        normalTotal:0,
        selfNormalTotal:0,
        closeTotal:0,
        selfCloseTotal:0,
        pageSize : 20,
        selfPageSize : 20,
        currentPage : 1,
        count: 0,
        selfCurrentPage : 1,
        company :{},
        selfCompany: {},
        currentStatus:1,
        selfCurrentStatus:0,
        gbzw: '',// gbzwSelf: '',
        dialogCe: false,
        dialogCl: false,
        dialogIsDelete: false,
        dialogOe: false,
        dialogOl: false,
        dialogVisible: false,
        thisPosition: {},
        thisSelfPosition: {},
        thisdeletePosition: {},
        thisOePosition: {},
        thisOlPosition: {},
        cid:'',
        on:'',
        isloading:true
      }
    },
    mounted:function(){
      this.$nextTick(function(){
        this.cid = this.$route.query.cid;
        this.on = this.$route.query.on;
        // 这个部分要设置委托职位 初始状态 加载那个公司 并active 
        if(this.on!=undefined){this.wtSwitch=this.on;}else{this.on = '0'}
        this.init();
      })
    },
    methods: {
      init:function(){
        let user_info = Cookies.get('user_info');
      if (!user_info) {
        this.$router.push({ path: '/' })
      } else {
        if (JSON.parse(user_info).user_type == '1') {
          ejax.get('/api/position/getTobCompanys?format=json').then(res => {
            this.identity = JSON.parse(user_info).user_type;
            this.companyList = res.data.results;
            if (this.companyList.length != 0) {
              this.getPositions(this.companyList[0], 1,this.cid);
            }else{
              this.isloading = false;
            }
          });
        }
        if (JSON.parse(user_info).user_type == '2') {
          ejax.get('/api/position/getSelfCompanys?format=json').then(res => {
            this.identity = JSON.parse(user_info).user_type;
            this.selfCompanyList = res.data.results;
            if (this.selfCompanyList.length != 0) {
              this.getSelfPositions(this.selfCompanyList[0], 0);
            }else{
              this.isloading = false;
            }
          })
            .catch(err => {
              console.log(err);
            })
        }
      }
    },
    openView: function(id,cid,on){
      if(cid != undefined){
        window.open(`/position/view/${id}?on=${on}&cid=${cid}`);
      }else{
        window.open(`/position/view/${id}`);
      }
    },
    openPost: function(selfCompany){
      console.log(selfCompany);
      if(selfCompany != undefined){
        window.open(`/position/post?cid=`+selfCompany.company_id);
      }else{
        window.open(`/position/post`);  
      }
    },
      handleSizeChange: function(val){
        // console.log(`每页 ${val} 条`);
      },
      handleCurrentChange: function(val){
        if(this.identity == 1){
          this.currentPage = val;
          this.getPositions(this.company,this.currentStatus);
        }else{
          this.selfCurrentPage = val;
          this.getSelfPositions(this.selfCompany,this.selfCurrentStatus);
        }
      },
      recommendDialog:function(id,company){
        this.dialogTui = true;
        this.positionId = id;
        this.cid = company.tob_parent_id;
      },
      getThisPositions:function(company,status,index,type){
        if(type == 'entrust'){
          this.on = index;
          if(this.on != this.wtSwitch)
          this.getPositions(company,status);
          !this.on ? this.on=0: '';
          this.wtSwitch = this.on;
        }
        if(type == 'local'){
          if(index != this.bdSwitch)
          this.getSelfPositions(company,status);
          !index ? index=0: '';
          this.bdSwitch = index;
        }
      },
      changePositionStatus: function(company,status,type){
        if(type == 'entrust' && this.currentStatus != status){
          this.currentPage = 1;
          status == 1 ? this.count = this.normalTotal : this.count = this.closeTotal;
          if(this.cid!=undefined && this.$route.query.on==this.wtSwitch){
            this.getPositions(company,status,this.cid);
          }else if(company.tob_parent_id != undefined){
            this.getPositions(company,status);
          }
          
        }
        if(type == 'local'){
          if(this.selfCurrentStatus != status){
            this.selfCurrentPage = 1;
            status == 0 ? this.count = this.selfNormalTotal : this.count = this.selfCloseTotal;
            if(company.company_id !=undefined){
              this.getSelfPositions(company,status);
            }
          }
        }
        
      },
      getPositions:function(company,status,cid){
        if (company){
          this.company = company;
          this.currentStatus = status;
        }
        let company_id;
        if(cid==undefined){company_id=this.company.tob_parent_id}else{company_id=cid};
        var param = {'tob_parent_id':company_id,
          'status':this.currentStatus,
          'pagesize':this.pageSize,
          'page':this.currentPage}
          this.isloading = true;
        ejax.post('/api/position/getPositions?format=json',param).then(res=> {
          this.total = res.data.results.num;
          this.normalTotal = res.data.results.normal_total;
          this.closeTotal = res.data.results.close_total;
          status == 1 ? this.count = this.normalTotal : this.count = this.closeTotal;
          this.positionList = res.data.results.positions;
          this.isloading = false;
        })
        .catch(err=>{
          console.log(err);
        })
      },
      getSelfPositions: function(company,status){
        // debugger;
        if (company){
          this.selfCompany = company;
          this.selfCurrentStatus = status;
        }
        var param = {'company_id':this.selfCompany.company_id,
          'status':this.selfCurrentStatus,
          'pagesize':this.selfPageSize,
          'page':this.selfCurrentPage}
          this.isloading = true;
        ejax.post('/api/position/getSelfPositions?format=json',param).then(res => {
          // 接口返回有错
          this.selfNormalTotal = res.data.results.normal_total;
          this.selfCloseTotal = res.data.results.close_total;
          status == 0 ? this.count = this.selfNormalTotal : this.count = this.selfCloseTotal;
          this.selfPositionList = res.data.results.positions;
          this.isloading = false;
        })
        .catch(err=>{
          console.log(err);
        })
      },
      closePosition:function(id,type){
        type == 'trust' ? this.dialogCe = false : this.dialogCl = false;
        var param = {'id':id};
        ejax.post('/api/position/closePosition?format=json',param).then(res => {
          if(type == 'trust'){
            this.isloading = true;let time = 0.5;
            let timer = setInterval(() => {
              time--;
              if (time <= 0) {
                clearInterval(timer);
                this.isloading = false;
                this.getPositions(this.company,1);
              }
            }, 500);
          }else{
            this.isloading = true;let time = 0.5;
            let timer = setInterval(() => {
              time--;
              if (time <= 0) {
                clearInterval(timer);
                this.isloading = false;
                this.getSelfPositions(this.selfCompany,0);
              }
            }, 500);
          }
        })
        .catch(err=>{
          console.log(err);
        })
      },
      deletePosition:function(id){
        this.dialogIsDelete = false;
        var param = {'id':id};
        ejax.post('/api/position/deletePosition?format=json',param).then(res => {
          if(res.data.err_no == 0){
            this.isloading = true;let time = 0.5;
            let timer = setInterval(() => {
              time--;
              if (time <= 0) {
                clearInterval(timer);
                this.isloading = false;
                this.getSelfPositions(this.selfCompany,4);
              }
            }, 500);
          }
        })
        .catch(err=>{
          console.log(err);
        })
      },
      openPosition: function(id,type){
        type == 'openEntrust' ? this.dialogOe = false : this.dialogOl = false;
        var param = {'id':id};
        ejax.post('/api/position/openPosition?format=json',param).then(res => {
          if(type == 'openEntrust'){
            this.isloading = true;let time = 0.5;
            let timer = setInterval(() => {
              time--;
              if (time <= 0) {
                clearInterval(timer);
                this.isloading = false;
                this.getPositions(this.company,0);
              }
            }, 500);
          }else{
            this.isloading = true;let time = 0.5;
            let timer = setInterval(() => {
              time--;
              if (time <= 0) {
                clearInterval(timer);
                this.isloading = false;
                this.getSelfPositions(this.selfCompany,4);
              }
            }, 500);
          }
        })
        .catch(err=>{
          console.log(err);
        })
      },
      /*toggleP:function(index){
        this.gbzw===index ? this.gbzw = '' : this.gbzw=index;
      },
      toggleSP:function(index){
        this.gbzwSelf===index ? this.gbzwSelf = '' : this.gbzwSelf=index;
      },*/
      openDialog:function(id,name,type){
        if(type == 'trust'){
          this.thisPosition.id = id;
          this.thisPosition.name = name;
          this.dialogCe = true;
        }
        if(type == 'local'){
          this.thisSelfPosition.id = id;
          this.thisSelfPosition.name = name;
          this.dialogCl = true;
        }
        if(type == 'delete'){
          this.thisdeletePosition.id = id;
          this.thisdeletePosition.name = name;
          this.dialogIsDelete = true;
        }
        if(type == 'openEntrust'){
          this.thisOePosition.id = id;
          this.thisOePosition.name = name;
          this.dialogOe = true;
        }
        if(type == 'openLocal'){
          this.thisOlPosition.id = id;
          this.thisOlPosition.name = name;
          this.dialogOl = true;
        }
      }
    },
    filters: {
      recommendCount(value){
        if(value > 99){return '99+';}else{return value;}
      }
    }
  }
</script>
<style lang="scss">
.resume_empty .cd-button{margin:15px 0 0 0;width: 120px;a{color: #fff;}} .cd-recommend a{color:#fff;}
</style>
