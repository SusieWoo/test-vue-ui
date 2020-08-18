import Vue from 'vue'
import {ImModule} from "@/im/store/modules/im";

if(!Function.prototype.bind){
  Function.prototype.bind = function(){
    var fn = this, args = Array.prototype.slice.call(arguments), object = args.shift();
    return function(){
      return fn.apply(object, args.concat(Array.prototype.slice.call(arguments)));
    }
  }
}

let Utils = Object.create(null)

Utils.encode = function (_map:any, _content:any) {
  _content = '' + _content
  if (!_map || !_content) {
    return _content||''
  }
  return _content.replace(_map.r, function ($1:any) {
    var _result = _map[!_map.i ? $1.toLowerCase() : $1]
    return _result != null ? _result : $1
  });
};
Utils.getType = function (type: any) {
  //'image' ? 'PICTURE' : 'TEXT'
  switch (type) {
    case 'image' : return 'PICTURE'
    case 'text' : return 'TEXT'
    case 'audio' : return 'AUDIO'
    case 'video' : return 'VIDEO'
  }
}

const delayTime = 120000 // 消息时间显示间隔
Utils.parseMsgTime = function () {
  return ImModule.current_session.list.map((item: any, index: number, arr: any) => {
    if (index === 0 || (item.time - arr[index - 1].time) > delayTime) {
      item['refreshTime'] = this.formatDate(item.time)
    }
    return item
  })
}


//TODO
Utils.escape = (function () {
  let _reg = /<br\/?>$/
  let _map = {
    r:/\<|\>|\&|\r|\n|\s|\'|\"/g,
    '<':'&lt;',
    '>':'&gt;',
    '&':'&amp;',
    ' ':'&nbsp;',
    '"':'&quot;',
    "'":'&#39;',
    '\n':'<br/>',
    '\r':''
  }
  return function(_content:any){
    _content = Utils.encode(_map, _content)
    return _content.replace(_reg, '<br/>');
  };
})();

//TODO
// 消息类型列表
Utils.mapMsgType = function (type:any) {
  type = type.toLowerCase()
  let map:any = {
    text: '文本消息',
    image: '[图片]',
    file: '[文件]',
    audio: '[语音]',
    video: '[视频]',
    geo: '[地理位置]',
    tip: '[提醒]',
    custom: '[自定义]',
    notification: '[系统通知]'
  }
  return map[type] || '未知消息类型'
}

Utils.stringifyDate = function (datetime: any, simple = false) {
  // let weekMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let weekMap = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  datetime = new Date(datetime)
  let year = datetime.getFullYear()
  let simpleYear = datetime.getYear() - 100
  let month = datetime.getMonth() + 1
  month = month > 9 ? month : '0' + month
  let day = datetime.getDate()
  day = day > 9 ? day : '0' + day
  let hour = datetime.getHours()
  hour = hour > 9 ? hour : '0' + hour
  let min = datetime.getMinutes()
  min = min > 9 ? min : '0' + min
  let week = datetime.getDay()
  week = weekMap[week]
  let thatDay = (new Date(year, month - 1, day, 0, 0, 0)).getTime()

  if (simple) {
    return {
      withYear: `${day}/${month}/${simpleYear}`,
      withMonth: `${month}-${day}`,
      withDay: `${week}`,
      withLastDay: `昨天`,
      withHour: `${hour}:${min}`,
      thatDay
    }
  } else {
    return {
      withYear: `${year}-${month}-${day} ${hour}:${min}`,
      withMonth: `${month}-${day} ${hour}:${min}`,
      withDay: `${week} ${hour}:${min}`,
      withLastDay: `昨天 ${hour}:${min}`,
      withHour: `${hour}:${min}`,
      thatDay
    }
  }
}
/* 格式化日期 */ //TODO
Utils.formatDate = function (datetime:any, simple = false) {
  let tempDate = (new Date()).getTime()
  let result = this.stringifyDate(datetime, simple)
  let thatDay = result.thatDay
  let deltaTime = (tempDate - thatDay) / 1000

  if (deltaTime < 3600 * 24) {
    return result.withHour
  } else if (deltaTime < 3600 * 24 * 2) {
    return result.withLastDay
  } else if (deltaTime < 3600 * 24 * 7) {
    return result.withDay
  } else if (deltaTime < 3600 * 24 * 30) {
    return result.withMonth
  } else {
    return result.withYear
  }
}

//TODO
Utils.parseCustomMsg = function (msg:any) {
  if (msg.type === 'custom') {
    try {
      let cnt = JSON.parse(msg.content)
      switch (cnt.type) {
        case 1:
          return '[猜拳消息]'
        case 2:
          return '[阅后即焚]'
        case 3:
          return '[贴图表情]'
        case 4:
          return '[白板消息]'
      }
    } catch (e) {}
    return '[自定义消息]'
  }
  return ''
}

export default Utils
