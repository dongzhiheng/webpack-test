/**
 * Created by qixin on 2017/3/29.
 */
//解析地址
export var sUrl = window.location.href;
export function getQuery(url, name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = url.substr(url.indexOf("?") + 1).match(reg);
  if (r != null) return decodeURI(r[2]); return null;
}
//消除字符串空格 
export function ltrim(str) {
  return str.replace(/^\s*/g, "");
}
export function rtrim(str) {
  return str.replace(/\s*$/g, "");
}
export function trim(str) {
  return str.replace(/^\s*|\s*$/g, "");
}
// 转化时间格式
// Date.prototype.format
export function format(date,fmt) {
     var o = { 
        "M+" : date.getMonth()+1,                 //月份 
        "d+" : date.getDate(),                    //日 
        "h+" : date.getHours(),                   //小时 
        "m+" : date.getMinutes(),                 //分 
        "s+" : date.getSeconds(),                 //秒 
        "q+" : Math.floor((date.getMonth()+3)/3), //季度 
        "S"  : date.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
     for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt; 
}
//Stroage
export let User = {};
export let Account1 = {},Account2 = {},Account3 = {},Account4 = {},Account5 = {},Account6 = {},Edu ={},Check1 ={},Check2 ={},Check3 ={},Check4 ={};
export function set(key, val, type) {
  var type = type || "local",
    val = val || "";
  type = (type.toLowerCase() != "local" || type.toLowerCase() != "session") ? 'local' : type;
  if (type.toLowerCase() == "local")
    window.localStorage.setItem(key, val);
  else
    window.sessionStorage.setItem(key, val);
};
export function get(key, type) {
  var type = type || "local";
  type = (type.toLowerCase() != "local" || type.toLowerCase() != "session") ? 'local' : type;
  if (type.toLowerCase() == "local")
    return window.localStorage.getItem(key);
  else
    return window.sessionStorage.getItem(key);
};
export function deletes(key, type){
  var type = type || "local";
  type = (type.toLowerCase() != "local" || type.toLowerCase() != "session") ? 'local' : type;
  if (type.toLowerCase() == "local")
    window.localStorage.removeItem(key);
  else
    window.sessionStorage.removeItem(key);
};
export function clear(type) {
  var type = type || "local";
  type = (type.toLowerCase() != "local" || type.toLowerCase() != "session") ? 'local' : type;
  if (type.toLowerCase() == "local")
    window.localStorage.clear();
  else
    window.sessionStorage.clear();
};
