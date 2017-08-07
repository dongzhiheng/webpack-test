<template>
  <div class="v-container">
    <navbar></navbar>
    <div class="v-box">
      <div class="viewinner">
        <div class="view-jobinfo">
          <div class="img">
            <img src="../../assets/img/company.png" alt="">
          </div>
          <div class="info">
            <h3>{{position_base_data.name}}</h3>

            <div class="job-jianjie">
              <span v-if="position_base_data.experience_end > position_base_data.experience_begin">{{position_base_data.experience_begin}} ~ {{position_base_data.experience_end}}年经验</span><span v-else="">{{position_base_data.experience_begin}}年以上工作经验</span>
              <strong v-show="position_base_data.degree">·</strong><span>{{position_base_data.degree}}</span>
              <strong>·</strong><span>{{position_base_data.languages | isLanguage}}</span>
              <strong>·</strong>
              <span v-if="position_base_data.salary_begin > 1000 && position_base_data.salary_end <= 500000">月薪:{{position_base_data.salary_begin}}-{{position_base_data.salary_end}}元</span>
              <span v-else-if="position_base_data.annual_salary_begin >= 10000 && position_base_data.annual_salary_end >= 10000">年薪:{{position_base_data.annual_salary_begin |salary2int }}-{{position_base_data.annual_salary_end | salary2int}}万元</span>
              <span v-else>薪资面议</span>
            </div>
            <div class="job-detail">
              <i class="icon-person"></i><span>招聘 <label>{{position_base_data.number}}</label>人</span>
              <i class="icon-tag"></i><span>{{position_base_data.architecture_name}}</span>
              <i class="icon-location"></i><span>{{position_base_data.city}}</span> <i class="icon-clock"></i><span>{{position_base_data.created_at | time3date}}发布</span>
              <!--position_base_data.created_at-->
            </div>
          </div>
          <div class="recommend">
            <div class="btn-group">
              <span class="btn btn-bg" v-if="operater=='1'" v-show="status=='0'" @click='openDialog("open")'>开启职位</span><!-- v-if="operater=='1'"-->
              <span class="btn btn-bg" v-if="identity=='2'" v-show="status=='0'" @click='openDialog("open")'>开启职位</span>
              <el-dialog title="提示" v-model="dialogOpen" size="tiny" class="close-dialog">
                <span>确定开启{{position_base_data.name}}职位？</span>
                <span slot="footer" class="dialog-footer">
                  <span @click="dialogOpen = false" class="cd-button">取 消</span>
                  <span type="primary" @click="openPosition" class="cd-button cd-button-primary">确 定</span>
                </span>
              </el-dialog>

              <span v-if="identity=='1'" class="btn btn-bg" v-show="status == '1'"><!-- v-if="identity=='1'"-->
              <!--<router-link :to="{ name: 'archivesUploadPid', params: { pid: positionId },query: { cid: cid,on: wtSwitch}}">确 定</router-link>-->
                <router-link :to="{ name: 'archivesUploadPid', params: { pid: pid },query: { cid: cid,on: on}}">推荐</router-link>
                </span>
               <el-dropdown trigger="click" @command='openDialog("close")' v-show="status == '1'">
                <span class="el-dropdown-link">
                  <i class="icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item><el-button type="text">关闭职位</el-button></el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dialog title="提示" v-model="dialogPosition" size="tiny" class="close-dialog">
                <span>确定关闭{{position_base_data.name}}职位？</span>
                <span slot="footer" class="dialog-footer">
                  <span @click="dialogPosition = false" class="cd-button">取 消</span>
                  <span type="primary" @click="closePosition" class="cd-button cd-button-primary">确 定</span>
                </span>
              </el-dialog>
            </div>
          </div>
        </div>
        <div class="view-pack">
          <div class="statusTab">
            <span v-bind:class="{active:currentStatus==0}" @click='changeTab("detail")'>职位详情</span>
            <span v-if="identity=='1'" v-bind:class="{active:currentStatus==1}" @click='changeTab("recommend")'>已推荐(<label>{{total}}</label>)</span>
            <span v-else="" v-bind:class="{active:currentStatus==2}" @click='changeTab("matching")'>人才匹配(<label>{{mtotal}}</label>)</span>
          </div>
          <div class="vpack" id="vpack">
            <div v-show="currentStatus==0">
              <div class="vpleft">
                <h3><i class="icon-document"></i> 职位描述</h3>
                <p class="h4">工作内容</p>
                <ul>
                  <li v-html="$options.filters.n2p(position_base_data.description)"></li>
                </ul>
                <p class="h4">职位要求</p>
                <ul>
                  <li v-html="$options.filters.n2p(position_base_data.requirement)"></li>
                </ul>
                <p class="h4">工作地点</p>
                <p class="h3" v-if="position_base_data.address">{{position_base_data.address}}</p>
                <p class="h5" v-else="">暂无</p>
              </div>
              <div class="vpright">
                <h3><i class="icon-compass"></i> 候选人偏好</h3>
                <p class="h4">行业偏好</p>
                <div>
                  <span class="tag danger" v-for="(industry,key) in position_base_data.industries">{{industry.name}}</span>
                </div>
                <p class="h4">公司偏好</p>
                <div>
                  <span class="tag warn" v-for="(company,key) in position_base_data.corporations">{{company}}</span>
                </div>
                <p class="h4">项目偏好</p>
                <p class="h3" v-if="position_base_data.projects">{{position_base_data.projects}}</p>
                <p class="h5"  v-else="">暂无</p>
                <p class="h4">技能偏好</p>
                <div v-if="position_base_data.skills">
                  <span class="tag primary" v-for="(skill,key) in position_base_data.skills">{{skill}}</span>
                </div>
                <p class="h5"  v-else="">暂无</p>
                <p class="h4">学校偏好</p>
                <div>
                  <span class="tag success" v-for="(school,key) in position_base_data.schools">{{school}}</span>
                </div>
                <p class="h4">管理经验</p>
                <p class="h3">{{position_base_data.is_manager | isManager}}</p>
                <p class="h4">年龄偏好</p>
                <p class="h3">{{position_base_data.age_begin}}~{{position_base_data.age_end}}岁</p>
                <p class="h4">其他偏好</p>
                <p class="h3" v-if="position_base_data.others">{{position_base_data.others}}</p>
                <p class="h5" v-else="">暂无</p>
                <p class="h4">避免背景</p>
                <p class="h3" v-if="position_base_data.no_background">{{position_base_data.no_background}}</p>
                <p class="h5" v-else="">暂无</p>
              </div>
            </div>
            <div v-show="currentStatus==1" v-if="identity=='1'">
              <ul class="job-list" v-if="total">
                <li v-for="resume in position_resumes">
                  <div class="job-info">
                    <span class="companylogo"><router-link :to="{name:'archivesView', params: {id: resume.resume_base_data.basic.id,'edit':'preview','pid':'cv'}}"> <img v-bind:src="resume.resume_base_data.basic.photo" alt="" v-if="resume.resume_base_data.basic.photo"/> <img v-else=""  v-bind:src="resume.resume_base_data.basic.gender | isGender" alt=""/></router-link></span>
                    <div class="seize">
                      <div class="job-type">
                        <router-link :to="{name:'archivesView', params: {id: resume.resume_base_data.basic.id,'edit':'preview','pid':'cv'}}"><strong>{{resume.resume_base_data.basic.name}}</strong></router-link><span>{{resume.resume_base_data.basic.work_experience}}年经验</span><em> · </em><span>{{resume.resume_base_data.basic.expect_city_names}}</span>
                        <router-link :to="{name:'archivesView', params: {id: resume.resume_base_data.basic.id,'edit':'preview','pid':'cv'},query: {'report':resume.id} }"><i class="icon-report">推荐报告</i></router-link>
                      </div>
                      <div class="last-company" v-for="work in resume.resume_base_data.work.slice(0,1)">
                        <i class="icon-post"></i> <span class="box-msg"><span>{{work.corporation_name}}</span><em> - </em><span>{{work.position_name}}</span><span class="line"></span></span> <span class="companytime">{{work.start_stop | calctime}}</span>
                      </div>
                      <div class="edu-bg" v-for="education in resume.resume_base_data.education.slice(0,1)">
                        <i class="icon-school"></i> <span class="box-msg"><span>{{education.school_name}}</span><em> - </em><span>{{education.discipline_name}}</span><em> - </em><span>{{education.degree}}</span><span class="line"></span></span> <span>{{education.start_time}} - {{education.end_time}}</span>
                      </div>
                    </div>
                  </div>
                  <div class="recommend-state">
                    <i class="circular active"></i> <span v-show="index == 0" v-for="(progress,index) in resume.progress"> {{progress.created_at | time2date}} <strong>{{progress.progress}}</strong> </span> <span class="view-detailes" @click="showProgress(resume)">查看详情</span>
                  </div>
                  <el-dialog title="" v-model="dialogVisible" size="tiny" class="resume-pro" :lock-scroll="false">
                    <div class="resume_header">
                      <label class="companylogo"><img v-bind:src="resume_base_data.photo" alt="" v-if="resume_base_data.photo"/> <img v-else=""  v-bind:src="resume_base_data.gender | isGender" alt=""/></label>
                      <strong>{{resume_base_data.name}}</strong>
                      <span>{{resume_base_data.expect_position_name}}</span>
                    </div>
                    <div class="resume_body" v-for="(progress,index) in resume_progress">
                      <p v-bind:class="{lineThrough:progress.is_cancel == '1'}">
                        <i class="circular" v-bind:class="{active:index==0}"><u v-show="index!=0"></u></i>
                        <span class="progress_time">{{progress.created_at}}</span>
                        <span class="progress_stage">{{progress.progress}}</span>
                        <span class="progress_state">{{progress.status | status2str}}</span>
                      </p>
                    </div>
                  </el-dialog>
                </li>
              </ul>
              <div v-else="" class="resume_empty">
                <img src="../../assets/img/empty.png" alt="">
                <p>还没有推荐候选人</p>
              </div>
            </div>
            <div v-show="currentStatus==2" v-else="">
              <ul class="overflow talent-matching" v-if="mtotal">
                <li class="job-info" v-for='talent in talent_recommend'>
                  <span class="companylogo"><router-link :to="{name:'archivesView', params: {id: talent.basic.id,'edit':'preview','pid':'cv'}}"> <img v-bind:src="talent.basic.photo" alt="" v-if="talent.basic.photo"/> <img v-else=""  v-bind:src="talent.basic.gender.toLowerCase() | isGender" alt=""/></router-link></span>
                    <div class="seize">
                      <div class="job-type"><span class="box-msg"><router-link :to="{name:'archivesView', params: {id: talent.basic.id,'edit':'preview','pid':'cv'}}"> <strong v-bind:title="talent.basic.name" v-text="talent.basic.name"></strong></router-link><span>{{talent.basic.work_experience | experienceFilter}}</span><em v-show="talent.basic.work_experience != 0 "> · </em><span>{{talent.basic.address}}</span></span>
                      </div>
                      <div class="last-company">
                      <i class="icon-post"></i> <span class="box-msg"><span v-text="talent.work[0].corporation_name"></span><em v-show="talent.work[0].corporation_name && talent.work[0].position_name"> - </em><span v-text="talent.work[0].position_name"></span><span class="line"></span></span> <span class="companytime">{{talent.work[0].start_stop | calctime}}</span>
                      </div>
                      <div class="edu-bg">
                        <i class="icon-school"></i> <span class="box-msg"><span v-text="talent.education[0].school_name"></span><em v-show="talent.education[0].school_name"> - </em><span v-text="talent.education[0].discipline_name"></span><em v-show="talent.education[0].degree"> - </em><span v-text="talent.education[0].degree"></span><span class="line"></span></span> <span>{{talent.education[0].start_time}} - {{talent.education[0].end_time}}</span>
                    </div>
                    <div class="match-degree">
                      <span class="h5">匹配度:</span>
                      <el-rate
                        v-model='talent.recommend.match_rate'
                        disabled
                        text-color="#FFD057"
                        text-template="{value}">
                      </el-rate>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-else="" class="resume_empty">
                <img src="../../assets/img/match.png" alt="">
                <p>还没有匹配的候选人</p>
              </div>
            </div>
            <!--分页-->
            <div class="block myPagination" v-show="count > 20">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="20"
                layout="prev, pager, next"
                :total="count">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import navbar from '../../components/Navbar/navbar.vue';
  import '../../assets/css/position/index.scss';
  import '../../assets/css/position/post.scss';
  import ejax from '../../assets/js/ejax';
  import Cookies from 'js-cookie';
  import male from '../../assets/img/male.png';
  import female from '../../assets/img/female.png';
  import nomarl from '../../assets/img/nomarl.png';
  import { sUrl, getQuery, trim} from '../../assets/js/base';

  export default {
    name: 'view',
    data () {
      return{
        identity: '',
        status: '',
        operater: '',
        currentStatus: '0',
        total:0,
        mtotal:0,
        pageSize : 20,
        currentPage : 1,
        count: 0,
        position_base_data:{},
        publishTime:'',
        position_resumes:{},
        dialogVisible:false,
        pid:'',
        position:{},
        resume_base_data:{},
        resume_progress:{},
        talent_recommend:{},
        duration:'',
        matchDegree:0,
        dialogPosition: false,
        dialogOpen:false,
        cid:'',
        on:'',
      }
    },
    mounted:function(){
      this.$nextTick(function(){
        if(this.$route.query.status != undefined){this.currentStatus = this.$route.query.status;}
        this.identity=Cookies.get('user_type');
        this.cid = this.$route.query.cid;
        this.on = this.$route.query.on;
        let id = this.$route.params.id;
        this.getPositionResumes(id);
        if(this.identity=='2')this.getRecommendResume(id);
        // document.getElementById('vpack').style.minHeight = document.body.scrollHeight  - 330+'px';
      })
    },
    methods: {
      openDialog: function(type){
        type == "open" ? this.dialogOpen=true : this.dialogPosition = true;
      },
       handleSizeChange: function(val){
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange: function(val){
        this.currentPage = val;
        console.log(`当前页: ${val}`);
        if(this.identity == '1'){
          this.getPositionResumes(this.$route.params.id);
        }
        if(this.identity == '2'){
          this.getRecommendResume(this.$route.params.id);
        }
      },
      closePosition:function(){
        var param = {'id':this.$route.params.id};
        ejax.post('/api/position/closePosition?format=json',param).then(res => {
          this.dialogPosition = false;
          if(res.data.err_msg == ''){this.status='0';}
        });
      },
      openPosition: function(){
        var param = {'id':this.$route.params.id};
        ejax.post('/api/position/openPosition?format=json',param).then(res => {
          this.dialogOpen = false;
          if(res.data.err_msg == ''){this.status = '1';}
        });
      },
      changeTab: function(type){
        type == 'detail'?this.currentStatus='0':type == 'matching'?this.currentStatus = '2':this.currentStatus = '1';
        type == 'matching'?this.count=this.mtotal:this.count=this.total;
      },
      showProgress: function(resume){
        this.dialogVisible = true
        this.resume_base_data = resume.resume_base_data.basic;
			  this.resume_progress = resume.progress;
      },
      getPositionResumes: function(id){
        if(id == 'null'){this.$router.push('/404')}
        else{
           var param = {'position_id':id,
            'pagesize':this.pageSize,
            'page':this.currentPage};
            ejax.post('/api/position/getPositionResumes?format=json',param).then( res=> {
              // debugger;
              this.pid = res.data.results.position.id;
              this.position_base_data = res.data.results.position_base_data;
              if(this.identity == '1'){
                this.status = res.data.results.position.status;
                this.operater = res.data.results.position.operater;
                this.position_resumes = res.data.results.results;
                this.total = parseInt(res.data.results.num);
              }
              if(this.identity == '2'){
                res.data.results.position_base_data.status == '0' ? this.status = '1' : this.status = '0';
              }
              console.log(this.status);
            });
        }
      },
      getRecommendResume:function(id){
        if(id != 'null'){
          var param = {'id':id,
            'pagesize':this.pageSize,
            'page':this.currentPage};
          ejax.post('/api/position/getRecommendResumeByTalent?format=json',param).then( res=> {
            this.talent_recommend = res.data.results.talent_recommend;
            this.mtotal = parseInt(res.data.results.talent_recommend_count);
          });
        }else{this.$router.push('/404')}
      }
    },
    components: {
      navbar
    },
    filters:{
      isLanguage(val){
        if(val != undefined){
          if(val.level == 1){
            return val.name + '(一般)' 
          }else if(val.level == 2){
            return val.name + '(良好)' 
          }else if(val.level == 3){
            return val.name + '(熟练)' 
          }else if(val.level == 4){
            return val.name + '(精通)' 
          }else{
            return  '外语不限' 
          }
        }
      },
      salary2int(value){
        return value/10000;
      },
      experienceFilter(val) {
        if (val == '0' || val == '') {
          return '';
        } else {
          return val + '年工作经验';
        }
      },
      isManager(val){
        if(val=="N"){return '不要求'}else{return '要求'}
      },
      isGender: function (val) {
         return val == 'M' ? male : (val == 'F') ? female : nomarl;
      },
      n2p(value) {
        if (!value) { return ''}
        return value.replace(/(\r|\n)*(.+)(\r|\n)*/gi, '<p>$2</p>');
      },
      time2date(value){
        return value.substring(0,10);
      },
      time3date(value){
        return (value+'').substring(0,10);
      },
      status2str(value){
        if (value == 0){
          return '失败';
        }else if (value == 1){
          return '通过';
        }
      },
       calctime: function (input) {
            var start = null;
            var stop = null;
            if (!input) {
                return '';
            }
            var _input = input;
            input = (input || '').split('-');
            if (trim(input[1]) !== '至今') {
                stop = new Date(input[1].replace(/\./g, '/') + '/01');
            } else {
                stop = new Date();
            }
            start = new Date((input[0].replace(/\./g, '/')) + '/01');
            var x = stop - start;

            var month = Math.round(x / (30 * 24 * 60 * 60 * 1000));
            var year = Math.floor(month / 12);
            month = month % 12;

            if (year > 0) {
                return _input + '（' + year + '年' + (month ? month + '个月）' : '）');
            } else {
                return _input + (month ? '（' + month + '个月）' : '');
            }
        }
    }
  }
</script>
<style lang="scss">
.v-box{padding-left: calc(100vw - 100%);.resume-pro .el-dialog{box-shadow:0 0 0;}}.btn-group .btn-bg a{color: #fff;}.lineThrough{text-decoration: line-through;color: #999;}
</style>
