<template>
  <div class="navbar">
    <div v-if="showBack" class="navbar-back" @click="goBack">
      <i class="fas fa-arrow-left"></i>
    </div>
    <div class="navbar-title">{{ title }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: 'GLY'
  },
  showBack: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.navbar-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.navbar-back {
  margin-right: 15px;
  color: white;
  cursor: pointer;
}
</style>
