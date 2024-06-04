<template>
  <div>
    <div class="card" :class="{ 'bg-lightgray': chocolate.status === 'OutOfStock' }">
      <img :src="imgSrc" class="card-img-top" alt="Chocolate Image">
      <div class="card-body">
        <h5 class="card-title">{{ chocolate.name }}</h5>
        <p class="card-text" :class="statusClass">Status: {{ chocolate.status }}<span v-if="chocolate.status === 'InStock'"> (Quantity: {{ chocolate.quantity }})</span></p>
        <p class="card-text">Category: {{ chocolate.category }}</p>
        <p class="card-text">Type: {{ chocolate.type }}</p>
        <p class="card-text">Weight: {{ chocolate.weight }} grams</p>
        <p class="card-description">{{ chocolate.description }}</p>
        <p class="card-price"><b>Price: {{ chocolate.price.toFixed(2) }} DIN</b></p>
        <div class="card-buttons" v-if="role === 'manager'">
          <button class="btn btn-primary" @click="openUpdateModal">Update</button>
          <button class="btn btn-danger" @click="deleteChocolate">Delete</button>
        </div>
        <div v-if="role === 'staff'" class="staff-button">
          <button class="btn btn-success" @click="openQuantityModal">Add chocolate</button>
        </div>
      </div>
    </div>

    <!-- Modal for updating chocolate -->
    <div class="modal fade" :id="'updateModal-' + chocolate.id" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="updateModalLabel">Update Chocolate</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Form fields for updating chocolate -->
            <div class="container" style="width: 100%;">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" class="form-control" v-model="chocolateForm.name" />
              </div>
              <div class="mb-3">
                <label class="form-label">Price</label>
                <input type="number" class="form-control" v-model="chocolateForm.price" />
              </div>
              <div class="mb-3">
                <label class="form-label">Type</label>
                <select class="form-select" v-model="chocolateForm.type">
                  <option value="black">Black</option>
                  <option value="white">White</option>
                  <option value="milk">Milk</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Category</label>
                <select class="form-select" v-model="chocolateForm.category">
                  <option value="cooking">Chocolate for cooking</option>
                  <option value="drinking">For drinking</option>
                  <option value="regular">Regular</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Weight (grams)</label>
                <input type="number" class="form-control" v-model="chocolateForm.weight" />
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea class="form-control" v-model="chocolateForm.description"></textarea>
              </div>
              <div class="errorText">{{ errorMessage }}</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="updateChocolateDetails">Update</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for updating chocolate quantity -->
    <div class="modal fade" :id="'quantityModal-' + chocolate.id" tabindex="-1" aria-labelledby="quantityModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="quantityModalLabel">Update Chocolate Quantity</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="container" style="width: 100%;">
              <div class="mb-3 d-flex align-items-center">
                <button class="btn btn-secondary" @click="decreaseQuantity">-</button>
                <input type="number" class="form-control mx-2" v-model="newQuantity" readonly/>
                <button class="btn btn-secondary" @click="increaseQuantity">+</button>
              </div>
              <div class="errorText">{{ quantityErrorMessage }}</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="updateQuantity">Update Quantity</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance, { baseURL, getUserProfile } from '@/utils/axiosInstance';

export default {
  name: 'ChocolateCard',
  props: {
    chocolate: Object
  },
  data() {
    return {
      imgSrc: '',
      role: '',
      chocolateForm: {
        name: '',
        price: 0,
        type: '',
        category: '',
        weight: 0,
        description: ''
      },
      errorMessage: '',
      newQuantity: 0,
      quantityErrorMessage: ''
    };
  },
  mounted() {
    this.imgSrc = `${baseURL}/chocolate/img/${this.chocolate.id}`;
    this.role = getUserProfile().role;
    this.newQuantity = this.chocolate.quantity;
  },
  computed: {
    statusClass() {
      return {
        'text-danger': this.chocolate.status === 'OutOfStock',
        'text-success': this.chocolate.status === 'InStock'
      };
    }
  },
  methods: {
    openUpdateModal() {
      this.chocolateForm = { ...this.chocolate };
      this.$nextTick(() => {
        const updateModal = new bootstrap.Modal(document.getElementById('updateModal-' + this.chocolate.id));
        updateModal.show();
      });
    },
    openQuantityModal() {
      this.newQuantity = this.chocolate.quantity;
      this.$nextTick(() => {
        const quantityModal = new bootstrap.Modal(document.getElementById('quantityModal-' + this.chocolate.id));
        quantityModal.show();
      });
    },
    increaseQuantity() {
      this.newQuantity++;
    },
    decreaseQuantity() {
      if (this.newQuantity > this.chocolate.quantity) {
        this.newQuantity--;
      }
    },
    updateChocolateDetails() {
      if (this.validateForm()) {
        const endpoint = '/chocolate/updatechocolate';
        axiosInstance.post(endpoint, this.chocolateForm)
          .then(response => {
            alert('Chocolate was successfully updated');
            location.reload();
          })
          .catch(error => {
            console.error(`Error updating chocolate with ID: ${this.chocolate.id}: ${error.message}`);
            alert('An error occurred while trying to update the chocolate: ' + error);
          });
      }
    },
    validateForm() {
      if (!this.chocolateForm.name || !this.chocolateForm.price || !this.chocolateForm.type ||
          !this.chocolateForm.category || !this.chocolateForm.weight || !this.chocolateForm.description) {
        this.errorMessage = 'All fields are required';
        return false;
      }
      this.errorMessage = '';
      return true;
    },
    updateQuantity() {
      alert('Updating Quantity. New quantity:' + this.newQuantity + 'Current quantity:' + this.chocolate.quantity);
      console.log('Updating Quantity. New quantity:', this.newQuantity, 'Current quantity:', this.chocolate.quantity);
      if (this.newQuantity < this.chocolate.quantity) {
        this.quantityErrorMessage = 'New quantity cannot be less than the current quantity';
        return;
      }
      const endpoint = `/chocolate/updatequantity/${this.chocolate.id}`;
      axiosInstance.post(endpoint, { quantity: this.newQuantity })
        .then(response => {
          alert('Chocolate quantity was successfully updated');
          location.reload();
        })
        .catch(error => {
          console.error(`Error updating quantity for chocolate with ID: ${this.chocolate.id}: ${error.message}`);
          alert('An error occurred while trying to update the chocolate quantity: ' + error);
        });
    },
    deleteChocolate() {
      const endpoint = `/chocolate/deletechocolate/${this.chocolate.id}`;
      axiosInstance.delete(endpoint)
        .then(() => {
          alert('Chocolate was successfully deleted');
          location.reload();
        })
        .catch(error => {
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
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.card-price {
  margin-top: auto;
  font-size: 1.25rem;
}
.card-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.staff-button {
  margin-top: 1rem;
}
.btn {
  width: 48%;
}
.text-danger {
  color: red;
}
.text-success {
  color: green;
}
.errorText {
  color: red;
}
</style>
