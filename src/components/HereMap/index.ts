import HMap from './map/Map.vue'
import HMarker from './objects/Marker.vue'
import HDomMarker from './objects/DomMarker.vue'
import HInfoBubble from './uis/InfoBubble.vue'

const protoInstall = {
    install: (Vue: any, options: any) => {
        const { apiKey, customUICss = false } = options
        Vue.prototype._HMap = () => ({ apiKey, customUICss })
        Vue.component('h-map', HMap)
        Vue.component('h-marker', HMarker)
        Vue.component('h-dom-marker', HDomMarker)
        Vue.component('h-info-bubble', HInfoBubble)
    }
}

export { HMap, HMarker, HDomMarker, HInfoBubble }

export default protoInstall
