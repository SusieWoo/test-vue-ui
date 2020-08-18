const types = {
  control: {
    unload: 'removeControl'
  },
  object: {
    unload: 'removeObject'
  }
}

const getParent = $component => ($component.abstract || $component.$el === $component.$children[0].$el) ? getParent($component.$parent) : $component

function destroyInstance() {
  const { unload, renderByParent, $parent } = this
  if (renderByParent) {
    $parent.reload()
  }
  unload()
}

class Mixin {
  constructor(prop) {
    this.methods = {
      ready() {
        const $parent = getParent(this.$parent)
        const H = this.H = $parent.H
        const map = this.map = $parent.map
        const ui = this.ui = $parent.ui
        const behavior = this.behavior = $parent.behavior
        this.load()
        this.$emit('ready', {
          H,
          map,
          ui,
          behavior
        })
      },
      transmitEvent(e) {
        this.$emit(e.type.replace(/^on/, ''), e)
      },
      reload() {
        this && this.H && this.$nextTick(() => {
          this.unload()
          this.$nextTick(this.load)
        })
      },
      unload() {
        const { map, ui, originInstance, originInstanceName, originUIBubble } = this
        try {
          switch (prop.type) {
            case 'control':
              ui.removeControl(originInstanceName)
              break
            case 'infoBubble':
              ui.removeBubble(originInstance)
              break
            default:
              map[types[prop.type].unload](originInstance)
              ui.removeBubble(originUIBubble)
          }
        } catch (e) {
          // console.log(e)
        }
      }
    }
    this.computed = {
      renderByParent() {
        return this.$parent.preventChildrenRender
      }
    }
    this.mounted = function() {
      const $parent = getParent(this.$parent)
      const map = $parent.map
      const { ready } = this
      map ? ready() : $parent.$on('ready', ready)
    }
    this.destroyed = destroyInstance
    this.beforeDestroy = destroyInstance
  }
}

export default type => new Mixin({ type })
