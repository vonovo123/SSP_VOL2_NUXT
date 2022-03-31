<template>
  <div class="container-fluid">
    <Loader
      v-if="mapLoading"
      :size="3"
      :z-index="9"
      absolute />
    <div
      class="map"
      id="map"></div>
    <button @click="getCurrentPosition">
      CURLOCATION
    </button>
    <toasts
      :show="showToastFlag"
      :error-message="errorMessage" />
  </div>
</template>

<script>
let map = null;
import Toasts from '~/components/Toasts'
import Loader from '~/components/Loader'
export default {
  components: {
    Toasts,
    Loader
  },
  data() {
    return {
      showToastFlag: false,
      errorMessage : '',
      mapLoading : true,
    }
  },
 mounted () {
    const $map = document.querySelector('#map');
    const myungdongMcdonald = { lat: 37.5642119, lng: 126.9845277 };
    //eslint-disable-next-line no-undef
    map = new google.maps.Map($map, {
      zoom: 6,
      center: myungdongMcdonald,
    });
    this.mapLoading = false;
  },
  methods: {
    getCurrentPosition() {
      this.mapLoading = true;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position);
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            map.setCenter(pos);
            this.mapLoading = false;
          },
          () => {
              this.showToast(`navigator.geolocation is denied`);
              this.mapLoading = false;
          }
        );
      } else {
        this.showToast(`navigator.geolocation is null`);
        this.mapLoading = false;
      }
      
    },
    showToast(message){
      if(this.showToastFlag) return;
        this.errorMessage = message;
        this.showToastFlag = true;
        setTimeout(()=>{
            this.errorMessage = ``;
            this.showToastFlag = false;
        }, 2000)
    }
  },
}
</script>

<style lang="scss" scoped>
  .map {
    width:100%;
    height: 500px;
  }
</style>