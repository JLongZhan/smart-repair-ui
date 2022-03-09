<template>
  <div style="height: 100%;overflow: hidden;">
    <router-view></router-view>
    <div class="container-wrapper" v-if="$route.meta.index===0">
      <!--      <van-notice-bar-->
      <!--          left-icon="volume-o"-->
      <!--          v-if="noticeStr.length>0"-->
      <!--          :text="noticeStr"-->
      <!--      />-->
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh"
                        style="height: 100%"
                        success-text="刷新成功">
        <van-tabs v-model:active="currentTab" animated sticky color="#1989fa" @change="_onTabChange">
          <van-tab v-for="(item,key) in groupTitles" :title="item" :key="key">
            <div v-if="exceptions.length>0">
              <!--
              -->
              <van-list
                  offset="30"
                  :loading="loading"
                  :immediate-check="false"
                  :finished="finished"
                  finished-text="没有更多了"
                  @load="onListLoad"
              >
                <van-cell v-for="item in exceptions"
                          :key="item">
                  <van-card
                      :price="item.location+' '+item.bindLine"
                      :desc="item.exceptionDescription"
                      :title="item.targetName+' - '+item.targetDescription"
                      thumb="https://wework.qpic.cn/wwpic/115896_gnADG-RDTCeeT1j_1642665588/0"
                      @click="_onExceptionItemClick(item.id)"
                      currency=""
                  >
                    <template #tags>
                      <van-tag plain :type="item.currentState===0?'danger':item.currentState===1?'primary':'success'">
                        {{ item.state }}
                      </van-tag>
                    </template>
                    <template #footer>

                      <div>{{ item.occurTime }}</div>
                    </template>
                  </van-card>
                </van-cell>
              </van-list>
            </div>
            <van-empty v-else description="没有异常"/>

          </van-tab>
        </van-tabs>
      </van-pull-refresh>
    </div>
  </div>

</template>

<script>

export default {
  name: "index",
  data() {
    return {
      userId: '',
      currentTab: 0,
      groupTitles: {0: '全部异常', 1: '与我相关'},
      publishPageInfo: {
        current: 1,
        size: 7
      },
      processPageInfo: {
        current: 1,
        size: 7
      },
      noticeStr: '智能叫修',
      chooseGroup: 0,
      groups: [
        {text: '异常群组 1', value: 0},
      ],
      chooseStatus: 0,
      statusOptions: [
        {text: '默认', value: 0},
      ],
      refreshing: false,
      loading: false,
      finished: false,
      publishExceptions: [],
      processExceptions: [],
      exceptions: []
    }
  },
  methods: {
    _onTabChange(e) {
      console.log("_onTabChange", e)
      if (e === 0) {
        this.exceptions = this.publishExceptions;
        if (this.publishExceptions.pages > 1 && this.publishExceptions.current === this.publishExceptions.pages) {
          this.finished = true;
        } else {
          this.finished = false;
        }
      } else {
        if (this.processExceptions.pages > 1 && this.processExceptions.current === this.processExceptions.pages) {
          this.finished = true;
        } else {
          this.finished = false;
        }
        console.log(this.processExceptions.length)
        if (this.processExceptions.length === 0) {
          this._getProcessExceptionList();
        } else
          this.exceptions = this.processExceptions;
      }
    },

    getUserInfo() {
      let userId = sessionStorage.getItem("UserId");
      let UserInfo = sessionStorage.getItem("UserInfo");
      if (userId !== null) {
        this.userId = userId;
        this.userInfo = UserInfo;
        this._getAllPublishExceptionList();
      } else {
        let url = location.href;
        console.log("当前Url", location)
        if (url.indexOf("code=") !== -1) {
          let code = url.slice(url.indexOf('=') + 1, url.indexOf('&state'));
          console.log("code:", code)
          if (code == null) {
            return;
          }
          this.$api.WeiXinApi.getUserInfo({
            "code": code
          })
              .then(res => {
                if (res.code === 0) {
                  this.userInfo = res.data;
                  sessionStorage.setItem("UserInfo", this.userInfo);
                  sessionStorage.setItem("UserId", this.userInfo.userid);
                  this.userId = this.userInfo.userid;
                  this._getAllPublishExceptionList();
                } else {
                  this.$toast("获取用户信息失败  " + res.message)
                  this.$router.replace({"name": "qr"})
                }
              }).catch(err => {
            console.log(err)
          })
        } else {
          console.log("请从企业微信端进入")
          this.$router.replace({"name": "qr"})
        }
      }
    }
    ,
    /**
     * 下拉刷新
     */
    onRefresh() {
      // 将 loading 设置为 true，表示处于加载状态
      this.refreshing = true;
      this.finished = false;
      // 清空列表数据
      if (this.currentTab === 0) {
        this.publishPageInfo.current = 1;
        this.exceptions = this.publishExceptions = [];
        // 重新加载数据
        this._getAllPublishExceptionList();
      } else {
        this.processPageInfo.current = 1;
        this.exceptions = this.processExceptions = []
        // 重新加载数据
        this._getProcessExceptionList();
      }


    }
    ,
    /**
     * 上拉加载更多
     */
    onListLoad() {
      console.log("------------------------------------onListLoad上拉加载更多")
      if (this.finished === true) {
        return;
      }
      if (this.currentTab === 0) {
        if (this.exceptions.length >= this.publishPageInfo.size &&
            this.publishPageInfo.current + 1 <= this.publishPageInfo.pages
        ) {
          this.loading = true;
          this.publishPageInfo.current += 1;
          this._getAllPublishExceptionList();
        }
      } else {
        if (this.exceptions.length >= this.processPageInfo.size &&
            this.processPageInfo.current < this.processPageInfo.pages) {
          this.loading = true;
          this.processPageInfo.current += 1;
          this._getProcessExceptionList();
        }
      }
    }
    ,
    /**
     * 获取我处理的异常列表
     * @private
     */
    _getProcessExceptionList() {
      let params = {
        userId: this.userId,
        current: this.processPageInfo.current,
        size: this.processPageInfo.size
      };
      this.$api.Exception.exceptionList(params)
          .then(res => {
            this.refreshing = false;
            this.loading = false;
            if (res.code === 0) {
              if (res.data.current === 1) {
                this.processExceptions = []
              }
              this.exceptions = this.processExceptions = this.processExceptions.concat(res.data.records);
              this.processPageInfo = res.data;
              if (res.data.pages > 1 && res.data.current === res.data.pages) {
                this.finished = true;
              }
            } else {
              this.$toast("请求失败" + res.message);
            }
            // 执行某些操作
          }).catch(error => {
        console.log(error)
      })
    }
    ,
    /**
     * 获取全部异常列表
     * @private
     */
    _getAllPublishExceptionList() {
      let params = {
        current: this.publishPageInfo.current,
        size: this.publishPageInfo.size
      };
      this.$api.Exception.exceptionList(params)
          .then(res => {
            this.refreshing = false;
            this.loading = false;

            if (res.code === 0) {
              console.log(this.exceptions, this.publishExceptions)
              if (res.data.current === 1) {
                this.publishExceptions = []
              }
              this.exceptions = this.publishExceptions = this.publishExceptions.concat(res.data.records);
              this.publishPageInfo = res.data;
              if (res.data.pages > 1 && res.data.current === res.data.pages) {
                this.finished = true;
              }
            } else {
              this.$toast("请求失败" + res.message);
            }
            // 执行某些操作
          }).catch(error => {
        console.log(error)
      })
    }
    ,
    /**
     * 异常Item点击效果
     * @private
     */
    _onExceptionItemClick(id) {
      this.$router.push({name: 'ExceptionDetails', params: {id: id}});
    }
  },
  created() {
    this.getUserInfo();
    // this._getAllPublishExceptionList();
  }
}
</script>

<style scoped>
::v-deep(.van-tab) {
  font-size: 16px;
}

.container-wrapper {
  width: 100%;
  height: 100%;
}

::v-deep(.van-pull-refresh) {
  height: 100%;
}

::v-deep(.van-tabs__wrap) {
  height: var(--van-nav-bar-height);;
}

.title-bar ::v-deep .van-nav-bar__content {
  width: 100%;
  background: #1989fa;
}

.title-bar
::v-deep .van-nav-bar__title {
  font-weight: bold;
  color: #fff;
}

::v-deep(.van-card__title) {
  font-weight: 700;
  font-size: 15px;
}

::v-deep(.van-card__desc) {
  font-size: 14px;
  margin-top: 5px;
}

::v-deep(.van-card__price-integer) {
  font-size: 12px;
}

::v-deep(.van-tag) {
  margin: 5px 0;
  padding: 4px;
}
</style>
