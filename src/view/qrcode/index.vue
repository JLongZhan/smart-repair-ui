<template>
  <div style="height: 100%;width: 100%">
    <button @click="exit">退出登录</button>
    <div v-html="text"></div>
    <!--  微信二维码-->
    <div id="code">
    </div>
    <div></div>
  </div>
</template>

<script>
import WwLogin from '../../assets/common/wwLogin-1.2.5'

export default {
  data() {
    return {
      text: "",
      oauthUrl: "http://192.168.162.126:8000/auth-server/oauth/authorize?client_id=eden&response_type=code&redirect_uri=http://192.168.162.126:8080"

    };
  },

  methods: {
    exit() {
      console.log("退出登录");
      location.replace("http://192.168.162.126:8000/auth-server/exit?redirect_uri=http://192.168.162.126:8080")
      // this.$api.WeiXinApi.exit().then(res => {
      //   console.log("res", res);
      // }).catch(err => {
      //   console.log(err);
      // })
    },
    oauth() {
      let accessToken = sessionStorage.getItem('access_token')
      if (accessToken == null) {
        let url = location.href
        let origin = location.origin
        let code = this.getQueryVariable(url.slice(url.indexOf('?') + 1), 'code')
        if (code !== false) {
          this.$api.WeiXinApi.callback({code: code})
              .then(response => {
                console.log(response);
                let data = response.data.data
                sessionStorage.setItem('access_token', data.access_token)
                sessionStorage.setItem('token', data)
                this.getUserInfo(data.access_token)
              })
        } else {
          let openUrl = this.$global.url.oauthUrl + origin
          location.replace(openUrl)
        }
      }
    },

  },
  mounted() {
    // this.oauth();
    new WwLogin({
      "id": "code",
      "appid": "wxb0e730f57b92d615",
      "agentid": "1000042",
      "redirect_uri": "http://platform.3nod.com.cn:200",
      "state": "HQ",
      "href": "",
      "lang": "zh",
    });

  }
};
</script>

<style lang="less">
#code {
  padding: 20px;
  display: flex;
  justify-content: center;
}

iframe {
  width: 100% !important;
  min-height: 350px
}
</style>
