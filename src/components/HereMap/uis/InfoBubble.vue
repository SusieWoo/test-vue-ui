<template>
  <div>
    <slot />
  </div>
</template>

<script>
import commonMixin from '@/components/HereMap/base/mixins/common'
import { createPoint } from '@/components/HereMap/base/factory'

export default {
  name: 'HInfoBubble',
  mixins: [commonMixin('infoBubble')],
  props: {
    position: {
      required: true
    }
  },
  watch: {
    'position.lng'(val, oldVal) {
      const { H, originInstance, position, renderByParent, $parent, $slots } = this
      if (val !== oldVal && val >= -180 && val <= 180) {
        const point = createPoint(H, { lng: val, lat: position.lat })
        originInstance && originInstance.setPosition(point) && originInstance.setContent($slots.default[0].elm)
      }
      renderByParent && $parent.reload()
    },
    'position.lat'(val, oldVal) {
      const { H, originInstance, position, renderByParent, $parent, $slots } = this
      if (val !== oldVal && val >= -74 && val <= 74) {
        const point = createPoint(H, { lng: position.lng, lat: val })
        originInstance && originInstance.setPosition(point) && originInstance.setContent($slots.default[0].elm)
      }
      renderByParent && $parent.reload()
    }
  },
  methods: {
    load() {
      const { H, ui, position, renderByParent, $parent, $slots } = this
      const bubble = new H.ui.InfoBubble(createPoint(H, position), {
        // read custom data
        content: $slots.default[0].elm
      })
      bubble.close()
      this.originInstance = bubble
      // show info bubble
      if (renderByParent) {
        $parent.reload()
      } else {
        ui.addBubble(bubble)
      }
    }
  }
}
</script>

<style scoped>

</style>
