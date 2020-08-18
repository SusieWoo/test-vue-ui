//im
export const cookie = {
  //写cookies
  setCookie: function (name: string, value: string) {
    let days = 1
    let exp = new Date()
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toUTCString()
  },
  //读取cookies
  readCookie: function (name: string) {
    let arr = null
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if (document.cookie && (arr = document.cookie.match(reg))) {
      return unescape(arr[2])
    } else {
      return null;
    }
  },
  //删除cookies
  delCookie: function (name: string) {
    let cval = this.readCookie(name)
    if (cval != null) {
      document.cookie = name + '=' + cval + ';expires=' + (new Date(0)).toUTCString()
    }
  }
}