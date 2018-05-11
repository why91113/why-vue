<template>
  <div class="components-view clear-f">
    <h2 class="tc">组件演示</h2>
    <el-menu :default-active="$route.path" class="main-menu">
      <el-menu-item v-for="item in menus" :key="item.path" :index="rootPath + '/' + item.path" @click="$router.push(rootPath + '/' + item.path)">
        <i class="el-icon-menu"></i>
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
    </el-menu>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'components-list',
  data () {
    window.vue = this
    let menus = []
    let rootPath = ''
    try {
      let componentsList = this.$router.options.routes.filter(a => a.name === 'ComponentsList')[0]
      rootPath = componentsList.path
      menus = componentsList.children
    } catch (e) { }
    return {
      menus,
      rootPath
    }
  }
}
</script>

<style lang="scss">
.components-view {
  h2 {
    font-size: 24px;
    font-weight: bold;
    line-height: 72px;
    border-bottom: 1px solid #ddd;
  }
  .main-menu {
    width: 199px;
    float: left;
  }
  .main-content {
    margin-left: 200px;
    padding: 15px;
  }
  .title {
    font-size: 18px;
    line-height: 36px;
  }
}
</style>
