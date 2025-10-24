<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <button @click="logout" class="logout-link-button">Sair</button>
    </nav>
    <notifications 
      position="top right"  
      classes="my-notification-style" 
      group="app-alerts"
      :duration="4000"
    />
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios';
// O componente precisa do $router para redirecionar

export default {
    name: 'App',
    
    methods: {
        async logout() {
            try {
              await axios.post('logout'); 
                
            } catch (error) {
                console.error("Erro ao tentar deslogar no servidor:", error);
            } finally {
                
                localStorage.removeItem('userToken');
                localStorage.removeItem('user'); 
                
                this.$router.push({ name: 'login' }); 
            }
        },
    }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.vue-notification {
  padding: 15px;
  margin: 0 5px 5px;
  font-size: 14px;
  color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.vue-notification.success {
  background: #4CAF50; /* Verde */
  border-left: 5px solid #388E3C;
}

.vue-notification.error {
  background: #F44336; /* Vermelho */
  border-left: 5px solid #D32F2F;
}

.vue-notification.info {
  background: #2196F3; /* Azul */
  border-left: 5px solid #1976D2;
}


.notifications {
    z-index: 9999;
}

.logout-link-button {
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    
    color: black;
    cursor: pointer; 
    text-decoration: none; 
    font-size: 16px;
    line-height: normal; 
}

.logout-link-button:hover {
    text-decoration: underline;
    color: #ff6e6e; 
}
</style>
