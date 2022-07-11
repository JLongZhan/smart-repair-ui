<template>
    <div>
        <!--{{currentRate}}-->
        <!--<div style="padding: 5px 5px 5px 0; font-size: 0.8rem">工单进度：67/200</div>-->
        <!--<div class="progress">-->
        <!--    <div class="progress-value" :style="{width: currentRateToPercent()}"></div>-->
        <!--</div>-->
        <!--<div class="progress-rate-text">-->
        <!--&lt;!&ndash;    <span >{{currentNumber}}({{currentRateToPercent()}})</span>&ndash;&gt;-->
        <!--&lt;!&ndash;    <span>{{total - currentNumber}}({{notCurrentRateToPercent()}})</span>&ndash;&gt;-->
        <!--</div>-->
    </div>
</template>

<script>
    export default {
        name: "Progress",
        props: ['currentRate', 'currentNumber', 'total'],
        data() {
            return {

            }
        },
        methods: {
            // currentRateToPercent(){
            //     if (this.currentRate > 1){
            //         return '100%'
            //     }
            //     return this.currentRate.toDecimal(2) * 100 + '%'
            // },
            // notCurrentRateToPercent(){
            //     return ((1 - this.currentRate).toDecimal(2) * 100).toFixed(0) + '%'
            //     // return (1-this.currentRate.toDecimal(2)) * 100 + '%'
            // }
        }
    }
</script>

<style scoped>
    .progress {
        height: 12px;
        width: 100%;
        background-color: #ebedf0;
    }

    .progress-value {
        width: 0;
        height: 100%;
        background-color: #9a60b4;
    }

    .progress-rate-text {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding-top: 5px
    }


</style>
