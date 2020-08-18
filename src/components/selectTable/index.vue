<template>
  <span class="select-table">
    <el-form-item :prop="prop" :label="label">
      <el-input :style="{width: valueWidth}" clearable v-model="model" :placeholder="placeholder" v-on:click.native="openDialog"></el-input>
    </el-form-item>
    <el-dialog
      :title="tableTitle"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="800px"
    >
      <div class="search">
        <el-input class="params mr-10" clearable :value="querys[searchName]" @input="querys[searchName] = $event" placeholder="请输入关键字"></el-input>
        <el-button class="mr-10" @click="search(1)" type="primary" icon="el-icon-search">{{$t('common.research')}}</el-button>
        <el-button type="primary" @click="clear" icon="el-icon-delete">{{$t('common.clear')}}</el-button>
      </div>
      <el-table
        v-if="columnList.length > 0"
        @row-click="rowClick"
        :data="tableList"
        stripe
        style="width: 100%"
      >
        <el-table-column
          v-for="(item,index) in columnList"
          :type="item.type"
          :key="index"
          :label="item.title"
          :min-width="item.width"
        >
          <template slot-scope="scope">
            <span>{{item.type === 'index' ? scope.$index + 1 + (querys.page_number - 1) * querys.page_size : scope.row[item.prop]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="querys.page_number"
        :limit.sync="querys.page_size"
        @pagination="search"
      />
    </el-dialog>
  </span>
</template>

<script  lang="ts" >
import pagination from "../pagination.vue";
import { Component, Watch, Prop, PropSync, Vue } from "vue-property-decorator";
interface Icolumn {
  prop: string;
  title: string;
  width: string;
}
interface Iquery {
  page_number: number;
  page_size: number;
  [x: string]: any;
}

@Component({
  components: { pagination }
})
export default class SelectTable extends Vue {
  @Prop({ default: [] }) columnList: Array<Icolumn> | undefined;
  @Prop({ default: [] }) private tableList!: any;
  @Prop({}) private fn!: any;
  @Prop({ default: 0 }) private total!: number;
  @Prop({ default: "" }) private tableTitle!: string;
  @Prop({ default: "" }) private prop!: string;
  @Prop({ default: "" }) private label!: string;
  @Prop({ default: "" }) private placeholder!: string;
  @Prop({ default: "" }) private value!: string;
  @Prop({ default: "" }) private searchName!: string;
  @Prop({ default: "" }) private valueWidth!: string;

  @Watch("value")
  getValue(newVal:string,oldVal:string) {
    this.model = newVal
  }

  private querys: Iquery = {
    page_number: 1,
    page_size: 10,
    [this.searchName]: ""
  };
  private model: string = "";
  private dialogVisible: boolean = false;
  private clear() {
    this.querys = {
      page_number: 1,
      page_size: 10,
      [this.searchName]: ""
    };
    this.$emit("search", this.querys);
  }
  private search(type: number) {
    if (type === 1) this.querys.page_number = 1
    this.$emit("search", this.querys);
  }
  private openDialog() {
    this.dialogVisible = true;

    this.$emit("search", this.querys);
  }
  private rowClick(row: any) {
    this.model = row.label ? row.label : row.value; //value必传
    this.$emit("input", row.value);
    this.$emit("obj", row);
    this.dialogVisible = false;
  }
}
</script>

<style scoped lang="scss">
.select-table {
  .mr-10 {
    margin-right: 10px;
  }
  .search {
    // display: flex;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
    .params {
      width: 260px;
    }
  }
}
</style>
