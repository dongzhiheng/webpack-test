<template>
	<div class="v-container" @click="closeSelect">
		<navbar class="noprint"></navbar>
		<div class="v-box resumeView">
			<div class="viewinner">
        <div class="view-jobinfo">
          <div class="basicBulid" v-if="build == '1'" v-show="editBasic ==0">
            <div class="img" @click="editBasic =1">
              <span class="companylogo"><img src="../../assets/img/nomarl.png" alt=""/> </span>
            </div>
            <div class="addBinfo"><span @click="editBasic =1"><i class="icon-add"></i>添加基本信息</span></div>
          </div>
          <div v-if="build != '1'" v-show="editBasic == 0" :style="{overflow:'hidden'}">
            <div class="img">
              <span class="companylogo"><img v-if="basic.photo!=''" v-bind:src="basic.photo" alt=""/> <img v-else="" v-bind:src="gender.toLowerCase() | isGender" alt=""/></span>
            </div>
            <div class="info">
              <h3>{{basic.name}}</h3>
              <div class="job-jianjie">
                <span>{{gender.toLowerCase() | gender}}</span><strong>·</strong>
                <span>{{basic.degree | degree}}</span><strong>·</strong>
                <span>{{basic.birth}}</span><strong>·</strong>
                <span>{{basic.work_experience | experienceFilter}}</span><strong>·</strong>
                <span v-show="basic.account != '0'">籍贯{{basic.account}}</span><strong v-show="basic.account != '0'">·</strong>
                <span v-show="basic.address != '0'">现居{{basic.address}} <span class="update" v-if="update" v-show="diff.address_diff">New</span></span>
              </div>
              <div class="job-detail">
                <i class="icon-phone"></i><span v-show="contact.phone">{{contact.phone}} <span class="update" v-if="update" v-show="diff.phone_diff">New</span></span> <span class="grayFont" v-show="!contact.phone">未完善</span>
                <i class="icon-email"></i><span v-show="contact.email">{{contact.email}} <span class="update" v-if="update" v-show="diff.email_diff">New</span></span> <span class="grayFont" v-show="!contact.email">未完善</span>
              </div>
            </div>
            <div class="recommend" v-show="edit == 'preview'">
              <div class="btn-group" v-show="isUpdate">
                <router-link :to="{ name: 'archivesView', query: { 'update':'new'}}">
                  <span class="btn btn-border"><label>New</label> 查看更新版</span>
                </router-link>
              </div>
              <div class="resume-operate">
                <label @click="openPrint"><i class="icon-print"></i><span>打印</span></label>
                <label @click="EvaluateDownDialog = true"><i class="icon-export"></i><span>导出</span></label>
              </div>
            </div>
            <div class="editItem"  v-if="edit == 'edit'" v-show="editBasic == 0" @click='goEdit("basic",basic,contact)'><i class="icon-edit"></i> 编辑</div>
          </div>
          <div v-if="edit == 'edit'" v-show="editBasic == 1" class="basicEdit">
            <div class="img" v-show="build != '1'">
              <span class="companylogo"><img v-if="basic.photo!=''" v-bind:src="basic.photo" alt=""/> <img v-else="" v-bind:src="gender.toLowerCase() | isGender" alt=""/></span>
            </div>
            <div class="img" v-show="build == '1'">
              <span class="companylogo"><img src="../../assets/img/nomarl.png" alt=""/> </span>
            </div>
            <div class="basicInfo">
              <el-form :model="basicForm" :rules="basicRules" ref="basicForm" :label-position="basicPosition">
                <el-form-item class="name" label="姓名" :label-width="labelWidth" prop="name" required>
                  <el-input type="" v-model="basicForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sex" class="sex">
                  <el-radio-group v-model="basicForm.sex">
                    <el-radio label="男"></el-radio>
                    <el-radio label="女"></el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item prop="birth" label="出生年月" :label-width="labelWidth" required>
                  <el-date-picker type="month" :editable=false placeholder="生日" v-model="basicForm.birth" style="width: 150px;"></el-date-picker>
                </el-form-item>
                <el-form-item class="pl13" label="籍贯" :label-width="labelWidth" prop="account">
                  <div class="place" @click.stop="showCity">
                      <div v-for="city of basicForm.accountType">{{city.name}}</div>
                      <cd-single-select-city :cityData="CityTypeData" :type="cityType" :selectCityShow="cityShow1" v-on:increment="incrementTotal"></cd-single-select-city>
                  </div>
                </el-form-item>
                <el-form-item class="pl13" label="现居城市" :label-width="labelWidth" prop="address">
                  <div class="place" @click.stop="showCity1" >
                      <div v-for="city of basicForm.addressType">{{city.name}}</div>    
                       <cd-single-select-city :cityData="CityTypeData" :type="cityType" :selectCityShow="cityShow2" v-on:increment="incrementTotal"></cd-single-select-city>        
                  </div>
                </el-form-item>
                <el-form-item class="" label="手机号" :label-width="labelWidth" prop="phone" required>
                  <el-input type="" v-model="basicForm.phone" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item class="" label="联系邮箱" :label-width="labelWidth" prop="email" required>
                  <el-input type="" v-model="basicForm.email" auto-complete="off"></el-input>
                </el-form-item>
                <div class="submit">
                  <span class="cd-button cd-button-default" @click="editBasic = 0">取 消</span>
                  <span class="cd-button cd-button-primary" @click="isSave('basic','edit','basicForm')">保 存</span>
                </div>
              </el-form>
            </div>
          </div>
        </div>
        <!--顾问评价-->
        <div class="evaluate" v-if="pid != 'cv'" v-show="build!='1'">
          <div class="cv-detail" :style="{padding:'30px 0 0 0'}">
            <p class="cv-detail-title">
              <i class="icon-resume-evaluati"></i> <span>顾问评价</span>
            </p>
            <div class="cv-detail-content" :style="{padding:'30px 0 0 0'}">
              <!--填写评价-->
              <el-form v-show="showEvaluate == 0" :model="evaluateForm" :rules="evaluateRules" ref="evaluateForm" :label-position="basicPosition">
                  <el-form-item label="评价内容" :label-width="labelWidth" prop="evaluate" required>
                    <el-input type="textarea" :rows='4' :maxlength='150' v-model="evaluateForm.evaluate"></el-input>
                    <p class="grayFont" :style="{textAlign:'right',fontSize:'12px'}">评论内容必须150字以内哦</p>
                  </el-form-item>
              </el-form>
              <!--展示评价-->
              <div class="detail education-detail" v-show="showEvaluate == 1">
                  <div class="other" v-html="$options.filters.n2p(evaluateForm.evaluate)"></div>
              </div>
            </div>
          </div>
        </div>
        <!--推荐报告-->
         <div class="cv-detail" v-show="report" :style="{padding:'30px 0 0 0'}">
           <p class="cv-detail-title">
             <i class="icon-resume-evaluati"></i> <span>顾问评价</span>
           </p>
           <div class="cv-detail-content" :style="{padding:'15px 0 0 0'}">
              <div class="detail education-detail">
                <div class="other" v-html="$options.filters.n2p(reportContent)"></div>
              </div>
           </div>
         </div>

        <div class="cv-detail">
          <div>
             <p class="cv-detail-title intention">
               <i class="icon-compass"></i> <span>求职意向</span>
               <div v-show="buildAccount.buildIntention">
                 <div class="newBulid" v-if="build" v-show="edit == 'edit',editIntention == 0" >
                   <span @click='goEdit("intention")'><i class="icon-add"></i>添加求职意向</span>
                 </div>
               </div>
            </p>
             <div class="cv-detail-content">
                <div class="detail intention-detail" v-if="!buildAccount.buildIntention" v-show="editIntention == 0">
                  <div class="cv-detail-left">
                    <p>
                      <span class="cv-detail-content-title">期望地点：</span>
                      <span class="cv-detail-container" v-bind:title="basic.expect_city_names"><em v-show="basic.expect_city_names">{{basic.expect_city_names}}</em> <em v-show="!basic.expect_city_names" class="grayFont">未完善</em></span>
                    </p>
                    <p>
                      <span class="cv-detail-content-title">期望月薪：</span>
                      <span class="cv-detail-container">
                        <em v-show="basic.expect_salary_from!=0,basic.expect_salary_to!=0">{{basic.expect_salary_from}} ~ {{basic.expect_salary_to}}k/月</em> 
                        <em v-show="basic.expect_salary_from==0,basic.expect_salary_to==0" class="grayFont">未完善</em>
                      </span>
                    </p>
                    <p>
                      <span class="cv-detail-content-title">期望职位：</span>
                      <span class="cv-detail-container"><em class="limit expect-position" v-show="basic.expect_position_name">{{basic.expect_position_name}}</em> <em v-show="!basic.expect_position_name" class="grayFont">未完善</em></span>
                    </p> 
                  </div> 
                  <div class="cv-detail-right">
                    <p>
                      <span class="cv-detail-content-title">目前状况：</span>
                      <span class="cv-detail-container"><em v-bind:title="basic.current_status" v-show="basic.current_status">{{basic.current_status}}</em> <em v-show="!basic.current_status" class="grayFont">未完善</em></span>
                    </p>
                    <p>
                      <span class="cv-detail-content-title">目前月薪：</span>
                      <span class="cv-detail-container">
                        <em v-show="basic.basic_salary_from!=0,basic.basic_salary_to!=0">{{basic.basic_salary_from}} ~ {{basic.basic_salary_to}}k/月</em> 
                        <em v-show="basic.basic_salary_from==0,basic.basic_salary_to==0" class="grayFont">未完善</em>
                      </span>
                    </p>
                    <p>
                      <span class="cv-detail-content-title">期望行业：</span>
                      <span class="cv-detail-container"><em class="limit expect-industry" v-show="basic.expect_industry_name">{{basic.expect_industry_name}}</em> <em v-show="!basic.expect_industry_name" class="grayFont">未完善</em></span>
                    </p>
                  </div>
                </div>

                <div class="editing intenEdit" v-if="build == '2'" v-show="editIntention == 1">
                  <el-form :model="intentionForm" :rules="intentionRules" ref="intentionForm" :label-position="basicPosition">
                    <el-form-item label="期望地点" :label-width="labelWidth" prop="city_names" required>
                      <div @click.stop="isCityShow">
                        <cd-select-city :cityData="intentionForm.city_names" :selectCityShow="cityShow"></cd-select-city>
                      </div>
                    </el-form-item>
                    <el-form-item label="目前状况" prop="current_status" :label-width="labelWidth" required>
                      <el-select v-model="intentionForm.current_status" placeholder="不限">
                        <el-option label="离职，正在看机会" value="1"></el-option>
                        <el-option label="在职，正在看机会" value="2"></el-option>
                        <el-option label="在职，有好的机会可以考虑" value="3"></el-option>
                        <el-option label="在职，不考虑机会" value="4"></el-option>
                        <el-option label="实习生" value="5"></el-option>
                      </el-select>
                    </el-form-item>
                     <el-col :span="8">
                        <el-form-item prop="expect_salary" label="期望月薪" :label-width="labelWidth" required>
                          <el-select v-model="intentionForm.expect_salary" placeholder="不限">
                            <el-option label="小于5k" value="0-5"></el-option>
                            <el-option label="5-8k" value="5-8"></el-option>
                            <el-option label="8-12k" value="8-12"></el-option>
                            <el-option label="12-15k" value="12-15"></el-option>
                            <el-option label="15-20k" value="15-20"></el-option>
                            <el-option label="20-30k" value="20-30"></el-option>
                            <el-option label="30-50k" value="30-50"></el-option>
                            <el-option label="大于50k" value="50"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span='8' class="ml40">
                        <el-form-item label="目前月薪" :label-width="labelWidth" required>
                          <el-form-item prop="current_salary">
                            <el-select v-model="intentionForm.current_salary" placeholder="不限">
                            <el-option label="小于5k" value="0-5"></el-option>
                            <el-option label="5-8k" value="5-8"></el-option>
                            <el-option label="8-12k" value="8-12"></el-option>
                            <el-option label="12-15k" value="12-15"></el-option>
                            <el-option label="15-20k" value="15-20"></el-option>
                            <el-option label="20-30k" value="20-30"></el-option>
                            <el-option label="30-50k" value="30-50"></el-option>
                            <el-option label="大于50k" value="50"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-form-item>
                    </el-col>
                    <el-form-item class="clearBoth" label="期望职位" :label-width="labelWidth" prop="expect_position_name" required>
                      <el-input type="" v-model="intentionForm.expect_position_name" auto-complete="off"></el-input>
                    </el-form-item>
                  </el-form>
                  
                  <el-form :model="intentionForm1" :rules="intentionRules1" ref="intentionForm1" :label-position="basicPosition">
                    <el-form-item class="clearBoth" label="期望行业" :label-width="labelWidth" prop="industries" required>
                      <div class="industry-wrapper" @click="dialogVisible = true">
                        <ul class="industry-selector-selected">
                        <li class="columns-item" v-for="industry in intentionForm1.industries" @click="$event.stopPropagation()">
                          {{industry.name}}
                          <em class="icon-close" @click="removeCheckIndustry(industry.tid)"></em>
                        </li>
                      </ul>
                      </div>
                    </el-form-item>
                  </el-form>

                    <div class="submit">
                      <span class="cd-button cd-button-default" @click="editIntention = 0">取 消</span>
                      <span class="cd-button cd-button-primary" @click="isSave('intention','edit','intentionForm')">保 存</span>
                    </div>
                </div>
              </div>
          </div>
          <div>
             <p class="cv-detail-title">
               <i class="icon-resume-educatio"></i> <span>教育经历 <span class="update" v-if="update" v-show="diff.education_diff">New</span></span>
               <span @click="goEdit('addEdu')" class="editItem" v-if="edit == 'edit'" v-show="editEdu == 0"><i class="icon-add"></i>
                  <label v-show="addShow.addShowEdu">添加</label><label v-show="!addShow.addShowEdu">新增</label>
                </span>
               <span class="editItem grayFont" v-show="editEdu == 1"><i class="icon-add"></i>
                  <label v-show="addShow.addShowEdu">添加</label><label v-show="!addShow.addShowEdu">新增</label>
               </span>
            </p>
            <div class="newBulid" v-if="buildAccount.buildEdu" v-show="editEdu == 0">
              <span @click="goEdit('addEdu')"><i class="icon-add"></i>添加教育经历</span>
            </div>
            <!--新增-->
            <div class="editing termEdit" v-show="addEdu == 1">
              <el-form :model="eduForm1" :rules="eduRules1" ref="eduForm1" :label-position="basicPosition">
                <el-form-item label="学校名称" :label-width="labelWidth" prop="school_name1" required>
                  <el-input type="" v-model="eduForm1.school_name1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="degree1" label="学历" :label-width="labelWidth" required>
                  <el-col :span="6">
                    <el-select v-model="eduForm1.degree1" placeholder="不限">
                      <el-option label="本科" value="1"></el-option>
                      <el-option label="硕士" value="2"></el-option>
                      <el-option label="博士" value="3"></el-option>
                      <el-option label="专科" value="4"></el-option>
                      <el-option label="MBA" value="6"></el-option>
                      <el-option label="博士后" value="10"></el-option>
                      <el-option label="职高" value="87"></el-option>
                      <el-option label="高中" value="89"></el-option>
                      <el-option label="中专" value="90"></el-option>
                      <el-option label="中技" value="91"></el-option>
                      <el-option label="专升本" value="92"></el-option>
                      <el-option label="EMBA" value="94"></el-option>
                      <el-option label="MPA" value="95"></el-option>
                      <el-option label="初中" value="86"></el-option>
                      <el-option label="其他" value="99"></el-option>
                    </el-select>
                  </el-col>
                </el-form-item>
                <el-form-item label="专业名称" :label-width="labelWidth" prop="major_name1" required>
                  <el-input type="" v-model="eduForm1.major_name1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="在校时间" :label-width="labelWidth" prop="dateRange1" required>
                  <el-col :span='4'>
                    <el-form-item  prop="from1">
                      <el-date-picker type="month" :editable=false  :picker-options="pickerClose" placeholder="入学时间" v-model="eduForm1.from1" style="width: 150px;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span='4'>~</el-col>
                  <el-col :span='4'>
                    <el-form-item prop="to1">
                      <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="毕业时间" v-model="eduForm1.to1" style="width: 150px;"></el-date-picker>
                  </el-form-item>
                  </el-col>
                </el-form-item>
                <div class="submit">
                  <!--重置editShow-->
                  <span class="cd-button cd-button-default" @click="editEdu = 0,addEdu = 0">取 消</span>
                  <span class="cd-button cd-button-primary" @click="isSave('edu','edit','eduForm1')">保 存</span>
                </div>
              </el-form>
            </div>
  
             <div class="cv-detail-content">
                <div class="detail education-detail" v-show="!buildAccount.buildEdu">
                  <div class="items" v-for="(edu,index) in resume_base_data.education">
                    <div class="editing" v-bind:class="{termEdit:index===editShow.editShowEdu}" v-show="editEdu == 1">
                        <el-form v-show="index===editShow.editShowEdu" :model="eduForm2" :rules="eduRules2" ref="eduForm2" :label-position="basicPosition">
                          <el-form-item label="学校名称" :label-width="labelWidth" prop="school_name2" required>
                            <el-input type="" v-model="eduForm2.school_name2" auto-complete="off"></el-input>
                          </el-form-item>
                          <el-form-item prop="degree2" label="学历" :label-width="labelWidth" required>
                            <el-col :span="6">
                              <el-select v-model="eduForm2.degree2" placeholder="不限">
                                <el-option label="本科" value="1"></el-option>
                                <el-option label="硕士" value="2"></el-option>
                                <el-option label="博士" value="3"></el-option>
                                <el-option label="专科" value="4"></el-option>
                                <el-option label="MBA" value="6"></el-option>
                                <el-option label="博士后" value="10"></el-option>
                                <el-option label="职高" value="87"></el-option>
                                <el-option label="高中" value="89"></el-option>
                                <el-option label="中专" value="90"></el-option>
                                <el-option label="中技" value="91"></el-option>
                                <el-option label="专升本" value="92"></el-option>
                                <el-option label="EMBA" value="94"></el-option>
                                <el-option label="MPA" value="95"></el-option>
                                <el-option label="初中" value="86"></el-option>
                                <el-option label="其他" value="99"></el-option>
                              </el-select>
                            </el-col>
                          </el-form-item>
                          <el-form-item label="专业名称" :label-width="labelWidth" prop="major_name2" required>
                            <el-input type="" v-model="eduForm2.major_name2" auto-complete="off"></el-input>
                          </el-form-item>
                          <el-form-item label="在校时间" :label-width="labelWidth" required>
                            <el-col :span='4'>
                              <el-form-item  prop="from2">
                                <el-date-picker type="month" :editable=false placeholder="入学时间" :picker-options="pickerClose" v-model="eduForm2.from2" style="width: 150px;"></el-date-picker>
                              </el-form-item>
                            </el-col>
                            <el-col :span='4'>~</el-col>
                            <el-col :span='4'>
                              <el-form-item  prop="to2">
                                <el-date-picker type="month" :editable=false placeholder="毕业时间" :picker-options="pickerClose" v-model="eduForm2.to2" style="width: 150px;"></el-date-picker>
                              </el-form-item>
                            </el-col>
                          </el-form-item>
                          <div class="submit">
                            <span class="cd-button cd-button-default" @click="editEdu = 0,addEdu = 0,editShow.editShowEdu= ''">取 消</span>
                            <span class="cd-button cd-button-primary" @click="isSave('edu','edit','eduForm2',index)">保 存</span>
                            <span v-show="addEdu == 0" class="btn-delete" @click="isDel('edu')"><i class="icon-delete"></i> 删除</span>
                          </div>
                        </el-form>
                    </div>

                    <div class="cv-detail-left" v-show="index!==editShow.editShowEdu">
                      <p>{{edu.start_time}} - {{edu.end_time}}</p>
                    </div> 
                    <div class="cv-detail-right" v-show="index!==editShow.editShowEdu">
                      <p>
                        <span>{{edu.degree}}<strong v-show="edu.degree !=''">·</strong></span><span class="limit limit-edu">{{edu.school_name}}<strong v-show="edu.discipline_name != ''">·</strong></span><span class="limit limit-edu">{{edu.discipline_name}}</span>
                        <span @click="goEdit('edu',edu,index)" class="editItem" v-if="edit == 'edit'" v-show="editEdu == 0"><i class="icon-edit"></i> 编辑</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div class="work">
             <p class="cv-detail-title">
               <i class="icon-resume-work"></i> <span>工作经历 <span class="update" v-if="update" v-show="diff.work_diff">New</span></span> 
               <span @click="goEdit('addWork')" class="editItem" v-if="edit == 'edit'" v-show="editWork == 0"><i class="icon-add"></i>
                  <label v-show="addShow.addShowWork">添加</label><label v-show="!addShow.addShowWork">新增</label>
               </span>
               <span class="editItem grayFont" v-show="editWork == 1"><i class="icon-add"></i>
                  <label v-show="addShow.addShowWork">添加</label><label v-show="!addShow.addShowWork">新增</label>
               </span>
            </p>
            <div class="newBulid" v-if="buildAccount.buildWork" v-show="editWork == 0">
              <span @click="goEdit('addWork')"><i class="icon-add"></i>添加工作经历</span>
            </div>
            <!--新增-->
            <div class="editing termEdit" v-if="edit == 'edit'" v-show="addWork == 1">
              <el-form :model="workForm1" :rules="workRules1" ref="workForm1" :label-position="basicPosition">
                <el-form-item label="公司名称" :label-width="labelWidth" prop="company_name1" required>
                  <el-input type="" v-model="workForm1.company_name1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="职位" :label-width="labelWidth" prop="position_name1" required>
                  <el-input type="" v-model="workForm1.position_name1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="在职时间" :label-width="labelWidth" prop="workTime1" required>
                  <el-col :span='4'>
                    <el-form-item  prop="from1">
                      <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="入职时间" v-model="workForm1.from1" style="width: 150px;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span='4'>~</el-col>
                  <el-col :span='4'>
                    <el-form-item  prop="to1">
                      <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="离职时间" v-model="workForm1.to1" style="width: 150px;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  </el-form-item>
                <el-form-item class="pl13" label="工作内容" :label-width="labelWidth" prop="responsibilities1">
                  <el-input type="textarea" :rows='4' :maxlength='500' v-model="workForm1.responsibilities1"></el-input>
                </el-form-item>
                <div class="submit">
                  <span class="cd-button cd-button-default" @click="editWork = 0,addWork = 0">取 消</span>
                  <span class="cd-button cd-button-primary" @click="isSave('work','edit','workForm1')">保 存</span>
                </div>
              </el-form>
            </div>
            
             <div class="cv-detail-content">
                <div class="detail work-detail" v-show="!buildAccount.buildWork">
                  <div class="work-items" v-for="(work,index) in resume_base_data.work">

                    <div class="editing" v-bind:class="{termEdit:index===editShow.editShowWork}" v-show="editWork == 1">
                      <el-form :model="workForm2" :rules="workRules2" ref="workForm2" :label-position="basicPosition" v-show="index===editShow.editShowWork">
                        <el-form-item label="公司名称" :label-width="labelWidth" prop="company_name2" required>
                          <el-input type="" v-model="workForm2.company_name2" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="职位" :label-width="labelWidth" prop="position_name2" required>
                          <el-input type="" v-model="workForm2.position_name2" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="在职时间" :label-width="labelWidth" prop="workTime2" required>
                          <el-col :span='4'>
                            <el-form-item  prop="from2">
                              <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="起始时间" v-model="workForm2.from2" style="width: 150px;"></el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span='4'>~</el-col>
                          <el-col :span='4'>
                            <el-form-item  prop="to2">
                              <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="结束时间" v-model="workForm2.to2" style="width: 150px;"></el-date-picker>
                            </el-form-item>
                          </el-col>
                        </el-form-item>
                        <el-form-item class="pl13" label="工作内容" :label-width="labelWidth" prop="responsibilities2">
                          <el-input type="textarea" :rows='4' :maxlength='500' v-model="workForm2.responsibilities2"></el-input>
                        </el-form-item>
                        <div class="submit">
                          <span class="cd-button cd-button-default" @click="editWork = 0,addWork = 0,editShow.editShowWork = ''">取 消</span>
                          <span class="cd-button cd-button-primary" @click="isSave('work','edit','workForm2',index)">保 存</span>
                          <span v-show="addWork == 0" class="btn-delete" @click="isDel('work')"><i class="icon-delete"></i> 删除</span>
                        </div>
                      </el-form>
                    </div>

                    <div class="cv-detail-left" v-show="index!==editShow.editShowWork">
                      <div class="priority">{{work.start_time}} - {{work.end_time}}</div>
                      <div class="work-diachronic">{{work.diachronic}}</div>
                    </div>
                    <div class="cv-detail-right" v-if="work.lack_work" v-show="index!==editShow.editShowWork">
                      <div class="priority"><span class="work-empty"> <i class="icon-prompt"></i>工作经历用户未完善</span></div>
                    </div>
                    <div class="cv-detail-right" v-else="" v-show="index!==editShow.editShowWork">
                      <div class="priority">
                        {{work.corporation_name}}
                        <span @click="goEdit('work',work,index)" class="editItem" v-if="edit == 'edit'" v-show="editWork == 0"><i class="icon-edit"></i> 编辑</span>
                      </div>
                      <div class="work-include-show">
                        <span class="limit limit-position">{{work.position_name}}</span>
                        <!--<u>|</u> <span class="limit limit-position">{{work.architecture_name}}</span>-->
                        <!--<u>|</u> <span class="">下属{{work.subordinates_count}}人</span>-->
                        <!--<u>|</u> <span class="">{{work.basic_salary}}/月</span>-->
                      </div>
                      <div class="work-responsibility" v-html="$options.filters.n2p(work.responsibilities)"></div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div class="project">
             <p class="cv-detail-title">
               <i class="icon-resume-project"></i> <span>项目经历 <span class="update" v-if="update" v-show="diff.project_diff">New</span></span>
               <span @click="goEdit('addProject')" class="editItem" v-if="edit == 'edit'" v-show="editProject == 0"><i class="icon-add"></i>
                  <label v-show="addShow.addShowProject">添加</label><label v-show="!addShow.addShowProject">新增</label>
               </span>
               <span class="editItem grayFont" v-show="editProject == 1"><i class="icon-add"></i>
                  <label v-show="addShow.addShowProject">添加</label><label v-show="!addShow.addShowProject">新增</label>
               </span>
            </p>
             <div class="newBulid" v-if="buildAccount.buildProject" v-show="editProject == 0">
              <span @click="goEdit('addProject')"><i class="icon-add"></i>添加项目经历</span>
            </div>
            <!--新增-->
            <div class="editing termEdit" v-if="edit == 'edit'" v-show="addProject == 1">
              <el-form :model="projectForm1" :rules="projectRules1" ref="projectForm1" :label-position="basicPosition">
                <el-form-item label="项目名称" :label-width="labelWidth" prop="project_name1" required>
                  <el-input type="" v-model="projectForm1.project_name1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="项目周期" :label-width="labelWidth" prop="project_time1" required>
                  <el-col :span='4'>
                    <el-form-item  prop="from1">
                      <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="起始时间" v-model="projectForm1.from1" style="width: 150px;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span='4'>~</el-col>
                  <el-col :span='4'>
                    <el-form-item  prop="to1">
                      <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="结束时间" v-model="projectForm1.to1" style="width: 150px;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item class="pl13" label="项目描述" :label-width="labelWidth" prop="describe1">
                  <el-input type="textarea" :rows='4' :maxlength='500' v-model="projectForm1.describe1"></el-input>
                </el-form-item>
                <div class="submit">
                  <span class="cd-button cd-button-default" @click="editProject = 0,addProject = 0">取 消</span>
                  <span class="cd-button cd-button-primary" @click="isSave('project','edit','projectForm1')">保 存</span>
                </div>
              </el-form>
            </div>
             <div class="cv-detail-content">
                <div class="detail work-detail" v-show="!buildAccount.buildProject">
                  <div class="work-items" v-for="(project,index) in resume_base_data.project">

                    <div class="editing" v-bind:class="{termEdit:index===editShow.editShowProject}" v-show="editProject == 1">
                      <el-form v-show="index===editShow.editShowProject" :model="projectForm2" :rules="projectRules2" ref="projectForm2" :label-position="basicPosition">
                        <el-form-item label="项目名称" :label-width="labelWidth" prop="project_name2" required>
                          <el-input type="" v-model="projectForm2.project_name2" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="项目周期" :label-width="labelWidth" prop="project_time2" required>
                          <el-col :span='4'>
                            <el-form-item  prop="from2">
                              <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="起始时间" v-model="projectForm2.from2" style="width: 150px;"></el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span='4'>~</el-col>
                          <el-col :span='4'>
                            <el-form-item  prop="to2">
                              <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="结束时间" v-model="projectForm2.to2" style="width: 150px;"></el-date-picker>
                            </el-form-item>
                          </el-col>
                        </el-form-item>
                        <el-form-item class="pl13" label="项目描述" :label-width="labelWidth" prop="describe2">
                          <el-input type="textarea" :rows='4' :maxlength='500' v-model="projectForm2.describe2"></el-input>
                        </el-form-item>
                        <div class="submit">
                          <span class="cd-button cd-button-default" @click="editProject = 0,addProject = 0,editShowProject = ''">取 消</span>
                          <span class="cd-button cd-button-primary" @click="isSave('project','edit','projectForm2',index)">保 存</span>
                          <span class="btn-delete" @click="isDel('project')"><i class="icon-delete"></i> 删除</span> 
                        </div>
                      </el-form>
                    </div>

                    <div class="cv-detail-left" v-show="index!==editShow.editShowProject">
                      <div class="priority">{{project.start_time}} - {{project.end_time}}</div>
                    </div>
                    <div class="cv-detail-right" v-show="index!==editShow.editShowProject">
                      <div class="priority">
                        {{project.name}}
                        <span  @click="goEdit('project',project,index)" class="editItem" v-if="edit == 'edit'" v-show="editProject == 0"><i class="icon-edit"></i> 编辑</span>
                      </div>
                      <div class="work-responsibility">
                        <p class="h5">项目描述</p>
                        <p v-html="$options.filters.n2p(project.describe)"></p>
                        <p v-html="$options.filters.n2p(project.responsibilities)"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div>
             <p class="cv-detail-title">
               <i class="icon-resume-skill"></i> <span>职业技能</span> 
               <span @click="goEdit('addSkill')" class="editItem" v-if="edit == 'edit'" v-show="editSkill == 0"><i class="icon-add"></i>
                  <label v-show="addShow.addShowSkill">添加</label><label v-show="!addShow.addShowSkill">新增</label>
               </span>
               <span class="editItem grayFont" v-show="editSkill == 1"><i class="icon-add"></i>
                  <label v-show="addShow.addShowSkill">添加</label><label v-show="!addShow.addShowSkill">新增</label>
               </span>
             </p>
             <div class="newBulid" v-if="buildAccount.buildSkill" v-show="editSkill == 0">
              <span @click="goEdit('addSkill')"><i class="icon-add"></i>添加职业技能</span>
            </div>
             <!--新增-->
             <div class="editing termEdit" v-if="edit == 'edit'"  v-show="addSkill == 1">
              <el-form :model="skillForm1" :rules="skillRules1" ref="skillForm1" :label-position="basicPosition">
                <el-form-item label="技能名称" :label-width="labelWidth" prop="name1" required>
                  <el-input type="" v-model="skillForm1.name1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="技能水平" :label-width="labelWidth" prop="level1" required>
                  <el-input type="" v-model="skillForm1.level1" auto-complete="off"></el-input>
                </el-form-item>
                <div class="submit">
                  <span class="cd-button cd-button-default" @click="editSkill = 0,addSkill = 0">取 消</span>
                  <span class="cd-button cd-button-primary" @click="isSave('skill','edit','skillForm1')">保 存</span>
                </div>
              </el-form>
            </div>

             <div class="cv-detail-content">
                <div class="detail" v-show="!buildAccount.buildSkill">
                  <div class="occupation-items"  v-for="(skill,index) in resume_base_data.skill">
                   
                    <div class="editing" v-bind:class="{termEdit:index===editShow.editShowSkill}" v-show="editSkill == 1">
                      <el-form v-show="index===editShow.editShowSkill" :model="skillForm2" :rules="skillRules2" ref="skillForm2" :label-position="basicPosition">
                        <el-form-item label="技能名称" :label-width="labelWidth" prop="name2" required>
                          <el-input type="" v-model="skillForm2.name2" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="技能水平" :label-width="labelWidth" prop="level2" required>
                          <el-input type="" v-model="skillForm2.level2" auto-complete="off"></el-input>
                        </el-form-item>
                        <div class="submit">
                          <span class="cd-button cd-button-default" @click="editSkill = 0,addSkill = 0,editShow.editShowSkill = ''">取 消</span>
                          <span class="cd-button cd-button-primary" @click="isSave('skill','edit','skillForm2',index)">保 存</span>
                          <span v-show="addSkill == 0" class="btn-delete" @click="isDel('skill')"><i class="icon-delete"></i> 删除</span>
                        </div>
                      </el-form>
                    </div>

                    <p v-show="index!==editShow.editShowSkill">
                      <span class="limit limit-edu">{{skill.name}}</span><strong>·</strong><span>{{skill.level}}</span>
                      <span  @click="goEdit('skill',skill,index)" class="editItem" v-if="edit == 'edit'" v-show="editSkill == 0"><i class="icon-edit"></i> 编辑</span>
                    </p>
                  </div>
                </div>
              </div>
          </div>
          <div>
             <p class="cv-detail-title">
               <i class="icon-resume-language"></i> <span>语言水平</span> 
               <span @click="goEdit('addLanguage')" class="editItem" v-if="edit == 'edit'" v-show="editLanguage == 0"><i class="icon-add"></i>
                  <label v-show="addShow.addShowLanguage">添加</label><label v-show="!addShow.addShowLanguage">新增</label>
               </span>
               <span class="editItem grayFont" v-show="editLanguage == 1"><i class="icon-add"></i>
                  <label v-show="addShow.addShowLanguage">添加</label><label v-show="!addShow.addShowLanguage">新增</label>
               </span>
             </p>
             <div class="newBulid" v-if="buildAccount.buildLanguage" v-show="editLanguage == 0">
              <span @click="goEdit('addLanguage')"><i class="icon-add"></i>添加语言水平</span>
            </div>
             <!--新增-->
             <div class="editing termEdit" v-if="edit == 'edit'"  v-show="addLanguage == 1">
              <el-form :model="languageForm1" :rules="languageRules1" ref="languageForm1" :label-position="basicPosition">
                <el-col :span='10'>
                  <el-form-item label="外语名称" :label-width="labelWidth" prop="name1" required>
                    <el-input type="" v-model="languageForm1.name1" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='8' class="ml40">
                  <el-form-item prop="level1" label="外语水平" :label-width="labelWidth" required>
                      <el-select v-model="languageForm1.level1" placeholder="一般">
                      <el-option label="一般" value="一般"></el-option>
                      <el-option label="良好" value="良好"></el-option>
                      <el-option label="熟练" value="熟练"></el-option>
                      <el-option label="精通" value="精通"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <div class="submit">
                  <span class="cd-button cd-button-default" @click="editLanguage = 0,addLanguage = 0">取 消</span>
                  <span class="cd-button cd-button-primary" @click="isSave('language','edit','languageForm1')">保 存</span>
                </div>
              </el-form>
            </div>

             <div class="cv-detail-content">
                <div class="detail" v-show="!buildAccount.buildLanguage">
                  <div class="occupation-items"  v-for="(language,index) in resume_base_data.language">

                    <div class="editing" v-bind:class="{termEdit:index===editShow.editShowLanguage}"  v-show="editLanguage == 1">
                        <el-form v-show="index===editShow.editShowLanguage" :model="languageForm2" :rules="languageRules2" ref="languageForm2" :label-position="basicPosition">
                          <el-col :span='10'>
                            <el-form-item label="外语名称" :label-width="labelWidth" prop="name2" required>
                              <el-input type="" v-model="languageForm2.name2" auto-complete="off"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span='8' class="ml40">
                            <el-form-item prop="level2" label="外语水平" :label-width="labelWidth" required>
                                <el-select v-model="languageForm2.level2" placeholder="一般">
                                <el-option label="一般" value="一般"></el-option>
                                <el-option label="良好" value="良好"></el-option>
                                <el-option label="熟练" value="熟练"></el-option>
                                <el-option label="精通" value="精通"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <div class="submit">
                            <span class="cd-button cd-button-default" @click="editLanguage = 0,addLanguage = 0,editShow.editShowLanguage = ''">取 消</span>
                            <span class="cd-button cd-button-primary" @click="isSave('language','edit','languageForm2',index)">保 存</span>
                            <span v-show="addLanguage == 0" class="btn-delete" @click="isDel('language')"><i class="icon-delete"></i> 删除</span>  
                          </div>
                        </el-form>
                      </div>
                    <p v-show="index!==editShow.editShowLanguage">
                      <span class="limit limit-edu">{{language.name}}</span><strong>·</strong><!--<span>{{language.certificate}}</span><strong>·</strong>--><span>{{language.level}}</span>
                      <span  @click="goEdit('language',language,index)" class="editItem" v-if="edit == 'edit'" v-show="editLanguage == 0"><i class="icon-edit"></i> 编辑</span>
                    </p>
                  </div>
                </div>
              </div>
          </div>
          <div>
             <p class="cv-detail-title"><i class="icon-resume-training"></i> <span>培训经历 <span class="update" v-if="update" v-show="diff.training_diff">New</span></span>
                <span @click="goEdit('addTraining')" class="editItem" v-if="edit == 'edit'" v-show="editTraining == 0"><i class="icon-add"></i>
                  <label v-show="addShow.addShowTraining">添加</label><label v-show="!addShow.addShowTraining">新增</label>
               </span>
               <span class="editItem grayFont" v-show="editTraining == 1"><i class="icon-add"></i>
                  <label v-show="addShow.addShowTraining">添加</label><label v-show="!addShow.addShowTraining">新增</label>
               </span>
             </p>
             <div class="newBulid" v-if="buildAccount.buildTraining" v-show="editTraining == 0">
              <span @click="goEdit('addTraining')"><i class="icon-add"></i>添加培训经历</span>
            </div>
             <!--新增-->
             <div class="editing termEdit" v-if="edit == 'edit'"  v-show="addTraining == 1">
              <el-form :model="trainingForm1" :rules="trainingRules1" ref="trainingForm1" :label-position="basicPosition">
                <el-form-item label="培训时间" :label-width="labelWidth" prop="training_time1" required>
                  <el-col :span='4'>
                    <el-form-item  prop="from1">
                      <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="起始时间" v-model="trainingForm1.from1" style="width: 150px;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span='4'>~</el-col>
                  <el-col :span='4'>
                    <el-form-item  prop="to1">
                      <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="结束时间" v-model="trainingForm1.to1" style="width: 150px;"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item label="培训内容" :label-width="labelWidth" prop="name1" required>
                  <el-input type="" v-model="trainingForm1.name1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="培训机构" :label-width="labelWidth" prop="authority1" required>
                  <el-input type="" v-model="trainingForm1.authority1" auto-complete="off"></el-input>
                </el-form-item>
                <div class="submit">
                  <span class="cd-button cd-button-default" @click="editTraining = 0,addTraining = 0">取 消</span>
                  <span class="cd-button cd-button-primary" @click="isSave('training','edit','trainingForm1')">保 存</span>
                </div>
              </el-form>
            </div>

             <div class="cv-detail-content">
                <div class="detail education-detail" v-show="!buildAccount.buildTraining">
                  <div class="items" v-for="(training,index) in resume_base_data.training">

                    <div class="editing" v-bind:class="{termEdit:index===editShow.editShowTraining}" v-show="editTraining == 1">
                      <el-form v-show="index===editShow.editShowTraining" :model="trainingForm2" :rules="trainingRules2" ref="trainingForm2" :label-position="basicPosition">
                        <el-form-item label="培训时间" :label-width="labelWidth" prop="training_time2" required>
                          <el-col :span='4'>
                            <el-form-item  prop="from2">
                              <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="起始时间" v-model="trainingForm2.from2" style="width: 150px;"></el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span='4'>~</el-col>
                          <el-col :span='4'>
                            <el-form-item  prop="to2">
                              <el-date-picker type="month" :editable=false :picker-options="pickerClose" placeholder="结束时间" v-model="trainingForm2.to2" style="width: 150px;"></el-date-picker>
                            </el-form-item>
                          </el-col>
                        </el-form-item>
                        <el-form-item label="培训内容" :label-width="labelWidth" prop="name2" required>
                          <el-input type="" v-model="trainingForm2.name2" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="培训机构" :label-width="labelWidth" prop="authority2" required>
                          <el-input type="" v-model="trainingForm2.authority2" auto-complete="off"></el-input>
                        </el-form-item>
                        <div class="submit">
                          <span class="cd-button cd-button-default" @click="editTraining = 0,addTraining = 0,editShow.editShowTraining = ''">取 消</span>
                          <span class="cd-button cd-button-primary" @click="isSave('training','edit','trainingForm2',index)">保 存</span>
                          <span v-show="addTraining == 0" class="btn-delete" @click="isDel('training')"><i class="icon-delete"></i> 删除</span>                              
                        </div>
                      </el-form>
                    </div>

                    <div class="cv-detail-left" v-show="index!==editShow.editShowTraining">
                      <p>{{training.start_time}} - {{training.end_time}}</p> 
                    </div> 
                    <div class="cv-detail-right" v-show="index!==editShow.editShowTraining">
                      <p>
                        <span>{{training.name}}</span> <span class="color9">{{training.authority}}</span>
                        <span  @click="goEdit('training',training,index)" class="editItem" v-if="edit == 'edit'" v-show="editTraining == 0"><i class="icon-edit"></i> 编辑</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div>
             <p class="cv-detail-title"><i class="icon-resume-certific"></i> <span>证书</span> 
                <span @click="goEdit('addCertificate')" class="editItem" v-if="edit == 'edit'" v-show="editCertificate == 0"><i class="icon-add"></i>
                  <label v-show="addShow.addShowCertificate">添加</label><label v-show="!addShow.addShowCertificate">新增</label>
               </span>
               <span class="editItem grayFont" v-show="editCertificate == 1"><i class="icon-add"></i>
                  <label v-show="addShow.addShowCertificate">添加</label><label v-show="!addShow.addShowCertificate">新增</label>
               </span>
             </p>
             <div class="newBulid" v-if="buildAccount.buildCertificate" v-show="editCertificate == 0">
              <span @click="goEdit('addCertificate')"><i class="icon-add"></i>添加证书</span>
            </div>
             <!--新增-->
             <div class="editing termEdit" v-if="edit == 'edit'"  v-show="addCertificate == 1">
              <el-form :model="certificateForm1" :rules="certificateRules1" ref="certificateForm1" :label-position="basicPosition">
                  <el-col :span='13'>
                  <el-form-item label="证书名称" :label-width="labelWidth" prop="name1" required>
                    <el-input type="" v-model="certificateForm1.name1" auto-complete="off"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span='8' class="ml40">
                  <el-form-item label="获得时间" :label-width="labelWidth" prop="from1" required>
                      <el-date-picker type="month" :editable=false :picker-options="pickerClose" v-model="certificateForm1.from1" style="width: 150px;"></el-date-picker>
                  </el-form-item>
                </el-col>
                <div class="submit">
                  <span class="cd-button cd-button-default" @click="editCertificate = 0,addCertificate = 0">取 消</span>
                  <span class="cd-button cd-button-primary" @click="isSave('certificate','edit','certificateForm1')">保 存</span>
                </div>
              </el-form>
            </div>

             <div class="cv-detail-content">
                <div class="detail education-detail" v-show="!buildAccount.buildCertificate">
                  <div class="items" v-for="(certificate,index) in resume_base_data.certificate">

                     <div class="editing" v-bind:class="{termEdit:index===editShow.editShowCertificate}" v-show="editCertificate == 1">
                      <el-form v-show="index===editShow.editShowCertificate" :model="certificateForm2" :rules="certificateRules2" ref="certificateForm2" :label-position="basicPosition">
                          <el-col :span='13'>
                          <el-form-item label="证书名称" :label-width="labelWidth" prop="name2" required>
                            <el-input type="" v-model="certificateForm2.name2" auto-complete="off"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span='6' class="ml40">
                          <el-form-item label="获得时间" :label-width="labelWidth" prop="from2" required>
                            <el-date-picker type="month" :editable=false :picker-options="pickerClose" v-model="certificateForm2.from2" style="width: 150px;"></el-date-picker>
                          </el-form-item>
                        </el-col>
                        <div class="submit">
                          <span class="cd-button cd-button-default" @click="editCertificate = 0,addCertificate = 0,editShow.editShowCertificate = ''">取 消</span>
                          <span class="cd-button cd-button-primary" @click="isSave('certificate','edit','certificateForm2',index)">保 存</span>
                          <span v-show="addCertificate == 0" class="btn-delete" @click="isDel('certificate')"><i class="icon-delete"></i> 删除</span> 
                        </div>
                      </el-form>
                    </div>

                    <div class="cv-detail-left" v-show="index!==editShow.editShowCertificate">
                      <p>{{certificate.start_time}}</p>
                    </div> 
                    <div class="cv-detail-right" v-show="index!==editShow.editShowCertificate" >
                      <p>
                        <span>{{certificate.name}}</span> <span class="color9">{{certificate.description}}</span>
                        <span  @click="goEdit('certificate',certificate,index)" class="editItem" v-if="edit == 'edit'" v-show="editCertificate == 0"><i class="icon-edit"></i> 编辑</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <div>
             <p class="cv-detail-title"><i class="icon-resume-other"></i> <span>其他内容</span> 
                <span @click="goEdit('other',basic)" class="editItem" v-if="edit == 'edit'" v-show="editOther == 0"><i class="icon-edit"></i> 编辑</span>
             </p>
            <div class="newBulid" v-if="buildAccount.buildOther" v-show="editOther == 0">
              <span @click="goEdit('other',basic)"><i class="icon-add"></i>添加其他内容</span>
            </div>
             <!--编辑-->
             <div class="editing termEdit" v-if="edit == 'edit'"  v-show="editOther == 1">
              <el-form :model="otherForm" :rules="otherRules" ref="otherForm" :label-position="basicPosition">
                  <el-form-item class="pl13" label="内容描述" :label-width="labelWidth" prop="other_info">
                    <el-input type="textarea" :rows='6' :maxlength='500' v-model="otherForm.other_info"></el-input>
                  </el-form-item>
                <div class="submit">
                  <span class="cd-button cd-button-default" @click="editOther = 0">取 消</span>
                  <span class="cd-button cd-button-primary" @click="isSave('other','edit','otherForm')">保 存</span>
                </div>
              </el-form>
            </div>

             <div class="cv-detail-content">
                <div class="detail education-detail" v-show="!buildAccount.buildOther">
                  <div v-show="editOther == 0" class="other" v-html="$options.filters.n2p(basic.other_info)"></div>
                </div>
              </div>
          </div>
          <!--行业弹窗-->
          <cd-select-industry ref="CdSelectIndustry" :industries="intentionForm1.industries" :show="dialogVisible" @on-change-show="onChangeShow"></cd-select-industry>
          <!--删除确认-->
          <el-dialog  v-if="edit == 'edit'"  title="提示" v-model="dialogDel" size="tiny" class="close-dialog">
            <span> <i class="icon-prompt"></i> 确定删除该条经历？</span>
            <span slot="footer" class="dialog-footer">
              <span @click="dialogDel = false" class="cd-button">取 消</span>
              <span type="primary" @click="save('del')" class="cd-button cd-button-primary">确 定</span>
            </span>
          </el-dialog>
          <!--手动添加提示先添加基本信息-->
          <el-dialog  v-if="edit == 'edit'"  title="提示" v-model="dialogBasic" size="tiny" class="close-dialog">
            <span> <i class="icon-prompt"></i> 请先添加基本信息！</span>
            <span slot="footer" class="dialog-footer">
              <span type="primary" @click="dialogBasic = false" class="cd-button cd-button-primary">确 定</span>
            </span>
          </el-dialog>
          <!--推荐反馈-->
          <el-dialog v-if="edit == 'edit'" title="提示" v-model="dialogEv" size="tiny" class="close-dialog">
            <span> <i class="icon-prompt"></i> {{recommendErr}} </span>
            <span slot="footer" class="dialog-footer">
              <span @click="dialogEv = false" class="cd-button">取 消</span>
              <!--带上cid on -->
              <router-link :to="{ name: 'position',query:{'cid':cid,'on':on}}" replace><span type="primary" class="cd-button cd-button-primary">返回职位</span></router-link>
            </span>
          </el-dialog>          
        </div>
        <!--确认简历信息-->
        <div class="keep" v-if="edit == 'edit'">
          <div class="keep-wrap">
            <div>
              <span v-if="pid != 'cv'" class="cd-button cd-button-primary" :style="{'width':'180px'}" @click="verifyResume">确定简历信息并完成推荐</span>
              <router-link v-else="" :to="{name:'archivesList'}" replace><span class="cd-button cd-button-primary">确认简历信息</span></router-link>
            </div>
          </div>
        </div>
        <!--导出简历dialog-->
        <el-dialog title="顾问评价" v-model="EvaluateDownDialog" size="tiny" :lock-scroll="false">
            <el-form :model="downLoadData" :rules="downLoadDataRules" ref="evaluateForm" :label-position="basicPosition">
              <el-form-item label="评价内容" :label-width="labelWidth">
                <el-input type="textarea" :rows='5' :maxlength='150' v-model="downLoadData.mark"></el-input>
                <p class="grayFont" :style="{textAlign:'right',fontSize:'12px'}">评论内容必须150字以内哦</p>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <span class="cd-button " @click="EvaluateDownDialog = false">取消</span>
              <span class="cd-button cd-button-primary" @click="isDownLoad">导出</span>
            </span>
          </el-dialog>
        <!--非公开简历-->
        <el-dialog class="noPublic" :close-on-click-modal="false" :show-close="false" title="提示" v-model="stopGoToDetail" size="tiny" :lock-scroll="false">
					<p>
						<i><img :src="icon_info" alt=""></i>
            <span v-if="identity == '2'">该简历为非公开简历</span>
            <span v-else="">不存在该简历！点击 知道 返回首页</span>
          </p>
					<span slot="footer" class="dialog-footer">
						<router-link :to="{ name: 'position'}"><span class="cd-button cd-button-primary">知道了</span></router-link>
					</span>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script>
import navbar from '../../components/Navbar/navbar.vue';
import CdSingleSelectCity from '../../components/SingleSelectCity/singleSelectCity.vue';
import ejax from '../../assets/js/ejax';
import Cookies from 'js-cookie';
import iconInfo from '../../assets/img/icon-info.svg';
import male from '../../assets/img/male.png';
import female from '../../assets/img/female.png';
import nomarl from '../../assets/img/nomarl.png';
import CdSelectCity from '../../components/SelectCity/SelectCity';
import CdSelectIndustry from '../../components/SelectIndustry/SelectIndustry';
import {format,transFrom} from '../../assets/js/base';

export default {
	name: 'archivesView',
	data() {
    var isCN = (rule, value, callback) => {
      if ( !/^[\u4E00-\u9FA5]+$/.test(value) ) {
        callback(new Error('请输入中文名字'));
      } else {
        callback();
      }
    };
    var isPhone = (rule, value, callback) => {
      if ( !/^(1\d{10})$/.test(value) ) {
        callback(new Error('请确认手机号'));
      } else {
        callback();
      }
    };
    var isDateRange1 = (rule, value, callback) => {
        if ( new Date(this.eduForm1.from1) >= new Date(this.eduForm1.to1)) {
          callback(new Error('时间范围不正确'));
        } else {
          callback();
        }
    };
    var isDateRange2 = (rule, value, callback) => {
        if ( new Date(this.eduForm2.from2) >= new Date(this.eduForm2.to2)) {
          callback(new Error('时间范围不正确'));
        } else {
          callback();
        }
    };
    var isWorkTime1 = (rule, value, callback) => {
        if ( new Date(this.workForm1.from1) >= new Date(this.workForm1.to1)) {
          callback(new Error('时间范围不正确'));
        } else {
          callback();
        }
    };
    var isWorkTime2 = (rule, value, callback) => {
        if ( new Date(this.workForm2.from2) >= new Date(this.workForm2.to2)) {
          callback(new Error('时间范围不正确'));
        } else {
          callback();
        }
    };
    var isProjectTime1 = (rule, value, callback) => {
        if ( new Date(this.projectForm1.from1) >= new Date(this.projectForm1.to1)) {
          callback(new Error('时间范围不正确'));
        } else {
          callback();
        }
    };
    var isProjectTime2 = (rule, value, callback) => {
        if ( new Date(this.projectForm2.from2) >= new Date(this.projectForm2.to2)) {
          callback(new Error('时间范围不正确'));
        } else {
          callback();
        }
    };
    var isTrainingTime1 = (rule, value, callback) => {
        if ( new Date(this.trainingForm1.from1) >= new Date(this.trainingForm1.to1)) {
          callback(new Error('时间范围不正确'));
        } else {
          callback();
        }
    };
    var isTrainingTime2 = (rule, value, callback) => {
        if ( new Date(this.trainingForm2.from2) >= new Date(this.trainingForm2.to2)) {
          callback(new Error('时间范围不正确'));
        } else {
          callback();
        }
    };
		return {
      pickerClose: {
        disabledDate(time) {
          return time > Date.now();
        }
      },
      edit: 0,
      editShow:{
        editShowEdu: '',editShowWork: '',editShowProject: '',editShowSkill: '',editShowLanguage: '',editShowTraining: '',editShowCertificate:'',
      },
      addShow:{
        addShowEdu:false,addShowWork:false,addShowProject:false,addShowSkill:false,addShowLanguage:false,addShowTraining:false,addShowCertificate:false,
      },
      isUpdate:false,
      update:'',
      diff:{},
      report:'',
      reportContent:'',
      basic: {},
      gender: '',
      contact: {},
			resume_base_data: {},
      dialogVisible: false,
      dialogDel:false,
      dialogEv:false,
      id: '',
      pid:'',
      icdc_id:'',
      type:'',
      basicPosition: 'left',
      labelWidth: '90px',
      editBasic: 0,
      CityTypeData:[],
      basicForm:{
        name: '',
        sex: '',
        birth: '',
        account: '',
        accountType:[
          {
            'id': '0',
            'name': '',
            'parent_id': '0',
          }
        ],
        address: '',
        addressType:[
          {
            'id': '0',
            'name': '',
            'parent_id': '0',
          }
        ],
        phone: '',
        email: '',
      },
      cityShow1:false,
      cityShow2:false,
      cityType:'place',
      basicRules:{
        name: [
          {required: true,message: '请输入姓名',trigger: 'change'},
          {min:2,max:4,message: '请确认姓名',trigger: 'blur'},
          {validator: isCN, trigger: 'blur'}
        ],
        sex: [
          {required: true,message: '请确认性别',trigger: 'change'}
        ],
        birth: [
          {required: true,type: 'date',message: '请选择出生年月',trigger: 'blur'}
        ],
        phone: [
          {required: true,message: '请输入手机号',trigger: 'blur'},
          {min:11,max:11,message: '请确认手机号',trigger: 'blur'},
          {validator: isPhone, trigger: 'blur'}
        ],
        email: [
          {required: true,type: 'email',message: '请输入正确的邮箱地址',trigger: 'blur'}
        ],
      },
      editIntention: 0,
      cityShow:false,
      intentionForm: {
        city_names:[],
        current_status:'',
        expect_salary:'',
        current_salary:'',
        expect_position_name:'',
        industries:[],
      },
      intentionForm1:{industries:[]},
      intentionRules1: {},
      intentionRules: {
       /* city_names: [
          {required: true,message: '请选择期望地点',trigger: 'blur'}
        ],*/
        current_status:[
          {required: true,message: '请选择目前状况',trigger: 'blur'}
        ],
        expect_salary:[
          {required: true,message: '请选择期望月薪',trigger: 'blur'}
        ],
        current_salary:[
          {required: true,message: '请选择目前月薪',trigger: 'blur'}
        ],
        expect_position_name:[
          {required: true,message: '请输入期望职位',trigger: 'blur'}
        ],
        industries:[
          {required: true,message: '请选择期望行业',trigger: 'blur'}
        ]
      },
      editEdu: 0,
      addEdu: 0,
      eduForm1:{
        id :'',
        school_name1:'',
        degree1:'',
        major_name1:'',
        from1:'',
        to1:''
      },
      eduForm2:{
        id :'',
        school_name2:'',
        degree2:'',
        major_name2:'',
        from2:'',
        to2:''
      },
      eduRules1: {
         school_name1: [
          {required: true,message: '请输入学校名称',trigger: 'blur'}
        ],
        degree1: [
          {required: true,message: '请选择学历',trigger: 'blur'}
        ],
        major_name1: [
          {required: true,message: '请输入专业名称',trigger: 'blur'}
        ],
        dateRange1: [
          {validator: isDateRange1, trigger: 'blur'}
        ],
        from1: [
          {required: true,type: 'date',message: '请选择入学时间',trigger: 'blur'},
          {validator: isDateRange1, trigger: 'blur'}
        ],
        to1: [
          {required: true,type: 'date',message: '请选择毕业时间',trigger: 'blur'},
          {validator: isDateRange1, trigger: 'blur'}
        ],
      },
      eduRules2:{
        school_name2: [
          {required: true,message: '请输入学校名称',trigger: 'blur'}
        ],
        degree2: [
          {required: true,message: '请选择学历',trigger: 'blur'}
        ],
        major_name2: [
          {required: true,message: '请输入专业名称',trigger: 'blur'}
        ],
        from2: [
          {validator: isDateRange2, trigger: 'blur'}
        ],
        to2: [
          {validator: isDateRange2, trigger: 'blur'}
        ],
      },
      editWork: 0,
      addWork: 0,
      workForm1:{
        company_name1:'',
        position_name1:'',
        from1:'',
        to1:'',
        responsibilities1:'',
      },
      workForm2:{
        company_name2:'',
        position_name2:'',
        from2:'',
        to2:'',
        responsibilities2:'',
      },
      workRules1:{
        company_name1: [
          {required: true,message: '请输入公司名称',trigger: 'blur'}
        ],
        position_name1: [
          {required: true,message: '请输入职位名称',trigger: 'blur'}
        ],
        from1: [
          {required: true,type: 'date',message: '请选择入职时间',trigger: 'blur'},
          {validator: isWorkTime1, trigger: 'blur'}
        ],
        to1: [
          {required: true,type: 'date',message: '请选择离职时间',trigger: 'blur'},
          {validator: isWorkTime1, trigger: 'blur'}
        ],
      },
      workRules2:{
        company_name2: [
          {required: true,message: '请输入公司名称',trigger: 'blur'}
        ],
        position_name2: [
          {required: true,message: '请输入职位名称',trigger: 'blur'}
        ],
        from2: [
          {required: true,type: 'date',message: '请选择入职时间',trigger: 'blur'},
          {validator: isWorkTime2, trigger: 'blur'}
        ],
        to2: [
          {required: true,type: 'date',message: '请选择离职时间',trigger: 'blur'},
          {validator: isWorkTime2, trigger: 'blur'}
        ],
      },
      editProject: 0,
      addProject: 0,
      projectForm1:{
        project_name1:'',
        from1:'',
        to1:'',
        describe1:'',
      },
      projectForm2:{
        project_name2:'',
        from2:'',
        to2:'',
        describe2:'',
      },
      projectRules1:{
         project_name1: [
          {required: true,message: '请输入项目名称',trigger: 'blur'}
        ],
         from1: [
          {required: true,type: 'date',message: '请选择起始时间',trigger: 'blur'},
          {validator: isProjectTime1, trigger: 'blur'}
        ],
        to1: [
          {required: true,type: 'date',message: '请选择结束时间',trigger: 'blur'},
          {validator: isProjectTime1, trigger: 'blur'}
        ],        
      },
      projectRules2:{
        project_name2: [
          {required: true,message: '请输入项目名称',trigger: 'blur'}
        ],
         from2: [
          {required: true,type: 'date',message: '请选择起始时间',trigger: 'blur'},
          {validator: isProjectTime2, trigger: 'blur'}
        ],
        to2: [
          {required: true,type: 'date',message: '请选择结束时间',trigger: 'blur'},
          {validator: isProjectTime2, trigger: 'blur'}
        ],        
      },
      editSkill: 0,
      addSkill: 0,
      skillForm1:{
        name1:'',
        level1:'',
      },
      skillForm2:{
        name2:'',
        level2:'',
      },
      skillRules1:{
        name1: [
          {required: true,message: '请输入技能名称',trigger: 'blur'}
        ],
        level1: [
          {required: true,message: '请输入技能水平',trigger: 'blur'}
        ],
      },
      skillRules2:{
        name2: [
          {required: true,message: '请输入技能名称',trigger: 'blur'}
        ],
        level2: [
          {required: true,message: '请输入技能水平',trigger: 'blur'}
        ],
      },
      editLanguage: 0,
      addLanguage: 0,
      languageForm1:{
        name1:'',
        level1:'',
      },
      languageForm2:{
        name2:'',
        level2:'',
      },
      languageRules1:{
         name1: [
          {required: true,message: '请输入外语名称',trigger: 'blur'}
        ],
        level1: [
          {required: true,message: '请选择外语水平',trigger: 'blur'}
        ],
      },
      languageRules2:{
         name2: [
          {required: true,message: '请输入外语名称',trigger: 'blur'}
        ],
        level2: [
          {required: true,message: '请选择外语水平',trigger: 'blur'}
        ],
      },
      editTraining: 0,
      addTraining: 0,
      trainingForm1:{
        from1:'',
        to1:'',
        name1:'',
        authority1 :'',
      },
      trainingForm2:{
        from2:'',
        to2:'',
        name2:'',
        authority2 :'',
      },
      trainingRules1:{
        from1: [
          {required: true,type: 'date',message: '请选择起始时间',trigger: 'blur'},
          {validator: isTrainingTime1, trigger: 'blur'}
        ],
        to1: [
          {required: true,type: 'date',message: '请选择结束时间',trigger: 'blur'},
          {validator: isTrainingTime1, trigger: 'blur'}
        ],
        name1: [
          {required: true,message: '请输入培训内容',trigger: 'blur'}
        ],
        authority1: [
          {required: true,message: '请输入培训机构名称',trigger: 'blur'}
        ],
      },
      trainingRules2:{
        from2: [
          {required: true,type: 'date',message: '请选择起始时间',trigger: 'blur'},
          {validator: isTrainingTime2, trigger: 'blur'}
        ],
        to2: [
          {required: true,type: 'date',message: '请选择结束时间',trigger: 'blur'},
          {validator: isTrainingTime2, trigger: 'blur'}
        ],
        name2: [
          {required: true,message: '请输入培训内容',trigger: 'blur'}
        ],
        authority2: [
          {required: true,message: '请输入培训机构名称',trigger: 'blur'}
        ],
      },
      editCertificate: 0,
      addCertificate: 0,
      certificateForm1:{
        from1:'',
        name1:'',
      },
      certificateForm2:{
        from2:'',
        name2:'',
      },
      certificateRules1:{
        name1: [
          {required: true,message: '请输入证书名称',trigger: 'blur'}
        ],
         from1: [
          {required: true,type: 'date',message: '请选择获得时间',trigger: 'blur'},
        ],
      },
      certificateRules2:{
        name2: [
          {required: true,message: '请输入证书名称',trigger: 'blur'}
        ],
         from2: [
          {required: true,type: 'date',message: '请选择获得时间',trigger: 'blur'},
        ],
      },
      editOther: 0,
      otherForm:{
        other_info:''
      },
      otherRules:{},
      showEvaluate: 0,
      recommendErr:'',
      evaluateForm:{
        evaluate:''
      },
      evaluateRules:{
         evaluate: [
           {required: true,message: '请填写顾问评价',trigger: 'blur'},
           {min: 1,max:150,message: '评价内容必须在150字以下哦！',trigger: 'blur'},
         ],
      },
      EvaluateDownDialog: false,
      downLoadData: {
        id: '',
        mark: ''
      },
      downLoadDataRules:{},
      build:'',
      dialogBasic:false,
      buildAccount:{
        buildIntention:true,
        buildEdu:true,
        buildWork:true,
        buildProject:true,
        buildSkill:true,
        buildLanguage:true,
        buildTraining:true,
        buildCertificate:true,
        buildOther:true,
      },
      icon_info:iconInfo,
      stopGoToDetail:false,
      cid:'',
      on:'',
      identity:'',
		}
  },
	mounted () {
		this.$nextTick(function(){
      this.identity=Cookies.get('user_type');
      this.id = this.$route.params.id;
      this.pid = this.$route.params.pid;
		  this.edit = this.$route.params.edit;
      this.update = this.$route.query.update;
      this.report = this.$route.query.report;
      if(this.report){this.getReport()};
      this.cid = this.$route.query.cid;
      this.on = this.$route.query.on;
      this.build = this.$route.query.build;
      if(this.build =='2'){this.getResumesDetail(this.id)}
      if(this.build == undefined){
        this.getResumesDetail(this.id);
        for(let key in this.buildAccount){
          this.buildAccount[key]=false;
        }
      }
    })
     //禁止复制黏贴
    document.getElementsByClassName('resumeView')[0].oncontextmenu=new Function("event.returnValue=false");
    document.getElementsByClassName('resumeView')[0].onselectstart=new Function("event.returnValue=false"); 
	},
	methods: {
    goEdit:function(type,target,index){
      if(type == 'basic'){
        this.editBasic = 1;
        let gender,year,month,birth;
        target.gender == 'M' ? gender = '男' : target.gender == 'F' ? gender = '女' : gender = '';
        this.basicForm.name = target.name;
        this.basicForm.sex = gender;
        if(target.birth != ''){
          year = target.birth.split('年')[0];
          month = target.birth.split('年')[1].split('月')[0];
          birth = year + '-' + month;
        }
        this.basicForm.birth = birth;
        if(target.account !== '0'){
          this.basicForm.accountType.splice(0,1,{'id':target.account_id,'name':target.account,'parent_id':target.account_province});
        }
        this.basicForm.account = target.account;
        if(this.basicForm.address !== '0'){
          this.basicForm.addressType.splice(0,1,{'id':target.address,'name':target.address,'parent_id':target.address_province});
        }
        this.basicForm.phone = index.phone;
        this.basicForm.email = index.email;
      }
      if(type == 'intention'){
        this.build == '1' ? this.dialogBasic = true : this.editIntention = 1;
      }
      if(type == 'addEdu'){
        if(this.build == '1'){
          this.dialogBasic = true;
        }else{ 
          for(var key in this.eduForm1){
            this.eduForm1[key]='';
          }
          this.editEdu = 1;
          this.addEdu = 1;
          this.eduForm1.degree1 = '本科';
        }
      }
      if(type == 'edu'){
        this.editEdu = 1;
        this.addEdu = 0;
        !index ? index=0: '';
        this.editShow.editShowEdu = index;
        this.eduForm2.id = target.id;
        this.eduForm2.school_name2 = target.school_name;
        this.eduForm2.degree2 = target.degree;
        this.eduForm2.major_name2 = target.discipline_name;
        this.eduForm2.from2 = target.start_time;
        this.eduForm2.to2 = target.end_time;
      }
      if(type == 'addWork'){
        if(this.build == '1'){
          this.dialogBasic = true;
        }else{
          for(var key in this.workForm1){
            this.workForm1[key]='';
          }
          this.editWork = 1;
          this.addWork = 1;
        }        
      }
      if(type == 'work'){
        this.editWork = 1;
        this.addWork = 0;
        !index ? index=0: '';
        this.editShow.editShowWork = index;
        this.workForm2.id = target.id;
        this.workForm2.company_name2 = target.corporation_name;
        this.workForm2.position_name2 = target.position_name;
        this.workForm2.from2 = target.start_time;
        this.workForm2.to2 = target.end_time;
        this.workForm2.responsibilities2 = target.responsibilities;
      }
      if(type == 'addProject'){
        if(this.build == '1'){
          this.dialogBasic = true;
        }else{
        for(var key in this.projectForm1){
          this.projectForm1[key]='';
        }
        this.editProject = 1;
        this.addProject = 1;
        }
      }
      if(type == 'project'){
        this.editProject = 1;
        this.addProject = 0;
        !index ? index=0: '';
        this.editShow.editShowProject = index;
        this.projectForm2.id = target.id;
        this.projectForm2.project_name2 = target.name;
        this.projectForm2.from2 = target.start_time;
        this.projectForm2.to2 = target.end_time;
        this.projectForm2.describe2 = target.describe;
      }
      if(type == 'addSkill'){
        if(this.build == '1'){
          this.dialogBasic = true;
        }else{
        for(var key in this.skillForm1){
          this.skillForm1[key]='';
        }
        this.editSkill = 1;
        this.addSkill = 1;}
      }
      if(type == 'skill'){
        this.editSkill = 1;
        this.addSkill = 0;
        !index ? index=0: '';
        this.editShow.editShowSkill = index;
        this.skillForm2.id = target.id;
        this.skillForm2.name2 = target.name;
        this.skillForm2.level2 = target.level;
      }
      if(type == 'addLanguage'){
        if(this.build == '1'){
          this.dialogBasic = true;
        }else{
        for(var key in this.languageForm1){
          this.languageForm1[key]='';
        }
        this.editLanguage = 1;
        this.addLanguage = 1;}
      }
      if(type == 'language'){
        this.editLanguage = 1;
        this.addLanguage = 0;
        !index ? index=0: '';
        this.editShow.editShowLanguage = index;
        this.languageForm2.id = target.id;
        this.languageForm2.name2 = target.name;
        this.languageForm2.level2 = target.level;
      }
      if(type == 'addTraining'){
        if(this.build == '1'){
          this.dialogBasic = true;
        }else{
        for(var key in this.trainingForm1){
          this.trainingForm1[key]='';
        }
        this.editTraining = 1;
        this.addTraining = 1;}
      }
      if(type == 'training'){
        this.editTraining = 1;
        this.addTraining = 0;
        !index ? index=0: '';
        this.editShow.editShowTraining = index;
        this.trainingForm2.id = target.id;
        this.trainingForm2.from2 = target.start_time;
        this.trainingForm2.to2 = target.end_time;
        this.trainingForm2.name2 = target.name;
        this.trainingForm2.authority2 = target.authority;
      }
      if(type == 'addCertificate'){
        if(this.build == '1'){
          this.dialogBasic = true;
        }else{
        for(var key in this.certificateForm1){
          this.certificateForm1[key]='';
        }
        this.editCertificate = 1;
        this.addCertificate = 1;}
      }
      if(type == 'certificate'){
        this.editCertificate = 1;
        this.addCertificate = 0;
        !index ? index=0: '';
        this.editShow.editShowCertificate = index;
        this.certificateForm2.id = target.id;
        this.certificateForm2.from2 = target.start_time;
        this.certificateForm2.name2 = target.name;
      }
      if(type == 'other'){
        if(this.build == '1'){
          this.dialogBasic = true;
        }else{
          this.editOther = 1;
          this.otherForm.other_info = target.other_info;
        }
      }
    },
    isDel: function(source){
      this.dialogDel = true;
      this.type=source;
    },
    isSave:function(type,action,form,index){
      this.type=type;
      // debugger;
      if(form == 'eduForm2'){
        this.eduForm2.from2 = new Date(this.eduForm2.from2);
        this.eduForm2.to2 = new Date(this.eduForm2.to2);
        this.$refs.eduForm2[index].validate((valid)=>{
          if (valid) {
            this.save(action);
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }else if(form == 'workForm2'){
        this.workForm2.from2 = new Date(this.workForm2.from2);
        this.workForm2.to2 = new Date(this.workForm2.to2);
        this.$refs.workForm2[index].validate((valid)=>{
          if (valid) {
            this.save(action);
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }else if(form == 'projectForm2'){
        this.projectForm2.from2 = new Date(this.projectForm2.from2);
        this.projectForm2.to2 = new Date(this.projectForm2.to2);
        this.$refs.projectForm2[index].validate((valid)=>{
          if (valid) {
            this.save(action);
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }else if(form == 'skillForm2'){
        this.$refs.skillForm2[index].validate((valid)=>{
          if (valid) {
            this.save(action);
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }else if(form == 'languageForm2'){
        this.$refs.languageForm2[index].validate((valid)=>{
          if (valid) {
            this.save(action);
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }else if(form == 'trainingForm2'){
        this.trainingForm2.from2 = new Date(this.trainingForm2.from2);
        this.trainingForm2.to2 = new Date(this.trainingForm2.to2);
        this.$refs.trainingForm2[index].validate((valid)=>{
          if (valid) {
            this.save(action);
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }else if(form == 'certificateForm2'){
        this.certificateForm2.from2 = new Date(this.certificateForm2.from2);
        this.$refs.certificateForm2[index].validate((valid)=>{
          if (valid) {
            this.save(action);
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      }else{
        form== 'basicForm' ? this.basicForm.birth = new Date(this.basicForm.birth):'';
        if(form=='intentionForm'){
          if (this.intentionForm.city_names.length == 0) {this.cityShow = true;}//判断是否选择城市
          let industries=[];
          for(let key in this.intentionForm1.industries){industries.push(this.intentionForm1.industries[key].name);}
          this.intentionForm.industries = industries.join(',');
        }        
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.save(action,form);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    save: function(action,form){
      if(this.type == 'basic'){
         if(action == 'edit'){
           let gender;
           this.basicForm.sex == '男' ? gender = 'M' : this.basicForm.sex == '女' ? gender = 'F' : gender = 'N';
           if(this.build == '1'){
             var param = {
              do: 'add',
              mod : 'basic',
              file_id: this.id,
              basic : 
                {
                  name: this.basicForm.name,
                  gender: gender,
                  birth: format(new Date(this.basicForm.birth),"yyyy年MM月"),
                  account: this.basicForm.accountType[0].id,
                  account_province: this.basicForm.accountType[0].parent_id?this.basicForm.accountType[0].parent_id : 0,
                  address: this.basicForm.addressType[0].id,
                  address_province: this.basicForm.addressType[0].parent_id ? this.basicForm.addressType[0].parent_id: 0,
                },
                contact:{
                  phone: this.basicForm.phone,
                  email: this.basicForm.email,
                }
            };
           }else{
             var param = {
               mod : 'basic',
               resume_id: this.id,
               basic : 
                 {
                   name: this.basicForm.name,
                   gender: gender,
                   birth: format(new Date(this.basicForm.birth),"yyyy年MM月"),
                   account: this.basicForm.accountType[0].id,
                   account_province: this.basicForm.accountType[0].parent_id?this.basicForm.accountType[0].parent_id : 0,
                   address: this.basicForm.addressType[0].id,
                   address_province: this.basicForm.addressType[0].parent_id ? this.basicForm.addressType[0].parent_id: 0,
                 },
                 contact:{
                   phone: this.basicForm.phone,
                   email: this.basicForm.email,
                 }
              };
           }
         };
      };
      if(this.type == 'intention'){
         if(action == 'edit'){
           let city_ids = [],from='',to='',bfrom='',bto='';
           for(let key in this.intentionForm.city_names){
             city_ids.push(this.intentionForm.city_names[key].id);
           }
           if(this.intentionForm.expect_salary == '0-5'){from='0';to='5';}
           if(this.intentionForm.expect_salary == '5-8'){from='5';to='8';}
           if(this.intentionForm.expect_salary == '8-12'){from='8';to='12';}
           if(this.intentionForm.expect_salary == '12-15'){from='12';to='15';}
           if(this.intentionForm.expect_salary == '15-20'){from='15';to='20';}
           if(this.intentionForm.expect_salary == '20-30'){from='20';to='30';}
           if(this.intentionForm.expect_salary == '30-50'){from='30';to='50';}
           if(this.intentionForm.expect_salary == '50'){from='50';to='100';}
           if(this.intentionForm.current_salary == '0-5'){bfrom='0';bto='5';}
           if(this.intentionForm.current_salary == '5-8'){bfrom='5';bto='8';}
           if(this.intentionForm.current_salary == '8-12'){bfrom='8';bto='12';}
           if(this.intentionForm.current_salary == '12-15'){bfrom='12';bto='15';}
           if(this.intentionForm.current_salary == '15-20'){bfrom='15';bto='20';}
           if(this.intentionForm.current_salary == '20-30'){bfrom='20';bto='30';}
           if(this.intentionForm.current_salary == '30-50'){bfrom='30';bto='50';}
           if(this.intentionForm.current_salary == '50'){bfrom='50';bto='100';}
           var param = {
            do: 'edit',
            mod : 'expect',
            resume_id: this.id,
            basic : 
              {
                expect_salary_from: from,
                expect_salary_to: to,
                expect_city_ids: city_ids.join(','),
                current_status: this.intentionForm.current_status,
                basic_salary_from: bfrom,
                basic_salary_to: bto,
                expect_position_name: this.intentionForm.expect_position_name,
                expect_industry_name: this.intentionForm.industries,
              },
           };
         }
      };
      if(this.type == 'edu'){
          var id,degree='',eduForm;
          if(this.addEdu == 0){
            eduForm = _.cloneDeep(this.eduForm2);
            // this.addEdu==0?id=this.eduForm2.id:'';
            if(!/^[0-9]*$/.test(eduForm.degree2)){
              eduForm.degree2=='不限'?degree='0':eduForm.degree2=='本科'?degree='1':eduForm.degree2=='硕士'?degree='2':eduForm.degree2=='博士'?degree='3':eduForm.degree2=='专科'?degree='4':eduForm.degree2=='MBA'?degree='6':eduForm.degree2=='博士后'?degree='10':eduForm.degree2=='职高'?degree='87':eduForm.degree2=='高中'?degree='89':eduForm.degree2=='中专'?degree='90':eduForm.degree2=='中技'?degree='91':eduForm.degree2=='专升本'?degree='92':eduForm.degree2=='EMBA'?degree='94':eduForm.degree2=='MPA'?degree='95':eduForm.degree2=='初中'?degree='86':degree='99';
            }
            if(action == 'edit'){
              var param = {
                mod : 'education',
                do: action,
                resume_id: this.id,
                education : 
                  {
                    school_name: eduForm.school_name2,
                    degree: degree == ''?eduForm.degree2:degree,
                    start_time: format(new Date(eduForm.from2),"yyyy年MM月"),
                    end_time: format(new Date(eduForm.to2),"yyyy年MM月"),
                    discipline_name: eduForm.major_name2,
                    id : eduForm.id
                  }
              };
            };
          };
          if(this.addEdu == 1){
            eduForm = _.cloneDeep(this.eduForm1);
            if(!/^[0-9]*$/.test(eduForm.degree1)){
              eduForm.degree1=='不限'?degree='0':eduForm.degree1=='本科'?degree='1':eduForm.degree1=='硕士'?degree='2':eduForm.degree1=='博士'?degree='3':eduForm.degree1=='专科'?degree='4':eduForm.degree1=='MBA'?degree='6':eduForm.degree1=='博士后'?degree='10':eduForm.degree1=='职高'?degree='87':eduForm.degree1=='高中'?degree='89':eduForm.degree1=='中专'?degree='90':eduForm.degree1=='中技'?degree='91':eduForm.degree1=='专升本'?degree='92':eduForm.degree1=='EMBA'?degree='94':eduForm.degree1=='MPA'?degree='95':eduForm.degree1=='初中'?degree='86':degree='99';
            }
            if(action == 'edit'){
              var param = {
                mod : 'education',
                do: action,
                resume_id: this.id,
                education : 
                  {
                    school_name: eduForm.school_name1,
                    degree: degree == ''?eduForm.degree1:degree,
                    start_time: format(new Date(eduForm.from1),"yyyy年MM月"),
                    end_time: format(new Date(eduForm.to1),"yyyy年MM月"),
                    discipline_name: eduForm.major_name1,
                    id : ''
                  }
              };
            };
          };
        if(action == 'del'){var param = {mod : 'education',do: action,resume_id: this.id,id : eduForm.id};};
      };
      if(this.type == 'work'){
          var id,workForm;
          if(this.addWork == 0){
            workForm = _.cloneDeep(this.workForm2);
            if(action == 'edit'){
              var param = {
                mod : 'work',
                do: action,
                resume_id: this.id,
                work : 
                  {
                    corporation_name: workForm.company_name2,
                    position_name: workForm.position_name2,
                    start_time: format(new Date(workForm.from2),"yyyy年MM月"),
                    end_time: format(new Date(workForm.to2),"yyyy年MM月"),
                    responsibilities: workForm.responsibilities2,
                    id : workForm.id
                  }
              };
            };
          };
          if(this.addWork == 1){
            workForm = _.cloneDeep(this.workForm1);
            if(action == 'edit'){
              var param = {
                mod : 'work',
                do: action,
                resume_id: this.id,
                work : 
                  {
                    corporation_name: workForm.company_name1,
                    position_name: workForm.position_name1,
                    start_time: format(new Date(workForm.from1),"yyyy年MM月"),
                    end_time: format(new Date(workForm.to1),"yyyy年MM月"),
                    responsibilities: workForm.responsibilities1,
                  }
              };
            };
          };
       if(action == 'del'){var param = {mod : 'work',do: action,resume_id: this.id,id:workForm.id};};
      }
      if(this.type == 'project'){
          var id,projectForm;
           if(this.addProject == 0){
            projectForm = _.cloneDeep(this.projectForm2);
             if(action == 'edit'){
              var param = {
                mod : 'project',
                do: action,
                resume_id: this.id,
                project : 
                  {
                    name: projectForm.project_name2,
                    start_time: format(new Date(projectForm.from2),"yyyy年MM月"),
                    end_time: format(new Date(projectForm.to2),"yyyy年MM月"),
                    describe: projectForm.describe2,
                    id : projectForm.id
                  }
              };
            };
          };
          if(this.addProject == 1){
            projectForm = _.cloneDeep(this.projectForm1);
            if(action == 'edit'){
              var param = {
                mod : 'project',
                do: action,
                resume_id: this.id,
                project : 
                  {
                    name: projectForm.project_name1,
                    start_time: format(new Date(projectForm.from1),"yyyy年MM月"),
                    end_time: format(new Date(projectForm.to1),"yyyy年MM月"),
                    describe: projectForm.describe1,
                  }
              };
            };
          };
        if(action == 'del'){var param = {mod : 'project',do: action,resume_id: this.id,id :projectForm.id};};
      }
      if(this.type == 'skill'){
         var id,skillForm;
         if(this.addSkill == 0){
           skillForm = _.cloneDeep(this.skillForm2);
           if(action == 'edit'){
             var param = {
               mod : 'skill',
               do: action,
               resume_id: this.id,
               skill : 
                 {
                   name: skillForm.name2,
                   level: skillForm.level2,
                   id : skillForm.id
                 }
             };
           };
         };
         if(this.addSkill == 1){
           skillForm = _.cloneDeep(this.skillForm1);
           if(action == 'edit'){
             var param = {
               mod : 'skill',
               do: action,
               resume_id: this.id,
               skill : 
                 {
                   name: skillForm.name1,
                   level: skillForm.level1,
                 }
             };
           };
         };
        if(action == 'del'){var param = {mod : 'skill',do: action,resume_id: this.id,id :skillForm.id};};
      }
      if(this.type == 'language'){
         var id,languageForm;
         if(this.addLanguage == 0){
           languageForm = _.cloneDeep(this.languageForm2);
           if(action == 'edit'){
             var param = {
               mod : 'language',
               do: action,
               resume_id: this.id,
               language : 
                 {
                   name: languageForm.name2,
                   level: languageForm.level2,
                   id : languageForm.id
                 }
             };
           };
         };
         if(this.addLanguage == 1){
           languageForm = _.cloneDeep(this.languageForm1);
           if(action == 'edit'){
             var param = {
               mod : 'language',
               do: action,
               resume_id: this.id,
               language : 
                 {
                   name: languageForm.name1,
                   level: languageForm.level1,
                 }
             };
           };
         };
         if(action == 'del'){var param = {mod : 'language',do: action,resume_id: this.id,id:languageForm.id};};
      };
      if(this.type == 'training'){
         var id,trainingForm;
         if(this.addTraining == 0){
           trainingForm = _.cloneDeep(this.trainingForm2);
           if(action == 'edit'){
             var param = {
               mod : 'training',
               do: action,
               resume_id: this.id,
               training : 
                 {
                   start_time: format(new Date(trainingForm.from2),"yyyy年MM月"),
                   end_time: format(new Date(trainingForm.to2),"yyyy年MM月"),
                   name: trainingForm.name2,
                   authority: trainingForm.authority2,
                   id : trainingForm.id
                 }
             };
           };
         };
         if(this.addTraining == 1){
           trainingForm = _.cloneDeep(this.trainingForm1);
           if(action == 'edit'){
             var param = {
               mod : 'training',
               do: action,
               resume_id: this.id,
               training : 
                 {
                   start_time: format(new Date(trainingForm.from1),"yyyy年MM月"),
                   end_time: format(new Date(trainingForm.to1),"yyyy年MM月"),
                   name: trainingForm.name1,
                   authority: trainingForm.authority1,
                 }
             };
           };
         };
         if(action == 'del'){var param = {mod : 'training',do: action,resume_id: this.id,id:trainingForm.id};};
      };
      if(this.type == 'certificate'){
         var id,certificateForm;
         if(this.addCertificate == 0){
           certificateForm = _.cloneDeep(this.certificateForm2);
           if(action == 'edit'){
             var param = {
               mod : 'certificate',
               do: action,
               resume_id: this.id,
               certificate : 
                 {
                   start_time: format(new Date(certificateForm.from2),"yyyy年MM月"),
                   name: certificateForm.name2,
                   id : certificateForm.id
                 }
             };
           };
         };
         if(this.addCertificate == 1){
           certificateForm = _.cloneDeep(this.certificateForm1);
           if(action == 'edit'){
             var param = {
               mod : 'certificate',
               do: action,
               resume_id: this.id,
               certificate : 
                 {
                   start_time: format(new Date(certificateForm.from1),"yyyy年MM月"),
                   name: certificateForm.name1,
                 }
             };
           };
         };
         if(action == 'del'){var param = {mod : 'certificate',do: action,resume_id: this.id,id:certificateForm.id};};
      };
      if(this.type == 'other'){
         if(action == 'edit'){
           var param = {
             mod : 'extra',
             resume_id: this.id,
             basic : 
               {
                 other_info: this.otherForm.other_info,
               }
           };
         };
      };
      ejax.post('/api/resumes/save?app=toh&format=json',param).then( res=> {
        if(res.data.err_no == 0){
          if(res.data.id!=this.id){
            this.id = res.data.id;
            this.build = '2';
            this.$router.push({ name: 'archivesView', params: { 'id': this.id, 'edit': 'edit', 'pid': this.pid }, query: { build: '2' } });
          }
          for(var key in this.editShow){this.editShow[key]='';}
          if(form=='intentionForm'){this.editIntention = 0;this.buildAccount.buildIntention=false;}
          if(form=='eduForm1'){this.buildAccount.buildEdu=false;}
          if(form=='workForm1'){this.buildAccount.buildWork=false;}
          if(form=='projectForm1'){this.buildAccount.buildProject=false;}
          if(form=='skillForm1'){this.buildAccount.buildSkill=false;}
          if(form=='languageForm1'){this.buildAccount.buildLanguage=false;}
          if(form=='trainingForm1'){this.buildAccount.buildTraining=false;}
          if(form=='certificateForm1'){this.buildAccount.buildCertificate=false;}
          if(form=='otherForm'){this.buildAccount.buildOther=false;}
          this.editEdu = 0;this.addEdu = 0;this.editWork = 0;this.addWork = 0;
          this.editProject = 0;this.addProject = 0;this.editSkill = 0;this.addSkill = 0;this.editLanguage = 0;this.addLanguage = 0;
          this.editTraining = 0;this.addTraining = 0;this.editCertificate = 0;this.addCertificate = 0;this.editOther = 0;this.editBasic = 0;this.dialogDel = false;
          this.getResumesDetail(this.id);
        }
      })
      .catch(err=>{
        console.log(err);
        this.$message(err.data.err_msg);
      });
    },
    showCity(){
        this.cityShow1 = true; 
        this.cityType = 'place'; 
    },
    showCity1(){
        this.cityShow2 = true;
        this.cityType = 'nowCity';
    },
    onChangeShow(val){
      this.dialogVisible = val;
    },
    removeCheckIndustry(tid) { //删除选中行业
      this.$refs.CdSelectIndustry.removeCheckIndustry(tid);
    },
    closeSelect() { //关闭选择弹窗
      this.cityShow = false;
      this.cityShow1 = false;
      this.cityShow2 = false;
    },
    verifyResume: function(){
       if(this.build != '1'){
        var param = {'resume_id':this.id,'position_id':this.pid};
        ejax.post('/api/position/verifyResumePushed?format=json',param).then( res=> {
          if(res.data.err_no == 0){
            this.icdc_id=res.data.results.icdc_id;
            this.pushResume('evaluateForm');
          }
        })
        .catch(err=>{
          if(err.data.err_no == 100009){
            this.recommendErr = '上传失败，请联系管理员！';
          }
          if(err.data.err_no == 23000){
            this.recommendErr = '该简历已被推荐过！';
          }
          // this.pid = 'cv';
          this.dialogEv = true;
          console.log(err);
        });
       }else{
         this.dialogBasic=true;
       }
    },
    pushResume:function(data){
      debugger;
      this.$refs[data].validate((valid) => {
        if (valid) {
          var param = {'resume_id':this.id,'position_id':this.pid,'base_resume_id':this.icdc_id,'evaluate':this.evaluateForm.evaluate};
          ejax.post('/api/position/pushResume?format=json',param).then( res=> {
            if(res.data.err_no == 0){
              //推荐成功跳转职位
              // this.showEvaluate = 1;this.pid = 'cv';
              this.$message('已成功推荐到该职位！');
              let time = 2;
              let timer = setInterval(() => {
                time--;
                if (time <= 0) {
                  clearInterval(timer);
                  this.$router.push({ name: 'positionView',params:{'id':this.pid}, query: { 'status':'1'}});
                }
              }, 1000)
            } 
          })
          .catch(err=>{
            console.log(err);
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
       
    },
    isNew: function(){
      this.resume_base_data.education.length != 0 ? this.addShow.addShowEdu = true : this.addShow.addShowEdu = false;
      this.resume_base_data.work.length != 0 ? this.addShow.addShowWork = true : this.addShow.addShowWork = false;
      this.resume_base_data.project.length != 0 ? this.addShow.addShowProject = true : this.addShow.addShowProject = false;
      this.resume_base_data.skill.length != 0 ? this.addShow.addShowSkill = true : this.addShow.addShowSkill = false;
      this.resume_base_data.language.length != 0 ? this.addShow.addShowLanguage = true : this.addShow.addShowLanguage = false;
      this.resume_base_data.training.length != 0 ? this.addShow.addShowTraining = true : this.addShow.addShowTraining = false;
      this.resume_base_data.certificate.length != 0 ? this.addShow.addShowCertificate = true : this.addShow.addShowCertificate = false;
    },
    isCityShow() {
      this.cityShow = true;
    },
		getResumesDetail: function(id){
        if(id == 'null'){
          this.$router.push('/404')
        }else{
           var param = {'id':id,
            'selected':'',
            'updated_at':''};
            ejax.post('/api/resumes/detail?app=toh&format=json',param).then( res=> {
              this.diff = res.data.results.algorithm.diff;
              for(var key in this.diff){
                if(this.diff[key] !== ''){
                  this.isUpdate = true;
                }
              }
              this.basic = res.data.results.basic;
              this.gender = res.data.results.basic.gender;
              this.contact = res.data.results.contact;
              this.resume_base_data = res.data.results;
              this.isNew();
            })
            .catch(err=>{
              console.log(err);
              this.stopGoToDetail = true;
            });
        }
      },
      getReport: function(){
        var param = {'pr_id':this.report};
          ejax.post('/api/position/report?format=json',param).then( res=> {
            this.reportContent = res.data.results;
          })
          .catch(err=>{
            console.log(err);
          });
      },
      incrementTotal(val){
        if(this.cityType == 'place'){
          this.basicForm.accountType = _.cloneDeep(val);
        }else{
          this.basicForm.addressType = _.cloneDeep(val);
        }
      },
      openPrint() {
      window.print();
    },
    isDownLoad() {
      let parm = {
        'id': this.id
      };
      if (this.downLoadData.mark !== '') {
        parm.mark = this.downLoadData.mark;
      }
      var sform = document.createElement('form');
      sform.style.display = 'none';
      sform.method = "post";
      sform.action = "/api/resumes/download?format=json";
      var input = document.createElement('input');
      var input2 = document.createElement('input');
      input.name = 'id';
      input.value = this.id;
      input2.name = "mark";
      input2.value = this.downLoadData.mark;
      sform.appendChild(input);
      sform.appendChild(input2);
      document.body.appendChild(sform);
      sform.submit();
      this.EvaluateDownDialog = false;
    },
	},
	components: {
		navbar,CdSelectCity,CdSelectIndustry,CdSingleSelectCity
	},
	filters: {
    experienceFilter(val) {
			if (val == '0' || val == '') {
				return '不足1年工作经验';
			} else {
				return val + '年工作经验';
			}
		},
		isGender(val){
			return val == 'm' ? male : (val == 'f') ? female : nomarl;
		},
		gender(val){
			 return val == 'm' ? '男' : (val == 'f') ? '女' : '无';
		},
		degree(val){
			return val == '0' ? '不限' : val == '1' ? '本科' : val == '2' ? '硕士' : val == '3' ? '博士' : '专科';
		},
    n2p(value) {
        if (!value) { return ''}
        return value.replace(/(\r|\n)*(.+)(\r|\n)*/gi, '<p>$2</p>');
      },
	}
}

</script>
<style lang="scss">
@media print {
  .noprint {display: none}
  .v-box {border-left: 50px solid #F5F5F5;padding: 0 20px;}
}
.resumeView{
  .basicBulid{overflow: hidden;.img{cursor: pointer}.addBinfo{line-height: 90px;margin-left: 110px;font-size: 14px;color: #3B99FF;span{cursor: pointer;}}}
  .newBulid{border: 1px dashed #eee;border-radius: 2px;height: 80px;color: #3B99FF;background-color:#FCFCFC;font-size: 14px;text-align: center;line-height: 80px;margin: 20px 0;span{cursor: pointer;}}
  .update{color: #FE6B2B;background: #FFE4D9;font-size: 12px;line-height: 1;padding: 0 3px;}
  .keep{
    width: 100%;position: fixed;left:0;bottom: 0;z-index: 99;text-align: center;line-height: 70px;padding-left:50px;
    .keep-wrap{padding-left: calc(100vw - 100%);div{width: 820px;height: 70px;margin:0 auto;background-color: #fff;border:1px solid #eee;border-bottom:none;box-shadow:1px 0 2px 1px #ddd;}}
    .cd-button{width:120px;}
  }
  a{color: #fff;}padding-left: calc(100vw - 100%);
  .noPublic { p{text-align: center;} i{display: inline-block;height: 18px;width: 18px;vertical-align: text-bottom;margin-right: 10px;}}
  .viewinner .evaluate .cv-detail .cv-detail-content{padding: 30px 40px;}
  .el-input__inner{height: 30px;border-radius: 2px;}
  .el-input__icon{display: none;}
  .editing{width: 630px;margin: 0 auto;}
  .submit{margin-top: 30px;text-align: center;clear: both}
  .btn-delete{font-size: 14px;float: right;line-height: 32px;cursor: pointer;color:#ccc;}
  .btn-delete:hover{color:#3B99FF;}
  .grayFont{color: #ccc;}
  .ml40{margin-left: 40px;}
  .pl13 label{padding-left: 13px;}
  .place{height: 30px; border:1px solid #bfcbd9; padding-left: 10px; line-height: 30px;}
  .icon-prompt{color: #FECB2F;font-size: 16px;padding-right: 5px;line-height: 1;}
  .viewinner .cv-detail .cv-detail-title .grayFont{color: #ccc;i{color: #ccc;}}
  .termEdit{
    margin: 20px auto 20px;
    .el-select{width: 100%;}.el-input__inner{height: 36px;}.el-input__icon{display: block;}
  }
  .intenEdit{
    .el-select{width: 100%;}.el-input__inner{height: 36px;}.el-input__icon{display: block;}
    .industry-wrapper{
      height: 34px;white-space: nowrap;border: 1px solid #ccc;overflow: hidden;
      .industry-selector-selected li{display: inline-block;}
      .industry-selector-selected li.columns-item{border-radius: 3px;background-color: #FFF6F2;color: #FE6B2B;height: 22px;line-height: 22px;cursor: pointer;margin-right: 5px;margin-left: 2px;padding: 0 5px 0 10px;}
    }
  }
  .basicEdit{
    overflow: hidden;width: 570px;margin: 0 auto;padding-bottom: 20px;
    .basicInfo{
      float: left;margin-left: 28px;padding-bottom:50px;
      .name{display: inline-block;width: 265px;}
      .sex{display: inline-block;width: 165px;.el-radio-group{padding-left: 20px;.el-radio__input.is-checked .el-radio__inner{border-color:#FE6B2B;background: #FE6B2B;}}}
    }
  }
  .view-jobinfo{padding-bottom: 30px;border-bottom: 1px solid #eee;}
	.img .companylogo img{width: 90px;}
  .info {
    margin: 5px 15px 0;.job-jianjie{margin: 3px 0 12px;}.job-detail span{font-size: 14px;}
  }
  .editItem{float: right;font-size: 14px;color: #3B99FF;cursor: pointer;padding-right: 5px;}
  .recommend{
    .btn{
      padding: 0 10px;
      label{font-size: 12px}
    }
    .resume-operate{
      padding-top: 30px;
      line-height: 16px;
      label{cursor: pointer}
      i{font-size: 16px;color: #999;padding-right: 6px;}
      .icon-export{margin-left: 15px;}
      span{font-size: 14px;}
    }
  }
  .work-detail{margin-left: 168px;}
  .cv-detail{
    padding: 30px 0;
    .color9{color: #999;margin-left: 10px;}
    .h5{color: #999;font-size: 12px}
    .cv-detail-title span{font-size: 14px;color: #FF6B2B;line-height: 18px}
    .cv-detail-title i{margin-right: 6px;font-size: 15px;color: #999;}
    .cv-detail-title .editItem{float: right;cursor: pointer;color: #3B99FF;i{font-size: 14px;color: #3B99FF;margin-right: 0;}}
    .work,.project{.cv-detail-content{padding-bottom: 10px;}}
    .cv-detail-content{
      font-size: 14px;
      padding: 15px 0 30px 0;
      overflow: hidden;
      .detail{.items{overflow: hidden}}
      .limit{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;vertical-align: top;}
      .intention-detail{.cv-detail-left,.cv-detail-right{width: 50%;}}
      .intention-detail,.education-detail{padding-left:15px;overflow: hidden;}
      .cv-detail-left{width: 166px;}
      .detail{
        .items .cv-detail-right{width: 639px;}
        .cv-detail-left,.cv-detail-right{float: left;}
        p{padding-bottom: 10px;display: block;strong{padding: 0 7px;}}
        .cv-detail-content-title{padding-right: 5px;}
        .limit-position,.cv-detail-container .limit{display: inline-block;max-width: 180px;}
        .limit-edu{display: inline-block;max-width: 167px;}
        .work-items{display: table;margin-bottom:20px; .cv-detail-left{ margin-left: -166px;}}
        .work-items .cv-detail-right{width: 654px}
        .priority{
          height: 30px;line-height: 30px;background-color: #F5FAFF;padding-left: 15px;
          .work-empty{color:#999;width: 654px;display: block;
            i{color: #999;}
          }
        }
        .work-responsibility,.work-diachronic{margin: 15px}
        .work-include-show{margin: 15px;u{padding: 0 5px;color: #ddd}}
        .occupation-items p{padding-left: 15px;}
        .other{padding-right: 15px}
      }
    }

  }
}
</style>
