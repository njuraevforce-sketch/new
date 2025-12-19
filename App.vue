<template>
  <div id="app">
    <!-- Кастомный модальный компонент -->
    <custom-modal
      v-if="showModal"
      :title="modalTitle"
      :content="modalContent"
      @close="closeModal"
      @confirm="modalConfirm"
    />
    
    <!-- Компонент загрузки -->
    <loading-overlay v-if="loading" :text="loadingText" />
    
    <!-- Основной контент -->
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import CustomModal from '@/components/CustomModal.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    CustomModal,
    LoadingOverlay
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  computed: {
    ...mapState([
      'showModal',
      'modalTitle',
      'modalContent',
      'modalOnConfirm',
      'loading',
      'loadingText'
    ])
  },
  created() {
    // Инициализация приложения
    this.initApp()
    
    // Обработка пригласительных ссылок
    this.handleInviteLinks()
  },
  methods: {
    ...mapActions([
      'initApp',
      'showAlert',
      'showLoading',
      'hideLoading'
    ]),
    
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    
    handleInviteLinks() {
      // Проверка параметров URL для реферальных ссылок
      const urlParams = new URLSearchParams(window.location.search)
      const refCode = urlParams.get('i') || urlParams.get('ref')
      
      if (refCode && !this.$store.state.user) {
        sessionStorage.setItem('pending_invite_code', refCode)
        this.$router.replace('/pages/register/index')
      }
    },
    
    closeModal() {
      this.$store.commit('HIDE_MODAL')
    },
    
    modalConfirm() {
      if (this.modalOnConfirm) {
        this.modalOnConfirm()
      }
      this.closeModal()
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/global.css';

#app {
  width: 100%;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: #1a1a1a;
}

/* Глобальные стили Uni-app */
page {
  background: #1a1a1a;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

/* Карточки */
.card {
  background: #2a2a2a;
  border-radius: 10px;
  padding: 15px;
  margin: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.padding {
  padding: 15px;
}

.margin-top {
  margin-top: 15px;
}

.margin-bottom {
  margin-bottom: 15px;
}

.text-center {
  text-align: center;
}

.text-white {
  color: white;
}

.text-gray {
  color: #cccccc;
}

.text-bold {
  font-weight: bold;
}

.flex {
  display: flex;
}

.align-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

/* Кнопки */
.pro-btn {
  background: #4e7771;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  width: 100%;
  text-align: center;
  
  &:hover {
    background: #3a5d58;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* Поля ввода */
.input-container {
  position: relative;
  margin-bottom: 15px;
}

.input-line {
  width: 100%;
  padding: 12px 40px 12px 12px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #4e7771;
  color: white;
  font-size: 16px;
  outline: none;
  
  &::placeholder {
    color: #cccccc;
  }
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #52c41a;
  cursor: pointer;
  z-index: 10;
}

/* Цвета */
.color-up {
  color: #52c41a;
}

.color-down {
  color: #ff6b6b;
}

/* Адаптация для мобильных */
@media (max-width: 768px) {
  .card {
    margin: 8px;
    padding: 12px;
  }
}
</style>
