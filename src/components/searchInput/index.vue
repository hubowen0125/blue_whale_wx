<script lang="ts" setup>

const emit = defineEmits(['onBlur' , 'onFocus'])

const props = defineProps({
    placeholder: {
        type: String,
        default: ''
    },
    // 可选：自定义防抖时间（默认 300ms）
    debounceTime: {
        type: Number,
        default: 300
    }
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const inputValue = ref('')

const onClick = () => {
    //     uni.navigateTo({
    //         url: '/pages/search/index'
    //     })
}

const onBlur = () => {
    // 清除之前的计时器
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }
    // 设置新的计时器，在 debounceTime 后触发
    debounceTimer = setTimeout(() => {
        emit('onBlur', inputValue.value)
        debounceTimer = null
    }, props.debounceTime)
}


const onFocus = () => {
    emit('onFocus')
}
</script>

<template>
    <view class="search_con flex_align">
        <uni-easyinput prefixIcon="search" v-model="inputValue" :placeholder="placeholder" @iconClick="onClick"
            trim="all" @blur="onBlur" @clear="onBlur" @focus="onFocus"
            :inputBorder="false"></uni-easyinput>
    </view>
</template>


<style lang="scss" scoped>
.search_con {
    height: 88rpx;
    background: #FFFFFF;
    border-radius: 12rpx;
    padding: 0 32rpx;
    gap: 20rpx;
    position: relative;

    .search_icon {
        width: 28rpx;
        height: 28rpx;
    }
}
</style>
