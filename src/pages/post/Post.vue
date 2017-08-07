<template>
  <div class="v-container" @click="closeSelect">
    <navbar></navbar>
    <div class="v-box">
  
      <div class="postinner">
        <div class="setp-crumbs">
          <h2>创建职位</h2>
          <ul>
            <li class="step-item stepf" v-bind:class="{active:step==0,finish:step==1||2}">
              <i class="quan"></i>
              <i class="line"></i>
              <span>基本信息</span>
            </li>
            <li class="step-item stept" v-bind:class="{active:step==1,finish:step==2}">
              <i class="quan"></i>
              <i class="line"></i>
              <span>职位详情</span>
            </li>
            <li class="step-item stepl" v-bind:class="{active:step==2}">
              <i class="quan"></i>
              <span>候选人偏好</span>
            </li>
          </ul>
        </div>
        <!---step == 0-->
        <el-form v-show='step == 0' :model="ruleForm1" :rules="rules1" ref="ruleForm1" :label-position="labelPosition" label-width="100px" class="demo-ruleForm">
          <el-form-item label="公司名称" required v-bind:class="{'is-error':company_error}" prop="">
            <el-autocomplete class="inline-input" :maxlength='20' v-model="state2" :fetch-suggestions="querySearch" placeholder="请输入公司名称" :trigger-on-focus="false" @select="handleSelect" @input="changeSelect"></el-autocomplete>
            <!--<span @click="changeSlect">das das</span>-->
            <!--<el-input v-model="ruleForm1.company_name" placeholder="请填写公司名称"></el-input>-->
            <div v-show="company_error" class="el-form-item__error">{{company_error}}</div>
          </el-form-item>
          <el-form-item label="职位名称" prop="name">
            <el-input v-model="ruleForm1.name" placeholder="请填写职位名称，如：产品经理"></el-input>
          </el-form-item>
          <el-form-item label="所属部门" prop="architecture_name">
            <el-input v-model="ruleForm1.architecture_name" placeholder="请填写该职位所属部门"></el-input>
          </el-form-item>
          <el-form-item label="招聘人数" prop="number">
            <el-col :span="4">
              <el-input :maxlength='5' v-model.number="ruleForm1.number"></el-input>
            </el-col>
            <el-col class="line" :span="2">人</el-col>
  
          </el-form-item>
          <el-form-item label="薪资范围：年薪" required>
            <el-col :span="4">
              <el-form-item prop="annual_salary_begin">
                <el-input placeholder="年薪起" :maxlength='5' v-model.number="ruleForm1.annual_salary_begin" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">~</el-col>
            <el-col :span="4">
              <el-form-item prop="annual_salary_end">
                <el-input placeholder="年薪止" :maxlength='5' v-model.number="ruleForm1.annual_salary_end" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">万</el-col>
          </el-form-item>
          <el-form-item label="工作城市" prop="city_ids" required>
            <div @click.stop="isCityShow">
              <cd-select-city :cityData="ruleForm1.city_ids" :selectCityShow="cityShow"></cd-select-city>
            </div>
  
          </el-form-item>
          <el-form-item label="工作地址" prop="address">
            <el-input v-model="ruleForm1.address"></el-input>
          </el-form-item>
          <el-form-item class="footer_wrapper">
            <span class="cd-button cd-button-default" @click="cancelPost">取消</span>
            <span class="cd-button cd-button-primary" @click="resetForm1('ruleForm1')">下一步</span>
          </el-form-item>
        </el-form>
        <!--step == 1-->
        <el-form v-show='step == 1' :model="ruleForm2" :rules="rules2" ref="ruleForm2" :label-position="labelPosition" label-width="100px" class="demo-ruleForm">
  
          <el-form-item label="工作年限" required>
            <el-col :span="4">
              <el-form-item prop="experience_begin">
                <el-input placeholder="" :maxlength='10' v-model.number="ruleForm2.experience_begin" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">~</el-col>
            <el-col :span="4">
              <el-form-item prop="experience_end">
                <el-input placeholder="" :maxlength='10' v-model.number="ruleForm2.experience_end" style="width: 100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='2' class="line">
              年
            </el-col>
          </el-form-item>
          <el-form-item>
            <div class="form-group">
              <p>学历要求</p>
              <ul class="edu-items">
                <li v-for="edu of degreeEdu" v-bind:class="{'active':ruleForm2.degree_id == edu.id}" @click.stop="ruleForm2.degree_id = edu.id">{{edu.name}}
                  <i class="icon-tick"></i>
                </li>
              </ul>
            </div>
          </el-form-item>
          <el-form-item class="language-select" label="外语要求">
            <el-col :span='12' class="pos">
              <el-input placeholder="不限" :readonly="true" icon="caret-bottom" style="width: 100%;"></el-input>
              <div class="language-selector-selected" @click.stop="showLanguagePop">
                <ul>
                  <li v-for="(item,index) of ruleForm2.languages">
                    <span>{{item.name}}{{item.level | skilled}}</span>
                    <i class="icon-close" @click.stop="removeLanguage(item,index)"></i>
                  </li>
                </ul>
              </div>
              <div class="wrapper" v-show="selectLanguageShow" @click="$event.stopPropagation()">
                <aside>
                  <el-checkbox-group class="orange" v-model="selectLanguageType">
                    <el-checkbox v-for="(language,index) of languageType" :label="language.name" :key="language.id" @change="selectLanguage(language,index)">{{language.name}}</el-checkbox>
                  </el-checkbox-group>
                </aside>
                <article v-if="skilledShow">
                  <el-input v-if="decOtherShow" class="items" placeholder="限填一项" v-model="decOtherData" size="small" @change="editOther"></el-input>
                  <p class="title">熟练程度</p>
                  <el-radio-group v-model="radio2" @change="editSkilled(radio2)">
                    <el-radio :label="1">一般</el-radio>
                    <el-radio :label="2">良好</el-radio>
                    <el-radio :label="3">熟练</el-radio>
                    <el-radio :label="4">精通</el-radio>
                  </el-radio-group>
                </article>
              </div>
            </el-col>
            <label class="cd-checkout oversea_wrapper" v-bind:class="{'is-checked': ruleForm2.is_oversea}">
              <input type="checkbox" v-model="ruleForm2.is_oversea">
              <span class="checkbox-text">海外背景</span>
            </label>
          </el-form-item>
  
          <el-form-item label="职位要求" prop="requirement">
            <el-input type="textarea" v-model="ruleForm2.requirement" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="工作描述" prop="description">
            <el-input type="textarea" v-model="ruleForm2.description" :rows="4"></el-input>
          </el-form-item>
  
          <el-form-item class="footer_wrapper">
            <span class="cd-button cd-button-default" type="primary" @click="backStep('0')">上一步</span>
            <span class="cd-button cd-button-primary" @click="resetForm2('ruleForm2')">下一步</span>
          </el-form-item>
        </el-form>
        <!--step == 2-->
        <el-form v-show='step == 2' :model="ruleForm3" :rules="rules3" ref="ruleForm3" :label-position="labelPosition" label-width="100px" class="demo-ruleForm">
          <div class="postinfo">
            <i>i</i>职位创建后会自动为您匹配简历，完善偏好信息会让匹配更加精准！</div>
  
          <el-form-item label="行业偏好">
            <div class="industry-wrapper" @click="dialogVisible = true">
              <ul class="industry-selector-selected">
                <li class="columns-item" v-for="industry in ruleForm3.industries" @click="$event.stopPropagation()">
                  {{industry.name}}
                  <em class="icon-close" @click="removeCheckIndustry(industry.tid)"></em>
                </li>
              </ul>
            </div>
          </el-form-item>
          <el-form-item class="company-hobby">
            <el-form-item label="公司偏好">
              <ul>
                <li v-for="(company, index) of ruleForm3.corporations" :key="company.id">
                  <el-input placeholder="公司偏好" :maxlength='60' :value="company" @change="editCompanyHobby($event,index)"></el-input>
                  <i class="icon-delete" v-show="ruleForm3.corporations.length > 1" @click="removeCompanyHobby(index)"></i>
                </li>
              </ul>
  
              <div class="add-btn">
                <i class="icon-add" @click="addCompanyHobby">新增</i>
              </div>
  
            </el-form-item>
          </el-form-item>
          <el-form-item label="项目偏好" prop="projects">
            <el-input v-model="ruleForm3.projects" :maxlength='60' placeholder="请填写职位所需具备的项目经验"></el-input>
          </el-form-item>
          <el-form-item label="技能偏好" prop="skills">
            <div class="skill-wrapper" @click="isShowSkillInput" v-show="this.ruleForm3.skills.length != 0" v-bind:class="{'active':skillShow}">
              <ul>
                <li class="columns-item" v-for="(skill,index) in ruleForm3.skills">{{skill}}
                  <i class="icon-close" @click="removeSkill(index)"></i>
                </li>
              </ul>
            </div>
            <el-input class="skill-input" v-model="strSkill" v-show="skillShow" placeholder="最多填写5个，不同标签用空格分隔" @keyup.native.32="addSkill($event)" @keydown.native.8="removeSkill($event)" @blur="isHideSkillInput"></el-input>
          </el-form-item>
          <el-form-item>
            <label class="cd-checkout" v-bind:class="{'is-checked': ruleForm3.is_manager}">
              <input type="checkbox" v-model="ruleForm3.is_manager">
              <span class="checkbox-text">管理经验</span>
            </label>
          </el-form-item>
          <el-form-item label="年龄偏好">
            <el-col :span="4">
              <el-form-item prop="age_begin">
                <el-input-number placeholder="最小" v-model="ruleForm3.age_begin" style="width: 100%;" :max="65" :min="0" :controls="false" :step="1"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">~</el-col>
            <el-col :span="4">
              <el-form-item prop="age_end">
                <el-input-number placeholder="最大" v-model="ruleForm3.age_end" style="width: 100%;" :max="65" :min="0" :controls="false"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span='2' class="line">
              岁
            </el-col>
          </el-form-item>
          <el-form-item label="学校偏好" class="school-hobby">
            <label class="cd-checkout" v-bind:class="{'is-checked': ruleForm3.is_211university}">
              <input type="checkbox" v-model="ruleForm3.is_211university">
              <span class="checkbox-text">985/211 高校</span>
            </label>
  
            <el-form-item label="">
              <ul>
                <li v-for="(school, index) of ruleForm3.schools" :key="school.id">
                  <el-input placeholder="请填写院校名称" :maxlength='60' :value="school" @change="editSchoolHobby($event,index)"></el-input>
                  <i class="icon-delete" v-show="ruleForm3.schools.length > 1" @click="removeSchoolHobby(index)"></i>
                </li>
              </ul>
              <div class="add-btn">
                <i class="icon-add" @click="addSchoolHobby">新增</i>
              </div>
  
            </el-form-item>
          </el-form-item>
          <el-form-item label="其他偏好" prop="others">
            <el-input type="textarea" :maxlength='600' placeholder="请填写关注的其他内容" v-model="ruleForm3.others" :rows="4"></el-input>
          </el-form-item>
          <el-form-item label="避免背景" prop="no_background">
            <el-input type="textarea" :maxlength='600' placeholder="请填写不要的背景信息，如：水果橙有限公司" v-model="ruleForm3.no_background" :rows="4"></el-input>
          </el-form-item>
          <el-form-item class="footer_wrapper">
            <span class="cd-button cd-button-default" @click="backStep('1')">上一步</span>
            <span class="cd-button cd-button-primary" @click="resetForm3('ruleForm3')">发布</span>
          </el-form-item>
        </el-form>
        <!--行业弹窗-->
        
        <cd-select-industry ref="CdSelectIndustry" :industries="ruleForm3.industries" :show="dialogVisible" @on-change-show="onChangeShow"></cd-select-industry>
        

      </div>
    </div>
  </div>
</template>


<script>
import navbar from '../../components/Navbar/navbar.vue'
import '../../assets/fonts/hunterchrome/iconfont.scss';
import ejax from '../../assets/js/ejax';
import CdSelectCity from '../../components/SelectCity/SelectCity';
import CdSelectIndustry from '../../components/SelectIndustry/SelectIndustry';
import axios from 'axios';
import { trim } from '../../assets/js/base';
// 选择语言数据
import {
  LanguageData,
  Edu
} from '../../assets/js/commonData/language';

export default {
  name: 'post',
  data() {
    var validateSalaryBegin = (rule, value, callback) => {
      if (value >= this.ruleForm1.annual_salary_end) {
        callback(new Error('必须小于起止年薪'));
      } else {
        callback();
      }
    };

    var validateSalaryEnd = (rule, value, callback) => {
      if (value <= this.ruleForm1.annual_salary_begin) {
        callback(new Error('必须大于起止年薪'));
      } else {
        callback();
      }
    };
    var validateExperienceBegin = (rule, value, callback) => {
      if (value >= this.ruleForm2.experience_end) {
        callback(new Error('必须小于最大年限'));
      } else {
        callback();
      }
    };
    var validateExperienceEnd = (rule, value, callback) => {
      if (value <= this.ruleForm2.experience_begin) {
        callback(new Error('必须大于最小年限'));
      } else {
        callback();
      }
    };
    return {
      labelPosition: 'top',
      state2: '',
      restaurants: [],
      company_error: '',
      strSkill: '',
      skillShow: true,
      ruleForm1: {
        number: 1,
        city_ids: []
      },
      rules1: {
        company_name: [{
          required: true,
          message: '请输入公司名称',
          trigger: 'blur'
        }, {
          max: 20,
          message: '不得超过20字符',
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: '请填写职位名称，如：产品经理',
          trigger: 'blur'
        }, {
          max: 20,
          message: '不得超过20字符',
          trigger: 'blur'
        }],
        architecture_name: [{
          required: true,
          message: '请填写该职位所属部门',
          trigger: 'blur'
        }, {
          max: 20,
          message: '不得超过20字符',
          trigger: 'blur'
        }],
        number: [{
          required: true,
          message: '招聘人数不能为空',
        },
        {
          type: 'number',
          message: '请输入数字',
          trigger: 'blur'
        }],
        annual_salary_begin: [{
          required: true,
          message: '起始年薪'
        }, {
          type: 'number',
          message: '请输入数字',
          trigger: 'blur'
        }, { validator: validateSalaryBegin, trigger: 'blur' }],
        annual_salary_end: [{
          required: true,
          message: '起止年薪',
        }, {
          type: 'number',
          message: '请输入数字',
          trigger: 'blur'
        }, { validator: validateSalaryEnd, trigger: 'blur' }],
        address: [{ max: 80, message: '不得超过80字符' }]
      },
      ruleForm2: {
        languages: [],
        degree_id: 0,
        is_oversea: false,
      },
      rules2: {
        requirement: [{
          required: true,
          message: '请填写职位要求',
          trigger: 'blur'
        }, {
          max: 600,
          message: '不得超过600字符'
        }],
        description: [
          { max: 600, message: '不得超过600字符' }
        ],
        experience_begin: [{
          required: true,
          message: '最少工作年限'
        }, {
          type: 'number',
          message: '请输入数字',
          trigger: 'blur'
        }, { validator: validateExperienceBegin, trigger: 'blur' }],
        experience_end: [{
          required: true,
          message: '最大工作年限'
        }, {
          type: 'number',
          message: '请输入数字',
          trigger: 'blur'
        }, { validator: validateExperienceEnd, trigger: 'blur' }]
      },
      ruleForm3: {
        corporations: [''],
        is_211university: false,
        schools: [''],
        industries: [],
        is_manager: false,
        skills: []
      },
      rules3: {
      },
      step: '0',
      languageType: LanguageData,
      selectLanguageType: [],
      degreeEdu: Edu,
      radio2: 0,
      languageIndex: 0,
      decOtherData: '',
      cityShow: false,
      selectLanguageShow: false,
      skilledShow: false,
      decOtherShow: false,
      getIndustry: {},
      dialogVisible: false,
      activedIndustry: {}
    }
  },
  mounted: function () {
    // this.$nextTick(function(){
    // })
    let cid = this.$route.query.cid;
    ejax.post('/api/position/getSelfCompanys?format=json')
      .then(data => {
        let arr = [];
        data.data.results.forEach((x) => {
          arr.push({
            value: x.company_name,
            id: x.company_id
          })
          if(cid == x.company_id){
            this.ruleForm1.company_id = cid;
            this.state2 = x.company_name;
            this.ruleForm1.company_name = x.company_name;
          }
        })
        this.restaurants = arr;
      })
      .catch(err => {
        this.$message(err);
      })
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      cb(results);
    },
    handleSelect(item) {
      this.company_error = '';
      this.ruleForm1.company_id = item.id;
      this.ruleForm1.company_name = item.value;
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.indexOf(queryString) === 0);
      };
    },
    changeSelect() {
      if(this.state2.length > 20){
        this.company_error = '不得超过20字符';
      }else{
        this.company_error = '';
      }
      this.ruleForm1.company_id = '0';
      this.ruleForm1.company_name = this.state2;
    },
    onChangeShow(val) {
      this.dialogVisible = val;
    },
    resetForm1(data) { //第一步数据验证
      let flag = true;
      if (this.state2 == '') {
        this.company_error = '请填写公司名称';
        flag = false;
      }
      //判断是否选择城市
      if (this.ruleForm1.city_ids.length == 0) {
        this.cityShow = true; //改变显示隐藏，触发组件内验证逻辑
        flag = false;
      }
      this.$refs[data].validate((valid) => {
        if (valid) {
          if (flag) {
            this.step = '1';
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm2(data) { //第二部数据验证
      this.$refs[data].validate((valid) => {
        if (valid) {
          this.step = '2';
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm3(data) { //第三部数据验证
      this.$refs[data].validate((valid) => {
        if (valid) {
          this.saveSelfPosition();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    saveSelfPosition() { //保存发布事件
      let obj = {};
      let OtherForms = {
        nature: 1,
        gender: 0,
        subordinate: 0,
        manager_years: 0,
        is_urgent: 0
      }
      let parm = _.assign({}, this.ruleForm1, this.ruleForm2, this.ruleForm3, OtherForms);
      parm.is_211university = parm.is_211university ? 'Y' : 'N';
      parm.is_oversea = parm.is_211university ? 'Y' : 'N';
      parm.is_manager = parm.is_211university ? 'Y' : 'N';
      parm.city_ids.forEach(x => {
        obj[x.id]=x.name;
      })
      parm.city_ids = obj;
      parm.annual_salary_begin = parm.annual_salary_begin * 10000;
      parm.annual_salary_end = parm.annual_salary_end * 10000;
      for (var i in parm) {
        if (typeof parm[i] == 'object') {
          parm[i] = JSON.stringify(parm[i]);
        }
      }
      ejax.post('/api/position/saveSelfPosition?format=json', parm)
        .then(data => {
          this.$router.push({ name: 'positionView', params: { id: data.data.results.id },query:{status:'2'}});
        })
        .catch(err => {
          console.log(err);
        })
    },
    backStep(val) { //返回上一步
      this.step = val;
    },
    isCityShow() {
      this.cityShow = true;
    },
    showLanguagePop() { //显示语言弹窗
      this.selectLanguageShow = true;
      return false;
    },
    closeSelect() { //关闭选择语言弹窗
      this.selectLanguageShow = false;
      this.cityShow = false;
    },
    selectLanguage(items, index) { //选择语言
      let flag = true;
      let languageItem = _.cloneDeep(items);
      this.activeLanguageId = languageItem.id;
      if (index == '0') {
        this.ruleForm2.languages.length = 0;
        this.selectLanguageType.length = 0;
        this.selectLanguageType.push('不限');
        this.radio2 = 0;
        this.skilledShow = false;
        this.languageType.forEach(x => {
          x.level = '0';
        })
        return false;
      } else {
        if (index == '7') {
          this.decOtherShow = true;
        } else {
          this.decOtherShow = false;
        }
        this.selectLanguageType = this.selectLanguageType.filter(x => {
          return x != '不限'
        });
        this.skilledShow = true;
        this.radio2 = Number(languageItem.level);

        this.ruleForm2.languages.forEach((item, index) => {
          if (item.id == languageItem.id) {
            flag = false;
            this.ruleForm2.languages.splice(index, 1);
            this.radio2 = 0;
          }
        })
        if (flag) {
          languageItem.level = parseInt(languageItem.level, 10);
          this.ruleForm2.languages.push(languageItem);
        }

      }

    },
    removeLanguage(lan, index) { //删除选中语言项
      this.skilledShow = false;
      this.ruleForm2.languages.splice(index, 1);
      this.selectLanguageType.forEach((y, i) => {
        if (lan.name == y) {
          this.selectLanguageType.splice(i, 1);
        }
      })

      this.languageType.forEach((x, i) => {
        if (x.name == lan.name) {
          this.languageType[i].level = '0';
        }
      })
    },
    editSkilled(val) { //编辑选中语言熟练度
      this.ruleForm2.languages.forEach((x, i) => {
        if (x.id == this.activeLanguageId) {
          this.ruleForm2.languages[i].level = val;
        }
      })
      this.languageType.forEach((x, i) => {
        if (x.id == this.activeLanguageId) {
          this.languageType[i].level = val;
        }
      })

    },
    editOther() { //选择其他
      this.ruleForm2.languages.forEach((x, i) => {
        if (x.id == '7') {
          this.ruleForm2.languages[i].name = this.decOtherData == '' ? '其他' : this.decOtherData;
        }
      })
    },
    addCompanyHobby() {
      this.ruleForm3.corporations.push('');
    },
    editCompanyHobby(value, index) {
      this.ruleForm3.corporations[index] = value;
    },
    removeCompanyHobby(index) {
      this.ruleForm3.corporations.splice(index, 1);
    },
    addSchoolHobby() {
      this.ruleForm3.schools.push('');
    },
    editSchoolHobby(value, index) {
      this.ruleForm3.schools[index] = value;
    },
    removeSchoolHobby(index) {
      this.ruleForm3.schools.splice(index, 1);
    },
    removeCheckIndustry(tid) { //删除选中行业
      this.$refs.CdSelectIndustry.removeCheckIndustry(tid);
    },
    addSkill(event) {//添加技能
      let str = this.strSkill;
      let flag = true;
      this.ruleForm3.skills.forEach(x=>{       
        if(x == trim(str)){
          flag = false;
        }
      })
      if (flag && trim(this.strSkill) !== '') {
        if (str.substr(this.strSkill.length - 1, 1) == ' ') {
          if (this.ruleForm3.skills.length < 5) {
            this.ruleForm3.skills.push(trim(this.strSkill));
            this.strSkill = '';
          } else {
            this.$message('最多允许填写5个');
          }
        }
      }
    },
    isShowSkillInput() {
      var input = document.querySelector('.skill-input input');
      this.skillShow = true;
      setTimeout(function () {
        input.focus();
      }, 1)
    },
    isHideSkillInput() {
      if (this.ruleForm3.skills.length !== 0) {
        this.skillShow = false;
      }
    },
    removeSkill(index) {
      if(!_.isObject(index)){
        this.ruleForm3.skills.splice(index, 1);
      }else{
        if(this.strSkill.length == 0){
           this.ruleForm3.skills.pop();
        }   
      }
      
      if (this.ruleForm3.skills.length == 0) {
        this.skillShow = true;
      }
    },
    cancelPost(){
      var self = this;
      this.$msgbox({
					title: '提示',
					message: '您确定要取消职位发布吗？',
          showCancelButton: true,
					confirmButtonText: '确定',
          cancelButtonText:'取消',
					confirmButtonClass: 'cd-primary',
          cancelButtonClass:'cd-default',
          callback(action,instance){
            if(action == 'confirm'){
              self.$router.push({name:'position'});
            }
          }
				})
    }
  },
  components: {
    navbar,
    CdSelectCity,
    CdSelectIndustry
  },
  filters: {
    skilled(val) {
      let x;
      switch (val) {
        case 1:
          x = '[一般]';
          break;
        case 2:
          x = '[良好]';
          break;
        case 3:
          x = '[熟练]';
          break;
        case 4:
          x = '[精通]';
          break;
        default:
          x = '';

      }
      return x;
    }
  }
}

</script>
<style lang="scss">
.line {
  text-align: center;
}

.postinner {
  .el-form-item.is-required .el-form-item__label:before {
    margin-left: -10px;
  }
  .el-autocomplete {
    display: block;
  }
  .el-form-item__label {
    font-size: 12px;
    color: #999999;
  }
  .el-input__inner {
    border: 1px solid #ccc;
  }
  .company-hobby,
  .school-hobby {
    .el-input__inner {
      margin-bottom: 16px;
    }
    li {
      position: relative;
      .icon-delete {
        position: absolute;
        right: -30px;
        top: 12px;
      }
    }
    .add-btn {
      .icon-add {
        color: #333;
        &:before {
          padding-right: 4px;
        }
        &:hover {
          color: #FE6B2B;
          cursor: pointer;
        }
      }
    }
  }
  .school-hobby {
    .el-input__inner {
      margin-top: 16px;
    }
    ul {
      li {
        .icon-delete {
          position: absolute;
          right: -30px;
          top: 29px;
        }
      }
    }
  }
  .footer_wrapper {
    text-align: center;
    margin-top: 50px;
  }
  .postinfo {
    width: 100%;
    height: 26px;
    line-height: 26px;
    text-align: center;
    color: #666;
    background-color: #F8F8F8;
    margin-bottom: 20px;
    i {
      display: inline-block;
      width: 14px;
      height: 14px;
      line-height: 14px;
      border: 1px solid #999;
      margin-right: 5px;
      -webkit-border-radius: 14px;
      -moz-border-radius: 14px;
      border-radius: 14px;
    }
  }
  .industry-wrapper {

    .industry-selector-selected {
      height: 36px;
      white-space: nowrap;
      border: 1px solid #ccc;
      overflow: hidden;
      li {
        display: inline-block;
        &.columns-item {
          border-radius: 3px;
          background-color: #FFF6F2;
          color: #FE6B2B;
          height: 22px;
          line-height: 22px;
          cursor: pointer;
          margin-right: 5px;
          margin-left: 2px;
          padding: 0 5px 0 10px;
          em {
            color: #ccc;
            &:hover {
              color: #FE6B2B;
            }
          }
        }
      }
    }
  }

  .edu-items {
    .icon-tick {
      display: none;
    }
    .active {
      .icon-tick {
        display: block;
      }
    }
  }
  .skill-wrapper {
    border: 1px solid #ccc;
    &.active {
      border-color: #20a0ff;
      border-bottom: 0;
      position: relative;
      z-index: 1;
      top: 1px;
      background: white;
    }
    .columns-item {
      display: inline-block;
      border-radius: 3px;
      background-color: #FFF6F2;
      color: #FE6B2B;
      height: 22px;
      line-height: 22px;
      cursor: pointer;
      margin-right: 5px;
      margin-left: 2px;
      padding: 0 5px 0 10px;
      em {
        color: #ccc;
        &:hover {
          color: #FE6B2B;
        }
      }
    }
  }
}

.v-container .el-input__inner {
  border-radius: 0;
}

.language-select {
  .pos {
    position: relative
  }
  .language-selector-selected {
    position: absolute;
    top: 0;
    height: 30px;
    overflow: hidden;
    width: 290px;

    li {
      color: #FE6B2B;
      font-size: 14px;
      padding: 0 5px 0 10px;
      height: 22px;
      line-height: 22px;
      cursor: pointer;
      background-color: #FFF6F2;
      margin-right: 5px;
      margin-left: 4px;
      border-radius: 3px;
      position: relative;
      display: inline-block;
      .icon-close {
        color: #CCCCCC;
        &:hover {
          color: #FE6B2B;
        }
      }
    }
  }
  .wrapper {
    width: 288px;
    height: 200px;
    overflow: hidden;
    background: #FFFFFF;
    border: 1px solid #DDDDDD;
    position: absolute;
    z-index: 10;
    aside {
      width: 110px;
      float: left;
      border-right: 1px solid #ccc;
    }
    article {
      float: left;
      width: 164px;
      .items {
        margin-left: 4px;
      }
      .el-radio {
        display: block;
        margin-left: 20px;
      }
      .el-radio+.el-radio {
        margin-left: 20px;
      }
      .title {
        font-size: 12px;
        color: #999999;
        padding-left: 20px;
        height: 40px;
        line-height: 40px;
      }
    }
    .orange {
      height: 200px;
      overflow-y: auto;
    }
  }
  .oversea_wrapper {
    margin-left: 83px;
  }
}

.orange .el-checkbox__inner:hover {
  border-color: #FE6B2B;
}

.orange .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #FE6B2B;
  border: 1px solid #FE6B2B;
}

.orange .el-checkbox {
  margin-left: 18px;
  display: block;
}

.orange .el-checkbox+.el-checkbox {
  margin-left: 18px;
  display: block;
}

.language-select .el-radio__input.is-checked .el-radio__inner {
  background-color: #FE6B2B;
  border: 1px solid #FE6B2B;
}

.language-select .el-radio__inner {
  height: 14px;
  width: 14px;
}

.language-select .el-radio {
  height: 30px;
}

.language-select .el-radio__label {
  font-size: 12px;
}

.language-select .el-radio__inner:hover {
  border-color: #FE6B2B;
}
</style>
