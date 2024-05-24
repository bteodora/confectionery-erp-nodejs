<template>
	<AdminNavbar />
	<div class="container" style="width: 35%;">
		<h3 class="bg-secondary formHeader">Register factory</h3><br>
		<div class="mb-3">
			<label class="form-label">Name</label>
			<input type="text" class="form-control" v-model="name" />
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
				<label class="form-label">Address</label>
				<input type="text" class="form-control" placeholder="Street & number" v-model="location.address" />
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
			<select class="form-select" v-model="managerId">
				<option value="" disabled selected></option>
				<option v-for="manager in managers">
					{{ manager.username + " - " + manager.name + " " + manager.surname }}</option>
			</select>
		</div>

		<br><div class="errorText">{{ errorMessage }}</div><br>
		<button class="btn btn-primary" v-on:click="register()">Submit</button>
	</div>
</template>

<script>

import AdminNavbar from '@/components/Admin/AdminNavbar.vue';
import axiosInstance from '@/utils/axiosInstance';

export default {
	name: 'RegisterFactory',
	components: {
		AdminNavbar
	},
	data() {
		return {
			name: '',
			startWorkTime: '',
			endWorkTime: '',
			managerId: '',
			location: {
				lat: null,
				lon: null,
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
			var attribution = new ol.control.Attribution({
				collapsible: false
			});

			var map = new ol.Map({
				controls: ol.control.defaults({ attribution: false }).extend([attribution]),
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

			var vectorSource = new ol.source.Vector({});
			var vectorLayer = new ol.layer.Vector({ source: vectorSource });
			map.addLayer(vectorLayer);

			var markerStyle = new ol.style.Style({
				image: new ol.style.Icon({
					anchor: [16, 64],
					anchorXUnits: 'pixels',
					anchorYUnits: 'pixels',
					scale: 0.7,
					src: 'https://maps.google.com/mapfiles/kml/pushpin/red-pushpin.png'
				})
			});

			map.on('click', function (event) {
				vectorSource.clear();

				var coordinate = event.coordinate;
				this.location = ol.proj.toLonLat(coordinate);

				var marker = new ol.Feature({
					geometry: new ol.geom.Point(coordinate)
				});

				marker.setStyle(markerStyle)

				vectorSource.addFeature(marker);
			});

			map.on('moveend', function () {
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

			return true;
		},
		register() {
			if(!this.validate())
				return;

			axiosInstance.post('/factory', {
				name: this.name,
				startWorkTime: this.startWorkTime,
				endWorkTime: this.endWorkTime,
				managerId: this.managerId,
				location: this.location
			})
				.then(response => {
					alert(response.data.message);
					this.$router.push('/admin');
				})
				.catch(error => {
					this.errorMessage = error.response.data.message;
				});
		}
	},
	mounted() {
		this.setupMap();
		this.getManagers();
	},
}

</script>

<style scoped>
.container {
	margin-top: 50px;
	margin-bottom: 100px;
	margin-left: auto;
	margin-right: auto;
}
</style>