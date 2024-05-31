<template>
  <div class="card" :class="{ 'bg-lightgray': chocolate.status === 'OutOfStock' }">
    <img :src="imgSrc" class="card-img-top" alt="Chocolate Image">
    <div class="card-body">
      <h5 class="card-title">{{ chocolate.name }}</h5>
      <p class="card-text"><b>Status: {{ chocolate.status }}</b></p>
      <p class="card-text">Category: {{ chocolate.category }}</p>
      <p class="card-text">Type: {{ chocolate.type }}</p>
      <p class="card-text">Weight: {{ chocolate.weight }} grams</p>
      <p class="card-description">{{ chocolate.description }}</p>
      <p class="card-price"><b>Price: {{ chocolate.price.toFixed(2) }} DIN</b></p>
      <div class="card-buttons">
        <button class="btn btn-primary" @click="updateChocolate">Update</button>
        <button class="btn btn-danger" @click="deleteChocolate">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance, { baseURL } from '@/utils/axiosInstance';

export default {
  name: 'ChocolateCard',
  props: {
    chocolate: Object
  },
  data() {
    return {
      imgSrc: ''
    };
  },
  mounted() {
    this.imgSrc = `${baseURL}/chocolate/img/${this.chocolate.id}`;
    // console.log(this.imgSrc);
  },
  methods: {
    updateChocolate() {
      // Handle the update logic here
      console.log(`Updating chocolate with ID: ${this.chocolate.id}`);
    },
    deleteChocolate() {
        console.log(`Attempting to delete chocolate with ID: ${this.chocolate.id}`);
        alert(this.chocolate.id);
          let endpoint = `/chocolate/deletechocolate/${this.chocolate.id}`
          axiosInstance.delete(endpoint)
            .then(() => {
                alert('Chocolate was successfully deleted');
            })
            .catch(error => {
                alert(error)
                console.error(`Error deleting chocolate with ID: ${this.chocolate.id}: ${error.message}`);
                alert('An error occurred while trying to delete the chocolate');
            });
    }
  }
};
</script>

<style scoped>
.card {
  width: 25rem;
  border-radius: 10px;
  box-shadow: 2px 2px 2px lightblue;
  margin: 20px;
  transition: background-color 0.3s ease;
  display: flex;
  flex-direction: column;
}
.bg-lightgray {
  background-color: lightgray;
}
.card-img-top {
  width: 100%;
  height: 16rem;
  border-radius: 10px 10px 0 0;
  border-bottom: 1px solid gray;
  object-fit: cover;
}
.card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}
.card-title {
  margin-bottom: 0.5rem;
}
.card-text {
  margin-bottom: 0.5rem;
}
.card-description {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}
.card-price {
  margin-top: 1rem;
  font-size: 1.25rem;
}
.card-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.btn {
  width: 48%;
}
</style>
