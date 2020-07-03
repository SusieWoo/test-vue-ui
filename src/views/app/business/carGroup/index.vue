<template>
	<div class="app-container">
		<el-row>
      <el-col :span="24" class="filter-header mb5">
        <el-form :inline="true" :model="query">
          <el-col :span="24">
            <el-form-item label="车队名称：" label-width="120px">
              <el-input v-model="query.keyWord" placeholder="请输入车队名称" style="width: 220px"/>
            </el-form-item>
            <el-form-item label="是否企业：" label-width="120px">
              <el-select v-model="query.isCompany" placeholder="全部">
                <el-option label="是" :value="1"></el-option>
                <el-option label="不是" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否集团客户：" label-width="120px">
              <el-select v-model="query.isGroup" placeholder="全部">
                <el-option label="是" :value="1"></el-option>
                <el-option label="不是" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否VIP：" label-width="120px">
              <el-select v-model="query.isVip" placeholder="全部">
                <el-option label="是" :value="1"></el-option>
                <el-option label="不是" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="是否tboss创建：" label-width="120px">
              <el-select v-model="query.createType" placeholder="全部">
                <el-option label="是" :value="1"></el-option>
                <el-option label="不是" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="创建时间：" label-width="120px">
              <el-date-picker
                style="width: 100%"
                v-model="query.createStartTime"
                type="date"
                placeholder="选择合同开始日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsStart"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="至">
              <el-date-picker
                style="width: 100%"
                v-model="query.createEndTime"
                type="date"
                placeholder="选择合同结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptionsEnd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="search-btn-group">
            <el-col :span="24" style="text-align: right;">
              <el-form-item class="fr">
                <el-button type="primary" @click="getDriver">
                  查询
                </el-button>
                <el-button type="primary" @click="edit">
                  新建
                </el-button>
              </el-form-item>
            </el-col>
          </el-col>
        </el-form>
      </el-col>
		</el-row>
	</div>
</template>

<script>
export default {
    name: 'CarGroup',
    data () {
      return {
        pickerOptionsStart: {
          disabledDate: time => {
            let endDateVal = this.query.createEndTime
            if (endDateVal) {
              return time.getTime() > new Date(endDateVal).getTime();
            }
          }
        },
        pickerOptionsEnd: {
          disabledDate: time => {
            let beginDateVal = this.query.createStartTime
            if (beginDateVal) {
              return time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            }
          }
        },
        value6: '',
        query: {
          page_number: 1,
          page_size: 10,
          sortType: 0,
          createStartTime: null,
          createEndTime: null
        }
      }
    },
    methods: {
      getDriver () {
        console.log(this.query)
      },
      edit () {

      }
    }
}
</script>
