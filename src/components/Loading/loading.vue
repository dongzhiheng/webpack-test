<template>
    <div v-show="loading" class="loading">
        <img :src='loading_page' alt="">
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import ejax from '@/assets/js/ejax';
import loading from '@/assets/img/icon-loading.svg'
export default {
    name: 'loading',
    data() {
        return {
            loading_page:loading
        }
    },
    props:{
        loading:{
            default:false
        }
    },
    mounted: function () {

    },
    methods: {
    }
}

</script>
<style lang="scss">
//加载loading动画
.loading {
    text-align: center;
    height: 300px;
    line-height: 300px;
    img {
        display: inline-block;
        width: 60px;
        height: 60px;
        animation: change 2s linear infinite;
    }
}

@keyframes change {
    0% {
        -webkit-transform: rotate(0deg);
    }
    50% {
        -webkit-transform: rotate(180deg);
    }
    100% {
        -webkit-transform: rotate(360deg);
    }
}
</style>
