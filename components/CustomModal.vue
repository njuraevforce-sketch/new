<template>
  <view class="custom-modal" v-if="visible" @click="close">
    <view class="custom-modal-content" @click.stop>
      <view class="custom-modal-header">{{ title }}</view>
      <view class="custom-modal-body" v-html="content"></view>
      <view class="custom-modal-footer">
        <button class="custom-modal-btn" @click="confirm">{{ $t('ok') }}</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    title: String,
    content: String
  },
  methods: {
    close() {
      this.$emit('close')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped>
.custom-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
}

.custom-modal-content {
  background: white;
  border-radius: 20rpx;
  width: 100%;
  max-width: 600rpx;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease;
}

.custom-modal-header {
  padding: 30rpx;
  font-weight: bold;
  border-bottom: 1rpx solid #eee;
  font-size: 32rpx;
  text-align: center;
  background: linear-gradient(135deg, #36454f, #5a6b76);
  color: white;
}

.custom-modal-body {
  padding: 40rpx;
  color: #333;
  font-size: 28rpx;
  line-height: 1.5;
  max-height: 60vh;
  overflow-y: auto;
}

.custom-modal-footer {
  padding: 30rpx;
  border-top: 1rpx solid #eee;
  text-align: center;
}

.custom-modal-btn {
  background: linear-gradient(135deg, #36454f, #5a6b76);
  color: white;
  border: none;
  padding: 20rpx 50rpx;
  border-radius: 10rpx;
  cursor: pointer;
  font-size: 28rpx;
  font-weight: bold;
  transition: all 0.3s ease;
  width: 100%;
}

.custom-modal-btn:hover {
  background: linear-gradient(135deg, #5a6b76, #36454f);
  transform: translateY(-2rpx);
}

@keyframes modalSlideIn {
  from { transform: translateY(-100rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
