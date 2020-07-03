/**
 * 自定义表单校验方法 && 基于element-ui 封装的全局自定义校验规则
 */
export const checkString = (rule: any, value: any, callback: any) => { //校验非法字符
  const reg = /[@#\$%\^&\*\!~`'",:+=?\\]+/g
  if (reg.test(value)) {
    return callback(new Error('含有非法字符，请重新输入'))
  } else {
    callback()
  }
}
