<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any


onLoad((e: any) => {
    proxy.$Loading()
    if (useUser.token) {
        console.log(e.type, 'werwere');
        if (e.type) {
            console.log(e.type, 'werwere');
            if (e.type == 'manufacturer') {
                uni.redirectTo({
                    url: `/manufacturer/shareOrderCard/index?type=${e.type}&cardNo=${e.cardNo}`
                })
            }
            if (e.type == 'wholesale') {
                uni.redirectTo({
                    url: `/wholesaler/shareOrderCard/index?type=${e.type}&cardNo=${e.cardNo}`
                })
            }
        } else {
            if (useUser.miniRole) {
                if (useUser.miniRole == 'guest') {
                    uni.redirectTo({
                        url: '/pages/chooseIdentity/index'
                    })
                }
                if (useUser.miniRole == 'manufacturer') {
                    uni.redirectTo({
                        url: '/manufacturer/home/index'
                    })
                }
                if (useUser.miniRole == 'wholesale') {
                    uni.redirectTo({
                        url: '/wholesaler/home/index'
                    })
                }
                if (useUser.miniRole == 'packaging') {
                    uni.redirectTo({
                        url: '/packagingStation/home/index'
                    })
                }
            }
        }
    } else {
        uni.redirectTo({
            url: '/pages/login/index'
        })
    }
})


</script>


<template>
    <view class="container"></view>
</template>


<style lang="scss">
.container {
    background: rgba(0, 0, 0, 0.5);
}
</style>