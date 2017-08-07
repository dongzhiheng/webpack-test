import Vue from 'vue'
import Router from 'vue-router'
import Cookies from 'js-cookie'
import Home from '@/pages/home/Home'
import Account from '@/pages/account/Account'
import Profile from '@/pages/account/Profile'
import SubAccount from '@/pages/account/SubAccount'
import Position from '@/pages/position/Position'
import Post from '@/pages/post/Post'
import View from '@/pages/view/View'
import ArchivesList from '@/pages/archives/List'
import ArchivesUpload from '@/pages/archives/Upload'
import ArchivesView from '@/pages/archives/View'
import ArchivesPermission from '@/pages/archives/Permission'
import ArchivesSummary from '@/pages/archives/Summary'
import ArchivesCombo from '@/pages/archives/Combo'
import Search from '@/pages/search/Search'
import ejax from '../assets/js/ejax';
import NotFound from '@/pages/404/404'
Vue.use(Router);

let routes = [
		{path: '/', name:'/',component: Home, title:'橙单 - 大数据让猎头成单更容易'},
    {path:'/home',redirect:{path: '/position'}, title:'橙单 - 大数据让猎头成单更容易'},
		{path: '/position',name:'position',component: Position, title:'橙单-职位'},
    {path:'/account',name:'account',component: Account,redirect: '/account/profile',title:'橙单-账号管理',
      children:[
        {path:'profile',name:'accountProfile', component:Profile,title:'橙单-账号管理'},
        {path:'sub-account',name:'accountSubAccount', component:SubAccount,title:'橙单-账号管理'}
      ]
    },
    {path: '/search', name:'search', component: Search,title:'橙单-搜索'},    
		{path: '/position/post',name:'positionPost', component: Post,title:'橙单-职位编辑'},
		{path: '/position/view/:id', name:'positionView' ,component: View,title:'橙单-职位详情'},
    {path: '/archives', name:'archives', redirect: '/archives/list',title:'橙单-人才库'},
    {path: '/archives/list', name:'archivesList', component: ArchivesList,title:'橙单-人才库'},
    {path: '/archives/upload', name:'archivesUpload', component: ArchivesUpload,title:'橙单-简历上传'},
    {path: '/archives/upload/:pid', name:'archivesUploadPid', component: ArchivesUpload,title:'橙单-简历上传'},
    {path: '/archives/view/:edit/:pid/:id', name:'archivesView', component: ArchivesView,title:'橙单-简历'},
    {path: '/archives/permission', name:'archivesPermission', component: ArchivesPermission,title:'橙单-权限设置'},
    {path: '/archives/summary', name:'archivesSummary', component: ArchivesSummary,title:'橙单-人才盘点'},
    {path: '/archives/combo', name:'archivesCombo', component: ArchivesCombo,title:'橙单-套餐详情'},
		{path: '/404', name:'404',component: NotFound,title:'404'},
		{path:'*',name:'*',redirect:{path: '/position'}}
  ]

const router = new Router({
  mode: 'history',
  routes: routes
});

router.beforeEach((to, from, next) => {
  //设置头部标题
  //将子路由提出
  routes.forEach(x=>{
    if(x.children){
      x.children.forEach(y=>{
        routes.push(y);
      })
    }
  }) 
  document.title = routes.find((item)=>{return item.name == to.name}).title;


  let isLogin = Cookies.get('user_info');
  if(to.path == '/' || to.path == '/home'){
    //是否登录 登录直接跳转职位列表页
    if(_.isEmpty(isLogin)){
      next();
    }else{
      next({
        path:'/position'
      });
    }
  }else{
    next();
  }
});

export default  router;

