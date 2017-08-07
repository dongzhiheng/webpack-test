<template>
  <div class="navbar">
    <router-link to="/position">橙单</router-link>
    <ul class="navitems">
      <router-link to="/position">
        <li><i class="icon-post"></i>职位</li>
      </router-link>
      <router-link to="/archives">
        <li><i class="icon-person1"></i>人才库</li>
      </router-link>
    </ul>
    <div class="set">
      <router-link to="/account"><p><i class=""></i> 账号设置</p></router-link>
      <p @click="showLoginOut" class="login_out"><i class=""></i> 退出</p>
    </div>
    <!--<div class="user_wrapper">
      <p @click.stop="isShowSet" class="user_name">{{username}}</router-link><i class="arrow arrow-top"></i></p>
    </div>-->

    <el-dialog title="提示" v-model="loginOutDialogVisible" size="tiny" :modal-append-to-body="false" :show-close="false" :close-on-click-modal="false" :close-on-press-escape='false'>
			<p>是否确定退出登录</p>
			<p></p>
			<span slot="footer" class="dialog-footer">
        <span class="cd-button cd-button-default" @click="loginOutDialogVisible = false">取 消</span>
			  <span class="cd-button cd-button-primary" @click="isloginOut">确 定</span>
			</span>
		</el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import ejax from '../../assets/js/ejax';
export default {
  name: 'navbar',
  data() {
    return {
      username: "",
      user_type: '',
      loginOutDialogVisible:false
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.getEmail();
      // document.addEventListener('click', (e) => {
      // if (!this.$el.querySelector('.set').contains(e.target)) this.accountSet = false;
      // })
    })
  },
  methods: {
    getEmail: function () {
      this.username = Cookies.get('email');
      /*ejax.get('/api/account/get_email?format=json').then(res=> {
        if(res.data.results.email == false){
          window.location.href='/login';
        }else{
          this.username=res.data.results.email;
          this.user_type=res.data.results.user_type;
          Cookies.set('user_type', res.data.results.user_type);
        }
      });*/
    },
    showLoginOut(){
      this.loginOutDialogVisible = true;
    },
    isloginOut(){
      ejax.post('/api/account/logout?format=json')
      .then(res=>{
        Cookies.remove('user_info');
        this.$router.push({path:'/'});
      })
      .catch(err=>{
        console.log(err);
      })

    }
  }
}

</script>
<style lang="scss">
.navbar {
  .user_wrapper {
    position: absolute;
    bottom: 35px;
    width: 100%;
    color: #ffffff;
    font-size: 12px;
    line-height: 14px;
    cursor: pointer;
    .user_name {
      width: 90%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .set {
    position: absolute;
    bottom: 30px;
    color: white;
    text-align: left;
    margin: 0 10%;
    padding: 0 9%;
    font-size: 12px;
    p{
      margin: 16px 0;
    }
    i{
      background-color: white;
      display: inline-block;
      margin-right: 4px;
      width: 4px;
      height: 4px;
      position: relative;
      top: -2px;
    }
    .router-link-active{
      p{
        color: #FE6B2B;
      }
      i{
        background-color: #FE6B2B;
      }
    }
  }
  .arrow-top {
    position: absolute;
    top: 0px;
    right: 5px;
  }
  .login_out{
    cursor: pointer;
  }
}
</style>
