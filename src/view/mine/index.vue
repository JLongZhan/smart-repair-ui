<template>
  <div>

    <div class="user-wrapper">
      <van-skeleton title avatar :row="13" :loading="false">
        <div class="profile-wrapper">
          <van-image
              round
              fit="cover"
              src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="basic-wrapper">
            <div class="name">占晋龙</div>
            <div class="dept">信息管理部</div>
          </div>
        </div>


      </van-skeleton>

      <div class="exception-wrapper">
        <div class="title" >异常相关</div>
        <van-divider />
        <div class="exception-manage">
          <div>
            <img src="../../assets/ic_mine_publish@3x.png" alt="">
            <div>我发布的</div>
          </div>
          <div>
            <img src="../../assets/ic_mine_process@3x.png" alt="">
            <div>我处理的</div>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
import {ref} from 'vue';

export default {
  name: "index",
  data() {
    return {
      userInfo: {}
    }
  },
  methods: {
    setup() {
      const active = ref('exception');
      return {active};
    },

  },
  created() {
    // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb0e730f57b92d615&
    //     redirect_uri=https%3A%2F%2Fplatform.acousticlink.com.cn%2F&response_type=code&scope=snsapi_base#wechat_redirect
    // let test = 'http://platform.acousticlink.com.cn:200/?code=a622KY1hWRailrZHGMtX7weGUf3fiIBjCnW5s1rJTA4&state=STATE#/publish';
    // console.log(test.slice(test.indexOf('=') + 1, test.indexOf('&state')));
    let url = location.href;
    console.log("当前Url", location)
    if (url.indexOf("code=") !== -1) {
      let code = url.slice(url.indexOf('=') + 1, url.indexOf('&state'));
      console.log("code:", code)
      if (code != null) {
        console.log('开始获取用户数据')
        this.getUserInfo(code);
      } else {
        console.log('code 为空')
      }
    }

  }
}
</script>

<style scoped>
.user-wrapper {

  border: none;
  font-weight: bold;
}

.profile-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  background: #1989fa;
  color: #ffffff;
  padding: 20px 20px 60px;
}

.profile-wrapper .van-image {
  width: 80px;
  height: 80px;
  margin-right: 20px;
}
.basic-wrapper{
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.basic-wrapper .name {
  font-size: 16px;
  padding: 5px 0;
}

.basic-wrapper .dept {
  font-size: 14px;

}

.exception-wrapper {
  margin: 20px 10px;
}
.exception-wrapper .title{
  border-left: 6px solid #1989fa;
  padding-left: 10px;
  font-weight: 700;
}
.exception-manage {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.exception-manage img{
  width: 60px;
  height: 60px;

}
</style>