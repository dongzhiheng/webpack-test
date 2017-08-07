<template>
	<div class="v-container">
		<navbar></navbar>
		<div class="v-box" @click="hideSelectType">
			<div class="archives_wrapper">
	
				<div class="heard_title mt40">
					<h2>人才库</h2>
					<div class="fr other_wrapper" v-if="talents_info">
						<span class="tip">{{talents_info.version}}人才库:</span>
						<span class="progress">
							<el-progress :text-inside="true" :show-text="false" :percentage="usedPercent" :stroke-width="6"></el-progress>
						</span>
						<span>{{talents_info.num}} 份 / {{talents_info.talent_upper_limit}} 份</span>
						<router-link to="/archives/combo">
							扩容
						</router-link>
						<router-link to="/archives/permission">
							<i class="icon-setting"></i>权限设置
						</router-link>
					</div>
				</div>
				<div v-show="!no_resume">
					<div class="search_box mt20">
						<div class="search_input">
							<ul>
								<li class="select_type">
									<div>
										<p @click.stop="isChoseType = true">{{dataType | filterDataType}}</p>
										<i class="arrow arrow-top"></i>
									</div>
									<ul v-show="isChoseType" class="chose_options">
										<li v-bind:class="{active: dataType == '0'}" @click.stop="switchType('0')">搜简历</li>
										<li v-bind:class="{active: dataType == '1'}" @click.stop="switchType('1')">搜人名</li>
									</ul>
								</li>
								<li class="select_input">
									<input v-model="keyWord"  :placeholder="holder" type="text" @keydown.enter.stop="search(1)">
									<p v-show="searchEmptyErr" class="err_info">请先输入搜索词</p>
								</li>
								<li class="search_btn" @click.stop="search(1)">
									<span>搜 索</span>
								</li>
							</ul>
						</div>
						<div class="search_btn_wrapper">
							<span @click.stop="goToUpload">上传</span>
						</div>
					</div>
					<div class="main-list">
						<div class="mt30 nav" v-show="navKeyWord">
							<ul>
								<li class="l">
									<router-link to="/archives/list">返回人才库</router-link>
								</li>
								<li class="l">
									<em>></em>
								</li>
								<li class="1">{{navKeyWord}}</li>
							</ul>
						</div>
						<ul class="overflow" v-show="isShowData">
							<li class="job-info mt30" v-for="resume in resumes">
								<span @click="goToDetail(resume)" class="userLogo">
									<img v-bind:src="resume.photo" alt="" v-if="resume.photo" />
									<img v-else="" v-bind:src="resume.gender.toLowerCase() | isGender" alt="" />
								</span>
								<div class="seize">
									<div class="job-type">
										<span class="box-msg">
											<strong @click="goToDetail(resume)">{{resume.name}}</strong>
											<span class="new_btn" v-show="resume.algorithm.diff.updated_at">
												<i>New</i>
											</span>
											<span class="year">{{resume.work_experience | experienceFilter}}</span>
											<em v-show="resume.address"> · </em>
											<span>{{resume.address}}</span>
											<!--<em v-show="resume.basic_salary_to"> ·</em>
												<span class="source">年薪：
													<span>{{resume.basic_salary_to}}万</span>
												</span>-->
										</span>
									</div>
									<div class="last-company mt10" v-if="resume.workinfo[0]">
										<span class="box-msg">
											<i class="icon-post"></i>
											<span class="test">{{resume.workinfo[0].company}}</span>
											<em v-show="resume.workinfo[0].company && resume.workinfo[0].position"> - </em>
											<span class="test">{{resume.workinfo[0].position}}</span>
											<span class="line"></span>
										</span>
										<span class="companytime">{{resume.workinfo[0].start_stop | calctime}}</span>
									</div>
									<div class="edu-bg mt10">
										<span class="box-msg">
											<i class="icon-school"></i>
											<span class="test" v-text="resume.education.school_name"></span>
											<em v-show="resume.education.discipline_name"> - </em>
											<span class="test" v-text="resume.education.discipline_name"></span>
											<em v-show="resume.education.degree"> - </em>
											<span class="test" v-text="resume.education.degree"></span>
											<span class="line"></span>
										</span>
										<span class="companytime">{{resume.education.start_stop}}</span>
	
										<!--<i class="icon-school"></i> <span class="box-msg"><span v-text="resume.education.school"></span><em v-show="resume.education.school"> - </em>
																								<span v-text="resume.education.major"></span><em v-show="resume.education.degree"> - </em><span v-text="resume.education.degree"></span></span>
																								<span v-text="resume.education.start_stop"></span>-->
									</div>
								</div>
							</li>
						</ul>
						<div class="myPagination" v-show="isShowData">
							<el-pagination layout="prev, pager, next" :total="total" :page-size="10" @current-change="currentChange" :current-page="parm.page">
							</el-pagination>
						</div>
					</div>
					<div class="no_search" v-show="no_search">
						<div class="con">
							<img src="../../assets/img/no_search.png" alt="">
							<div v-if="!searchErr">
								<p>没有相关结果</p>
								<p>试试换个搜索条件</p>
							</div>
							<div v-else>
								<p>网络异常</p>
								<p>请稍后再试</p>
							</div>
							
						</div>
	
					</div>
					<loading :loading='isloading'></loading>
					<!--<div v-show="isloading" class="loading">
									<img :src='loading_page' alt="">
								</div>-->
				</div>
	
				<div class="no_resume" v-show="no_resume">
					<div class="con">
						<img src="../../assets/img/match.png" alt="">
						<p>暂未上传简历</p>
						<span @click.stop="goToUpload" class="mt10">上 传 简 历</span>
					</div>
				</div>
				<el-dialog title="提示" v-model="stopGoToDetail" size="tiny" :lock-scroll="false">
					<p>
						<i>
							<img :src="icon_info" alt="">
						</i>该简历为非公开简历，如需查看可向所有者
						<span class="orange">{{user}}</span> 索要</p>
					<span slot="footer" class="dialog-footer">
						<span class="cd-button cd-button-primary" @click="stopGoToDetail = false">知道了</span>
					</span>
				</el-dialog>
	
				<el-dialog title="提示" v-model="fullTalents" size="tiny" :lock-scroll="false">
					<p>
						<i>
							<img :src="icon_warning" alt="">
						</i>人才份额已满，无法上传简历！</p>
					<p class="fn12 mt10">
						<i></i>升级人才库请联系商务：021-63086588</p>
					<span slot="footer" class="dialog-footer">
						<span class="cd-button cd-button-primary" @click="fullTalents = false">知道了</span>
					</span>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
import ejax from '../../assets/js/ejax';
import male from '../../assets/img/male.png';
import female from '../../assets/img/female.png';
import nomarl from '../../assets/img/nomarl.png';
import iconWarning from '../../assets/img/icon-warning.svg';
import iconInfo from '../../assets/img/icon-info.svg';
import { trim } from '../../assets/js/base';
import Cookies from 'js-cookie'
export default {
	name: 'ArchivesList',
	data() {
		return {
			resumes: [],
			talents_info: null,
			dataType: '0',
			isChoseType: false,
			keyWord: '',
			navKeyWord: '',
			parm: {
				'pagesize': 10,
				'page': 1
			},
			usedPercent: 0,
			isShowData: false,
			total: 0,
			stopGoToDetail: false,
			fullTalents: false,
			user: '',
			no_search: false,
			no_resume: false,
			isloading: true,
			icon_warning: iconWarning,
			icon_info: iconInfo,
			holder: '可搜关键词，例如：上海 产品 3年',
			searchEmptyErr:false,
			searchErr:false
		}
	},

	mounted: function () {
		this.$nextTick(function () {
			this.showTalents();
			let current = this.$route.query.page ? this.$route.query.page : 1;
			if (this.$route.query.dataType) {
				this.dataType = this.$route.query.dataType;
				if (this.$route.query.q) {
					this.keyWord = this.$route.query.q;
					this.navKeyWord = this.$route.query.q;
					this.search(parseInt(current));
				} else {
					this.getTalentsList();
				}
			} else {
				this.getTalentsList();
			}
		})

	},
	methods: {
		showTalents() {
			let user_info = Cookies.get(user_info);
			if (user_info) {
				if (user_info.user_type !== '1') {
					this.getTalentsNum();
				}
			}
		},
		getTalentsNum() {
			ejax.post('/api/account/view_talents_num?format=json')
				.then(data => {
					this.talents_info = data.data.results;
					if (data.data.results.talent_upper_limit == 0) {
						this.usedPercent = 0;
					} else {
						this.usedPercent = data.data.results.num / parseInt(data.data.results.talent_upper_limit, 10) * 100;
					}
				})
				.catch(err => {
					console.log(err);
				})
		},
		switchType(val) {
			this.dataType = val;
			this.isChoseType = false;
			if (val == 0) {
				this.holder = '可搜关键词，例如：上海 产品 3年';
			} else {
				this.holder = '可直接搜索名字，例如：陈三';
			}
			this.$router.push({ name: 'archivesList', query: { dataType: val } });
		},
		hideSelectType() {
			this.isChoseType = false;
		},
		search(currentPage) {
			if (currentPage) { this.parm.page = currentPage };
			if (trim(this.keyWord) == '') { 
				this.searchEmptyErr = true;
				return false ;
			};
			this.navKeyWord = this.keyWord;
			if (this.dataType == '0') {
				this.parm.keyword = this.keyWord;

			} else if (this.dataType == '1') {
				this.parm.name = this.keyWord;
				delete this.parm.keyword;
			} else {
				console.log('搜索条件错误');
				return false;
			}
			this.isShowData = false;
			this.isloading = true;
			this.no_search = false;
			this.$router.push({ name: 'archivesList', query: { dataType: this.dataType, q: this.keyWord, page: this.parm.page } })
			ejax.post('/api/search/archives?app=toh&format=json', this.parm)
				.then(res => {

					this.resumes = res.data.results.data || [];
					this.total = res.data.results.pagination.total;
					this.isShowData = this.resumes.length > 0 ? true : false;
					this.no_search = this.resumes.length > 0 ? false : true;
					this.isloading = false;
					this.searchErr = false;
				})
				.catch(err => {
					this.isShowData = false;
					this.no_search = true;
					this.searchErr = true;
					this.isloading = false;
					console.log(err);
				})


		},
		currentChange(page) {
			if (this.$route.query.q) {
				this.search(page);
			} else {
				this.getTalentsList(page);
			}

		},
		getTalentsList(page = 1) {
			this.isloading = true;
			this.isShowData = false;
			ejax.post('/api/talents/talents_list?format=json', { pagesize: 10, page: page })
				.then(res => {
					this.resumes = res.data.results.data ? res.data.results.data : [];
					this.total = res.data.results.pagination.total;
					this.no_resume = this.resumes.length ? false : true;
					this.isShowData = this.resumes.length > 0 ? true : false;
					this.isloading = false;
				})
				.catch(err => {
					console.log(err);
				})
		},
		goToDetail(Resume) {
			if (Resume.is_hidden == '1') {
				this.user = Resume.user;
				this.stopGoToDetail = true;
			} else {
				//页面进行跳转
				window.open(`/archives/view/preview/cv/${Resume.id}`);
				//this.$router.push({ name: 'archivesView', params: { 'id': Resume.id, 'edit': 'preview', 'pid': 'cv' } });
			}
		},
		goToUpload() {
			if (!!this.talents_info && (this.talents_info.num >= this.talents_info.talent_upper_limit)) {
				this.fullTalents = true;
			} else {
				this.$router.push({ 'name': 'archivesUpload' })
			}
		}
	},
	filters: {
		isGender: function (val) {
			return val == 'm' ? male : (val == 'f') ? female : nomarl;
		},
		experienceFilter(val) {
			if (val == '0' || val == '') {
				return '少于1年经验';
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
		},
		filterDataType(val) {
			if (val == '0') {
				return '搜简历';
			} else {
				return '搜人名';
			}
		}
		// filter end
	},
	watch: {
		'$route'(to, from) {
			//解决访问本页面无参数url 页面不刷新的问题
			if (_.isEmpty(to.query)) {
				Object.assign(this.$data, this.$options.data())
				this.showTalents();
				this.getTalentsList();
			}
		},
		keyWord:{
			handler(val, oldval){
				if(!trim(val) == ''){
					this.searchEmptyErr = false;
				}
			}
		}
	}
}

</script>
<style lang="scss">
.archives_wrapper {
	margin: 50px auto 73px;
	width: 830px;
	min-height: 960px;
	.heard_title {
		border-bottom: 1px solid #eee;
		h2 {
			display: inline-block;
			padding-bottom: 8px;
		}
		.fr {
			float: right;
		}
		.other_wrapper {
			position: relative;
			top: 8px;
			span {
				display: inline-block;
			}
			.tip {
				color: #999;
				font-size: 12px;
				margin-right: 6px;
			}
			.progress {
				width: 100px;
				margin-right: 6px;
				.el-progress-bar__inner {
					background-color: #FD4A3F;
				}
			}
			a {
				color: #3B99FF;
				padding: 0 6px;
			}
			.icon-setting {
				vertical-align: middle;
				margin-right: 2px;
			}
		}
	}
	.search_box {
		.search_input {
			display: inline-block;
			width: 60%;
			ul {
				li {
					position: relative;
					height: 30px;
					line-height: 30px;
					&.select_type {
						float: left;
						width: 12%;
						min-width: 90px;
						background-color: #eee;
						cursor: pointer;
						position: relative;
						p {
							text-align: center;
							font-size: 14px;
						}
						.chose_options {
							position: absolute;
							background: white;
							border: 1px solid #ccc;
							width: 100%;
							top: 33px;
							li {
								text-align: center;
								height: 34px;
								line-height: 34px;
								&.active {
									background: #FE692B;
									color: white;
								}
							}
						}
						.arrow {
							position: absolute;
							border-top-color: black;
							right: 6%;
							top: 14px;
						}
					}
					&.select_input {
						float: left;
						width: 45%;
						input {
							width: 100%;
							height: 28px;
							line-height: 28px;
							border: 1px solid #ddd;
							padding-left: 10px;
						}
					}
					&.search_btn {
						float: left;
						width: 14%;
						min-width: 80px;
						text-align: center;
						background-color: #FE692B;
						color: white;
						border-radius: 4px;
						font-size: 14px;
						cursor: pointer;
					}
				}
			}
		}
		.search_btn_wrapper {
			float: right;
			span {
				display: inline-block;
				width: 80px;
				height: 30px;
				line-height: 30px;
				background: #FE692B;
				color: white;
				cursor: pointer;
				text-align: center;
				font-size: 14px;
				border-radius: 4px;
			}
		}
		.err_info{
			padding-left: 10px;
			color: red;
			position: absolute;
			bottom: -24px;
		}
	}
	.main-list {
		.nav {
			ul {
				font-size: 14px;
				a {
					color: #3B99FF;
				}
				em {
					padding: 0 6px;
				}
			}
		}
		.overflow {}
		.job-info {
			padding-bottom: 50px;
			border-bottom: 1px solid #eee;
			display: flex;
			.userLogo {
				width: 63px;
				display: inline-block;
			}
			.seize {
				flex: 1;
				.job-type {
					width: 60%;
					.box-msg {
						width: 100%;
						strong {
							font-size: 16px;
							color: #3B99ff;
						}
						.new_btn {
							display: inline-block;
							width: 32px;
							height: 14px;
							line-height: 14px;
							border-radius: 2px;
							background: #FFE4D9;
							color: #FE6B2B;
							font-size: 12px;
							text-align: center;
							i {
								transform: scale(.8);
								display: block;
							}
						}
						.year {
							padding-left: 10px;
						}
					}
				}
				.last-company,
				.edu-bg {
					display: flex;
					align-items: center;
					.icon-post,
					.icon-school {
						color: #D8D8D8;
					}
					.box-msg {
						width: 60%;
						display: flex;
						align-items: center;
						.test {
							padding-left: 4px;
							padding-right: 4px;
						}
						em {
							padding-right: 2px;
						}
						.line {
							height: 0;
							border: 1px dashed #eee;
							flex: 1;
							margin: 0 8px;
						}
					}
				}
			}
		}
	}
	.no_search {
		min-height: 700px;
		position: relative;
		.con {
			position: absolute;
			text-align: center;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
			width: 50%;
			height: 30%;
			p {
				font-size: 16px;
				padding-right: 33px;
			}
		}
	}
	.no_resume {
		min-height: 800px;
		position: relative;
		.con {
			position: absolute;
			text-align: center;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			margin: auto;
			width: 50%;
			height: 30%;
			p {
				font-size: 16px;
			}
			span {
				display: inline-block;
				width: 120px;
				height: 30px;
				text-align: center;
				color: white;
				border-radius: 4px;
				background: #ff6b2b;
				line-height: 30px;
				font-size: 14px;
				cursor: pointer;
			}
		}
	}
	.el-dialog__body {
		p {
			text-align: center;
			font-size: 14px;
		}
		i {
			display: inline-block;
			height: 18px;
			width: 18px;
			vertical-align: text-bottom;
			margin-right: 10px;
		}
		.fn12 {
			font-size: 12px;
		}
		.orange {
			color: #FE6B2B;
		}
	}
}
</style>
