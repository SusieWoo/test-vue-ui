import config from '../configs'

const pageMap:any = {
  'login': config.loginUrl,
  'regist': config.registUrl,
}

var scrollTimer:any = null

var page = {
  // 切换页面，并错误提示
  turnPage: (message:any, url:string) => {
    if (message) {
      alert(message)
    }
    if (url) {
      if (pageMap[url]) {
        url = pageMap[url]
      }
      window.location.href = url
    }
  },
  // 确定导航tab页，是否show nav
  showNav: (path:string) => {
    switch (path) {
      case '/':
        return true
      case '/session':
        return true
      case '/contacts':
        return true
      case '/general':
        return true
      default:
        return false
    }
  },
  // 滚动聊天列表到底部
  scrollChatListDown: (pos:any, initCount:any) => {
    let dom = document.getElementById('chat-list')
    if (!dom) {
      return
    }
    let maxCount = 5
    initCount = initCount || 1
    if (typeof pos !== 'number') {
      pos = Math.max(dom.scrollHeight - dom.clientHeight, 888888)
    }
    dom.scrollTop = pos
    if ((dom.scrollTop < pos) && (initCount < maxCount)) {
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        initCount++
        page.scrollChatListDown(pos, initCount)
      }, 500)
    }
  },
  getChatListHeight: () => {
    let dom = document.getElementById('chat-list') as HTMLElement
    return dom.scrollHeight
  },
  getChatListScroll: () => {
    let dom = document.getElementById('chat-list') as HTMLElement
    return dom.scrollTop
  },
}

export default page
