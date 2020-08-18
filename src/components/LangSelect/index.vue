<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon name="language" class="international-icon" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'" command="zh">简体中文</el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en">English</el-dropdown-item>
      <el-dropdown-item :disabled="language==='tl'" command="tl">Pilipino</el-dropdown-item>
      <el-dropdown-item :disabled="language==='vi'" command="vi">Tiếng Việt</el-dropdown-item>
      <el-dropdown-item :disabled="language==='ha'" command="ha">هَوُسَ</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AppModule } from "@/store/modules/app";
import i18n from '@/lang/index'
@Component({
  name: "LangSelect"
})
export default class extends Vue {
  get language() {
    return AppModule.language;
  }

  private handleSetLanguage(lang: string) {
    this.$i18n.locale = lang;
    AppModule.SetLanguage(lang);
    this.$message({
      message: "Switch Language Success",
      type: "success"
    });
  }
}
</script>
