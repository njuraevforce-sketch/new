<template>
  <view class="company-page">
    <!-- Company Header -->
    <div class="company-header">
      <img src="/static/assets/logo.png" alt="GLY" class="company-logo">
      <h1 class="company-name">GLY Platform</h1>
      <p class="company-tagline">Global Ledger Yield - Revolutionizing Quantum Investment</p>
    </div>

    <!-- About Us -->
    <div class="section-card">
      <h2 class="section-title">{{ $t('about_us') }}</h2>
      <div class="section-content">
        <p>GLY Platform is a cutting-edge quantum investment platform that leverages advanced AI algorithms and blockchain technology to provide secure and profitable investment opportunities.</p>
        <p>Founded in 2024, our mission is to democratize access to sophisticated investment strategies that were previously available only to institutional investors.</p>
      </div>
    </div>

    <!-- Our Mission -->
    <div class="section-card">
      <h2 class="section-title">{{ $t('our_mission') }}</h2>
      <div class="section-content">
        <p>To empower individuals worldwide with transparent, secure, and profitable investment opportunities through innovative technology and financial expertise.</p>
        <div class="mission-list">
          <div class="mission-item">
            <i class="fas fa-shield-alt"></i>
            <span>Security First</span>
          </div>
          <div class="mission-item">
            <i class="fas fa-chart-line"></i>
            <span>Maximum Returns</span>
          </div>
          <div class="mission-item">
            <i class="fas fa-users"></i>
            <span>Community Growth</span>
          </div>
          <div class="mission-item">
            <i class="fas fa-globe"></i>
            <span>Global Access</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Our Vision -->
    <div class="section-card">
      <h2 class="section-title">{{ $t('our_vision') }}</h2>
      <div class="section-content">
        <p>To become the world's leading quantum investment platform, recognized for innovation, transparency, and exceptional returns for our users.</p>
        <p>We envision a future where everyone has equal access to sophisticated investment tools and can achieve financial independence through smart, automated investing.</p>
      </div>
    </div>

    <!-- Contact Us -->
    <div class="section-card">
      <h2 class="section-title">{{ $t('contact_us') }}</h2>
      <div class="contact-info">
        <div class="contact-item">
          <i class="fas fa-envelope"></i>
          <div>
            <h4>Email</h4>
            <p>info@gly.io</p>
          </div>
        </div>
        <div class="contact-item">
          <i class="fab fa-telegram"></i>
          <div>
            <h4>Telegram</h4>
            <p>@GLY_Support</p>
          </div>
        </div>
        <div class="contact-item">
          <i class="fas fa-clock"></i>
          <div>
            <h4>Support Hours</h4>
            <p>24/7 Customer Support</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Legal Links -->
    <div class="legal-links">
      <a href="#" class="legal-link" @click.prevent="showTerms">
        <i class="fas fa-file-contract"></i>
        <span>{{ $t('terms_service') }}</span>
      </a>
      <a href="#" class="legal-link" @click.prevent="showPrivacy">
        <i class="fas fa-user-shield"></i>
        <span>{{ $t('privacy_policy') }}</span>
      </a>
    </div>
  </view>
</template>

<script setup>
import { t } from '@/utils/translate'

const showTerms = () => {
  const content = `
    <div style="padding: 20px; max-height: 400px; overflow-y: auto;">
      <h3 style="color: #4e7771; margin-bottom: 15px;">Terms of Service</h3>
      <p style="margin-bottom: 10px; line-height: 1.6;">By using GLY Platform, you agree to these terms...</p>
      <!-- Add full terms content here -->
    </div>
  `
  
  window.showCustomModal('Terms of Service', content)
}

const showPrivacy = () => {
  const content = `
    <div style="padding: 20px; max-height: 400px; overflow-y: auto;">
      <h3 style="color: #4e7771; margin-bottom: 15px;">Privacy Policy</h3>
      <p style="margin-bottom: 10px; line-height: 1.6;">Your privacy is important to us...</p>
      <!-- Add full privacy policy content here -->
    </div>
  `
  
  window.showCustomModal('Privacy Policy', content)
}
</script>

<style scoped>
.company-page {
  padding: 20px;
  padding-bottom: 80px;
  background: #f5f5f5;
  min-height: 100vh;
}

.company-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.company-logo {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  margin-bottom: 15px;
}

.company-name {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.company-tagline {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.section-card {
  background: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.section-content {
  color: #666;
  line-height: 1.6;
}

.section-content p {
  margin-bottom: 15px;
}

.mission-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.mission-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 10px;
  transition: all 0.3s;
}

.mission-item:hover {
  background: #f0f0f0;
  transform: translateY(-2px);
}

.mission-item i {
  color: #4e7771;
  font-size: 18px;
}

.mission-item span {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  transition: all 0.3s;
}

.contact-item:hover {
  background: #f0f0f0;
}

.contact-item i {
  width: 40px;
  height: 40px;
  background: #4e7771;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.contact-item h4 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.contact-item p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

.legal-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.legal-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.legal-link:hover {
  background: #f0f0f0;
  transform: translateX(5px);
}

.legal-link i {
  color: #4e7771;
  font-size: 18px;
}

@media (min-width: 768px) {
  .company-page {
    max-width: 375px;
    margin: 0 auto;
  }
}
</style>
