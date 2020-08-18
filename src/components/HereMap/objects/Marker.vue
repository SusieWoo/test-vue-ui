<template>
  <div>
    <slot name="infoBubble" />
  </div>
</template>

<script>
import commonMixin from '../base/mixins/common.js'
import { createIcon, createPoint } from '../base/factory.js'

export default {
  name: 'HMarker',
  mixins: [commonMixin('object')],
  props: {
    position: {},
    icon: {},
    // The minimum zoom level at which the object is visible
    min: {
      type: Number,
      default: -Infinity
    },
    // The maximum zoom level at which the object is visible
    max: {
      type: Number,
      default: Infinity
    },
    draggable: {
      type: Boolean,
      default: false
    },
    visibility: {
      type: Boolean,
      default: true
    },
    volatility: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    'position.lng'(val, oldVal) {
      const { H, originInstance, originUIBubble, position, renderByParent, $parent, $slots } = this
      if (val !== oldVal && val >= -180 && val <= 180) {
        const point = createPoint(H, { lng: val, lat: position.lat })
        originInstance.getObjects()[0].setGeometry(point)
        originUIBubble && originUIBubble.setPosition(point) && originUIBubble.setContent($slots.infoBubble[0].elm)
      }
      renderByParent && $parent.reload()
    },
    'position.lat'(val, oldVal) {
      const { H, originInstance, originUIBubble, position, renderByParent, $parent, $slots } = this
      if (val !== oldVal && val >= -74 && val <= 74) {
        const point = createPoint(H, { lng: position.lng, lat: val })
        originInstance.getObjects()[0].setGeometry(point)
        originUIBubble && originUIBubble.setPosition(point) && originUIBubble.setContent($slots.infoBubble[0].elm)
      }
      renderByParent && $parent.reload()
    },
    icon: {
      deep: true,
      handler(val) {
        const { H, originInstance } = this
        originInstance && originInstance.getObjects()[0].setIcon(createIcon(H, val))
      }
    },
    draggable(val) {
      this.volatility = val
      this.originInstance.draggable = val
      const { H, map, behavior } = this
      if (val) {
        // Add event listeners for marker movement
        map.addEventListener('dragstart', evt => {
          if (evt.target instanceof H.map.Marker) behavior.disable()
        }, false)
        map.addEventListener('dragend', evt => {
          if (evt.target instanceof H.map.Marker) {
            behavior.enable()
          }
        }, false)
        map.addEventListener('drag', evt => {
          const pointer = evt.currentPointer
          if (evt.target instanceof H.map.Marker) {
            evt.target.setGeometry(map.screenToGeo(pointer.viewportX, pointer.viewportY))
          }
        }, false)
      } else {
        map.removeEventListener('dragstart')
        map.removeEventListener('dragend')
        map.removeEventListener('drag')
      }
    },
    visibility(val) {
      this.originInstance.setVisibility(val)
    },
    volatility(val) {
      this.originInstance.setVolatility(val)
    },
    zIndex(val) {
      this.originInstance.setZIndex(val)
    }
  },
  methods: {
    load() {
      const { H, map, ui, behavior, position, icon, min, max, visibility, volatility, draggable, zIndex, renderByParent, $parent, $slots } = this
      // A group is a container for other map objects.
      const group = new H.map.Group()
      const object = new H.map.Marker(createPoint(H, position), {
        icon: icon && createIcon(H, icon),
        min,
        max,
        visibility,
        volatility: draggable || volatility,
        zIndex
      })
      // has infoBuddle
      if ($slots.infoBubble) {
        let bubble
        const that = this
        group.addEventListener('tap', function(evt) {
          // event target is the marker itself, group is a parent event target
          // for all objects that it contains
          if (!bubble) {
            bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
              // read custom data
              content: evt.target.getData()
            })
            // show info bubble
            ui.addBubble(bubble)
            that.originUIBubble = bubble
          } else {
            bubble.open()
          }
        }, false)
        object.setData($slots.infoBubble[0].elm)
      }
      // draggable
      if (draggable) {
        object.draggable = draggable
        // Add event listeners for marker movement
        map.addEventListener('dragstart', evt => {
          if (evt.target instanceof H.map.Marker) behavior.disable()
        }, false)
        map.addEventListener('dragend', evt => {
          if (evt.target instanceof H.map.Marker) {
            behavior.enable()
          }
        }, false)
        map.addEventListener('drag', evt => {
          const pointer = evt.currentPointer
          if (evt.target instanceof H.map.Marker) {
            evt.target.setGeometry(map.screenToGeo(pointer.viewportX, pointer.viewportY))
          }
        }, false)
      }
      this.originInstance = group
      if (renderByParent) {
        $parent.reload()
      } else {
        group.addObject(object)
        map.addObject(group)
      }
    }
  }
}
</script>

<style scoped>

</style>
