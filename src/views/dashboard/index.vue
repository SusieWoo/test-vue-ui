<template>
  <div class="home">
    <car-linkage :model.sync="chexing"
                 :vehicle.sync="chexi"
                 :discharge.sync="paifang" />
  </div>
</template>

<script>
// @ is an alias to /src
import Bus from '@/common/bus.ts';
import carLinkage from '@/components/carLinkage/carLinkage.vue';

Bus.$on('XXXX-a', data => { });

export default {
  name: 'Dashboard',
  components: {
    carLinkage
  },
  data () {
    return {
      chexing: '',
      chexi: '',
      paifang: '',

      qqqqq: '',

      qqqqqList: []
    };
  },
  mounted () {
    setTimeout(() => {
      Bus.$emit('XXXX-a', {
        res: 1111
      });
    }, 1000);
  },
  destroyed () { },
  methods: {
    output (val) {
      console.log(val);
    },
    arrOpen (arr) {
      const peak = arr.map(item => {
        return { id: item, label: item };
      });
      return peak;
    }
  }
};
</script>

<style scoped>
.qqq {
  color: blue;
}
</style>