<script lang="ts" setup>

import edit_icon from "@/static/images/edit_icon.png"
import manufacturer_icon from "@/static/images/chooseIdentity/manufacturer_icon.png"
import wholesale_icon from "@/static/images/chooseIdentity/wholesale_icon.png"
import packaging_icon from "@/static/images/chooseIdentity/packaging_icon.png"
import member_icon from "@/static/images/member_icon.png"
import arrow_right from "@/static/images/arrow_right.png"
import position_2 from "@/static/images/position_2.png"

const props = defineProps({
    userRole: {
        type: String,
        default: 'wholesaler'
    },
    infoDetails: {
        type: Object,
        default: {
        }
    }
})
const headerIcon = ref()

onMounted(() => {
    console.log(props.userRole, 'props.userRoleprops.userRoleprops.userRole');
    if (props.userRole === 'wholesaler') {
        headerIcon.value = wholesale_icon
    }
    if (props.userRole === 'packaging') {
        headerIcon.value = packaging_icon
    }
    if (props.userRole === 'manufacturer') {
        headerIcon.value = manufacturer_icon
    }
})

// 立即续费
const renewFu = () => {
    uni.navigateTo({
        url: '/wholesaler/renewalMembership/index'
    })
}
</script>


<template>
    <view class="my_header  flex_between">
        <view class="my_header_info flex_column ">
            <view class="flex_align position_info">
                <image class="position_icon" :src="position_2"></image>
                <view>{{ infoDetails.username }}</view>
            </view>
            <view>{{ infoDetails.address }}</view>
            <view>{{ infoDetails.userPhone }}</view>
            <button class="flex_align edit_btn">
                <image class="edit_icon" :src="edit_icon"></image>
                <text>编辑</text>
            </button>
        </view>
        <image class="my_header_icon" :src="headerIcon"></image>
    </view>
    <view class="member_info flex_between flex_1">
        <view>
            <view class="flex_align">
                <image class="member_icon" :src="member_icon"></image>
                <text class="member_name">{{ infoDetails.roleName }}</text>
            </view>
            <view class="member_desc">有效期至 {{ infoDetails.expireTime }}</view>
        </view>
        <button class="flex_align member_btn flex_center" @click="renewFu">
            <text>立即续费</text>
            <image class="arrow_right" :src="arrow_right"></image>
        </button>
    </view>

</template>

<style lang="scss" scoped>
.my_header {
    font-weight: 400;
    font-size: 24rpx;
    color: #DDEFFF;
    position: relative;

    .my_header_info {
        gap: 12rpx;

        .position_info {
            font-weight: bold;
            font-size: 40rpx;
            color: #FFFFFF;
            margin-bottom: 4rpx;

            .position_icon {
                width: 36rpx;
                height: 36rpx;
                margin-right: 18rpx;
            }
        }

        .edit_btn {
            width: 120rpx;
            box-sizing: border-box;
            padding: 18rpx 20rpx;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 40rpx;
            border: 1rpx solid #8CBAFF;
            font-weight: 500;
            font-size: 26rpx;
            color: #FFFFFF;

            .edit_icon {
                width: 20rpx;
                height: 20rpx;
                margin-right: 8rpx;
            }
        }
    }

    .my_header_icon {
        width: 360rpx;
        height: 360rpx;
    }
}

.member_info {
    padding: 38rpx 28rpx;
    background: #FFFFFF;
    border-radius: 24rpx;
    font-weight: 400;
    font-size: 26rpx;
    color: #7C8191;
    margin-top: -76rpx;
    position: relative;

    .member_icon {
        width: 34rpx;
        height: 34rpx;
        margin-right: 14rpx;
    }

    .member_name {
        font-weight: normal;
        font-size: 32rpx;
        line-height: 36rpx;
        font-style: normal;
        background: linear-gradient(324.7605345773806deg, #0D5DFF 0%, #00AAFF 100%);
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
    }

    .member_desc {
        margin-top: 10rpx;
    }

    .member_btn {
        padding: 24rpx;
        background: rgba(12, 104, 255, 0.05);
        border-radius: 48rpx;
        border: 1rpx solid #8CBAFF;
        font-weight: 500;
        font-size: 26rpx;
        color: #0C62FF;

        .arrow_right {
            width: 26rpx;
            height: 26rpx;
        }
    }
}
</style>