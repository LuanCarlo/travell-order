<script>
import axios from 'axios';

export default {
  name: 'UserRegister', 
  
  data() {
    return {
      name: '',
      email: '',
      password: '',
      passwordConfirmation: '', 
      errorMessage: '',
      isLoading: false,
    };
  },
  
  methods: {
    async userRegister() {
      this.errorMessage = '';
      this.isLoading = true;

      if (!this.name || !this.email || !this.password || !this.passwordConfirmation) {
        this.errorMessage = 'Por favor, preencha todos os campos.';
        this.isLoading = false;
        return;
      }

      if (this.password !== this.passwordConfirmation) {
        this.errorMessage = 'A senha e a confirmação de senha não coincidem.';
        this.isLoading = false;
        return;
      }

      try {
        
        const response = await axios.post(`register`, {
          name: this.name,
          email: this.email,
          password: this.password,
          password_confirmation: this.passwordConfirmation,
        });

        const token = response.data.token;
        const user = response.data.user;
        
        localStorage.setItem('userToken', token);
        localStorage.setItem('user', JSON.stringify(user)); 

        this.$notify({
            group: 'app-alerts',
            title: 'Sucesso!',
            text: 'Conta criada e login realizado.',
            type: 'success'
        });

        setTimeout(() => {
          this.$router.push({ path: '/ordersList' });
        }, 1000);

      } catch (error) {
        this.isLoading = false;
        let errorMsg = 'Erro ao tentar registrar. Verifique os dados.';
        
        if (error.response && error.response.status === 422) {
            const errors = error.response.data.errors;
            errorMsg = Object.values(errors).flat().join(' | ');
        }
        
        this.errorMessage = errorMsg;
        
        this.$notify({
            group: 'app-alerts',
            title: 'Erro de Registro',
            text: errorMsg,
            type: 'error'
        });
      } finally {
          this.isLoading = false;
      }
    },
    goToLogin() {
      this.$router.push({ name: 'login' });
    }
  },
};
</script>
<template>
  <div class="register-container">
    <form @submit.prevent="userRegister" class="register-form">
      <h2>Criar Nova Conta</h2>
      
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div class="form-group">
        <label for="name">Nome Completo</label>
        <input 
          id="name" 
          type="text" 
          v-model="name" 
          required 
          placeholder="Seu Nome"
        />
      </div>
      
      <div class="form-group">
        <label for="email">E-mail</label>
        <input 
          id="email" 
          type="email" 
          v-model="email" 
          required 
          placeholder="seu@email.com"
        />
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input 
          id="password" 
          type="password" 
          v-model="password" 
          required 
          placeholder="******"
        />
      </div>

      <div class="form-group">
        <label for="password_confirmation">Confirmar Senha</label>
        <input 
          id="password_confirmation" 
          type="password" 
          v-model="passwordConfirmation" 
          required 
          placeholder="******"
        />
      </div>

      <button type="submit" :disabled="isLoading" class="register-button">
        <span v-if="isLoading">Registrando...</span>
        <span v-else>Cadastrar</span>
      </button>

      <button @click.prevent="goToLogin" class="back-button">
        Login
      </button>

    </form>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.register-form {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px; 
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.register-button {
  width: 100%;
  padding: 12px;
  background-color: #28a745; 
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.register-button:hover:not(:disabled) {
  background-color: #1e7e34;
}

.register-button:disabled {
    background-color: #94d3a2;
    cursor: not-allowed;
}

.back-button {
    width: 100%;
    margin-top: 10px;
    padding: 10px;
    background: none;
    color: #007bff;
    border: none;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
}
.back-button:hover {
    text-decoration: underline;
}

.error-message {
  color: #e3342f; 
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 0.9em;
}
</style>