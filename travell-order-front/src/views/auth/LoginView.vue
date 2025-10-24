<script>
import axios from 'axios';

export default {
  // O nome do componente deve ser multi-palavra, como corrigimos
  name: 'UserLogin', 
  
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      api : process.env.VUE_APP_API_BASE_URL,
    };
  },
  
  methods: {
    async userLogin() {
      this.errorMessage = '';

      if (!this.email || !this.password) {
        this.errorMessage = 'Por favor, preencha o e-mail e a senha.';
        return;
      }

      try {
        const response = await axios.post(`login`, {
          email: this.email,
          password: this.password,
        });

        const token = response.data.token;
        const user = response.data.user;
        
        localStorage.setItem('userToken', token);
        localStorage.setItem('user', JSON.stringify(user)); 

        this.$router.push({ path: '/ordersList' });

      } catch (error) {
        this.errorMessage = 'E-mail ou senha inválidos. Tente novamente.';
      }
    },
    goToRegister() {
      this.$router.push({ path: '/register' });
    } 
  },
  mounted() {
   
    console.log('API Base URL:', process.env.VUE_APP_API_BASE_URL);

    this.$notify({
        group: 'foo',
        title: 'Sucesso',
        text: 'Dados atualizados com sucesso!',
        type: 'success'
    });
  },
};
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="userLogin" class="login-form">
      <h2>Acesso ao Sistema</h2>
      
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

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

      <button type="submit" class="login-button">Entrar</button>
      <div @click="goToRegister()" class="register-access">Registrar</div>


    </form>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.login-form {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 350px;
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

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* Garante que padding não aumente o tamanho total */
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #e3342f; /* Vermelho vibrante */
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 0.9em;
}

.register-access {
  margin-top: 5%;
  text-decoration: underline;
  cursor: pointer;
}
</style>