<template>
  <div>
    <div class="material-wrapper" v-show="$route.meta.index===1">
      <van-nav-bar
          left-text="返回"
          :title="$route.meta.title"
          left-arrow
          @click-left="onClickLeft"
      />
      <div v-if="workPlans.length>0">
        <!--
        -->
        <van-list
            offset="30"
            :loading="loading"
            :immediate-check="false"
            :finished="finished"
            finished-text="没有更多了"
        >
          <van-cell v-for="item in workPlans"
                    :key="item">
            <van-card
                :title="item.name+' - '+item.line"
                :num="item.qty"
                currency=""
            >
              <template #tags>
                <div class="card-time">
                  {{ item.orderDate }}
                </div>
                <van-tag plain type="primary" v-if="item.subArea">{{ item.subArea }}</van-tag>
                <!--                <van-tag plain type="danger" style="margin-left: 5px" v-if="item.emergencyLevel">-->
                <!--                  {{ item.emergencyLevel }}-->
                <!--                </van-tag>-->

              </template>
              <template #footer>
                <van-progress :percentage="item.actualQty/item.planQty" stroke-width="4"/>
              </template>
            </van-card>
          </van-cell>
        </van-list>
      </div>
      <van-empty v-else description="没有工单"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      loading: false,
      finished: false,
      workPlans: [],
    }
  },
  methods: {
    onClickLeft() {
      history.back();
    },

    getMaterialList() {
      let param = {}
      this.$api.Material.getWorkPlan(param, "http://192.168.162.118:8007")
          .then(res => {
            console.log(res);
            this.workPlans = res;
            for (let i = 0; i < res.length; i++) {
              let item = res[i];
              item['percentage'] = item.actualQty / item.planQty;
              console.log(item['percentage']);
            }
          })
          .catch(err => {
            console.log(err);
          })
    }
  },
  mounted() {
    console.log(123)
    this.getMaterialList();
  },
  created() {
    console.log(213)
  }
}
</script>

<style scoped>

</style>
