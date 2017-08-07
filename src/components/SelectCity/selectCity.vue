<template>
	<div class="cd-select-city" v-bind:class="{ error_wrapper: error }">
		
		<div class="wrapper">
			<ul>
				<li class="select-items" v-for="(city,index) of cityData">
					{{city.name}}
					<span class="icon-close" @click.stop="removeSelectCity(city,index)"></span>	
				</li>
			</ul>
			<div v-show="error" class="error_text">请填写工作城市</div>
		</div>
		<div class="select-city-wrapper" v-show="selectCityShow">
			<ul class="city-selector-group">
				<li class="columns-item" v-bind:class="{'city-selector-group-active':activeGroup === 'hot'}" @click="changeGroup('hot')">热门<i class="arrow"></i><i class="arrow double"></i></li>
				<li class="columns-item" v-bind:class="{'city-selector-group-active':activeGroup === 'mainland'}" @click="changeGroup('mainland')">国内<i class="arrow"></i><i class="arrow double"></i></li>
				<li class="columns-item" v-bind:class="{'city-selector-group-active':activeGroup === 'gat'}" @click="changeGroup('gat')">海外<i class="arrow"></i><i class="arrow double"></i></li>
			</ul>
			<div class="main">
				<aside v-show="activeGroup === 'mainland'">
					<ul>
						<li v-bind:class="{'city-selector-selected-active':activeSecond === selectCity.id}" v-for="selectCity of selectFirstCity" @click="selectSecondCity(selectCity)">{{selectCity.name}}</li>
					</ul>
				</aside>
				<article v-bind:class="{'wrapper':activeSecond}">
					<ul v-if="!activeSecond">
						<li v-for="province in locations[activeGroup]">
							<label class="cd-checkout" :for="province.id+'city'" v-bind:class="{'is-checked': province.checked, 'is-disabled': province.disabled}">
							<input :id="province.id+'city'" type="checkbox" :checked="province.checked" :disabled="province.disabled" @change="selectCity(province)">
							<span class="checkbox-text">{{province.name}}</span>
							</label>
						</li>
					</ul>
					<ul v-else>
						<li v-for="province in locations[activeSecond]">
							<label class="cd-checkout" :for="province.id+'city'" v-bind:class="{'is-checked': province.checked, 'is-disabled': province.disabled}">
							<input :id="province.id+'city'" type="checkbox" :checked="province.checked" :disabled="province.disabled" @change="selectCity(province)">
							<span class="checkbox-text">{{province.name}}</span>
							</label>
						</li>
					</ul>
				</article>
			</div>
		</div>

	</div>
</template>

<script>
	import ejax from '../../assets/js/ejax';
	import {hotCityData} from '../../assets/js/commonData/hotCity';

	export default  {
        name: 'cd-select-city',
        componentName: 'CdSelectCity',
		components: {

		},
		mounted:function(){
			this.locations.hot = _.cloneDeep(hotCityData);
		},
		props: {
			cityData:{
				default:function(){
					return [];
				}
			},
			selectCityShow:{
				default:false
			}
		},
		data: function () {
			return {
				activeGroup:'hot',
				activeSecond:null,
				locations:{
					'hot':[]
				},
				selectFirstCity:[],
				error:false
			}
		},
		watch:{
			selectCityShow(val){
				if(val == false){
					if(this.cityData.length == 0){
						this.error = true;
					}
				}
				
			}
		},
		created() { //组件实例创建完成，属性已绑定，但Dom未生成，$el属性不存在


		},
		methods: { // 操作方法
			changeGroup(val){
				let parm = {};
				this.activeGroup = val;
				this.activeSecond = null;
				if(val === 'mainland'){
					this.getCityByProvince()
					.then(data=>{						
						if(_.isEmpty(this.selectFirstCity)){
							data.data.results.forEach(x=>{
								x.checked = false;
								x.disabled = false;
							})
							this.selectFirstCity = data.data.results;
						}						
					})
					.catch(err=>{
						console.log(err);
					})
				}else if(val === 'gat'){
					this.getCityByProvince({province:'gat'})
					.then(cityData=>{
						cityData.data.results.forEach(x=>{
							x.checked = false;
							x.disabled = false;
						})
						if(!this.locations[this.activeGroup]){
							this.$set(this.locations,this.activeGroup,cityData.data.results);
						}
					})
					.catch(err=>{
						console.log(err);
					})
				}
			},
			getCityByProvince(parm={}){
				return ejax.post('/api/common/getCityByProvince?format=json',parm)				
			},
			selectCity(obj){
				if(obj.checked == false){
					if(this.cityData.length < 6){
						obj.checked = true;
						this.cityData.push(obj);
						this.validate(obj);
					}else{
						this.$message({
							message:'超过了6个限制'
						});
					}
					
				}else{
					this.cityData.forEach((x,i)=>{
						if(obj.id == x.id){
							x.checked = false;
							this.cityData.splice(i,1);
						}
					})
					this.validate(obj);
					
				}
				
			},
			removeSelectCity(city,index){ //删除选中城市
				city.checked = false;
				this.cityData.splice(index,1);
				this.validate(city);
			},
			selectSecondCity(city){
				let flag = true;
				this.activeSecond = city.id;
				if(_.isEmpty(this.locations[this.activeSecond])){
					this.getCityByProvince({province:city.id})
					.then(data=>{
						data.data.results.forEach((x,i)=>{
							x.checked = false;
							x.disabled = false;
							this.locations['hot'].forEach(y=>{
								if(x.id == y.id){
									data.data.results[i] = y;
								}
							})							
						});

						this.locations['hot'].forEach(x=>{
							if(x.id == city.id){								
								if(x.checked == true){
									data.data.results.forEach(x=>{
										x.disabled = true;
									});
								}
								data.data.results.unshift(x);
								flag = false;
							}
						})
						if(flag){
							data.data.results.unshift(city);
						}
						data.data.results.forEach(x=>{
							if(x.checked == true){
								//data.data.results[0].disabled = true;
								data.data.results[0].checked = true;
							}
						})

						this.$set(this.locations,this.activeSecond,data.data.results);
					})
					.catch(err=>{
						console.log(err);
					})
				}
				
			},
			validate(city){
				let flag = false;
				if(city.level == '1'){
					if(city.checked == true){
						if(this.locations[city.id]){
							this.locations[city.id].forEach((x,i)=>{
								if(i !== 0){
									x.disabled = true;
								}
							})
						}
					}else{
						if(this.locations[city.id]){
							this.locations[city.id].forEach((x,i)=>{
								if(i !== 0){
									x.disabled = false;
								}
							})
						}
					}
					
				}else if(city.level == '2'){
					if(this.locations[city.parent_id]){
						this.locations[city.parent_id].forEach((x,i)=>{
							if( i !== 0){
								if(x.checked == true){
									flag = true;									
								}
							}
						})
						if(flag){
							this.locations[city.parent_id][0].disabled = true;
						}else{
							this.locations[city.parent_id][0].disabled = false;
						}	
					}		
				}
				if(this.cityData.length !== 0){
						this.error = false;
					}else{
						this.error = true;
					}
			}
		},

	}
</script>


<style lang="scss" scoped>
.cd-select-city{
	position: relative;
	box-sizing: border-box;
	background: transparent;
	width: 100%;
	font-size: 16px;
	border: 1px solid #ccc;
	height: 36px;
	.wrapper{
		position: relative;
		ul{
			height: 36px;
			overflow: hidden;
			.select-items{
				display: inline-block;
				font-size: 12px;
				padding: 0 6px;
				color: #FE6B2B;
				cursor: pointer;
				background-color: #FFF6F2;
				margin-left:7px;
				border-radius: 4px;
				height: 24px;
				line-height: 24px;
			}
		}
		.error_text{
			position: absolute;
			bottom:-14px;
			color: #ff4949;
			font-size: 12px;
			line-height: 1;
			padding-top: 4px;
			left:-1px;
		}
	}
	&.error_wrapper{
		border: 1px solid #ff4949;
	}
	.select-city-wrapper{
		position: absolute;
		top: 33px;
		left: -1px;
		right: 0;
		height: 240px;
		overflow: hidden;
		border: 1px solid #ddd;
		background-color: #fff;
		box-shadow: 0 1px 2px #ccc;
		z-index: 100;
		width: 100%;
		.city-selector-group{
			background-color: #FAFAFA;
			border-bottom: 1px solid #ddd;
			height: 34px;
			.columns-item{
				position: relative;
				line-height: 30px;
				padding: 5px 30px;
				cursor: pointer;
				color: #666;
				font-size: 12px;
				letter-spacing: normal;
				display: inline-block;
				vertical-align: top;	
				&:hover{
					color: #FE6B2B;
				}
				.arrow{
					display: none;
				}
				.double{
					border-bottom-color: white;
				}
			}
			.city-selector-group-active{
				color: #FE6B2B;
				.arrow{
					display: block;
					position: absolute;
					top:24px;
					left: 37px;
					border-bottom-color: #ddd;
				}
				.double{
					border-bottom-color: white;
					top:25px;
				}
			}
		}
		.main{
			aside{
				float: left;
				width: 100px;
				margin-right: -15px;
				ul{
					padding-top: 12px;
					height: 200px;
					overflow-y: auto;
					li{
						padding-left: 30px;
						font-size: 12px;
						cursor: pointer;
						&:hover{
							background-color: #FFF6F2;
						}
					}
				}
				.city-selector-selected-active{
					background-color: #FFF6F2;
				}
			}
			article{
				float: left;
				background-color: white;
				min-height: 280px;
				min-width: 450px;
				&.wrapper{
					width: 450px;
					ul{
						width: 490px;
						height: 190px;
						overflow: auto;
						li{
							&:nth-child(1){
							float: none;
						}
					}
					}
				}
				ul{
					padding-top: 12px;
					padding-left: 20px;
					
					li{
						display: block;
						float: left;
						line-height: 30px;
						white-space: nowrap;
						font-size: 12px;
						width: 111px;
						overflow: hidden;
   					 	text-overflow: ellipsis;
						
					}
				}
			}
		}
	}
	
}


</style>