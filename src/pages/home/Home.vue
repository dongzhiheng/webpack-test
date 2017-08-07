<template>
    <div class="home">
        <div class="wrapper">
            <div class="left"></div>
            <div class="main">
                <div class="top">
                    <div class="logo">橙单</div>
                    <div class="login_info">
                        加入橙单，请联系：021-63086522 &nbsp&nbsp |
                        <span @click="openLogin">登录</span>
                    </div>
                    <div class="title1"></div>
                    <div class="title2"></div>
                </div>
            </div>
            <div class="right"></div>
        </div>
        <div class="introduce-list">
            <ul>
                <li>
                    <div class="infos">
                        <dl>
                            <dt class="mt20">
                                <strong>人才库</strong>
                            </dt>
                            <dd class="mt10">独创简历去重算法，帮助企业更新历史简历，并基
                                <br/>于岗位智能推荐再次利用，让成单率节节高</dd>
                        </dl>
                    </div>
                    <div class="images">
                        <img class="r" src="../../assets/img/home/home-sync.png" alt="">
                    </div>
                </li>
                <li>
                    <div class="images">
                        <img class="l" src="../../assets/img/home/home-Compass.png" alt="">
                    </div>
                    <div class="infos">
                        <dl>
                            <dt class="mt20">
                                <strong>人才匹配</strong>
                            </dt>
                            <dd class="mt10">基于大数据分析企业岗位用人偏好，个性化推荐
                                <br/>最适合的候选人，让猎头成单更容易</dd>
                        </dl>
                    </div>
                </li>
                <li>
                    <div class="infos">
                        <dl>
                            <dt class="mt20">
                                <strong>人才地图</strong>
                            </dt>
                            <dd class="mt10">关于目标公司，从组织架构到人员背景，你想知道的
                                <br/>所有秘密，都能从这里获取</dd>
                        </dl>
                    </div>
                    <div class="images">
                        <img class="r" src="../../assets/img/home/home-map.png" alt="">
                    </div>
                </li>
                <!--<li>
                        <div class="images">
                            <img class="l" src="../../assets/img/home/home-send.png" alt="">
                        </div>
                        <div class="infos">
                            <dl>
                                <dt class="mt20">
                                    <strong>智能BD</strong>
                                </dt>
                                <dd class="mt10">挖掘全网企业招聘信息，职能分析、匹配人才库合适
                                    <br/>人才，一键向企业发出推荐</dd>
                            </dl>
                        </div>
                    </li>-->
    
            </ul>
        </div>
        <div class="foot">
            <p>上海逸橙信息科技有限公司 Copyright © 2012 - 2017 | 沪ICP备12043691号-1 沪公网安备 31010102002040 号</p>
        </div>
        <el-dialog custom-class="login_wrapper" v-model="dialogVisible" size="tiny" :close-on-click-modal="false" :close-on-press-escape="false" @close="closeLogin">
    
            <h2 v-show="dialogType !== '设置成功'">{{dialogType}}</h2>
            <div v-show="dialogType == '账号登录'">
                <el-form :model="ruleForm1" :rules="rules1" ref="ruleForm1" label-position="left" class="demo-ruleForm login-container">
                    <el-form-item class="mt40 login-input" label-width="20%" label="登录邮箱" prop="username">
                        <el-input type="text" v-model="ruleForm1.username" :autofocus="true" auto-complete="off" placeholder="请输入登录邮箱">
                        </el-input>
                    </el-form-item>
                    <el-form-item class="mt30 login-input" label-width="20%" label="登录密码" prop="passwordmd5">
                        <el-input type="password" v-model="ruleForm1.passwordmd5" @keydown.enter.stop.native="login('ruleForm1')" auto-complete="off" placeholder="请输入登录邮箱密码"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" class="mt30 login-input" label-width="20%" prop="mmm" v-if="show_vcode">
                        <el-input v-model="ruleForm1.vcode" @keydown.enter.stop.native="login('ruleForm1')" auto-complete="off" placeholder="请输入验证码"></el-input>
                        <img class="code_img" @click="changeVcode" :src="vcode_img" alt="">
                    </el-form-item>
                    <div>
                        <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
                        <p @click="toReset" class="con r">忘记密码？</p>
                    </div>
                    <div class="footer mt30">
                        <span class="cd-button cd-button-primary" @click="login('ruleForm1')">登录</span>
                    </div>
                </el-form>
            </div>
            <div v-show="dialogType == '忘记密码'">
                <el-form v-show="step == 0" :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" class="demo-ruleForm login-container">
                    <el-form-item class="mt40 reset-input" label="登录邮箱" label-width="20%" prop="email">
                        <el-input @change="delectInfo" type="text" v-model="ruleForm2.email" auto-complete="off" placeholder="请输入登录邮箱">
                        </el-input>
                        <p v-show="errEmail" class="info">{{errEmail}}</p>
                    </el-form-item>
                    <el-form-item class="mt40 reset-input" label="验证码" label-width="20%" prop="code">
                        <el-input type="text" v-model="ruleForm2.code" auto-complete="off" placeholder="请输入验证码">
                        </el-input>
                        <span @click.stop="getResetCode()" class='code_wrapper'>
                            <i class="stand"></i>
                            <em class="get-code" v-if="disClick">{{strCode}}</em>
                            <em class="col" v-else>{{time}}S</em>
                        </span>
                    </el-form-item>
                    <div class="footer mt30">
                        <span class="cd-button cd-button-primary" @click="nextReset('ruleForm2')">下一步</span>
                    </div>
                </el-form>
                <!--填写新密码-->
                <el-form v-show="step == 1" :model="ruleForm3" :rules="rules3" ref="ruleForm3" label-position="left" class="demo-ruleForm login-container">
                    <el-form-item class="mt40 reset-input" label="新密码" label-width="20%" prop="password">
                        <el-input type="password" v-model="ruleForm3.password" :autofocus="true" auto-complete="off" placeholder="请输入6-18包含数字、字母的密码">
                        </el-input>
                        <!--<p class="info">密码由6位以上数字、字母组成</p>-->
                    </el-form-item>
                    <el-form-item class="mt40 reset-input" label="确认密码" label-width="20%" prop="confirm_password">
                        <el-input type="password" v-model="ruleForm3.confirm_password" auto-complete="off" placeholder="再输一次">
                        </el-input>
                    </el-form-item>
                    <div class="footer mt30">
                        <span class="cd-button cd-button-primary normal" @click="step = 0;">上一步</span>
                        <span class="cd-button cd-button-primary normal" @click="savePassWord('ruleForm3')">确定</span>
                    </div>
                </el-form>
            </div>
            <div v-show="dialogType == '设置成功'">
                <img src="" alt="">
                <p>{{dialogType}}</p>
                <p>新密码设置成功，请重新登录账号</p>
                <div class="footer mt30">
                    <span class="cd-button cd-button-primary" @click="closeLogin">重新登录</span>
                </div>
            </div>
        </el-dialog>
    
    </div>
</template>

<script>
import ejax from '../../assets/js/ejax';
import { getQuery } from '../../assets/js/base';
import Cookies from 'js-cookie'
export default {
    name: 'home',
    data() {
        var validatePass = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm3.password) {
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
            ruleForm1: {
                username: '',
                passwordmd5: '',
                code: ''
            },
            rules1: {
                username: [
                    { type: 'email', required: true, message: '请输入正确的邮箱' }
                ],
                passwordmd5: [
                    { min: 6, max: 18, required: true, message: '请输入正确的登录密码', trigger: 'blur' }
                ]
            },
            ruleForm2: {
                email: '',
                code: ''
            },
            rules2: {
                email: [
                    { type: 'email', required: true, message: '请输入正确的邮箱' }
                ],
                code: [
                    { required: true, message: '请输入验证码' }
                ]
            },
            ruleForm3: {
                password: '',
                confirm_password: ''
            },
            rules3: {
                password: [
                    { validator: isPassWord, trigger: 'blur' },
                    { min: 6, max: 18, required: true, message: '请输入6-18包含数字、字母的密码', trigger: 'blur' }
                ],
                confirm_password: [
                    { validator: validatePass, trigger: 'blur' },
                    { min: 6, max: 18, message: '请输入6-18包含数字、字母的密码', trigger: 'blur' }
                ]
            },
            dialogVisible: false,
            show_vcode: false,
            checked: false,
            vcode_img: '',
            dialogType: '账号登录',
            disClick: true,
            time: 60,
            strCode: '获取验证码',
            step: 0,
            errEmail: ''
        }
    },
    mounted: function () {
        this.$nextTick(function () {
            if (sessionStorage.getItem('show_vcode') && sessionStorage.getItem('show_vcode') !== 'false') {
                this.show_vcode = true;
                this.changeVcode();
            }
        })

    },
    methods: {
        openLogin() {
            this.dialogVisible = true;
        },
        closeLogin() {
            this.dialogType = '账号登录';
            this.step = 0;
            this.$refs['ruleForm1'].resetFields();
            this.$refs['ruleForm2'].resetFields();
        },
        login(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var param = { 'email': this.ruleForm1.username, 'password': this.ruleForm1.passwordmd5, "vcode": this.ruleForm1.vcode };
                    ejax.post('/api/account/login?format=json', param)
                        .then(res => {
                            sessionStorage.setItem("show_vcode", false);
                            let tempObj = {
                                'email': res.data.results.email,
                                'user_type': res.data.results.user_type,
                                'type': res.data.results.type
                            }
                            Cookies.set('user_info', tempObj, { expires: 365 });
                            Cookies.set('email', res.data.results.email);
                            Cookies.set('user_type', res.data.results.user_type);
                            let refer = decodeURIComponent(getQuery(window.location.href, 'refer'));
                            if (refer !== 'null') {
                                window.location.href = refer;
                            } else {
                                this.$router.push('/position');
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            this.show_vcode = err.data.results.show_vcode;
                            if (this.show_vcode) {
                                this.changeVcode();
                            }
                            sessionStorage.setItem("show_vcode", this.show_vcode);
                            this.$message(err.data.err_msg);
                        })
                } else {
                    return false;
                }
            })
        },
        changeVcode() {
            this.vcode_img = '/api/account/get_vcode?t=' + (new Date()).valueOf();
        },
        toReset() {
            this.dialogType = '忘记密码';
        },
        getResetCode() {
            this.$refs['ruleForm2'].validateField('email', (value) => {
                if (!value) {
                    this.errEmail = '我们将发送验证码到您的登录邮箱';
                    if (this.disClick) {
                        ejax.post('/api/account/get_mail_code?format=json', {
                            'email': this.ruleForm2.email
                        })
                            .then(res => {
                                //发送成功
                                this.disClick = false;
                                let timer = setInterval(() => {
                                    this.time = this.time - 1;
                                    if (this.time <= 0) {
                                        clearInterval(timer);
                                        this.strCode = '重新发送';
                                        this.disClick = true;
                                        this.time = 60;
                                    }
                                }, 1000)
                            })
                            .catch(err => {
                                if (err.data.err_msg) {
                                    this.$message(err.data.err_msg);
                                    this.strCode = '重新发送';
                                    this.disClick = true;
                                    this.time = 60;
                                }
                            })
                    }
                }
            })

        },
        nextReset(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.step = 1;
                }
            })

        },
        savePassWord(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    ejax.post('/api/account/get_password?format=json', {
                        'email': this.ruleForm2.email,
                        'code': this.ruleForm2.code,
                        'password': this.ruleForm3.password,
                        'confirm_password': this.ruleForm3.confirm_password
                    })
                        .then((res) => {
                            this.dialogType = '设置成功';
                        })
                        .catch((err) => {
                            console.log(err);
                            this.$message(err.data.err_msg);
                        })

                }
            })

        },
        delectInfo() {
            this.errEmail = '';
        }
    }
}

</script>
<style lang="scss">
.home {
    min-width: 960px;
    .wrapper {
        display: flex;
        .left {
            flex: 1;
            background-color: #fd513a;
        }
        .main {
            width: 960px;
            background-image: url('../../assets/img/home/homepage-bg.png');
            height: 420px;
            margin: 0 auto;
            .top {
                width: 960px;
                margin: 0 auto;
                height: 420px;
                position: relative;
                .logo {
                    float: left;
                    font-size: 20px;
                    color: white;
                    font-weight: 800;
                    line-height: 50px;
                    &:before {
                        content: '';
                        width: 38px;
                        height: 38px;
                        display: inline-block;
                        background: white;
                        position: relative;
                        left: 0px;
                        top: 10px;
                        margin-right: 12px;
                    }
                }
                .login_info {
                    float: right;
                    font-size: 14px;
                    line-height: 50px;
                    color: white;
                    span {
                        border: 1px solid white;
                        width: 80px;
                        height: 26px;
                        border-radius: 4px;
                        text-align: center;
                        display: inline-block;
                        line-height: 26px;
                        margin-left: 20px;
                        cursor: pointer;
                    }
                }
                .title1 {
                    position: absolute;
                    left: 45px;
                    top: 150px;
                    width: 361px;
                    height: 49px;
                    background-image: url('../../assets/img/home/home-title1.png');
                }
                .title2 {
                    position: absolute;
                    left: 45px;
                    top: 220px;
                    width: 351px;
                    height: 29px;
                    background-image: url('../../assets/img/home/home-title2.png');
                }
            }
        }
        .right {
            flex: 1;
            background-color: #ff7325;
        }
    }
    .introduce-list {
        width: 670px;
        margin: 0 auto;
        ul {
            li {
                strong {
                    font-size: 28px;
                    color: #333;
                }
                dd {
                    font-size: 16px;
                    line-height: 24px;
                }
                padding:60px 0;
                height: 150px;
                display: flex;
                .infos {
                    flex: 1;
                }
                .images {
                    width: 300px;
                }
            }
        }
    }
    .foot {
        height: 60px;
        background: #F4F6F8;
        line-height: 60px;
        p {
            width: 670px;
            margin: 0 auto;
            text-align: center;
            font-size: 12px;
        }
    }
    .login_wrapper {
        min-width: 500px;
        h2 {
            text-align: center;
        }
        .con {
            font-size: 14px;
            cursor: pointer;
            color: #333;
            &:hover {
                color: #3b99ff;
            }
        }
        .cd-button {
            width: 120px;
        }
        .normal {
            width: 100px;
        }
        .footer {
            text-align: center;
        }
        .el-dialog__header {
            background: #fff;
        }
        .login-input {
            border-bottom: 1px solid #ddd;
            .el-input__inner {
                border: 0;
            }
            .el-form-item__error {
                left: 10px;
            }
            .code_img {
                position: absolute;
                top: 0;
                right: 0;
            }
        }
        .reset-input {
            .el-input {
                width: 100%;
            }
            .el-input__inner {
                border-radius: 0;
            }
            .info {
                position: absolute;
                color: #999;
                font-size: 12px;
                bottom: -30px;
                padding-left: 10px;
            }
        }
        .el-dialog__body {
            padding: 4% 10% 6% 10%;
            .el-checkbox__label {
                font-size: 14px;
            }
        }
        .el-form-item.is-required .el-form-item__label:before {
            content: '';
        }
        .code_wrapper {
            position: absolute;
            right: 20px;
            top: 1px;
            .stand {
                display: inline-block;
                height: 10px;
                width: 1px;
                background: #ddd;
                margin-right: 6px;
                font-size: 14px;
            }
            .col {
                color: #999;
            }
            .get-code {
                cursor: pointer;
                &:hover {
                    color: #3b99ff;
                }
            }
            em {
                display: inline-block;
                width: 70px;
                text-align: center
            }
        }
    }
}
</style>

