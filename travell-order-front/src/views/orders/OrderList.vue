<script>
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'OrderListView',
  components: {
    LoadingSpinner,
  },  
  data() {
    return {
      orders: [], 
      ordersStatus: [],   
      editingOrderId: null,     
      isLoading: true, 
      error: null,
      filterStatus: null,
      filterDestination: null,
      filterDateStart:null,
      filterDateEnd:null,
      debounceTimeout: null,
      user:null,
    };
  }, 
  mounted() {
    this.getOrders();
    this.getOrderStatus();

    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString);
    } 

  },
  
  methods: {

    async getOrders() {
      this.isLoading = true;
      this.error = null;
      
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      
      const params = new URLSearchParams();
      if (this.filterStatus) params.append('filterStatus', this.filterStatus);
      if (this.filterDestination) params.append('filterDestination', this.filterDestination);
      if (this.filterDateStart) params.append('filterDateStart', this.filterDateStart);
      if (this.filterDateEnd) params.append('filterDateEnd', this.filterDateEnd); 
      const queryString = params.toString();

      try {
        let data = await axios.get(`orders?${queryString}`);

        if (data.data?.status == 200 && data.data?.record?.length > 0) {

          this.orders = data.data.record;
        }

      } catch (error) {
      
        console.error("Falha ao buscar solicitações:", error);
        this.error = 'Não foi possível carregar a lista de solicitações. Tente novamente.';
      } finally {
        this.isLoading = false;
      }
    },
    async getOrderStatus() {
      this.isLoading = true;
      this.error = null;

      let ordersStatus = [
        {value:null, label: 'Selecione'}
      ];
      
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

    },
    startEdit(orderId) {
      this.editingOrderId = orderId;
    },
    stopEdit() {
      setTimeout(() => {
        this.editingOrderId = null;
      }, 300); 
    }, 
    async updateStatus(order, newStatus, label) {

      
      const statusArray = this.ordersStatus.filter(statusItem => statusItem.value == newStatus);
      
      const originalStatus = order.order_status_id;
      order.order_status_id = newStatus;
      order.status = statusArray[0]?.label;

      try {

        const response = await axios.patch(`orders/updateStatusOrder/${order.id}`, {
         status:newStatus
        });
        

      } catch (error) {

        order.order_status_id = originalStatus;

        const statusArray = this.ordersStatus.filter(statusItem => statusItem.value == originalStatus);
        order.status = statusArray[0]?.label;

        let message = 'Erro ao atualizar o status do pedido. Tente novamente.';
        if (error.response && error.response.status === 403) {

          if (error.response?.data?.message) {
            message = error.response.data.message
          }
        }     

        this.$notify({
          group: 'app-alerts',
          title: 'Erro de Registro',
          text: message,
          type: 'error'
        });
        console.error(message);
      }
    },  
    goToNewOrder() {
      this.$router.push({ path: '/order/create' });
    },
    editOrder(orderId) {
      this.$router.push({ 
        name: 'OrderEdit', 
        params: { 
          id: orderId 
        } 
      });
    },
    debounceGetOrders() {
      if (this.debounceTimeout) {
          clearTimeout(this.debounceTimeout);
      }
      this.debounceTimeout = setTimeout(() => {
          this.getOrders();
      }, 500);
    },
    clearFilter() {

      this.filterStatus = null,
      this.filterDestination = null,
      this.filterDateStart = null,
      this.filterDateEnd = null,
      this.filterStatus = null;
      this.getOrders();
    }
  }
};
</script>

<template>
  <div class="orders-container">
    <LoadingSpinner :show="isLoading" text="Buscando pedidos de viagem..." />
    <div class="header">
      <h4>Lista de Pedidos de Viagem</h4>

      <div class="filter-group">
        <input 
          id="destination-filter"
          type="text" 
          v-model="filterDestination" 
          @input="debounceGetOrders" 
          placeholder="Buscar por destino..."
          class="text-filter"
        />
      </div>

      <div class="filter-group date-filter-group">
        <label for="date-start" class="filter-label">De:</label>
        <input 
          id="date-start" 
          type="date" 
          v-model="filterDateStart" 
          @change="getOrders"
          class="date-filter"
        />
        
        <label for="date-end" class="filter-label">Até:</label>
        <input 
          id="date-end" 
          type="date" 
          v-model="filterDateEnd" 
          @change="getOrders"
          class="date-filter"
        />
      </div>

      <select
        v-model="filterStatus"
        @change="getOrders"
        class="status-select-filter"
      >        
        <option
          v-for="option in ordersStatus"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <button @click="clearFilter()" class="clear-button">
        Limpar
      </button>
      <button @click="goToNewOrder" class="add-button">
        + Novo
      </button>
    </div>

    <div v-if="isLoading" class="status-message loading">
      Carregando lista de pedidos de viagem...
    </div>

    <div v-else-if="error" class="status-message error">
      {{ error }}
      <button @click="getOrders" class="retry-button">Tentar Novamente</button>
    </div>

    <div v-else-if="orders.length === 0" class="status-message empty">
      Nenhum pedido encontrado. Clique em "Novo Pedido" para cadastrar o primeiro.
    </div>

    <div v-else class="order-list">
      <table class="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Solicitante</th>
            <th>Destino</th>
            <th>Data de Partida</th>
            <th>Data de Retorno</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td @click="editOrder(order.id)" class="clicable-td">{{ order.id }}</td>
            
            <td @click="editOrder(order.id)" class="clicable-td">{{ order.user }}</td>

            <td>{{ order.destination }}</td>
            
            <td>{{ order.departure_date }}</td>
            
            <td>{{ order.return_date }}</td>
            
            <td 
              class="status-cell"
              @mouseover="startEdit(order.id)" 
              @mouseleave="stopEdit"
            >
              
              <select 
                v-if="editingOrderId === order.id && user.admin == 1" 
                :value="order.order_status_id"
                @change="updateStatus(order, $event.target.value, order.status)"
                class="status-select-editable"
              >
                <option 
                  v-for="option in ordersStatus" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              
              <span 
                v-else
                :class="['status-badge', order.status.toLowerCase()]"
              >
                {{ order.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.orders-container {
  max-width: 1100px;
  margin: 0px auto 40px auto;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
    display: flex; 
    align-items: center;
    gap: 15px; 
    margin-bottom: 20px;
}

.filter-group {
    display: flex;
    align-items: center;
}

.filter-label {
  font-size: 12px;
  margin-right: 5px;
  white-space: nowrap; 
}

.text-filter, .date-filter, .status-select {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.date-filter-group {
    /* Ajusta o espaçamento dentro do grupo de datas */
    gap: 5px; 
}

h1 {
  font-size: 1.8em;
  color: #333;
}

.add-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
  margin-left: auto;
}


.add-button:hover {
  background-color: #0056b3;
}

.clear-button {
  padding: 10px 15px;
  background-color: #ff0000;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
}

/* Estilos da Lista */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.order-info strong {
  display: block;
  font-size: 1.1em;
  color: #333;
}

.order-info small {
  color: #777;
}

.order-value {
  font-weight: bold;
  color: #28a745; /* Verde para valores */
  font-size: 1.2em;
}

/* Estilos de Status */
.status-message {
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  font-size: 1.1em;
}

.loading {
  background-color: #e9f7ff;
  color: #007bff;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.empty {
  background-color: #fff3cd;
  color: #856404;
}

.retry-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table-container {
  overflow-x: auto; /* Permite rolagem horizontal em telas pequenas */
}

.order-table {
  width: 100%;
  border-collapse: collapse; /* Remove o espaçamento entre bordas */
  text-align: left;
}

.order-table th,
.order-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
}

.order-table th {
  background-color: #f4f4f4;
  color: #555;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.9em;
}

.order-table tr:hover {
  background-color: #f0f8ff; /* Fundo azul claro ao passar o mouse */
}

/* Estilos para a coluna Status (Badges) */
.status-badge {
  display: inline-block;
  padding: 5px 8px;
  border-radius: 15px;
  font-size: 0.85em;
  font-weight: bold;
  text-transform: capitalize;
}

/* Cores de Exemplo para Status */
.status-badge.solicitado {
  background-color: #ffc107;
  color: #6a4a00;
}

.status-badge.aprovado {
  background-color: #28a745;
  color: white;
}

.status-badge.cancelado {
  background-color: #dc3545;
  color: white;
}

.status-select-editable {
  width: 100%;
  height: 100%;
  padding: 2px 10px; 
  border: 1px solid #007bff; /* Borda sutilmente azul para indicar foco/edição */
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
  
  -webkit-appearance: none; 
  -moz-appearance: none;
  appearance: none; 
  
  background-color: #f7f9fb; 
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007bff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13.2-5.4H18.6c-5%200-9.3%201.8-13.2%205.4A17.6%2017.6%200%200%200%200%2082.6c0%204.8%201.8%209.1%205.4%2013.2l128%20128c3.9%203.8%208.2%205.6%2013%205.6s9.1-1.8%2013-5.6l128-128c3.8-3.9%205.6-8.2%205.6-13.2%200-5-1.8-9.3-5.6-13.2z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right 10px top 50%;
  background-size: 10px auto;
  
  cursor: pointer;
}

.status-select-filter {
    padding: 10px 30px 10px 15px; 
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 12px;    
    background-color: #f7f7f7; 
    background-repeat: no-repeat;
    background-position: right 10px top 50%;
    background-size: 10px auto; 
    
    cursor: pointer;
    transition: border-color 0.2s;
}

.status-select {
    padding: 10px 30px 10px 15px; 
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1em;
    height: 40px; 
    
    background-color: #f7f7f7; 
    background-repeat: no-repeat;
    background-position: right 10px top 50%;
    background-size: 10px auto; 
    
    cursor: pointer;
    transition: border-color 0.2s;
}

.status-select:hover {
    border-color: #007bff; 
}

.status-select:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.clicable-td {
  cursor: pointer;
}
</style>