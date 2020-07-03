<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "AppConfig"
})
export default class extends Vue {}
</script>
