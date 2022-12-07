<template>
  <div id="app">
    <van-nav-bar :title="$route.meta.title" v-if="$route.meta.showFooter" placeholder fixed safe-area-inset-top
                 class="title-bar">
    </van-nav-bar>
    <router-view/>
    <van-tabbar route fixed placeholder="placeholder" v-if="$route.meta.showFooter">
      <van-tabbar-item replace to="/exception" icon="home-o">异常列表</van-tabbar-item>
      <van-tabbar-item replace to="/menu" icon="home-o">菜单</van-tabbar-item>
      <van-tabbar-item replace to="/setting" icon="home-o">我的</van-tabbar-item>
      <!--      <van-tabbar-item replace to="/publish" icon="search">异常推送</van-tabbar-item>-->
      <!--            <van-tabbar-item replace to="/mine" icon="search">我的</van-tabbar-item>-->
    </van-tabbar>
  </div>
</template>
<script>

export default {
  name: "index",
  data() {
    return {
      userInfo: {}
    }
  },
  methods: {
    /**
     * 根据url路径获取参数
     * @param query
     * @param variable
     * @returns {string|boolean}
     */
    getQueryVariable(query, variable) {
      let vars = query.split("&");
      for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] === variable) {
          return pair[1];
        }
      }
      return false;
    }

  },

  created() {
  }
}
</script>
<style scoped>
#app {
}

body {
  font-size: 16px;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
}

.title-bar ::v-deep .van-nav-bar__content {
  width: 100%;
  background: #1989fa;
}

::v-deep(.van-nav-bar__title) {
  color: #ffffff;
}

</style>
