
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
    <span
      class="btn-box"
      v-if="!mapLoading"> 
      <!-- <button
        class="btn btn-light cur-btn"
        @click="initCurLocation">
        현재위치로 돌아가기
      </button> -->
      <button
        v-if="!draw"
        class="btn btn-light draw-btn"
        @click="drawPolyLine">
        활동경로 그리기
      </button>
      <button
        v-if="draw"
        class="btn btn-light draw-btn"
        @click="erasePolyLine">
        지우기
      </button>
    </span>
    <toasts
      :show="showToastFlag"
      :error-message="errorMessage" />
  </div>
</template>

<script>
import Toasts from '~/components/Toasts'
import Loader from '~/components/Loader'
import GoogleMap from '~/plugins/GoogleMap.js'
let googleMap = null;
export default {
  components: {
    Toasts,
    Loader
  },
  data() {
    return {
      curPosMarker : null,
      showToastFlag: false,
      mapLoading : true,
      errorMessage : '',
      draw : false,
      clickEventListner : null,
    }
  },
 mounted () {
    this.initGoogleMap();
    this.mapLoading = false;
    //this.initCurLocation();
  },
  methods: {
    // 구글지도 초기화
    initGoogleMap(){
      const $map = document.getElementById('map');
      const center = { lat: 37.5642119, lng: 126.9845277 };
      googleMap = new GoogleMap($map, {zoom : 15, center}); 
    }
    /**
     * 현재위치 초기화
     */
    ,async initCurLocation(){
      try {
        if(this.curPosMarker){
          this.curPosMarker.setMap(null);
          this.curPosMarker = null;
        }
        this.mapLoading = true;
        const pos = await this.getCurrentPosition();
        googleMap.setCenter(pos);
        return pos;
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
              console.log(position)
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
    // 폴리라인 그리기
    ,async drawPolyLine(){
      let position = await this.initCurLocation();
      position = new google.maps.LatLng(position.lat, position.lng)
      if(!this.draw) this.draw = true;
      googleMap.createPolyLine({
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 3
        }
      );
      const option = {
        position,
        draggable: true,
      }
      const marker = googleMap.createPolyLineMarker(option);

      marker.addListener("click", () => {
          // '점' 또는 '선'이 아니면
          if(googleMap.polyMarkers.length > 2) googleMap.drawPolygon();
          googleMap.removePolyLine();
          googleMap.removeListener(this.clickEventListner)
          this.draw = false;
      })
      marker.addListener("dragend", (e) => {
        console.log(googleMap.polyLine.getPath().Ed[0] = e.latLng);
      })
      googleMap.polyMarkers.push(marker);
      this.curPosMarker = marker;
      const cb = (e) => {
        console.log(this.curPosMarker.draggable);
        this.curPosMarker.setDraggable(false);
        const option = {
          position: e.latLng,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 3,
          },
            draggable: false,
        }
        const marker = googleMap.createPolyLineMarker(option);
        marker.addListener("click", ()=>{
          // '점' 또는 '선'인 상황이면
          if(googleMap.polyMarkers.length === 1 || googleMap.polyMarkers.length === 2) {
            googleMap.removePolyLine();
            googleMap.removeListener(this.clickEventListner)
            this.draw = false;
          }else{
              googleMap.removePolyLineMarker(marker);
          }
          
        })
        googleMap.polyMarkers.push(marker);
      }
      this.clickEventListner = googleMap.addEventListner('click', cb)
    }
    //폴리라인 지우기
    ,erasePolyLine(){
      this.draw = false;
      googleMap.removePolyLine();
      googleMap.removeListener(this.clickEventListner)
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
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  .map {
    position: relative;
    width:100%;
    height: 800px;
  }
  .btn-box{
    position:absolute;
    width:400px;
    height:50px;
    bottom : 5%;
    left: calc(50% - 200px);
    display: flex;
    & .btn {
      margin:10px;
    }
    .cur-btn{
    
    }
    .draw-btn{
    
    }
    
  }
  

}
  
</style>