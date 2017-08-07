<template>
  <div class="sub-account">
    <div class="btn-wrapper mt30">
      <span class="create-btn" @click="addSubAccount">创建子账号</span>
    </div>
    <div v-show="!isShow" class="main mt20">
      <el-table :data="tableData" style="width: 100%" :row-class-name="isStatusClass">
        <el-table-column prop="contact" label="负责人" align='left'>
        </el-table-column>
        <el-table-column prop="email" label="账号" align='left'>
        </el-table-column>
        <el-table-column prop="position_num" width="100" label="发布职位" align='center'>
        </el-table-column>
        <el-table-column prop="resumes_num" width="100" label="上传简历" align='center'>
        </el-table-column>
        <el-table-column label="操作" align='center'>
          <template scope="scope">
            <span @click="switchStatus(scope.row)" class="is_open">{{scope.row.status | filterStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="编辑" width="100" align='center'>
          <template scope="scope">
            <i @click="editSubAccount(scope.row)" class="icon-edit"></i>
            <!--<el-button type="text" size="small" @click="editSubAccount(scope.row)">编辑</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="isShow" class="resume_empty">
      <img src="../../assets/img/empty.png" alt="">
      <p>暂未创建子账号</p>
    </div>
    <!--创建新子账号-->
    <el-dialog title="创建子账号" custom-class="editSub_dialog" v-model="dialogVisibleAccountCreate" :lock-scroll="false" size="tiny">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left">
        <el-form-item class="colums" label="登录邮箱" label-width="100px" prop="email" required>
          <el-input v-model="ruleForm.email" auto-complete="off" placeholder="请输入账号登录邮箱"></el-input>
        </el-form-item>
        <el-form-item class="colums" label="登录密码" label-width="100px" prop="password" required>
          <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="请设置6-18位包含数字，字母的登录密码"></el-input>
        </el-form-item>
        <el-form-item class="colums" label="负责人" label-width="100px" prop="contact" required>
          <el-input v-model="ruleForm.contact" auto-complete="off" placeholder="请输入负责人姓名"></el-input>
        </el-form-item>
        <el-form-item class="colums" label="固定电话" label-width="100px">
          <el-col :span="5">
            <el-form-item prop="tel_area_code">
              <el-input v-model="ruleForm.tel_area_code" :maxlength='5' placeholder="区号" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item prop="tel_number">
              <el-input v-model="ruleForm.tel_number" :maxlength='8' placeholder="固定电话号码" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item prop="tel_ext">
              <el-input v-model="ruleForm.tel_ext" :maxlength='6' placeholder="分机" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item class="colums" label="手机" label-width="100px" prop="mobile" required>
          <el-input v-model="ruleForm.mobile" auto-complete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
  
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="cd-button cd-button-default" @click="dialogVisibleAccountCreate = false">取 消</span>
        <span class="cd-button cd-button-primary" @click="saveSubAccount('ruleForm')">确 定</span>
      </span>
    </el-dialog>
  
    <!--编辑账号-->
    <el-dialog title="编辑子账号" custom-class="editSub_dialog" v-model="dialogVisibleAccountEdit" size="tiny" :lock-scroll="false">
      <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-position="left">
        <el-form-item class="colums" label="登录邮箱" label-width="100px" prop="email">
          {{ruleForm1.email}}
          <!--<el-input :disabled="disable" v-model="ruleForm1.email" auto-complete="off" placeholder="请输入账号登录邮箱"></el-input>-->
        </el-form-item>
        <el-form-item class="colums" label="登录密码" label-width="100px" prop="password">
          <el-input type="password" v-model="ruleForm1.password" auto-complete="off" placeholder="请设置6-18位包含数字，字母的登录密码"></el-input>
        </el-form-item>
        <el-form-item class="colums" label="负责人" label-width="100px" prop="contact" required>
          <el-input v-model="ruleForm1.contact" auto-complete="off" placeholder="请输入负责人姓名"></el-input>
        </el-form-item>
        <el-form-item class="colums" label="固定电话" label-width="100px">
          <el-col :span="5">
            <el-form-item prop="tel_area_code">
              <el-input v-model="ruleForm1.tel_area_code" :maxlength='5' placeholder="区号" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item prop="tel_number">
              <el-input v-model="ruleForm1.tel_number" :maxlength='8' placeholder="固定电话号码" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-form-item prop="tel_ext">
              <el-input v-model="ruleForm1.tel_ext" :maxlength='6' placeholder="分机" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item class="colums" label="手机" label-width="100px" prop="mobile" required>
          <el-input v-model="ruleForm1.mobile" auto-complete="off" placeholder="请输入手机号"></el-input>
        </el-form-item>
  
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span class="cd-button cd-button-default" @click="dialogVisibleAccountEdit = false">取 消</span>
        <span class="cd-button cd-button-primary" @click="saveEditSubAccount('ruleForm1')">确 定</span>
      </span>
    </el-dialog>
  
  </div>
</template>

<script>
import ejax from '../../assets/js/ejax';
import { getQuery } from '../../assets/js/base';

export default {
  name: 'SubAccount',
  data() {
    var isPhone = (rule, value, callback) => {
      if (!/^(1\d{10})$/.test(value)) {
        callback(new Error('请确认手机号'));
      } else {
        callback();
      }
    };
    var vaildAreaCode = (rule, value, callback) => {
      if (value) {
        if (!/^[0-9]*$/.test(value)) {
          callback(new Error('请填写数字'));
        } else if (!/^[0]+/.test(value)) {
          callback(new Error('首位必为0'));
        } else {
          callback();
        }
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
    var isNumber = (rule, value, callback) => {
        if (!/^\s+$|^[0-9]*$/.test(value)) {
          callback(new Error('填入数字'));
        } else {
          callback();
        }

    };
    return {
      tableData: [],
      dialogVisibleAccountCreate: false,
      dialogVisibleAccountEdit: false,
      dialogVisibleAccountSwitch: false,
      ruleForm: { //新建子账号
        email: '',
        password: '',
        contact: '',
        tel_area_code: '',
        tel_number: '',
        tel_ext: '',
        mobile: ''
      },
      rules: {//新建子账号验证规则
        email: [{
          required: true,
          type: 'email',
          message: '请输入正确的邮箱',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          min:6,
          max:18,
          message: '请设置6-18位包含数字，字母的登录密码',
          trigger: 'blur'
        },{validator:isPassWord,trigger:'blur'}],
        contact: [{
          required: true,
          max: 20,
          message: '联系人长度不超过20个字符',
          trigger: 'blur'
        }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' },
        { min: 11, max: 11, message: '请确认手机号', trigger: 'blur' },
        { validator: isPhone, trigger: 'blur' }],
        tel_area_code: [
          { validator: vaildAreaCode, trigger: 'blur' }
        ],
        tel_number: [
          { validator: isNumber, trigger: 'blur' }
        ],
        tel_ext: [
          { validator: isNumber, trigger: 'blur' }
        ]

      },
      ruleForm1: { //编辑子账号
        email: '',
        password: '',
        contact: '',
        tel_area_code: '',
        tel_number: '',
        tel_ext: '',
        mobile: ''
      },
      rules1: {//编辑子账号验证规则
        contact: [{
          required: true,
          max: 20,
          message: '联系人长度不超过20个字符',
          trigger: 'blur'
        }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请确认手机号', trigger: 'blur' },
          { validator: isPhone, trigger: 'blur' }
        ],
        tel_area_code: [
          { validator: vaildAreaCode, trigger: 'blur' }
        ],
        tel_number: [
          { validator: isNumber, trigger: 'blur' }
        ],
        tel_ext: [
          { validator: isNumber, trigger: 'blur' }
        ]

      },
      labelPosition: 'left',
      formLabelWidth: '160px',
      isShow: false
    }
  },
  mounted() {
    this.getAccountData();
  },
  methods: {
    getAccountData() {
      ejax.post('/api/account/sub_account_list?format=json')
        .then(accountList => {
          this.tableData = accountList.data.results.results;
          if (this.tableData.length == 0) {
            this.isShow = true;
          } else {
            this.isShow = false;
          }
        })
        .catch(err => {
          console.log(err);
        })
    },
    addSubAccountData(obj) {
      let parm = {};
      _.assign(parm, obj);
      return ejax.post('/api/account/add_sub_account?format=json', parm)
    },
    updatedSubAccountData(obj) {
      let tempObj = _.cloneDeep(obj);
      for (let i in tempObj) {
        if (tempObj[i] == '') {
          delete tempObj[i];
        }
      }
      return ejax.post('/api/account/update?format=json', tempObj)
    },
    addSubAccount() {
      this.dialogVisibleAccountCreate = true;
      this.ruleForm = this.$options.data().ruleForm;

    },
    saveSubAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addSubAccountData(this.ruleForm)
            .then(data => {
              this.dialogVisibleAccountCreate = false;
              this.getAccountData();
            })
            .catch(err=>{
              this.$message(err.data.err_msg);
            })
        }
      })
    },
    saveEditSubAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updatedSubAccountData(this.ruleForm1)
            .then(data => {
              this.dialogVisibleAccountEdit = false;
              this.getAccountData();
            })
            .catch(err => {
              this.$message(err.data.err_msg);
              console.log(err);
            })
        }
      })
    },
    editSubAccount(obj) {
      var self = this;
      for (let i in this.ruleForm1) {
        this.ruleForm1[i] = '';
      }
      ejax.post('/api/account/detail?format=json', { 'account_id': obj.id })
        .then(data => {
          _.forEach(this.ruleForm1, function (value, key) {
            _.forEach(data.data.results.account, function (value1, key1) {
              if (key == key1) {
                self.ruleForm1[key] = value1;
              }
            })
          })
          this.ruleForm1.account_id = obj.id;
          this.dialogVisibleAccountEdit = true;
        })
    },
    switchStatus(row, index) {
      let parm = {
        'account_id': row.id
      }
      let strContent = row.status == 1 ? '确定禁用该账号' : '确定启用该账号';
      this.$confirm(strContent, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        confirmButtonClass: 'cd-primary',
        cancelButtonClass: "cd-default"
      })
        .then(() => {
          return ejax.post('/api/account/update_status?format=json', parm)
        })
        .then(res => {
          //console.log(res);
          this.getAccountData();
        })
        .catch(err => {
          console.log(err);
        })
    },
    isStatusClass(row, index) {
      if (row.status == 2) {
        return 'inactive';
      }
    }
  },
  components: {

  },
  filters: {
    filterStatus(val) {
      if (val == 1) {
        return '禁用';
      } else if (val == 2) {
        return '开启';
      } else {
        return '待审核';
      }
    }
  }
}

</script>
<style lang="scss">
.sub-account {
  margin: 0 70px;
  .resume_empty {
    height: 600px;
  }
  .btn-wrapper {
    .create-btn {
      display: inline-block;
      width: 120px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 4px;
      color: white;
      background-color: #FE6B2B;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .main {
    .is_open {
      color: #333;
      cursor: pointer;
    }
    .icon-edit {
      cursor: pointer;
      &:hover {
        color: #20a0ff;
      }
    }
  }
  .editSub_dialog {
    .el-dialog__body {
      padding-right: 16%;
      padding-left: 16%;
    }
    .el-form-item.is-required .el-form-item__label:before {
      margin-left: -14px;
    }
  }
  .el-table::after,
  .el-table::before {
    background-color: white;
  }
  .el-table__header-wrapper thead div {
    background-color: #FCFCFC;
    color: #999;
    font-weight: normal;
  }
  .el-table {
    border: 0;
    td {
      border-bottom: 0;
      .cell {
        overflow: hidden;
        white-space: nowrap;
      }
    }
    tr {
      background-color: white;
    }
    th {
      background-color: #FCFCFC;
      &.is-leaf {
        border-bottom: 0px;
      }
    }
    &::before {
      background-color: white;
    }

    .inactive {
      .cell {
        color: #999;
      }
    }
  }
  .el-table--enable-row-hover {
    .el-table__body {
      tr {
        &:hover {
          &>td {
            background: white;
          }
        }
      }
    }
  }
}
</style>
