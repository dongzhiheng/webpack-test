import axios from 'axios';
import qs from 'qs';
import {
  Message
} from 'element-ui';
import Cookies from 'js-cookie'

function Ejax() {
  this.request = function () {
    return axios({
      url: this.url,
      method: this.method,
      data: qs.stringify(this.data),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      withCredentials: true
    });
  }
  this.get = function (url, data) {
    this.method = 'get';
    this.url = url;
    this.data = data;
    return this.request();
  }
  this.post = function (url, data) {
    this.method = 'post';
    this.url = url;
    this.data = data;
    return this.request();
  }
}
let ERROR_CODE_SIGNATURE_ERROR = 100011;
axios.interceptors.response.use(function (response) {
  //对响应数据做些事
  if (response.data.err_no == "0") {
    return response;
  } else {
    if (response.data.err_no == ERROR_CODE_SIGNATURE_ERROR) {
      let from = window.location.href;
	  Cookies.remove('user_info');
      Message({
        title: '错误',
        message: response.data.err_msg,
        onClose() {
          window.location.href = '/home' + '?refer=' + from;
        }
      });
    }
    return Promise.reject(response);
  }

}, function (error) {
  //请求错误时做些事
  return Promise.reject(error.response);
});

export default new Ejax();
