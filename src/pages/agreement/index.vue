<script lang="ts" setup>
import { userAgreement, privacyAgreement } from './page';

const protocolText = ref('')
const headerTitle = ref('')

onLoad((e: any) => {
    protocolText.value = e.type == 'privacyAgreement' ? privacyAgreement : userAgreement
    headerTitle.value = e.type == 'privacyAgreement' ? '隐私政策' : '用户手册'
})

</script>


<template>
    <view class="container flex_column">
        <com-header :headerTitle="headerTitle"></com-header>
        <view class="main_con flex_1">
            <rich-text :nodes="protocolText"></rich-text>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.main_con {
    overflow-x: hidden;
    overflow-y: auto;
    padding: 30rpx;
}
</style>