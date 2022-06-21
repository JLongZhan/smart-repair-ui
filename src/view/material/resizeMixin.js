// 屏幕适配 mixin 函数
export default {
    data() {
        return {
            // * 定时函数
            drawTiming: null,
            innerWidth: 0
        };
    },
    mounted() {
        this.calcRate();
        window.addEventListener('resize', this.resize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize);
    },
    methods: {
        calcRate() {
            // for (let home of document.getElementsByClassName('home')){
            //     if (window.innerHeight/window.innerWidth > 1080/1920){
            //         home.style.transform = `scale(${window.innerHeight/1080})`;
            //     }else {
            //         home.style.transform = `scale(${window.innerWidth/1920})`;
            //     }
            // }
            this.innerWidth = window.innerWidth;
        },
        resize() {
            clearTimeout(this.drawTiming);
            this.drawTiming = setTimeout(() => {
                this.calcRate();
            }, 100);
        }
    }
};
