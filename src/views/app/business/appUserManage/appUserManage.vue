<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "AppUserManage"
})
export default class extends Vue {}
</script>
