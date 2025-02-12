<script setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div class="page-container">
    <h1>{{ t('pages.test') }}</h1>
    <div class="content-box">
      <p>{{ t('testPage.description') }}</p>
    </div>
  </div>
</template>

<style scoped>
.content-box {
  padding: 2rem;
  background: var(--bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 1.5rem;
}
</style>
