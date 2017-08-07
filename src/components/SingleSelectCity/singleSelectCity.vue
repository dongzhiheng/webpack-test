<template>
	<div class="cd-single-select-city">
		<div class="select-city-wrapper" v-show="selectCityShow">
			<ul class="city-selector-group">
				<li class="columns-item" v-bind:class="{'city-selector-group-active':activeGroup === 'hot'}" @click="changeGroup('hot')">热门
					<i class="arrow"></i>
					<i class="arrow double"></i>
				</li>
				<li class="columns-item" v-bind:class="{'city-selector-group-active':activeGroup === 'mainland'}" @click="changeGroup('mainland')">国内
					<i class="arrow"></i>
					<i class="arrow double"></i>
				</li>
				<li class="columns-item" v-bind:class="{'city-selector-group-active':activeGroup === 'gat'}" @click="changeGroup('gat')">海外
					<i class="arrow"></i>
					<i class="arrow double"></i>
				</li>
			</ul>
			<div class="main"  @click="$event.stopPropagation()">
				<aside v-show="activeGroup === 'mainland'">
					<ul class="clearfix">
						<li v-bind:class="{'city-selector-selected-active':activeSecond === selectCity.id}" v-for="selectCity of selectFirstCity" @click.stop="selectSecondCity(selectCity)">{{selectCity.name}}</li>
					</ul>
				</aside>
				<article v-bind:class="{'wrapper':activeSecond}" @click="$event.stopPropagation()">
					<ul class="clearfix" v-if="!activeSecond">
						<li v-for="province in locations[activeGroup]">
							<label class="cd-checkout" :for="province.id+'Singlecity'" v-bind:class="{'is-checked': province.checked, 'is-disabled': province.disabled}">
								<input :id="province.id+'Singlecity'" type="checkbox" :checked="province.checked" :disabled="province.disabled" @change.stop="selectCity(province)">
								<span class="checkbox-text">{{province.name}}</span>
							</label>
						</li>
					</ul>
					<ul v-else>
						<li v-for="province in locations[activeSecond]">
							<label class="cd-checkout" :for="province.id+'Singlecity'" v-bind:class="{'is-checked': province.checked, 'is-disabled': province.disabled}">
								<input :id="province.id+'Singlecity'" type="checkbox" :checked="province.checked" :disabled="province.disabled" @change="selectCity(province)">
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
import {hotCityData} from '../../assets/js/commonData/hotCity';
import ejax from '../../assets/js/ejax';

export default {
  name: 'cd-single-select-city',
	componentName: 'CdSingleSelectCity',
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
	watch:{
		selectCityShow(val){
			if(val == false){
				_.each(this.locations,function(value, key){
					_.each(value,function(value1,key1){
							value1.checked = false;				
					})
				})
			}
		}
	},
	data:function(){
		return{
			activeGroup:'hot',
			activeSecond:null,
			locations:{
				'hot':[]
			},
			selectFirstCity:[],
			error:false
		}
	},
	mounted:function(){
		this.locations.hot = _.cloneDeep(hotCityData);
	},
	methods:{
		changeGroup(val){
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
				}
		},
		getCityByProvince(parm={}){
				return ejax.post('/api/common/getCityByProvince?format=json',parm)				
		},		
		selectCity(item){
			let city = _.cloneDeep(item);
			let id = city.id;
			if(!city.checked){
				_.each(this.locations,function(value, key){
					_.each(value,function(value1,key1){
							value1.checked = false;				
					})
				})
				//this.cityData[0] = _.pick(city,['id','name']);
				this.cityData.splice(0,1,_.pick(city,['id','name','parent_id']));
				_.each(this.locations,function(value, key){
					_.each(value,function(value1,key1){
						if(value1.id == id){
							value1.checked = true;
						}
					})
				})

			}else{
				_.each(this.locations,function(value, key){
					_.each(value,function(value1,key1){
							value1.checked = false;				
					})
				})
				this.cityData.splice(0,1);

			}
			//console.log(this.cityData);
			this.$emit('increment',this.cityData);
		},
		selectSecondCity(city){
				let flag = true;
				this.activeSecond = city.id;
				if(_.isEmpty(this.locations[this.activeSecond])){
					this.getCityByProvince({province:city.id})
					.then(res=>{
						res.data.results.forEach((x,i)=>{
							x.checked = false;
							x.disabled = false;
							this.locations['hot'].forEach(y=>{
								if(x.id == y.id){
									res.data.results[i] = y;
								}
							})							
						});
							res.data.results.unshift(city);
						

						this.$set(this.locations,this.activeSecond,res.data.results);
					})
				}
		}
	}
}
</script>
<style lang="scss">
.cd-single-select-city {
	// position: relative;
	// box-sizing: border-box;
	// background: transparent;
	// width: 100%;
	// font-size: 16px;
	// border: 1px solid #ccc;
	//height: 36px;
	.wrapper {
		position: relative;
		ul {
			height: 36px;
			.select-items {
				display: inline-block;
				font-size: 12px;
				padding: 0 6px;
				color: #FE6B2B;
				cursor: pointer;
				background-color: #FFF6F2;
				margin-left: 7px;
				border-radius: 4px;
				height: 24px;
				line-height: 24px;
			}
		}
		.error_text {
			position: absolute;
			bottom: -14px;
			color: #ff4949;
			font-size: 12px;
			line-height: 1;
			padding-top: 4px;
			left: -1px;
		}
	}
	&.error_wrapper {
		border: 1px solid #ff4949;
	}
	.select-city-wrapper {
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
		.city-selector-group {
			background-color: #FAFAFA;
			border-bottom: 1px solid #ddd;
			height: 34px;
			.columns-item {
				position: relative;
				line-height: 30px;
				padding: 5px 30px;
				cursor: pointer;
				color: #666;
				font-size: 12px;
				letter-spacing: normal;
				display: inline-block;
				vertical-align: top;
				&:hover {
					color: #FE6B2B;
				}
				.arrow {
					display: none;
				}
				.double {
					border-bottom-color: white;
				}
			}
			.city-selector-group-active {
				color: #FE6B2B;
				.arrow {
					display: block;
					position: absolute;
					top: 24px;
					left: 37px;
					border-bottom-color: #ddd;
				}
				.double {
					border-bottom-color: white;
					top: 25px;
				}
			}
		}
		.main {
			aside {
				float: left;
				width: 100px;
				margin-right: -15px;
				ul {
					padding-top: 12px;
					height: 196px;
					overflow-y: auto;
					li {
						padding-left: 30px;
						font-size: 12px;
						cursor: pointer;
						&:hover {
							background-color: #FFF6F2;
						}
					}
				}
				.city-selector-selected-active {
					background-color: #FFF6F2;
				}
			}
			article {
				float: left;
				background-color: white;
				&.wrapper {
					width: 230px;
					ul {
						width: 258px;
						height: 193px;
						overflow: auto;
						li {
							&:nth-child(1) {
								float: none;
							}
						}
					}
				}
				ul {
					padding-top: 12px;
					padding-left: 20px;
					min-width: 258px;
					height: 193px;
					li {
						display: block;
						float: left;
						line-height: 30px;
						white-space: nowrap;
						font-size: 12px;
						width: 104px;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				}
			}
		}
	}
}
</style>

