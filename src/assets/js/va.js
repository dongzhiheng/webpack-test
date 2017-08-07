/**
 * Created by qixin on 2017/4/7.
 */
//验证数字
export function isNumber(num){
  return /^[0-9]+(\.\d+)?$/.test(num);
};
//验证手机号
export function isPhone(phone){
  return (this.length == 11 && /^(1\d{10})$/.test(phone));
};
