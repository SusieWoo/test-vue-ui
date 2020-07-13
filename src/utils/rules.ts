/**
 * 自定义表单校验方法 && 基于element-ui 封装的全局自定义校验规则
 */
//非法字符
export const checkString = (rule: any, value: any, callback: any) => {
  const reg = /[@#\$%\^&\*\!~`'",:+=?\\]+/g
  if (reg.test(value)) {
    return callback(new Error('含有非法字符，请重新输入'))
  } else {
    callback()
  }
}
//url地址
export const checkUrl = (rule: any, value: any, callback: any) => {
  const reg = /^(https|http|ftp|mms)?:\/\//
  if (!reg.test(value)) {
    return callback(new Error('链接地址不正确，请重新输入'))
  } else {
    callback()
  }
}
//正整数
export const Num = (rule: any, value: any, callback: any) => {
  const reg = /^[1-9]\d*$/
  if (!reg.test(value)) {
    return callback(new Error('只能输入正整数'))
  } else {
    callback()
  }
}

//6位颜色色号(实际是十六进制数)
export const checkColor = (rule: any, value: any, callback: any) => {
  const reg = /^[0-9a-fA-F]{6}$/
  if (!reg.test(value)) {
    return callback(new Error('请输入6位a-f字母和数字的任意组合'))
  } else {
    callback()
  }
}
//邮箱格式
export const validateEmail = (rule: any, value: any, callback: any) => {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
  if (!reg.test(value)) {
    return callback(new Error('邮箱格式不正确'))
  } else {
    callback()
  }
}