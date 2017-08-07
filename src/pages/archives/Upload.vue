<template>
	<div class="v-container">
		<navbar></navbar>
		<div class="v-box">
			<div class="upload_wrapper">
				<div class="heard_title mt40">
					<h2>
						<router-link to="/archives/list">人才库</router-link>
						<em>></em>
						<p>上传简历</p>
					</h2>
				</div>
				<div class="upload_box mt40">
					<el-upload class="upload-demo" v-if="isShowUpload" :on-progress="handlePreview" drag :on-error="handleError" :on-success="handleSuccess" action="/api/resumes/upload" :multiple="false" name="Filedata" accept="" :before-upload="beforeUpload">
						<img class="mt40" src="../../assets/img/upload.png" alt="">
						<div class="el-upload__text">简历文件拖拽至此区域 或
							<em>点击上传</em>
						</div>
						<div class="el-upload__tip" slot="tip">仅限上传3M以下，html、htm、doc、docx、pdf、mht、txt 文件，暂不支持批量上传。</div>
					</el-upload>
					<div class="upload_info " v-if="!isShowUpload">
						<div class="main">
							<dl>
								<dt>
									<img :src="fileType | srcFileUrl" alt="">
								</dt>
								<dd>
									<div class="clearfix">
										<span>{{fileData.name}}</span>
										<span class="r">{{isSuccess }}</span>
									</div>
									<div class="progress mt20">
										<el-progress :text-inside="true" :show-text="false" :percentage="fileData.percent"></el-progress>
									</div>
								</dd>
							</dl>
						</div>
	
					</div>
				</div>
				<!--简历解析失败-->
				<el-dialog title="提示" v-model="errDialogVisible" size="tiny" :show-close="false" :close-on-click-modal="false" :close-on-press-escape='false' :lock-scroll="false">
					<p>
						<i>
							<img :src="icon_warning" alt="">
						</i>简历解析失败</p>
					<p class="mt20 fn12">您可以手动创建录入简历信息</p>
					<span slot="footer" class="dialog-footer">
						<span class="cd-button cd-button-default" @click="backUpload">取 消</span>
						<span class="cd-button cd-button-primary" @click="failCreateResume">创建简历</span>
					</span>
				</el-dialog>
				<!--简历解析成功-->
				<el-dialog title="提示" v-model="successDialogVisible" size="tiny" :show-close="false" :close-on-click-modal="false" :close-on-press-escape='false' :lock-scroll="false">
					<p>
						<i>
							<img :src="icon_success" alt="">
						</i>简历解析成功！</p>
					<p class="mt10 fn12">前往查看编辑页面，可对简历信息</p>
					<span slot="footer" class="dialog-footer">
						<span class="cd-button cd-button-primary" @click="createResume">核对简历</span>
					</span>
				</el-dialog>
			</div>
		</div>
	
	</div>
</template>

<script>
import ejax from '../../assets/js/ejax';
import doc from '../../assets/img/file_icon/file-doc.svg';
import docx from '../../assets/img/file_icon/file-docx.svg';
import htm from '../../assets/img/file_icon/file-htm.svg';
import html from '../../assets/img/file_icon/file-html.svg';
import mht from '../../assets/img/file_icon/file-mht.svg';
import pdf from '../../assets/img/file_icon/file-pdf.svg';
import txt from '../../assets/img/file_icon/file-txt.svg';
import iconSuccess from '../../assets/img/icon-success.svg';
import iconWarning from '../../assets/img/icon-warning.svg';

export default {
	name: 'archivesUpload',
	data() {
		return {
			fileData: {
				percent: 0
			},
			isSuccess: '上传中...',
			isShowUpload: true,
			errDialogVisible: false,
			successDialogVisible: false,
			fileType: 'doc',
			id: '',
			icon_success: iconSuccess,
			icon_warning: iconWarning,
			pid: '',
			file_id: '0',
			on: '',
			cid: ''
		}
	},

	mounted: function () {
		this.getUrlParms();
	},
	methods: {
		getUrlParms(){
			this.pid = this.$route.params.pid ? this.$route.params.pid : 'cv';
			this.on = this.$route.query.on ? this.$route.query.on : '';
			this.cid = this.$route.query.cid ? this.$route.query.cid : '';
		},
		beforeUpload(file) {
			let d = /\.[^\.]+$/.exec(file.name);
			let fileType = d[0].slice(1);
			this.fileType = fileType;

			if (file.size > 3145728) {
				this.$msgbox({
					title: '提示',
					message: '上传文件过大，请重新上传',
					confirmButtonText: '确定',
					confirmButtonClass: 'cd-primary'
				})
				return false;
			}
		},
		handlePreview(file, fileList) {
			this.isShowUpload = false;
			this.fileData = fileList;
			this.fileData.percent = file.percent;
			this.$set(this.fileData, file.percent);
		},
		handleSuccess(response, file) {
			if (!response.err_msg == '') {
				this.$message({
					title: '错误',
					message: response.err_msg,
					onClose() {
						this.isShowUpload = true;
					}
				});
			} else {
				this.isSuccess = '上传成功';
				this.file_id = response.results.file_id;
				let num = 0;
				let timer = setInterval(() => {
					num++;
					ejax.post('/api/resumes/upload_process?app=toh&format=json', { 'id': this.file_id })
						.then(res => {
							let flag = false;
							if (res.data.results.status == 0) {
								this.isSuccess = '解析中...';
							} else if (res.data.results.status > 0 && res.data.results.status < 4) {
								this.isSuccess = '解析成功';
								flag = true;
								this.successDialogVisible = true;
							} else {
								this.isSuccess = '解析失败';
								flag = true;
								this.errDialogVisible = true;

							}
							this.id = res.data.results.resume_id;
							if (flag) {
								clearInterval(timer);
							}
							if (num > 15) {
								clearInterval(timer);
								this.errDialogVisible = true;
							}
						})
						.catch(err => {
							clearInterval(timer);
							this.errDialogVisible = false;
							this.successDialogVisible = false;
							this.isShowUpload = true;
							this.$message(err.data.err_msg);

						})
				}, 2000)
			}

		},
		handleError(err, file) {
			this.$alert('上传文件失败，请重新上传', '提示', {
				confirmButtonText: '确定',
				confirmButtonClass: 'cd-primary'
			})
			this.isShowUpload = true;
		},
		backUpload() {
			Object.assign(this.$data, this.$options.data());
			this.getUrlParms();

		},
		createResume() {
			this.errDialogVisible = false;
			this.successDialogVisible = false;
			this.isShowUpload = true;
			this.$router.push({ name: 'archivesList' });
			debugger;
			window.open(`/archives/view/edit/${this.pid}/${this.id}?on=${this.on}&cid=${this.cid}`);

		},
		failCreateResume() {
			this.errDialogVisible = false;
			this.successDialogVisible = false;
			this.isShowUpload = true;
			window.open(`/archives/view/edit/${this.pid}/${this.file_id}?build=1&on=${this.on}&cid=${this.cid}`);
		}
	},
	filters: {
		percentChangeStr(val) {
			let x;
			switch (val) {
				case 0:
					x = '上传中...';
					break;
				case 1:
					x = '上传完成';
					break;
				case 2:
					x = '解析中';
					break;
				case 3:
					x = '解析完成';
					break;
				case 4:
					x = '解析失败';
					break;
				default:
					x = '';

			}
			return x;
		},
		srcFileUrl(val) {
			let x;
			switch (val) {
				case 'doc':
					x = doc;
					break;
				case 'docx':
					x = docx;
					break;
				case 'htm':
					x = htm;
					break;
				case 'html':
					x = html;
					break;
				case 'pdf':
					x = pdf;
					break;
				case 'txt':
					x = txt;
					break;
				default:
					break;
			}
			return x;
		}
	}

}

</script>
<style lang="scss">
.upload_wrapper {
	margin: 50px auto 10px;
	width: 830px;
	min-height: 860px;
	.heard_title {
		border-bottom: 1px solid #eee;
		h2 {
			font-weight: normal;
			a {
				display: inline-block;
				padding-bottom: 8px;
				color: #FE6B2B;
				font-size: 16px;
			}
			em {
				display: inline-block;
				font-size: 16px;
				padding: 0 6px;
			}
			p {
				display: inline-block;
				font-size: 16px;
			}
		}
	}
	.upload_box {
		padding: 0 60px 100px 60px;
		.el-upload {
			width: 100%;
			.el-upload-dragger {
				width: 100%;
				height: 340px;
				img {
					margin-top: 100px;
				}
			}
		}
		.upload_info {
			border: 1px dashed #DDD;
			height: 340px;
			text-align: center;
			position: relative;
			.main {
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				margin: auto;
				width: 50%;
				height: 30%;
				dl {
					dt {
						float: left;
						img {
							display: inline-block;
							width: 56px;
							height: 64px;
						}
					}
					dd {
						font-size: 14px;
						padding-left: 80px;
						.progress {}
					}
				}
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
			color: #999;
		}
	}
}
</style>
