<template>
  <div class="container-fluid map-container">
    <Loader
      v-if="mapLoading"
      :size="3"
      :z-index="9"
      absolute />
    <div
      class="map"
      id="map"></div>
    <button
      class="cur-btn"
      v-if="!mapLoading"
      @click="initCurLocation">
      현재위치로 돌아가기
    </button>
    <toasts
      :show="showToastFlag"
      :error-message="errorMessage" />
  </div>
</template>

<script>
let map = null;
let curPosMaker = null;
import Toasts from '~/components/Toasts'
import Loader from '~/components/Loader'
export default {
  components: {
    Toasts,
    Loader
  },
  data() {
    return {
      curPos : {},
      showToastFlag: false,
      mapLoading : true,
      errorMessage : ''
    }
  },
 mounted () {
    this.initMap();
    this.initCurLocation();
  },
  methods: {
    initMap(){
      const $map = document.querySelector('#map');
      const myungdongMcdonald = { lat: 37.5642119, lng: 126.9845277 };
          //eslint-disable-next-line no-undef
      map = new google.maps.Map($map, {
        zoom: 6,
        center: myungdongMcdonald,
      });
      map.addListener('click',(e) => {
        console.log(this);
        mapClickEvent(e , this);
      });
    }
    /**
     * 현재위치 초기화
     */
    , async initCurLocation(){
      try {
        this.mapLoading = true;
        if(curPosMaker) curPosMaker.setMap(null);
        const pos = await this.getCurrentPosition();
        map.setCenter(pos);
        this.curPos = {...pos};
        this.addCurPosMarker();
      } catch(error){
        this.showToast(error);
      } finally {
        this.mapLoading = false;
      } 
    }
    /**
     * 현재위치 조회
     */
    ,getCurrentPosition() {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              resolve(pos);
            },
            () => {
                reject(`navigator.geolocation is denied`)
            }
          );
        } else {
          reject(`navigator.geolocation is null`)
        }
      })
    }
    /**
     * 마커 만들기
     */
    ,addCurPosMarker(){
      curPosMaker = new google.maps.Marker({
          position: this.curPos,
          map: map,
      });
    }
    ,showToast(message){
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
const mapClickEvent = (e, THIS) => {
  console.log(THIS);
  let pos = {
    lat : e.latLng.lat(),
    lng : e.latLng.lng()
    }
  if(curPosMaker) curPosMaker.setMap(null);
  THIS.curPos = {...pos};
  THIS.addCurPosMarker();
}
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  .cur-btn{
    position:absolute;
    width:180px;
    height:50px;
    bottom : 5%;
    left: calc(50% - 90px);
  }
  .map {
    width:100%;
    height: 500px;
  }
}
  
</style>