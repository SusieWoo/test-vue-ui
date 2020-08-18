/**
 * 自定义表单校验方法 && 基于element-ui 封装的全局自定义校验规则
 */
import i18n from '@/lang'
let lang:any = i18n

//非法字符
export const checkString = (rule: any, value: any, callback: any) => {
  const reg = /[@#\$%\^&\*\!~`'",:+=?\\]+/g
  if (reg.test(value)) {
    return callback(new Error(lang.t('common.rules.checkString')))
  } else {
    callback()
  }
}
//url地址
export const checkUrl = (rule: any, value: any, callback: any) => {
  const reg = /^(https|http|ftp|mms)?:\/\//
  if (!reg.test(value)) {
    return callback(new Error(lang.t('common.rules.checkUrl')))
  } else {
    callback()
  }
}
//正整数
export const Num = (rule: any, value: any, callback: any) => {
  const reg = /^[1-9]\d*$/
  if (!reg.test(value)) {
    return callback(new Error(lang.t('common.rules.Num')))
  } else {
    callback()
  }
}

//6位颜色色号(实际是十六进制数)
export const checkColor = (rule: any, value: any, callback: any) => {
  const reg = /^[0-9a-fA-F]{6}$/
  if (!reg.test(value)) {
    return callback(new Error(lang.t('common.rules.checkColor')))
  } else {
    callback()
  }
}
//邮箱格式
export const validateEmail = (rule: any, value: any, callback: any) => {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
  if (!reg.test(value)) {
    return callback(new Error(lang.t('common.rules.validateEmail')))
  } else {
    callback()
  }
}

export const objToStringFy = (obj: any) => {

  for (let i in obj) {
    if (obj[i] instanceof Object) {
      obj[i] = JSON.stringify(obj[i]);
    }
  }
  return obj
}

// 16位数字或字母组合校验
export const letterOrNumber16 = (rule: any, value: any, callback: any) => {
  const reg = /^[a-zA-Z0-9]{1,16}$/
  if (!reg.test(value)) {
    return callback(new Error(lang.t('common.rules.letterOrNumber16')))
  } else {
    callback()
  }
}

// 11位手机号
export const mobilePhone = (rule: any, value: any, callback: any) => {
  const reg = /^[1][0-9]{10}$/
  if (!reg.test(value)) {
    return callback(new Error(lang.t('common.rules.mobilePhone')))
  } else {
    callback()
  }
}

// 联系方式 通用校验 只要是数字即可
export const publicTel = (rule: any, value: any, callback: any) => {
  const reg = /^\d+$/
  if (!reg.test(value)) {
    return callback(new Error(lang.t('common.rules.publicTel')))
  } else {
    callback()
  }
}
