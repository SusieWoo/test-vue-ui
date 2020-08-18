export function createPoint(H, options = {}) {
  const { lng, lat } = options
  return new H.geo.Point(lat, lng)
}

export function createSize(H, options = {}) {
  const { width, height } = options
  return new H.math.Size(width, height)
}

export function createIcon(H, options = {}) {
  // TODO hitArea/crossOrigin/stickHeight/stickColor
  const { url, size, opts = {}} = options
  return new H.map.Icon(url, {
    size: createSize(H, size),
    anchor: opts.anchor && createSize(H, opts.anchor)
  })
}

// eventOptions {onAttach: function, onDetach: function}
export function createDomIcon(H, options = {}) {
  const { url, size, style, eventOptions } = options
  // 图标必须放在div中 否则旋转失效, 原因：地图渲染对于 dom 元素会使用 transform 属性进行计算元素位置
  const domDivIcon = document.createElement('div')
  domDivIcon.style.marginTop = `-${size.height.split('px')[0] / 2}px`
  domDivIcon.style.marginLeft = `-${size.width.split('px')[0] / 2}px`
  const domIcon = document.createElement('img')
  domIcon.src = url
  Object.keys(style).forEach(key => {
    domIcon.style.setProperty(key, style[key])
  })
  domDivIcon.append(domIcon)
  return new H.map.DomIcon(domDivIcon, eventOptions)
}
