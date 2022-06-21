<template>
    <div>
        <!--<div v-show="$route.meta.index===0">-->
        <!--    <div class="item" @click="clickWarningSetting">-->
        <!--        <span>预警人员设置</span>-->
        <!--        <el-icon>-->
        <!--            <CaretRight />-->
        <!--        </el-icon>-->
        <!--    </div>-->
        <!--</div>-->

        <!--<div v-show="innerWidth<600">-->
            <div class="setting-index" v-show="$route.meta.index===0">
                <van-grid square :column-num="3">
                    <van-grid-item icon="friends" text="预警人员设置" to="/setting/warningpersonnelsetting"/>
                </van-grid>
            </div>
        <!--</div>-->
        <!--<div class="setting-index" v-show="$route.meta.index===0">-->
        <!--    <van-grid square :column-num="3">-->
        <!--        <van-grid-item icon="friends" text="预警人员设置" to="/setting/warningpersonnelsetting"/>-->
        <!--    </van-grid>-->
        <!--</div>-->

        <router-view></router-view>
    </div>
</template>

<script>
    import { CaretRight } from '@element-plus/icons-vue';
    // import resizeMixin from "./resizeMixin";

    export default {
        name: "index",
        // mixins: ['resizeMixin'],
        components: {CaretRight},
        data() {
            return {}
        },
        methods: {
            clickWarningSetting(){
                // console.log('clickWarningSetting')
                this.$router.push({name: 'warningpersonnelsetting'})
            }
        },
    }
</script>

<style scoped lang="less">
    .item {
        box-sizing: border-box;
        padding: 15px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #323232
    }

    .setting-index {
        width: 100%;
        height: 100%;
        background-color: #f5f5f5
    }

    ::v-deep(.van-grid-item__text) {
        font-size: 16px;
        color: #323233;
    }

    ::v-deep(.van-grid-item__icon) {
        color: red !important;
    }

</style>