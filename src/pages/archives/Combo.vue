<template>
  <div class="v-container">
    <navbar></navbar>
    <div class="v-box">
      <div class="combo_wrapper">
        <div class="heard_title mt40">
          <h2>
            <router-link to="/archives/list">人才库</router-link>
            <em>></em>
            <p>套餐详情</p>
          </h2>
        </div>
  
        <div class="main">
          <div class="mt30">
            <dl class="clearfix">
              <dt class="l">商务联系：</dt>
              <dd class="l">
                <i class="icon-phone"></i>021-63086588</dd>
              <dd class="l">
                <i class="icon-email"></i> yang.liu@ifchange.com</dd>
            </dl>
          </div>
          <div class="mt30 rel">
            <img src="../../assets/img/combo_bg.png" alt="">
            <span v-bind:class="{'free':this.type == '免费','professional':this.type == '专业','vip':this.type == 'vip'}">
              <img src="../../assets/img/combo_success.png" alt="">
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ejax from '../../assets/js/ejax';
export default {
  name:'combo',
  data(){
      return{
        type:'免费'
      }
  },
  mounted:function() {
    ejax.post('/api/account/view_talents_num?format=json')
    .then((res)=>{
      this.type = res.data.results.version;
    })
    .catch(err=>{
      console.log(err);
      this.type = '免费';
    })
  }
}
</script>
<style lang="scss">
.combo_wrapper {
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
  .main {
    dd {
      padding-right: 20px;
    }
    i {
      vertical-align: text-bottom;
      color: #999;
      font-size: 16px;
      margin-right: 2px;
    }
    .rel {
      position: relative;
    }
    .free {
      position: absolute;
      left: 233px;
      top: 0;
    }
    .professional {
      position: absolute;
      left: 506px;
      top: 0;
    }
    .vip {
      position: absolute;
      left: 780px;
      top: 0;
    }
  }
}
</style>




