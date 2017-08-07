<template>
  <div class="main_wrapper">
    <div v-show="!isLoading">
      <div class="account_name">
        <P>{{profileData.contact}}</P>
        <span v-show="profileData.user_type == 2">{{profileData.type|accountType}}</span>
      </div>
      <div class="mail mt10">
        {{profileData.email}}
        <em class="edit" @click.stop="showEditPass">修改密码</em>
  
      </div>
      <div class="info mt40">
        公司信息
      </div>
      <dl class="itmes_msg mt20">
        <dt>公司名称</dt>
        <dd>{{profileData.company_name}}</dd>
      </dl>
      <dl class="itmes_msg mt30" v-show="profileData.user_type == 2">
        <dt>统一社会信用代码</dt>
        <dd>{{profileData.company_license}}</dd>
      </dl>
      <dl class="itmes_msg mt30" v-show="profileData.user_type == 2">
        <dt class="l">业务领域</dt>
        <dd>
          <ul class="industry-selector-selected">
            <li class="columns-item" v-for="industry in industries" @click="$event.stopPropagation()">
              {{industry.name}}
            </li>
          </ul>
          <em v-show="profileData.type != 2 " @click="editBusiness" class="edit">编辑</em>
        </dd>
      </dl>
  
      </dl>
      <div class="info mt40">
        联系方式
      </div>
      <dl class="itmes_msg mt20">
        <dt>负责人</dt>
        <dd>
          <span class="title" v-show="contact.checked">{{contact.name}}</span>
          <div v-show="!contact.checked">
            <input class='cd-input' type="text" v-model="contact.name">
            <span class="small-btn" @click="saveContact">确定</span>
            <!--<p class="err_msg">dsfdsf</p>-->
          </div>
          <em v-bind:class="{'no_edit':!isEdit}" v-show="contact.checked" class="edit" @click="editContact">编辑</em>
        </dd>
      </dl>
      <dl class="itmes_msg mt30">
        <dt>联系电话</dt>
        <dd>
          <span v-show="phone.checked" class="title">{{phone.tel_area_code}}-{{phone.tel_number}}-{{phone.tel_ext}}</span>
          <div v-show="!phone.checked">
            <input class="cd-input small_input" v-model="phone.tel_area_code" type="text">
            <input class="cd-input middle_input" v-model="phone.tel_number" type="text">
            <input class="cd-input small_input mr0" v-model="phone.tel_ext" type="text">
            <span class="small-btn" @click="savePhone">确定</span>
          </div>
          <em v-bind:class="{'no_edit':!isEdit}" class="edit" v-show="phone.checked" @click="editPhone">编辑</em>
        </dd>
      </dl>
      <dl class="itmes_msg mt30">
        <dt>手机号</dt>
        <dd>
          <span class="title" v-if="mobile.checked">{{mobile.number}}</span>
          <div v-if="!mobile.checked">
            <input class='cd-input' type="text" v-model="mobile.number">
            <span class="small-btn" @click="saveMobile">确定</span>
          </div>
          <em v-bind:class="{'no_edit':!isEdit}" v-show="mobile.checked" class="edit" @click="editMobile">编辑</em>
        </dd>
      </dl>
    </div>
    <loading :loading="isLoading"></loading>
  
    <el-dialog title="修改密码" custom-class="editPassWord_dialog" v-model="dialogVisiblePass" size="tiny" :lock-scroll="false">
      <el-form :model="ruleForm1" :rules="rules2" ref="ruleForm1" :label-position="labelPosition">
        <el-form-item class="colums" label="原密码" :label-width="formLabelWidth" prop="oldPassWord" required>
          <el-input type="password" v-model="ruleForm1.oldPassWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="colums" label="新密码" :label-width="formLabelWidth" prop="passWord" required>
          <el-input type="password" v-model="ruleForm1.passWord" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item class="colums" label="确认密码" :label-width="formLabelWidth" prop="checkPassword" required>
          <el-input type="password" v-model="ruleForm1.checkPassword" auto-complete="off"></el-input>
        </el-form-item>
  
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="cd-button cd-button-default" @click="dialogVisiblePass = false">取 消</span>
        <span class="cd-button cd-button-primary" @click="savePassWord('ruleForm1')">确 定</span>
      </span>
    </el-dialog>
    <!--行业弹窗-->
    <cd-select-industry ref="CdSelectIndustry" :industries="industries" :show="dialogVisible" @on-change-show="onChangeShow" @on-save="saveBusiness"></cd-select-industry>
  </div>
</template>

<script>
import ejax from '../../assets/js/ejax';
import CdSelectIndustry from '../../components/SelectIndustry/SelectIndustry';
import { getQuery } from '../../assets/js/base';
import Cookies from 'js-cookie'
export default {
  name: 'Profile',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm1.passWord) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    var isPassWord = (rule, value, callback) => {
      if (!/^[A-Za-z0-9]+$/.test(value)) {
        callback(new Error('请输入6-18包含数字、字母的密码'));
      } else {
        callback();
      }
    };
    return {
      labelPosition: 'left',
      dialogVisiblePass: false,
      dialogVisible: false,
      profileData: {},
      industries: [],
      ruleForm1: {
        oldPassWord: '',
        passWord: '',
        checkPassword: '',
      },
      rules2: {
        oldPassWord: [{
          required: true,
          message: '请输入原密码',
          trigger: 'blur'
        }, { min: 6, max:18,message: '请输入6-18包含数字、字母的密码', trigger: 'blur' },{validator:isPassWord,trigger:'blur'}],
        passWord: [{
          required: true,
          message: '请输入6-18包含数字、字母的密码',
          trigger: 'blur'
        }, { min: 6, max:18,message: '请输入6-18包含数字、字母的密码', trigger: 'blur' },
        {validator:isPassWord,trigger:'blur'}],
        checkPassword: [{
          validator: validatePass,
          trigger: 'blur'
        }, { min: 6, max:18, message: '请输入6-18包含数字、字母的密码', trigger: 'blur' }]
      },
      formLabelWidth: '40%',
      contact: { //联系人
        name: '',
        checked: true,
      },
      mobile: { //手机号
        number: '',
        checked: true
      },
      phone: {
        tel_area_code: '',
        tel_number: '',
        tel_ext: '',
        checked: true
      },
      isEdit: true,
      isLoading: true

    }
  },
  mounted() {
    this.getAccountDetail();
  },
  methods: {
    getAccountDetail() {
      this.isLoading = true;
      return ejax.post('/api/account/detail?format=json')
        .then(data => {
          let arrBusiness;
          if (data.data.results.account.main_business) {
            arrBusiness = JSON.parse(data.data.results.account.main_business);
            this.editIndustrty(arrBusiness);
          }
          this.profileData = data.data.results.account;
          this.contact.name = this.profileData.contact;
          //this.industries = JSON.parse(data.data.results.account.main_business);
          _.assign(this.phone, this.profileData);
          this.mobile.number = this.profileData.mobile;
          this.isLoading = false;
        })
        .catch(err => {
          console.log(err);
        })
    },
    updatedAccount(obj) {
      var parm = {
        account_id: this.profileData.type == '1' ? '' : this.profileData.id
      };
      _.assign(parm, obj);
      return ejax.post('/api/account/update?format=json', parm)
    },
    showEditPass() {
      this.dialogVisiblePass = !this.dialogVisiblePass;
    },
    editBusiness() {
      this.dialogVisible = true;
    },
    saveBusiness() {
      let arr = [];
      this.industries.forEach(x => {
        arr.push(x.tid);
      })
      this.updatedAccount({
        'main_business': JSON.stringify(arr)
      })

    },
    editContact() {
      if (this.isEdit) {
        this.isEdit = !this.isEdit;
        this.contact.checked = false;
      }
    },
    saveContact() {
      if (this.contact.name == '') {
        this.isEdit = !this.isEdit;
        this.contact.checked = true;
        this.getAccountDetail();
      } else {
        this.updatedAccount({
          contact: this.contact.name
        }).then((res) => {
          this.isEdit = !this.isEdit;
          this.contact.checked = true;
        }).catch((err) => {
          err.data.results.forEach(x => {
            for (let i in x) {
              this.$message(x[i].err_msg);
            }
          })
        })
      }


    },
    editMobile() {
      if (this.isEdit) {
        this.isEdit = !this.isEdit;
        this.mobile.checked = false;
      }
    },
    saveMobile() {
      this.updatedAccount({
        mobile: this.mobile.number
      })
        .then(res => {
          this.isEdit = !this.isEdit;
          this.mobile.checked = true;
          this.getAccountDetail();
        })
        .catch(err => {
          err.data.results.forEach(x => {
            for (let i in x) {
              this.$message(x[i].err_msg);
            }
          })
        })
    },
    editPhone() {
      if (this.isEdit) {
        this.isEdit = !this.isEdit;
        this.phone.checked = false;
      }
    },
    savePhone() {
      this.updatedAccount({
        tel_area_code: this.phone.tel_area_code,
        tel_number: this.phone.tel_number,
        tel_ext: this.phone.tel_ext
      })
        .then(res => {
          this.isEdit = !this.isEdit;
          this.phone.checked = true;
          this.getAccountDetail();
        })
        .catch(err => {
          err.data.results.forEach(x => {
            for (let i in x) {
              this.$message(x[i].err_msg);
            }
          })
        })
    },
    savePassWord(formName) {
      let parm = {
        account_id: this.profileData.type == '1' ? '' : this.profileData.id
      };
      this.$refs[formName].validate((valid) => {
        if (valid) {
          parm.old_password = this.ruleForm1.oldPassWord;
          parm.new_password = this.ruleForm1.checkPassword;
          ejax.post('/api/account/update_password?format=json', parm)
            .then(res => {
              var self = this;
              this.$message({
                message: '密码修改成功,请重新登录',
                onClose: function () {
                  ejax.post('/api/account/logout?format=json')
                    .then(res => {
                      Cookies.remove('user_info');
                      self.$router.push({ path: '/' });
                    })
                    .catch(err => {
                      console.log(err);
                    })
                }
              });

            })
            .catch(err => {
              this.$message(err.data.err_msg);
            })
        }
      })



    },
    onChangeShow(val) {
      this.dialogVisible = val;
    },
    removeCheckIndustry(tid) { //删除选中行业
      this.$refs.CdSelectIndustry.removeCheckIndustry(tid);
    },
    editIndustrty(arr) {//数组添加行业
      this.industries = [];
      this.$refs.CdSelectIndustry.editIndustrty(arr);
    }
  },
  components: {
    CdSelectIndustry
  },
  filters: {
    accountType(val) {
      if (val === '1') {
        return '主账号';
      } else {
        return '子账号';
      }
    }
  }
}

</script>
<style lang="scss">
.main_wrapper {
  margin: 0 70px;
  padding-bottom: 190px;
  .edit {
    font-size: 14px;
    color: #3B99FF;
    padding-left: 20px;
    cursor: pointer;
  }
  .no_edit {
    color: #ccc;
    cursor: not-allowed;
  }
  .account_name {
    p {
      font-size: 20px;
      color: #333;
      line-height: 20px;
      padding-top: 30px;
      display: inline-block;
      font-weight: 800;
    }
    span {
      display: inline-block;
      width: 48px;
      height: 18px;
      background-color: #FEF2EF;
      border-radius: 2px;
      color: #FE6B2B;
      text-align: center;
      vertical-align: text-bottom;
      margin-left: 4px;
    }
  }
  .mail {
    font-size: 14px;
    color: #333;
    .icon-email {
      color: #D8D8D8;
      font-size: 18px;
      vertical-align: sub;
    }
  }
  .industry-selector-selected {
    display: inline-block;
    max-width: 427px;
    .columns-item {
      display: inline-block;
      background: #FEF2EF;
      font-size: 12px;
      color: #FC3333;
      border-radius: 2px;
      margin-right: 10px;
      margin-bottom: 10px;
      height: 22px;
      line-height: 22px;
      padding: 0 10px;
    }
  }
  .info {
    background: #FCFCFC;
    color: #999;
    padding-left: 10px;
    height: 24px;
    line-height: 24px;
  }
  .itmes_msg {
    dt,
    dd {
      display: inline-block;
      font-size: 14px;
      color: #333;
      position: relative;
    }
    dt {
      width: 200px;
      padding-left: 10px;
    }
    .title {
      height: 26px;
      line-height: 26px;
      display: inline-block;
    }
    .small_input {
      width: 56px;
      height: 24px;
      padding-left: 10px;
      border: 1px solid #DDDDDD;
      margin-right: 10px;
    }
    .middle_input {
      width: 86px;
      height: 24px;
      padding-left: 10px;
      border: 1px solid #DDDDDD;
      margin-right: 10px;
    }
    .mr0 {
      margin-right: 0;
    }
    .err_msg {
      position: absolute;
      left: 10px;
      bottom: -21px;
    }
  }
  .editPassWord_dialog {
    .el-dialog__body {
      padding-right: 16%;
    }
    .colums {
      label {
        padding-left: 10%;
      }
    }
  }
  .cd-input {
    width: 250px;
    height: 24px;
    padding-left: 10px;
    border: 1px solid #DDDDDD;
    &:focus {
      border: 1px solid #3B99FF;
    }
  }
  .small-btn {
    display: inline-block;
    width: 48px;
    height: 27px;
    background-color: #FE6B2B;
    border-radius: 2px;
    color: white;
    text-align: center;
    line-height: 27px;
    margin-left: 16px;
    cursor: pointer;
  }
}
</style>
