
import utils from '@/utils/map'
export default {
  update: function (el, binding, vnode) {
    console.log('update',binding);
    if (!binding.value.lat || !binding.value.lng) {
      el.innerHTML =""
    } else {
      utils.getRevGeocode({ lat: binding.value.lat, lng: binding.value.lng }).then(res => {
        console.log(res.title);
        el.innerHTML = res.title || ""
      })
    }
  }
}
