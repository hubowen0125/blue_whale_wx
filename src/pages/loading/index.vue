<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'

const useUser = useUserStore()
const { proxy } = getCurrentInstance() as any


onLoad((e: any) => {
    proxy.$Loading()
    if (useUser.token) {
        if (e.type) {
            if (e.type == 'manufacturer') {
                if (useUser.miniRole == 'wholesale') {
                    uni.redirectTo({
                        url: '/wholesaler/home/index?popup=true'
                    })
                } else {
                    if (e.manufacturerId == 'null' || !e.manufacturerId) {
                        uni.redirectTo({
                            url: `/manufacturer/shareOrderCard/index?type=${e.type}&cardNo=${e.cardNo}`
                        })
                    } else if (e.manufacturerId == useUser.userInfo.deptId) {
                        uni.redirectTo({
                            url: `/manufacturer/shareOrderCard/index?type=${e.type}&cardNo=${e.cardNo}`
                        })
                    } else {
                        uni.redirectTo({
                            url: '/manufacturer/home/index?popup=true'
                        })
                    }
                }
            }
            if (e.type == 'wholesale') {
                if (useUser.miniRole == 'manufacturer') {
                    uni.redirectTo({
                        url: '/manufacturer/home/index?popup=true'
                    })
                } else {
                    uni.redirectTo({
                        url: `/wholesaler/shareOrderCard/index?type=${e.type}&cardNo=${e.cardNo}`
                    })
                }
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
        if (e.type) {
            uni.redirectTo({
                url: `/pages/login/index?type=${e.type}&cardNo=${e.cardNo}&typeId=${e.type == 'manufacturer' ? e.manufacturerId : e.wholesaleId}`
            })
        } else {
            uni.redirectTo({
                url: '/pages/login/index'
            })
        }
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