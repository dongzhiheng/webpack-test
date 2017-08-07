<template>
    <div class="v-container">
        <navbar></navbar>
        <div class="v-box">
            <div class="account_wrapper">
                <ul class="child-menu">
                    <router-link class="items" to="/account/profile">账号信息
                        <i class="line"></i>
                    </router-link>
                    <router-link v-if="accountType" class="items" to="/account/sub-account">子账号管理
                        <i class="line"></i>
                    </router-link>
                </ul>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
import ejax from '@/assets/js/ejax';
import { getQuery } from '@/assets/js/base';
import Cookies from 'js-cookie';
export default {
    name: 'login',
    data() {
        return {
            accountType: false
        }
    },
    mounted() {
        let user_info = Cookies.get('user_info');
        if (user_info) {
            if (JSON.parse(user_info).user_type == 2 && JSON.parse(user_info).type == 1) {
                this.accountType = true;
            }

        } else {
            ejax.post('/api/account/detail?format=json')
                .then(data => {
                    if (data.data.results.account.user_type == 1 && data.data.results.account.type == 1) {
                        this.accountType = false;
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }

    },
    methods: {

    }
}

</script>
<style lang="scss">
.account_wrapper {
    margin: 50px auto 73px;
    width: 830px;
    min-height: 800px;
    .child-menu {
        margin: 40px 70px 0px 70px;
        border-bottom: 1px solid #EEE;
        .items {
            position: relative;
            display: inline-block;
            padding: 0 8px;
            font-size: 16px;
            color: #999;
            line-height: 16px;
            height: 27px;
            .line {
                display: none;
                height: 2px;
                width: 100%;
                background-color: #FE6B2B;
                position: absolute;
                bottom: 0;
                left: 0;
                z-index: 100;
            }
            &.router-link-active {
                color: #FE6B2B;
                .line {
                    display: block;
                }
            }
        }
    }
}
</style>
