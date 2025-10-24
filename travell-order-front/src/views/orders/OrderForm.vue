<script>
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'OrderFormView',
  components: {
    LoadingSpinner,
  },  
  data() {
    return {
      order: {
        id: null,
        destination: null,
        departure_date: this.formatDateForInput(new Date()),
        return_date: this.formatDateForInput(new Date()),
        user_id: null,
      },
      isLoading: false,
      isEditing: false,
      errorMessage: null,
      successMessage: null,
      ordersStatus: [],
      originalOrderStatus: null,
      user:null,
    };
  },
  

  mounted() {
    this.getOrderStatus();
    if (this.$route.params.id) {
      this.isEditing = true;
      this.order.id = this.$route.params.id;
      this.getOrder(this.order.id);
    }

    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
    } 

    if (this.isEditing == false && this.user) {
      this.order.userName = this.user.name;
      this.order.user_id = this.user.id;
    }

          console.log(this.isEditing, this.user.admin);

  },

  methods: {
    formatDateForInput(dateString) {
       if (!dateString) return '';
        
        let formattedString = String(dateString);

        if (formattedString.includes(' ')) {
        
            formattedString = formattedString.replace(' ', 'T').substring(0, 16);
        } else if (formattedString.includes('T')) {
             formattedString = formattedString.substring(0, 16);
        }
        
        return formattedString;
    },
    async getOrder(id) {
      this.isLoading = true;
      try {
        const data = await axios.get(`orders/getOrder/${id}`); 
    
        if (data.data.status == 200) {

            this.order = data.data.record;
            this.order.userName = this.order.user.name;
            this.originalOrderStatus = this.order.order_status_id;
        } else {
            this.errorMessage = 'Erro ao carregar os dados do pedido de viagem.';
        }
      } catch (error) {
        this.errorMessage = 'Erro ao carregar os dados do pedido de viagem.';
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    

    async saveOrder() {
      this.errorMessage = null;
      this.successMessage = null;
      this.isLoading = true;
      
      try {
        let response;
        
        if (!this.isEditing) {
          delete this.order.id;
        }
        
        if (this.isEditing) {
          response = await axios.put(`orders/update/${this.order.id}`, this.order);
          this.successMessage = 'Pedido atualizado com sucesso!';

          
        } else {
          response =  await axios.post(`orders/`, this.order);
          this.successMessage = 'Pedido criado com sucesso!';
          this.isEditing = true;
          this.order.id = response.id; 

        }

        this.$notify({
          group: 'app-alerts',
          title: 'Sucesso!',
          text: this.successMessage,
          type: 'success'
        });

        setTimeout(() => {
          this.$router.push({ name: 'ordersList' });
        }, 2000);

      } catch (error) {

        this.isLoading = false;
        let errorMsg = 'Erro ao tentar registrar. Verifique os dados.';
        
        if (error.response && error.response.status === 422) {
            const errors = error.response.data.errors;
            errorMsg = Object.values(errors).flat().join(' | ');
        }

        if (error.response && error.response.status === 403) {

          if (error.response?.data?.message) {
            errorMsg = error.response.data.message
          }

          this.order.order_status_id = this.originalOrderStatus;

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
    async getOrderStatus() {
      this.isLoading = true;
      this.error = null;

      let ordersStatus = [];
      
      try {
        let data = await axios.get(`orders/orderStatus`);

        if (data.data?.status == 200 && data.data?.record?.length > 0) {

          data.data?.record?.forEach(element => {
            ordersStatus.push({value:element.id, label: element.status});
          });
        }

        this.ordersStatus = ordersStatus;

      } catch (error) {
      
        console.error("Falha ao buscar status:", error);
        this.error = 'Não foi possível carregar a lista de status. Tente novamente.';

        
      } finally {
        this.isLoading = false;
      }

    }
  },
  
  computed: {
    pageTitle() {
      return this.isEditing ? 'Editar Pedido #' + this.order.id : 'Novo Pedido';
    },
    isNotEditable() {

      if (this.isEditing == false || (this.user.id == this.order.user_id || this.user.admin == 1) 
      && (this.order.order_status_id == 1 || this.order.order_status_id == null)){
        return false;
      }

      return true;
    },
    cantChangeStatus() {


      if (this.isEditing == true && this.user.admin == 1){
        return false;
      }

      return true;
    }
  }
};
</script>

<template>
  <div class="form-container">
    <LoadingSpinner :show="isLoading" text="Salvando pedido de viagem..." />

    <h1 class="title">{{ pageTitle }}</h1>

    <div v-if="isLoading && !order.cliente" class="status-message loading">
      Carregando dados do order...
    </div>
    
    <div v-if="errorMessage" class="status-message error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="status-message success">{{ successMessage }}</div>
    
    <form v-if="!isLoading || order.user_id" @submit.prevent="saveOrder" class="order-form">
      
      <div class="form-group">
        <label for="user_id">Solicitante</label>
        <input id="userName" v-model="order.userName" type="text" :disabled="true">
      </div>

      <div class="form-group">
        <label for="user_id">Destino</label>
        <input id="destination" v-model="order.destination" type="text" required :disabled="isNotEditable">
      </div>

      <div class="form-group">
        <label for="departure_date">Data de Partida</label>
        <input id="departure_date" v-model="order.departure_date" type="datetime-local" required :disabled="isNotEditable">
      </div>

      <div class="form-group">
        <label for="return_date">Data de Retorno</label>
        <input id="return_date" v-model="order.return_date" type="datetime-local" required :disabled="isNotEditable">
      </div>
      
      <div v-if="isEditing" class="form-group">
        <label for="status">Status Atual</label>
        <select id="status" v-model="order.order_status_id" :disabled="cantChangeStatus">
          <option v-for="status in ordersStatus" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="isLoading || (isNotEditable && cantChangeStatus)" class="save-button">
          {{ isEditing ? 'Salvar Edição' : 'Criar Pedido' }}
        </button>
        <button @click="$router.go(-1)" type="button" class="back-button">Voltar</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.form-container { max-width: 600px; margin: 40px auto; padding: 30px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
.title { font-size: 2em; color: #333; margin-bottom: 25px; text-align: center; }
.order-form { display: grid; gap: 20px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: 600; color: #555; }
.form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 1em; }
.form-actions { display: flex; justify-content: space-between; margin-top: 20px; }
.save-button, .back-button { padding: 12px 25px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; transition: background-color 0.3s; }
.save-button { background-color: #007bff; color: white; }
.save-button:hover:not(:disabled) { background-color: #0056b3; }
.save-button:disabled { background-color: #a0c3e8; cursor: not-allowed; }
.back-button { background-color: #6c757d; color: white; }
.back-button:hover { background-color: #5a6268; }
.status-message { padding: 15px; border-radius: 4px; margin-bottom: 20px; text-align: center; }
.loading { background-color: #e9f7ff; color: #007bff; }
.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
</style>