<template>
	<div class="app-container">
    <el-table
      class='t-table'
      stripe
      :data="tableData"
      style="width: 100%; text-align: center;"
    >
      <el-table-column prop="fmi" align="center" :label="$t('fmi.fmi')"></el-table-column>
      <el-table-column prop="faultLevel" align="center" :label="$t('fmi.faultLevel')"></el-table-column>
      <el-table-column prop="faultDes" align="center" :label="$t('fmi.desc')"></el-table-column>
    </el-table>
	</div>
</template>

<script>
import { queryCarFaultFmiList } from "@/api/business/businessService";

export default {
  name: 'Fmi',
  components: {

  },
  data () {
    return {
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    async getList() {
        let re = await queryCarFaultFmiList();
        this.tableData = re.data.list
    }
  }
}
</script>

<style scoped>

</style>
