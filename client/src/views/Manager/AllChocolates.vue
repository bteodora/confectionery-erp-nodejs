<template>
  <div>
    <ManagerNavbar/>
    <div class="card-container">
      <ChocolateCard v-for="chocolate in chocolates" :key="chocolate.id" :chocolate="chocolate"/>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/utils/axiosInstance';
import ChocolateCard from '@/components/ChocolateCard.vue';
import ManagerNavbar from '@/components/Manager/ManagerNavbar.vue';

export default {
  name: 'ChocolatesView',
  components: {
    ChocolateCard,
    ManagerNavbar
  },
  data() {
    return {
      factoryId: '',
      chocolates: []
    };
  },
  async mounted() {
    try {
      console.log('Fetching factory ID...');
      const factoryResponse = await axiosInstance.get('/user/factoryid');
      this.factoryId = factoryResponse.data.factoryId;
      console.log('Factory ID fetched:', this.factoryId);

      if (this.factoryId) {
        console.log(`Fetching chocolates for factory ID: ${this.factoryId}`);
        const chocolatesResponse = await axiosInstance.get(`/chocolate/${this.factoryId}`);
        this.chocolates = chocolatesResponse.data;
        console.log('Chocolates fetched:', this.chocolates);
      } else {
        console.error('Factory ID is not available');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('An error occurred while fetching data');
    }
  }
};
</script>

<style scoped>
.card-container {
  display: flex;
  margin-top: 2%;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
