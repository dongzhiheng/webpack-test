<template>
    <div class="v-container">
        <navbar></navbar>
        <div class="v-box">
            <div class="searchinner">
                <div class="searchbar overflow">
                    <input type="text"
                           name="keywords"
                           class="search-input"
                           autocomplete="off"
                           placeholder="一次可搜索多个关键词，例：iOS  北京  3年">
                    <button><i class="icon-search"></i>搜简历</button>
                    <div class="search-history"
                         style="display:none">
                        <div class="clear-history">最近搜索<a href="javascript:;"> - 清除</a></div>
                        <ul></ul>
                    </div>
                </div>
                <div class="load">
                    <div class="filterSelector">
                        <div class="col-1 overflow">
                            <span class="title">筛选条件：</span>
                            <!--<span class="screen-conditions"></span>-->
                            <ul>
                                <li class="channel">渠道</li>
                                <li class="function">职能</li>
                            </ul>
                            <span class="restore-defaults">恢复默认</span>
                        </div>
                        <div class="groups overflow">
                            <div class="row channel-row">
                                <span class="title">渠道：</span>
                                <ul>
                                    <li class="active">不限</li>
                                    <li>人才库(<span>500</span>)</li>
                                    <li>外网(<span>5842235</span>)</li>
                                </ul>
                            </div>
                            <div class="row function-row">
                                <span class="title">职能：</span>
                                <ul>
                                    <li class="active">不限</li>
                                </ul>
                                <ul>
                                    <li v-for="(fn,index) in fun" v-on:click='choseFunctionOption(fn,index)' v-bind:class="{active:index===fnActive}">
                                        <label v-text="fn.name"></label>(<span v-text="fn.count"></span>)</li>
                                </ul>
                            </div>
                            <div class="row industry-row">
                                <span class="title">行业：</span>
                                <el-checkbox-group v-model="industryList">
                                    <el-checkbox label="电子商务"></el-checkbox>
                                </el-checkbox-group>
                                <span class="industry-more">更多</span>
                            </div>
                            <div class="row location-row">
                                <span class="title">地点：</span>
                                <el-checkbox-group v-model="locationList">
                                    <el-checkbox label="上海"></el-checkbox>
                                </el-checkbox-group>
                                <span class="location-more">更多</span>
                            </div>
                            <div class="row edu-row">
                                <span class="title">学历：</span>
                                <el-checkbox-group v-model="eduList"
                                                   v-on:change='toggleSelection'>
                                    <el-checkbox label="本科"></el-checkbox>
                                    <el-checkbox label="硕士"></el-checkbox>
                                    <el-checkbox label="博士"></el-checkbox>
                                    <el-checkbox label="专科"></el-checkbox>
                                    <el-checkbox label="高中"></el-checkbox>
                                    <el-checkbox label="中专"></el-checkbox>
                                    <el-checkbox label="其他"></el-checkbox>
                                </el-checkbox-group>
                            </div>
                            <div class="row other-row">
                                <span class="title">其他：</span>
                                <el-select v-model="updatetime"
                                           placeholder="更新时间"
                                           v-on:change="chosenUpdatetime">
                                    <el-option v-for="item in updatetimeOptions"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.id">
                                    </el-option>
                                </el-select>
                                <el-select v-model="workyears"
                                           placeholder="工作年限"
                                           v-on:change="chosenWorkyears">
                                    <el-option v-for="item in workyearOptions"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.id">
                                    </el-option>
                                </el-select>
                                <el-select v-model="gender"
                                           placeholder="性别"
                                           v-on:change="chosenGender">
                                    <el-option v-for="item in genderOptions"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.id">
                                    </el-option>
                                </el-select>
                                <el-select v-model="age"
                                           placeholder="年龄"
                                           v-on:change="chosenAge">
                                    <el-option v-for="item in ageOptions"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.id">
                                    </el-option>
                                </el-select>
                                <el-select v-model="expectsalary"
                                           placeholder="期望月薪"
                                           v-on:change="chosenExpectsalary">
                                    <el-option v-for="item in salaryOptions"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.id">
                                    </el-option>
                                </el-select>
                                <el-select v-model="currentstate"
                                           placeholder="当前状态"
                                           v-on:change="chosenCurrentstate">
                                    <el-option v-for="item in stateOptions"
                                               :label="item.label"
                                               :value="item.value"
                                               :key="item.id">
                                    </el-option>
                                </el-select>
                            </div>
    
                        </div>
                    </div>
                    <div class="search-results-list">
                        <div class="toolbar overflow">
                            <p v-show="totalcount > 100">共<span v-text="totalcount"></span>条结果</p>
                            <div class="data-list-checkbox">
                                <el-checkbox v-model="edu_211_985"
                                             v-on:change="toggle985">211/985</el-checkbox>
                                <el-checkbox v-model="corp_trade_istop"
                                             v-on:change="toggleFamous">名企/大公司</el-checkbox>
                                <el-checkbox v-model="avg_duty_month"
                                             v-on:change="toggleStable">稳定性高</el-checkbox>
                                <el-checkbox v-model="exp_seg_num"
                                             v-on:change="toggleRecentOne">只看最近一份工作</el-checkbox>
                            </div>
                            <div class="update-sort">
                                <label class="updated_at_desc"
                                       v-bind:class="{active:sort==1}"
                                       v-on:click="changeSort(1)">更新时间</label>
                                <label class="compound_sort"
                                       v-bind:class="{active:sort==0}"
                                       v-on:click="changeSort(0)">综合排序</label>
                            </div>
                        </div>
                        <ul class="overflow">
                            <li class="job-info"
                                v-for="resume in resumes">
                                <span class="companylogo"><a href="" target="_blank"><img v-bind:src="resume.basic.photo" alt="" v-if="resume.basic.photo"/> <img v-else=""  v-bind:src="resume.basic.gender.toLowerCase() | isGender" alt=""/></a></span>
                                <div class="seize">
                                    <div class="job-type"><span class="box-msg"><strong v-bind:title="resume.basic.name" v-text="resume.basic.name"></strong><span>{{resume.work_experience[0] | experienceFilter}}</span><em v-show="resume.work_experience[0] != 0 "> · </em><span>{{resume.basic.address}}</span></span> <span class="source">来源：<span>人才库</span></span>
                                    </div>
                                    <div class="last-company">
                                        <i class="icon-post"></i> <span class="box-msg"><span v-text="resume.workinfo[0].company"></span><em v-show="resume.workinfo[0].company && resume.workinfo[0].position"> - </em><span v-text="resume.workinfo[0].position"></span></span> <span class="companytime">{{resume.workinfo[0].start_stop | calctime}}</span>
                                    </div>
                                    <div class="edu-bg">
                                        <i class="icon-school"></i> <span class="box-msg"><span v-text="resume.education[0].school_name"></span><em v-show="resume.education[0].school_name"> - </em><span v-text="resume.education[0].discipline_name"></span><em v-show="resume.education[0].degree"> - </em><span v-text="resume.education[0].degree"></span></span> <span v-text="resume.education[0].start_stop"></span>
                                    </div>
                                </div>
                            </li>
                        </ul>
    
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import navbar from '../../components/Navbar/navbar.vue';
import '../../assets/css/search.scss';
import ejax from '../../assets/js/ejax';
import male from '../../assets/img/male.png';
import female from '../../assets/img/female.png';
import nomarl from '../../assets/img/nomarl.png';
import { sUrl, getQuery, trim, Account1,Account2,Account3,Account4,Account5,Account6, Edu, Check1,Check2,Check3,Check4, set, get, clear } from '../../assets/js/base';
import { updatetimeOptions, workyearOptions, genderOptions, ageOptions, salaryOptions, stateOptions } from '../../assets/js/commonData/language'

export default {
    name: 'view',
    data() {
        return {
            industryList: [], locationList: [], eduList: [], eduCheckstr: '',
            edu_211_985: '', corp_trade_istop: '', avg_duty_month: '', exp_seg_num: '',
            edu_211_985_args: '', corp_trade_istop_args: '', avg_duty_month_args: '', exp_seg_num_args: '',
            updatetimeOptions, workyearOptions, genderOptions, ageOptions, salaryOptions, stateOptions,
            updatetime: '', workyears: '', gender: '', age: '', expectsalary: '', currentstate: '',
            resumes: '',
            fun: '',fnActive:'',
            functionOption: '',
            sort: '0',
            totalcount: '0'
        }
    },

    mounted: function () {
        this.$nextTick(function () {
            this.init();
        })
    },
    created: function () {
        let account1 = get('Account1'),account2 = get('Account2'),account3 = get('Account3'),account4 = get('Account4'),account5 = get('Account5'),account6 = get('Account6'),edu = get('Edu'),check1 = get('Check1'),check2 = get('Check2'),check3 = get('Check3'),check4 = get('Check4');
        account1 = JSON.parse(account1);account2 = JSON.parse(account2);account3 = JSON.parse(account3);account4 = JSON.parse(account4);account5 = JSON.parse(account5);account6 = JSON.parse(account6);
        edu = JSON.parse(edu);check1 = JSON.parse(check1);check2 = JSON.parse(check2);check3 = JSON.parse(check3);check4 = JSON.parse(check4);
        if (account1 != null && account1.updatetime) { this.updatetime = account1.updatetime; }
        if (account2 != null && account2.workyears) { this.workyears = account2.workyears }
        if (account3 != null && account3.gender) { this.gender = account3.gender }
        if (account4 != null && account4.age) { this.age = account4.age }
        if (account5 != null && account5.expectsalary) { this.expectsalary = account5.expectsalary }
        if (account6 != null && account6.currentstate) { this.currentstate = account6.currentstate }
        if (edu != null) {
            if (edu.eduCheckstr) {
                let eduarr = edu.eduCheckstr.split(',');
                for (let i in eduarr) {
                    eduarr[i] == '1' ? eduarr[i] = '本科' : eduarr[i] == '2' ? eduarr[i] = '硕士' : eduarr[i] == '3' ? eduarr[i] = '博士' : eduarr[i] == '4' ? eduarr[i] = '专科' : eduarr[i] == '89' ? eduarr[i] = '高中' : eduarr[i] == '90' ? eduarr[i] = '中专' : eduarr[i] == '99' ? eduarr[i] = '其他' : '';
                }
                this.eduList = eduarr;
            }
        }
        if (check1 != null && check1.edu_211_985_args) { check1.edu_211_985_args == 1 ? this.edu_211_985 = true : this.edu_211_985 = false }
        if (check1 != null && check2.corp_trade_istop_args) { check2.corp_trade_istop_args == 1 ? this.corp_trade_istop = true : this.corp_trade_istop = false }
        if (check1 != null && check3.avg_duty_month_args) { check3.avg_duty_month_args == 1 ? this.avg_duty_month = true : this.avg_duty_month = false }
        if (check1 != null && check4.exp_seg_num_args) { check4.exp_seg_num_args == 1 ? this.exp_seg_num = true : this.exp_seg_num = false }
    },
    methods: {
        init: function () {
            var _this = this;
            _this.searchServices();
        },
        choseFunctionOption: function(fn,index){
            !index ? index=0: '';
            this.fnActive = index;
            this.functionOption = fn.id;
            if(index!=this.fnActive)
            this.searchServices();
        },
        chosenUpdatetime: function () {
            Account1.updatetime = this.updatetime;
            set('Account1', JSON.stringify(Account1));
            this.searchServices();
        },
        chosenWorkyears: function () {
            Account2.workyears = this.workyears;
            set('Account2', JSON.stringify(Account2));
            this.searchServices();
        },
        chosenGender: function () {
            Account3.gender = this.gender;
            set('Account3', JSON.stringify(Account3));
            this.searchServices();
        },
        chosenAge: function () {
            Account4.age = this.age;
            set('Account4', JSON.stringify(Account4));
            this.searchServices();
        },
        chosenExpectsalary: function () {
            Account5.expectsalary = this.expectsalary;
            set('Account5', JSON.stringify(Account5));
            this.searchServices();
        },
        chosenCurrentstate: function () {
            Account6.currentstate = this.currentstate;
            set('Account6', JSON.stringify(Account6));
            this.searchServices();
        },
        toggleSelection: function () {
            let eduCheck = [], eduCheckstring;
            for (let i = 0; i < this.eduList.length; i++) {
                this.eduList[i] == '本科' ? eduCheck[i] = '1' : this.eduList[i] == '硕士' ? eduCheck[i] = '2' : this.eduList[i] == '博士' ? eduCheck[i] = '3' : this.eduList[i] == '专科' ? eduCheck[i] = '4' : this.eduList[i] == '高中' ? eduCheck[i] = '89' : this.eduList[i] == '中专' ? eduCheck[i] = '90' : this.eduList[i] == '其他' ? eduCheck[i] = '99' : '';
            }
            eduCheckstring = eduCheck.join(',');
            this.eduCheckstr = eduCheckstring;
            Edu.eduCheckstr = this.eduCheckstr;
            set('Edu', JSON.stringify(Edu));
            this.searchServices();
        },
        toggle985: function () {
            this.edu_211_985 == true ? this.edu_211_985_args = 1 : this.edu_211_985_args = 0;
            Check1.edu_211_985_args = this.edu_211_985_args;
            set('Check1', JSON.stringify(Check1));
            this.searchServices();
        },
        toggleFamous: function () {
            this.corp_trade_istop == true ? this.corp_trade_istop_args = 1 : this.corp_trade_istop_args = 0;
            Check2.corp_trade_istop_args = this.corp_trade_istop_args;
            set('Check2', JSON.stringify(Check2));
            this.searchServices();
        },
        toggleStable: function () {
            this.avg_duty_month == true ? this.avg_duty_month_args = 1 : this.avg_duty_month_args = 0;
            Check3.avg_duty_month_args = this.avg_duty_month_args;
            set('Check3', JSON.stringify(Check3));
            this.searchServices();
        },
        toggleRecentOne: function () {
            this.exp_seg_num == true ? this.exp_seg_num_args = 1 : this.exp_seg_num_args = 0;
            Check4.exp_seg_num_args = this.exp_seg_num_args;
            set('Check4', JSON.stringify(Check4));
            this.searchServices();
        },
        changeSort: function (sort) {
            let curSort = this.sort;
            this.sort = sort;
            if (curSort != sort)
                this.searchServices();
        },
        searchServices: function () {
            let keywords = decodeURIComponent(getQuery(sUrl, 'keywords'));
            let account1 = get('Account1'),account2 = get('Account2'),account3 = get('Account3'),account4 = get('Account4'),account5 = get('Account5'),account6 = get('Account6'),edu = get('Edu'),check1 = get('Check1'),check2 = get('Check2'),check3 = get('Check3'),check4 = get('Check4');
            account1 = JSON.parse(account1);account2 = JSON.parse(account2);account3 = JSON.parse(account3);account4 = JSON.parse(account4);account5 = JSON.parse(account5);account6 = JSON.parse(account6);
            edu = JSON.parse(edu);check1 = JSON.parse(check1);check2 = JSON.parse(check2);check3 = JSON.parse(check3);check4 = JSON.parse(check4);
            /*console.log(account);
            console.log(check);
            console.log(edu);*/
            let param = {
                'keywords': keywords, //关键字
                'pagesize': '20', //每页数量
                'page': '1',  //第几页
                // 'industry': '',  //搜索条件 行业的id
                // 'fe_location': '',  //索条件 工作的城市id
                // 'is_rck': '',  //人才库
                // 'show_src_attr': 1,  //简历来源
                'all_function_tag_attr':this.functionOption,
                'edu': (edu != null && edu.eduCheckstr != undefined ) ?edu.eduCheckstr : this.eduCheckstr,
                'edu_211_985': (check1 != null && check1.edu_211_985_args != undefined) ? check1.edu_211_985_args : this.edu_211_985_args,
                'corp_trade_istop': (check2 != null && check2.corp_trade_istop_args != undefined) ? check2.corp_trade_istop_args : this.corp_trade_istop_args,
                'avg_duty_month': (check3 != null && check3.avg_duty_month_args != undefined) ? check3.avg_duty_month_args : this.avg_duty_month_args,
                'exp_seg_num': (check4 != null && check4.exp_seg_num_args != undefined) ? check4.exp_seg_num_args : this.exp_seg_num_args,
                'updated_at': (account1 != null && account1.updatetime != undefined) ? account1.updatetime : this.updatetime,
                'updated_at_day_desc': this.sort,
                'workyear': (account2 != null && account2.workyears != undefined) ? account2.workyears : this.workyears,
                'gender': (account3 != null && account3.gender != undefined) ? account3.gender : this.gender,
                'age': (account4 != null && account4.age != undefined) ? account4.age : this.age,
                'hope_money': (account5 != null && account5.expectsalary != undefined) ? account5.expectsalary : this.expectsalary,
                'current_status': (account6 != null && account6.currentstate != undefined) ? account6.currentstate : this.currentstate,
                // 'current_location_attr': 1,  //当前所在地
                // 'expectant_location_attr': 1,  //期望所在地
                // 'register_location_attr': 1,  //户籍所在地
            };
            for (let args in param) {
                if (param[args] === '' || param[args] === null) delete param[args];
            };
            var _this = this;
            ejax.post('/api/search/keySearch?app=toh&format=json', param).then(function (res) {
                _this.resumes = res.data.results.list;
                _this.totalcount = res.data.results.totalcount;
                if(res.data.results.facet){_this.fun = res.data.results.facet.all_function_tag_info;}
            });
        }
    },
    components: {
        navbar
    },
    filters: {
        isGender: function (val) {
            return val == 'm' ? male : (val == 'f') ? female : nomarl;
        },
        experienceFilter(val) {
            if (val == '0' || val == '') {
                return '';
            } else {
                return val + '年工作经验';
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
        // filter end
    }

}
</script>
