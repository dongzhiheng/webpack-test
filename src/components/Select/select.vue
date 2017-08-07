<template>
	<div class="wrapper">
		
		<div class="cd-select" @click.stop="trigger">dasdasda</div>
		<ul v-show="ishide">
			<li  v-for="(item,key) in select_db" >{{item}}</li>
		</ul>	
	</div>
</template>

<script>
	

	module.exports = {
        name: 'cd-select',
        componentName: 'CdSelect',
		components: {

		},
		data: function () {
			return {
				ishide:false
			}
		},
		created() { //组件实例创建完成，属性已绑定，但Dom未生成，$el属性不存在


		},
		methods: { // 操作方法
			trigger(event){
				this.ishide = !this.ishide;
				console.log(event)
				return false;
			}
		},
		props:['select_db']
	}
</script>


<style scoped>
.wrapper{
	appearance:none;
  -moz-appearance:none;
   background: transparent;
   width: 268px;
   padding: 5px;
   font-size: 16px;
   border: 1px solid #ccc;
   height: 34px;
   -webkit-appearance: none; /*for chrome*/
}
select:hover{
	 outline:none;
}
select:focus{
	 outline:none;
}
option{
outline:none;
border: 1px solid #ccc;
}
</style>