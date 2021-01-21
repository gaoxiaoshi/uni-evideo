<template>
    <view class="no-data-box">
        <view class="no-data-ico">
            <image class="no-data-ico-image" src="./no-data.png" />
        </view>
        <view class="no-data-p">{{text}}</view>
    </view>
</template>
<script>
export default {
    props: {
        text: {
            type: String,
            default: 'no data'
        }
    }
}
</script>
<style lang="less" scoped>
.no-data-box {
    padding: 100rpx 25rpx;
    text-align: center;
}

.no-data-box .no-data-ico {
    text-align: center;
}

.no-data-box .no-data-ico .no-data-ico-image {
    width: 360rpx;
    height: 360rpx;
}

.no-data-box .no-data-p {
    font-size: 28rpx;
    color: #91a9ac;
}
</style>

