<template>
    <div class="v-container">
        <navbar></navbar>
        <div class="v-box">
            <div class="premission_wrapper">
    
                <div class="heard_title mt40">
                    <h2>
                        <router-link to="/archives/list">人才库</router-link>
                        <em>></em>
                        <p>权限设置</p>
                    </h2>
                </div>
                <div class="premission_main mt40">
                    <div class="setting">
                        <dl>
                            <dt class="l">简历上传查看权限</dt>
                            <dd>
                                <el-radio-group v-model="authority" @change="editAuthority">
                                    <el-radio :label="1">公开</el-radio>
                                    <el-radio :label="2">私有</el-radio>
                                </el-radio-group>
                            </dd>
                        </dl>
                    </div>
                </div>
                <div class="info mt40 clearfix">
                    <div class="l">
                        <p>私有：本账号之外，只有上级账号可查看联系方式。</p>
                        <p>公开：贵公司所有账号均可查看联系方式。</p>
                        <p>1.设置后，仅对新增的简历有效，旧有简历的查看权限不改变；</p>
                        <p>2.某份简历如果是公开的状态，则无法将其设置为私有。</p>
                    </div>
                    <div class="r">
                        <img src="../../assets/img/permission_bg.png" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import navbar from '../../components/Navbar/navbar.vue';
import ejax from '../../assets/js/ejax';
export default {
    name: 'ArchivesPermission',
    data() {
        return {
            authority: null,
        }
    },
    components: {
        navbar
    },
    mounted() {
        this.getUserDetail();
    },
    methods: {
        getUserDetail() {
            ejax.post('/api/account/detail?format=json')
                .then(data => {
                    this.authority = parseInt(data.data.results.account.talents_authority, 10);
                })
                .catch(err => {
                    console.log(err);
                })
        },
        editAuthority() {
            ejax.post('/api/account/talents_authority?format=json', { 'talents_authority': this.authority })
                .then(data => {
                    this.getUserDetail();
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }

}
</script>
<style lang="scss">
.premission_wrapper {
    margin: 50px auto 73px;
    width: 830px;
    min-height: 760px;
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
    .premission_main {
        .setting {
            dt {
                font-size: 14px;
            }
            dd {
                margin-left: 140px;
                font-size: 14px;
            }
            .el-radio__inner:hover {
                border-color: #FE6B2B;
            }
            .el-radio__input.is-checked .el-radio__inner {
                border-color: #FE6B2B;
                background: #FE6B2B;
            }
        }
    }
    .info {
        border: 1px solid #eee;
        padding: 30px 20px;
    }
}
</style>