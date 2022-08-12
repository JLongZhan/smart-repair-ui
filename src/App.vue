<template>
  <div id="app">
    <van-nav-bar :title="$route.meta.title" v-if="$route.meta.showFooter" placeholder fixed safe-area-inset-top
                 class="title-bar"/>
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
    },
    getUserInfo() {
      // let userId = sessionStorage.getItem("UserId");
      // if (userId === null) {
      //   let url = location.href;
      //   let code = this.getQueryVariable(url.slice(url.indexOf('?') + 1), 'code');
      //   if (code !== false) {
      //     let hq = this.getQueryVariable(url.slice(url.indexOf('?') + 1), 'state');
      //     this.$api.WeiXinApi.getUserInfo({
      //       "code": code,
      //       "hq": hq === "HQ"
      //     }).then(res => {
      //       if (res.code === 0) {
      //         this.userInfo = res.data;
      //         sessionStorage.setItem("hq", hq);
      //         sessionStorage.setItem("UserInfo", JSON.stringify(this.userInfo));
      //         sessionStorage.setItem("UserId", this.userInfo.userid);
      //       } else {
      //         this.$toast("获取用户信息失败  " + res.message)
      //         this.$router.replace({"name": "qr"})
      //       }
      //     }).catch(err => {
      //       console.log(err)
      //     })
      //   } else {
      //     console.log("请从企业微信端进入")
      //   }
      // }
    }
  },

  created() {
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb0e730f57b92d615&
    //     redirect_uri=https%3A%2F%2Fplatform.acousticlink.com.cn%2F&response_type=code&scope=snsapi_base#wechat_redirect
    // let test = 'http://platform.acousticlink.com.cn:200/?code=a622KY1hWRailrZHGMtX7weGUf3fiIBjCnW5s1rJTA4&state=STATE#/publish';
    // console.log(test.slice(test.indexOf('=') + 1, test.indexOf('&state')));
    this.getUserInfo();
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
