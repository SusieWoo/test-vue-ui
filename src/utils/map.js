import revgeocode from '@/api/map.ts'

// 输入点集合转化为Point[]
const polylineData = function(points) {
  var data = new window.H.geo.LineString()
  if (points && points.length > 0) {
    points.map((item, index) => (
      data.pushPoint(new H.geo.Point(item.lat, item.lon))
    ))
    return data
  } else {
    return []
  }
}

// Polyline
const polylineArray = function(item) {
  return new H.map.Polyline(
    polylineData(item.points),
    { style: {
      strokeColor: item.color,
      lineWidth: 6
    }}
  )
}

// 新建point
const setPoint = point => {
  return new H.geo.Point(point.lat, point.lon)
}

// 新建icon
// icon.eventOptions {onAttach: function, onDetach: function}
const setDomIcon = icon => {
  // 图标必须放在div中 否则旋转失效, 原因：地图渲染对于 dom 元素会使用 transform 属性进行计算元素位置
  const domDivIcon = document.createElement('div')
  domDivIcon.style.marginTop = `-${icon.style.height.split('px')[0] / 2}px`
  domDivIcon.style.marginLeft = `-${icon.style.width.split('px')[0] / 2}px`
  const domIcon = document.createElement('img')
  domIcon.src = icon.url
  if (typeof icon.style === 'string') {
    domIcon.style.cssText = icon.style
  } else {
    Object.keys(icon.style).forEach(key => {
      domIcon.style.setProperty(key, icon.style[key])
    })
  }
  domDivIcon.append(domIcon)
  return new H.map.DomIcon(domDivIcon, icon.eventOptions)
}

// 新建marker
const setMarker = (point, icon) => {
  let Marker = null
  if (icon && icon.url) {
    const myIcon = new H.map.Icon(icon.url, { size: new H.math.Size(icon.width, icon.height) })
    Marker = new H.map.Marker(setPoint(point), { icon: myIcon })
  } else if (icon instanceof H.map.DomIcon) {
    Marker = new H.map.DomMarker(setPoint(point), { icon: icon })
  } else {
    Marker = new H.map.Marker(setPoint(point))
  }
  return Marker
}

const setCenter = (map, point, level) => {
  map.setCenter(new H.geo.Point(point.lat, point.lon))
  map.setZoom(level)
}

const setCenterByL = (map, lng, lat, level) => {
  map.setCenter(new H.geo.Point(lat, lng))
  map.setZoom(level)
}

const speedColors = [
  { key: '#FFC94E', name: '0~30km/h' },
  { key: '#FF8500', name: '30~60km/h' },
  { key: '#44E4A6', name: '60~80km/h' },
  { key: '#2BB5FE', name: '80~100km/h' },
  { key: '#C75EFA', name: '>100km/h' }
]
const autoColors = [
  { key: '#fa0000', name: '智能驾驶' },
  { key: '#0dc207', name: '人工驾驶' }
]

// type=0 区分速度；type=1 区分智能驾驶
const colorType = (points, type) => {
  // result：存储多段轨迹对象（颜色，点数组）
  const result = []
  // obj：存储每段轨迹点对象（颜色，点数组）
  let obj = { color: '', points: [] }
  // prevSpeedLevel:上一个点的速度级别
  let prevSpeedLevel = null
  // speedLevel：当前点的数度级别
  let speedLevel = 0
  // 轨迹点index
  let i = null
  const comm = (color, type) => {
    speedLevel = type
    // 保证每段轨迹有两个点
    obj.points.push(points[i])
    // 1.第一个点初始化本段轨迹颜色
    // 2.数度级别不变保持颜色
    // 3.更换数度级别后，先存储上一段轨迹到总轨迹，再初始化下一段轨迹颜色

    if (prevSpeedLevel === speedLevel || prevSpeedLevel === null) {
      obj.color = color
      if ((points.length !== 0) && (i === points.length - 1)) {
        result.push(obj)
      }
    } else {
      /* 本段轨迹输出*/
      result.push(obj)
      /* 初始化下一段轨迹对象*/
      obj = { color: color, points: [points[i]] }
    }
    if (obj.points.length === points.length && points.length !== 0) {
      // 所有点都是同一个速度时，result只有一个元素
      result.push(obj)
    }
    prevSpeedLevel = speedLevel
  }
  if (type === 0) {
    for (i = 0; i < points.length; i++) {
      const speed = parseInt(points[i].speed)
      if (speed < 30) {
        comm(speedColors[0].key, 0)
      } else if (speed >= 30 && speed < 60) {
        comm(speedColors[1].key, 1)
      } else if (speed >= 60 && speed < 80) {
        comm(speedColors[2].key, 2)
      } else if (speed >= 80 && speed < 100) {
        comm(speedColors[3].key, 3)
      } else {
        comm(speedColors[4].key, 4)
      }
    }
  } else if (type === 1) {
    for (i = 0; i < points.length; i++) {
      const autoDriverFlag = points[i].autoDriverFlag
      if (autoDriverFlag) {
        comm(autoColors[0].key, 0)
      } else {
        comm(autoColors[1].key, 1)
      }
    }
  }

  return result
}
// 速度区分轨迹
const speedColor = points => {
  return colorType(points, 0)
}
// 智能驾驶区分轨迹
const autoColor = points => {
  return colorType(points, 1)
}

const getPopCard = options => {
  const customPopCard = document.createElement('div')
  customPopCard.id = 'customPopCard'
  customPopCard.style.cssText = 'font-size:12px;width:200px;line-height:12px;'
  const header = document.createElement('div')
  header.style.cssText = 'display: flex;flex-direction: row;justify-content: space-between;border-bottom: 1px solid #293C63;'
  const title = document.createElement('div')
  title.style.cssText = 'display: flex;flex-direction: row;' + options.autoState ? 'color: #48CF4D;' : 'color: #fff;'
  title.innerHTML = `<div style="margin-top: 2px; margin-right: 7px;"><img src="@/assets/images/car-card.png" width="20px" height="12px"></div><div style="margin-top: 2px;">${options.title}</div>`
  header.appendChild(title)
  const body = document.createElement('div')
  body.style.cssText = 'border-bottom: 1px solid #293C63;line-height: 25px;font-size: 12px;'
  body.innerHTML = `<div>所属机构：111</div>
      <div>当前速度：111km/h</div>
      <div>当前油耗：111L/100km</div>
      <div>上报时间：111</div>
      <div>当前状态：人工驾驶</div>`
  customPopCard.appendChild(header)
  customPopCard.appendChild(body)
  return customPopCard
}

const getRevGeocode = ({ lat, lng }) => {
  return new Promise((resolve) => {
    revgeocode.revgeocode(lng, lat).then(data => {
      const { items } = data
      if (items && items.length > 0) {
        resolve(items[0])
      }
    })
  })
}
export default {
  polylineData,
  polylineArray,
  setMarker,
  setPoint,
  setDomIcon,
  speedColor,
  autoColor,
  speedColors,
  autoColors,
  setCenter,
  setCenterByL,
  getPopCard,
  getRevGeocode
}
