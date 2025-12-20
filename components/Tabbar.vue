<template>
  <div class="tabbar">
    <router-link 
      v-for="item in tabItems" 
      :key="item.path"
      :to="item.path"
      class="tabbar-item"
      :class="{ 'tabbar-item-active': $route.path === item.path }"
    >
      <img 
        :src="getIcon(item.icon, $route.path === item.path)" 
        class="tabbar-item-icon"
        alt=""
      />
      <div class="tabbar-item-text">{{ item.text }}</div>
    </router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const tabItems = ref([
  {
    text: 'Home',
    path: '/pages/home',
    icon: 'home'
  },
  {
    text: 'Get',
    path: '/pages/get',
    icon: 'get'
  },
  {
    text: 'Assets',
    path: '/pages/assets',
    icon: 'assets'
  },
  {
    text: 'Mine',
    path: '/pages/mine',
    icon: 'mine'
  }
])

const getIcon = (icon, active) => {
  return `/static/${icon}${active ? '-active' : ''}.png`
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  z-index: 1000;
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: all 0.3s ease;
}

.tabbar-item-active {
  color: #4e7771;
}

.tabbar-item-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 4px;
}

.tabbar-item-text {
  font-size: 11px;
  font-weight: 500;
}
</style>
