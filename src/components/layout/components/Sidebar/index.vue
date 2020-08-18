<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu :collapse="isCollapse"
             :background-color="variables.menuBg"
             :text-color="variables.menuText"
             :active-text-color="variables.menuActiveText"
             :unique-opened="true"
             :collapse-transition="false"
             mode="vertical">
      <sidebar-item v-for="route in routes"
                    :key="route.path"
                    :item="route"
                    :base-path="route.path"
                    :is-collapse="isCollapse" />
    </el-menu>
  </el-scrollbar>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AppModule } from '@/store/modules/app'
import { PermissionModule } from '@/store/modules/permission'
import SidebarItem from './SidebarItem.vue'
import variables from '@/styles/_variables.scss'
import { UserModule } from '@/store/modules/user'

@Component({
  name: 'SideBar',
  components: {
    SidebarItem
  }
})
export default class extends Vue {
  get sidebar() {
    return AppModule.sidebar
  }

  get routes() {
    const data = this.addAttr(PermissionModule.routes)
    return data
  }

  get variables() {
    return variables
  }

  get isCollapse() {
    return !this.sidebar.opened
  }

  private addAttr(data: any) {
    for (let j = 0; j < data.length; j++) {
      if (UserModule.roles.indexOf(data[j].roleId) !== -1) {
        data[j].isShow = true
      } else {
        //TODO
        data[j].isShow = true
      }
      if (data[j].children) {
        if (data[j].children.length > 0) {
          this.addAttr(data[j].children)
        }
      }
    }
    return data
  }
}
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
