<template>
	<AdminNavbar />
	<div class="containerCenter col-4">
		<h3 class="bg-secondary formHeader">Register factory</h3><br>
		<div class="mb-3">
			<label class="form-label">Name</label>
			<input type="text" class="form-control" v-model="name" />
		</div>
		<div class="mb-3">
			<label class="form-label">Logo</label>
			<input class="form-control" type="file" ref="fileInput" multiple="false" />
		</div>
		<div class="mb-3">
			<label class="form-label">Start of working hours</label>
			<input type="time" class="form-control" v-model="startWorkTime" />
		</div>
		<div class="mb-3">
			<label class="form-label">End of working hours</label>
			<input type="time" class="form-control" v-model="endWorkTime" />
		</div>
		<div class="mb-3">
			<label class="form-label">Location</label>
			<div id="map"></div>
		</div>

		<div class="row g-3 mb-3">
			<div class="col-md-6">
				<label class="form-label">Street & number</label>
				<input type="text" class="form-control" v-model="location.address" />
			</div>
			<div class="col-md-4">
				<label class="form-label">City</label>
				<input type="text" class="form-control" v-model="location.city">
			</div>
			<div class="col-md-2">
				<label class="form-label">Zip</label>
				<input type="text" class="form-control" v-model="location.zip">
			</div>
		</div>

		<div class="mb-3">
			<label class="form-label">Manager</label>

			<div class="d-flex align-items-center">
				<select class="form-select" v-model="managerId">
					<option value="" disabled selected></option>
					<option v-for="manager in managers" :value="manager.username">
						{{ manager.username + " - " + manager.name + " " + manager.surname }}</option>
				</select>
				<button type="button" class="btn btn-primary text-nowrap mx-3" data-bs-toggle="modal"
					data-bs-target="#registerModal" v-on:click="refreshModal()">Register new</button>
			</div>
		</div>

		<div class="errorText">{{ errorMessage }}</div><br>
		<button class="btn btn-primary" v-on:click="register()">Submit</button>

		<div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="exampleModalLabel">Register manager</h5>
					</div>
					<div class="modal-body">
						<RegisterForm ref="registerForm" role="manager" endpoint="/user/register/manager"/>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import AdminNavbar from '@/components/Admin/AdminNavbar.vue';
import RegisterForm from '@/components/RegisterForm.vue';
import axiosInstance, { logoutUser } from '@/utils/axiosInstance';

export default {
	name: 'RegisterFactory',
	components: {
		AdminNavbar,
		RegisterForm
	},
	data() {
		return {
			name: '',
			logo: '',
			startWorkTime: '',
			endWorkTime: '',
			managerId: '',
			location: {
				lon: null,
				lat: null,
				address: '',
				city: '',
				zip: '',
			},
			errorMessage: '',
			managers: []
		}
	},
	methods: {
		setupMap() {
			let map = new ol.Map({
				layers: [
					new ol.layer.Tile({
						source: new ol.source.OSM(),
						preload: 1
					})
				],
				target: 'map',
				view: new ol.View({
					center: ol.proj.fromLonLat([19.851608646943994, 45.24622446340179]),
					zoom: 15,
					maxZoom: 18,
					minZoom: 7
				})
			});

			let vectorSource = new ol.source.Vector({});
			let vectorLayer = new ol.layer.Vector({ source: vectorSource });
			map.addLayer(vectorLayer);

			let markerStyle = new ol.style.Style({
				image: new ol.style.Icon({
					anchor: [16, 64],
					anchorXUnits: 'pixels',
					anchorYUnits: 'pixels',
					scale: 0.7,
					src: 'https://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png'
				})
			});

			map.on('click', (event) => {
				vectorSource.clear();

				let coordinate = event.coordinate;
				let lonLat = ol.proj.toLonLat(coordinate)
				this.location.lon = lonLat[0];
				this.location.lat = lonLat[1];

				let marker = new ol.Feature({
					geometry: new ol.geom.Point(coordinate)
				});

				marker.setStyle(markerStyle)

				vectorSource.addFeature(marker);
			});

			map.on('moveend', () => {
				map.render();
			});
		},
		getManagers() {
			axiosInstance.get('/user/manager/available')
				.then(response => {
					this.managers = response.data;
				})
				.catch(error => {
					console.log(error);
				});
		},
		validate() {
			if (this.name === '') {
				this.errorMessage = 'All fields are required';
				return false;
			}
			if (this.startWorkTime === '') {
				this.errorMessage = 'All fields are required';
				return false;
			}
			if (this.endWorkTime === '') {
				this.errorMessage = 'All fields are required';
				return false;
			}
			if (this.location.address === '') {
				this.errorMessage = 'All fields are required';
				return false;
			}
			if (this.location.city === '') {
				this.errorMessage = 'All fields are required';
				return false;
			}
			if (this.location.zip === '') {
				this.errorMessage = 'All fields are required';
				return false;
			}
			if (this.managerId === '') {
				this.errorMessage = 'All fields are required';
				return false;
			}
			if (this.location.lat === null || this.location.lon === null) {
				this.errorMessage = 'Location is required';
				return false;
			}
			if (this.startWorkTime >= this.endWorkTime) {
				this.errorMessage = 'End hours must be after start working hours';
				return false;
			}
			if (this.$refs.fileInput.files.length === 0) {
				this.errorMessage = 'Logo is required';
				return false;
			}

			return true;
		},
		async register() {
			if (!this.validate())
				return;

			try {
				const response1 = await axiosInstance.post('/factory/register', {
					name: this.name,
					startWorkTime: this.startWorkTime,
					endWorkTime: this.endWorkTime,
					managerId: this.managerId,
					location: this.location
				});

				const factoryId = response1.data.factoryId;
				const img = this.$refs.fileInput.files[0];
				const formData = new FormData();
				formData.append('img', img);

				const response2 = await axiosInstance.post(`/factory/img/upload/${factoryId}`, formData)

				alert(response1.data.message + '\n' + response2.data.message);
				this.$router.push('/admin');
			}
			catch (error) {
				console.log(error.response.data.message);
				return;
			}
		},
		refreshModal(){
			this.$refs.registerForm.refresh();
		}
	},
	mounted() {
		this.setupMap();
		this.getManagers();
	},
}

</script>

<style scoped>

</style>