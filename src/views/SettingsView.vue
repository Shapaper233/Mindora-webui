<template>
  <div class="settings-view">
    <h2 class="section-title">{{ $t("settings.title") }}</h2>
    <div class="color-picker-group">
      <label>{{ $t("settings.theme_color") }}：</label>
      <input
        type="color"
        :value="themeColor"
        @input="updateThemeColor($event.target.value)"
      />
    </div>

    <div class="settings-card">
      <h3 class="card-title">{{ $t("settings.interface_prefs") }}</h3>
      <div class="form-item">
        <label>{{ $t("settings.menu_speed") }}</label>
        <select v-model="animationSpeed">
          <option value="fast">{{ $t("settings.fast") }}</option>
          <option value="normal">{{ $t("settings.normal") }}</option>
          <option value="slow">{{ $t("settings.slow") }}</option>
        </select>
      </div>
    </div>

    <!-- 语言切换 -->
    <div class="settings-card">
      <h3 class="card-title">{{ $t("settings.language_settings") }}</h3>
      <div class="form-item">
        <label>{{ $t("settings.select_language") }}</label>
        <select v-model="currentLanguage" @change="changeLanguage">
          <option value="zh-CN">{{ $t("settings.chinese") }}</option>
          <option value="en-US">{{ $t("settings.english") }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useThemeStore } from "@/stores/theme";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";

const { locale } = useI18n();
const themeStore = useThemeStore();
const { locale: currentLanguage } = storeToRefs(themeStore);

// 确保 currentLanguage 有默认值
if (!currentLanguage.value) {
  currentLanguage.value = locale.value || 'zh-CN';
}

const themeColor = ref(themeStore.primaryColor);
const animationSpeed = ref("normal");

const changeLanguage = (event) => {
  const newLang = event.target.value;
  locale.value = newLang;
  themeStore.setLanguage(newLang);
  // 刷新页面让菜单语言生效
  //window.location.reload();
};

const updateThemeColor = (color) => {
  themeStore.setPrimaryColor(color);
  themeColor.value = color;
};
</script>

<style scoped>
.settings-view {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  color: var(--text-color);
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
}

.settings-card {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 1.5rem;
}

.card-title {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.form-item {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.color-picker-group {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;

  input[type="color"] {
    width: 40px;
    height: 40px;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
  }
}

select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--input-bg);
  color: var(--text-color);
}
</style>
