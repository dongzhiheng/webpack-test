<template>
  <el-dialog title="行业选择" v-model="myShow" size="small" custom-class="select-industry" :close-on-click-modal="false"
    :close-on-press-escape="false" :lock-scroll="false">
    <div class="select-wrapper" @click.stop="hideLevel3">
      <div class="industry-selector-unconfirm-selected">
        <em>已选择</em>
        <ul class="industry-selector-selected">
          <li class="columns-item" v-for="industry in industries">
            {{industry.name}}
            <i class="icon-close" @click="removeCheckIndustry(industry.tid)"></i>
          </li>
        </ul>
      </div>

      <dl v-for="level1 in getIndustry" class="level1-wrapper">
        <dt class="level1-name">

          <label class="cd-checkout" :for="level1.tid+'industy'" v-bind:class="{'is-checked': level1.checked, 'is-disabled': level1.disabled}">
                  <input type="checkbox" :id="level1.tid+'industy'" :checked="level1.checked" :disabled="level1.disabled"  @change="checkIndustry(level1)">
                  <span class="checkbox-text">{{level1.name}}</span>
              </label>

        </dt>
        <dd v-if="level1.child">
          <dl class="level2-wrapper" v-for="level2 in level1.child">
            <dt class="level2-name" v-if="!level2.child">
              <label class="cd-checkout" :for="level2.tid+'industy'" v-bind:class="{'is-checked': level2.checked, 'is-disabled': level2.disabled}">
                    <input type="checkbox" :id="level2.tid+'industy'" :checked="level2.checked" :disabled="level2.disabled"  @change="checkIndustry(level1,level2)">
                    <span class="checkbox-text">{{level2.name}}</span>
            </label>
            </dt>
            <dt class="level2-name" v-else v-bind:class="{'active':level2.isShow}" @click="$event.stopPropagation()">
              <div v-if="level2.isShow">
                <label class="cd-checkout" :for="level2.tid+'industy'" v-bind:class="{'is-checked': level2.checked, 'is-disabled': level2.disabled}">
                      <input type="checkbox" :id="level2.tid+'industy'" :checked="level2.checked" :disabled="level2.disabled"  @change="checkIndustry(level1,level2)">
                      <span class="checkbox-text">{{level2.name}}</span>
                    </label>
                <em class="icon-close" v-if="level2.isShow" @click.stop="level2.isShow = false"></em>
              </div>
              <div class="selector-add" v-else @click.stop="triggerLevel3(level2)" v-bind:class="{'self-or-child-has-checked':level2.number,'is-disabled': level2.disabled}">
               <span>{{level2.name}}</span>
              </div>

            </dt>
            <dd class="level3-wrapper" v-if="level2.child" v-show="level2.isShow" @click="$event.stopPropagation()">
              <ul>
                <li v-for="level3 in level2.child">
                  <label class="cd-checkout" :for="level3.tid+'industy'" v-bind:class="{'is-checked': level3.checked, 'is-disabled': level3.disabled}">
                        <input type="checkbox" :id="level3.tid+'industy'" :checked="level3.checked" :disabled="level3.disabled"  @change="checkIndustry(level1,level2,level3)">
                        <span class="checkbox-text">{{level3.name}}</span>
                    </label>
                </li>
              </ul>
            </dd>
          </dl>
        </dd>
      </dl>
    </div>
    <span slot="footer" class="dialog-footer">
            <span class="cd-button cd-button-default" @click="myShow = false">取 消</span>
            <span class="cd-button cd-button-primary" @click="ensure">确 定</span>

          </span>
  </el-dialog>
</template>

<script>
  import ejax from '../../assets/js/ejax';

  export default {
    name: 'cd-select-industry',
    componentName: 'CdSelectIndustry',
    components: {

    },
    props:{
        industries:{
            default:function(){
                return [];
            }
        },
        show:{
            default:true
        }
    },
    data: function () {
      return {
        getIndustry: [],
        activedIndustry:{},
        myShow:this.show
      }
    },
    watch:{
        show(val){
            this.myShow = val;
        },
        myShow(val){
            this.$emit('on-change-show',val);
        }
    },
    created() { //组件实例创建完成，属性已绑定，但Dom未生成，$el属性不存在
      this.getIndustryData();

    },
    methods: { // 操作方法
      getIndustryData(){
       return ejax.post('/api/common/getIndustry?format=json')
        .then((acct) => {
          // Both requests are now complete 
          acct.data.results.forEach(x => {
            x.disabled = false;
            x.checked = false;
            x.number = 0;
            if (x.child) {
              x.child.forEach(y => {
                y.disabled = false;
                y.checked = false;
                y.number = 0;
                y.isShow = false;
                if (y.child) {
                  y.child.forEach(z => {
                    z.disabled = false;
                    z.checked = false;
                  })
                }
              })
            }
          })
          this.getIndustry = acct.data.results
        })
        .catch(err=>{
          console.log(err);
        })
      },
      checkIndustry(level1, level2, level3) {
        var parent = arguments.length;
        if (parent == '1') { //判断是否为层级一
          if (level1.checked == false) { //判断层级一得选中状态，选中
            if(this.addIndustry(level1)){
              level1.checked = true;
              if (level1.child) {
                level1.child.forEach(x => {
                  x.disabled = true;
                })
              }
            }
          } else { //取消状态
            this.removeCheckIndustry(level1.tid);
          }
        } else if (parent == '2') { //选中的是否是层级二
          if (level2.checked == false) { //判断是否为选中状态，是选中状态
            if(this.addIndustry(level2)){
              level2.checked = true;
              level1.checked = false;
              level1.number++;
              level1.disabled = true;
              if (level2.child) {
                level2.number++;
                level2.child.forEach(x => {
                  x.disabled = true;
                })
              }
            }
          } else { //取消状态
            if (level2.child) {
              level2.child.forEach(x => {
                x.disabled = false;
              })
            }
            this.removeCheckIndustry(level2.tid);
          }
        } else { //选中的是否是层级三
          if (level3.checked == false) {
           if(this.addIndustry(level3)){
            level3.checked = true;
            level2.disabled = true;
            level2.number++;
            level1.checked = false;
            level1.number++;
            level1.disabled = true;
           }
            
          } else {

            this.removeCheckIndustry(level3.tid);
          }
        }
      },
      removeCheckIndustry(tid) { //删除选中行业
        if (tid) {
          this.industries.forEach((x, i) => {
            if (x.tid == tid) {
              this.industries.splice(i, 1);
            }
          })
          this.getIndustry.forEach(x => {
            if (x.tid == tid) {
              x.checked = false;
              x.disabled = false;
              if(x.child){
                x.child.forEach(it=>{
                  it.disabled = false;
                  it.checked = false;
                })
              }          
            } else {
              if (x.child) {
                x.child.forEach(y => {
                  if (y.tid == tid) {
                    y.checked = false;
                    y.disabled = false;
                    x.number--;
                    if (x.number == '0') {
                      x.disabled = false;
                      x.checked = false;
                    }
                    if(y.child){
                      y.number--;
                      y.child.forEach(ic=>{
                        ic.disabled = false;
                        ic.checked = false;
                      })
                    }
                  } else {
                    if (y.child) {
                      y.child.forEach(z => {
                        if (z.tid == tid) {
                          z.checked = false;
                          z.disabled = false;
                          y.number--;
                          x.number--;
                          if (x.number == '0') {
                            x.disabled = false;
                            x.checked = false;
                          }
                          if (y.number == '0') {
                            y.disabled = false;
                            y.checked = false;
                          }
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      },
      triggerLevel3(level2) {
          if(level2.disabled == true){
              //return false;
          }
          if(level2.disabled == true && level2.number !== 0){
            level2.isShow = true;
            if (_.isEmpty(this.activedIndustry)) {
                this.activedIndustry = level2;
            } else {
                if (this.activedIndustry == level2) {
                    return false;
                }
                this.activedIndustry.isShow = false;
                this.activedIndustry = level2;
            }
            return false;
          }
          if(level2.disabled == false){
            level2.isShow = true;
            if (_.isEmpty(this.activedIndustry)) {
                this.activedIndustry = level2;
            } else {
                if (this.activedIndustry == level2) {
                    return false;
                }
                this.activedIndustry.isShow = false;
                this.activedIndustry = level2;
            }
            return false;
          }
         
      },
      hideLevel3(){
        this.getIndustry.forEach(y=>{
            if(y.child){
              y.child.forEach(z=>{
                z.isShow = false;
              })
            }
          })
      },
      addIndustry(obj){
        if(this.industries.length > 5){
          obj.checked = false;
          this.$message({
							message:'最多只能选择6个行业'
						});
          return false;
        }else{
          this.industries.push({
            'name': obj.name,
            'tid': obj.tid
          })
          return true;
        }
      },
      editIndustrty(arr){
        this.getIndustryData()
        .then(()=>{
          arr.forEach(a=>{
          this.getIndustry.forEach(b=>{
            if(b.tid == a){
              this.checkIndustry(b);
            }else{
              if(b.child){
                b.child.forEach(c=>{
                  if(c.tid == a){
                    this.checkIndustry(b,c)
                  }else{
                    if(c.child){
                      c.child.forEach(d=>{
                        if(d.tid == a){
                          this.checkIndustry(b,c,d);
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        })
        })       
      },
      ensure(){
        //debugger;
        this.myShow = false;
        this.$emit('on-save','1');
        
      }
    }
  }

</script>


<style lang="scss" scoped>
.select-industry{
    .selector-add{
        &:before{
            content: "";
            width: 14px;
            height: 14px;
            font-size: 0;
            overflow: hidden;
            display: inline-block;
            vertical-align: middle;
            background-image: url('../../assets/img/all_custom_icon.png');
            background-repeat: no-repeat;
            background-color: #f5f5f5;
            background-position: -76px -4px;
        }
        span{
            cursor: pointer;
            position: relative;
            top: 2px;
            left:3px;
        }
    }
    .is-disabled{
        span{
            color: #999;
        }
    }
    .self-or-child-has-checked{
        &:before{
            background-position: -112px -4px;
        }
        span{
            color: #48576a;
        }
    }
    .select-wrapper {
        height: 320px;
        overflow-x: auto;
        font-size: 12px;
      }
      .industry-selector-unconfirm-selected {
        position: relative;
        margin-bottom: 5px;
        white-space: nowrap;
        height:22px;
        em{
            display: block;
            float: left;
            line-height: 25px;
            margin-right: 6px;
        }
      }
      .industry-selector-selected {
        display: inline-block;
        li {
          display: inline-block;
        }
        .columns-item {
          border-radius: 3px;
          background-color: #FFF6F2;
          color: #FE6B2B; 
          height: 22px;
          line-height: 22px;
          cursor: pointer;
          margin-right: 5px;
          margin-left: 2px;
          padding: 0 5px 0 10px;
          em{
              color: #ccc;
              &:hover{
                  color: #FE6B2B;
              }
          }
        }
      }
      .level1-wrapper {
        display: inline-block;
        width: 100%;
        border-top: 1px dotted #ccc;
        position: relative;
        .level1-name {
          font-size: 14px;
          padding: 10px 0 6px;
        }
      }
      .level2-wrapper {
        display: inline-block;
        width: 33.3333%;
        .level2-name {
          margin-right: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          position: relative;
          padding-left: 15px;
          padding-top: 10px;
          padding-bottom: 6px;
          margin-left: -15px;
        }
        .active {
          border-style: solid;
          border-width: 1px;
          border-color: #e1e1e1 #e1e1e1 #fff;
          background-color: #fff;
          position: relative;
          padding-bottom: 2px;
          margin-bottom: -1px;
          z-index: 201;
          border-radius: 3px 3px 0 0;
          .icon-close {
            float: right;
            padding-right: 10px;
          }
        }
      }
      .level3-wrapper {
        position: absolute;
        left: 0;
        right: 0;
        background-color: #fff;
        z-index: 200;
        ul {
          border: 1px solid #E1E1E1;
          padding-top: 8px;
          margin: 0 -15px;
          box-shadow: 0 1px 2px #ddd;
          border-radius: 0 0 3px 3px;
          li {
            display: inline-block;
            width: 20%;
            margin-bottom: 12px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            label {
              padding-left: 15px;
            }
          }
        }
      }
    }


</style>
