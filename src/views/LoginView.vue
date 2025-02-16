<template>
    <div class="login-view">
        <div class="login-card">
            <h1>{{ $t('login.welcome') }}</h1>
            <form @submit.prevent="login">
                <div class="form-group">
                    <label>{{ $t('login.email') }}</label>
                    <input 
                        type="email" 
                        v-model="email" 
                        :placeholder="$t('login.email_placeholder')"
                        required
                    />
                </div>
                <div class="form-group">
                    <label>{{ $t('login.password') }}</label>
                    <input 
                        type="password" 
                        v-model="password" 
                        :placeholder="$t('login.password_placeholder')"
                        required
                    />
                </div>
                <button type="submit" class="login-btn">{{ $t('login.sign_in') }}</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/stores/theme'

const { t } = useI18n()
const themeStore = useThemeStore()
const theme = themeStore.currentTheme

const email = ref('')
const password = ref('')

const login = () => {
    // Mock login request
    console.log('Logging in with:', email.value)
    // Simulate API call
    setTimeout(() => {
        alert(t('login.success'))
    }, 1000)
}
</script>

<style scoped>
.login-view {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

h1 {
    color: #333;
    text-align: center;
    margin-bottom: 1.5rem;
}

.form-group {
    margin-bottom: 1rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
}

input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
}

.login-btn {
    width: 100%;
    padding: 0.75rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.3s ease;
}

.login-btn:hover {
    background: #5a6fd1;
}
</style>
