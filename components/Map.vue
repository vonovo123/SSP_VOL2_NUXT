
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
      <button
        class="btn btn-light cur-btn"
        @click="initCurLocation">
        현재위치로 돌아가기
      </button>
      <button
        v-if="!draw"
        class="btn btn-light draw-btn"
        @click="drawOn">
        활동루트 그리기
      </button> 
      <button
        v-if="draw"
        class="btn btn-light draw-btn"
        @click="drawOff">
        지우기
      </button>
    </span>
    <toasts
      :show="showToastFlag"
      :error-message="errorMessage" />
  </div>
</template>

<script>
/* eslint-disable no-undef */
let map = null;
let poly = null;
let curPosMaker = null;
let clickEventListner = null;
let curMakers = [];
const drawPolygon = () => {
  const coords = [];
  curMakers.forEach(marker =>  {
     coords.push({
      lat : marker.position.lat(),
      lng : marker.position.lng(),
      })
  })
  const polygon = new google.maps.Polygon({
    paths: coords,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: "#FF0000",
    fillOpacity: 0.35,
  });
  polygon.setMap(map);
}
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
      errorMessage : '',
      draw : false
    }
  },
 mounted () {
    this.initMap();
    this.initCurLocation();
  },
  methods: {
    // 구글지도 초기화
    initMap(){
      const $map = document.getElementById('map');
      const myungdongMcdonald = { lat: 37.5642119, lng: 126.9845277 };
      map = new google.maps.Map($map, {
        zoom: 15,
        center: myungdongMcdonald,
      });
    }
    // 폴리라인 그리기
    ,drawOn(){
      if(!this.draw) this.draw = true;
      poly = new google.maps.Polyline({
              strokeColor: "#000000",
              strokeOpacity: 1.0,
              strokeWeight: 3,
            });
      poly.setMap(map);
      clickEventListner = map.addListener('click',(e) => {
        //새로운 라인 추가
        poly.getPath().push(e.latLng);
        const marker = new google.maps.Marker({
          position: e.latLng,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 3,
          },
          editable: true,
          draggable: false,
          map: map,
        });
        //첫 마커
        if(curMakers.length === 0){
          marker.addListener("click", () => {
            // '점' 또는 '선'인 상황이면
            if(curMakers.length === 1 || curMakers.length === 2) this.drawOff();
            drawPolygon();
            this.removePolyLine();
          })
        }  else {
          marker.addListener("click", ()=>{
            // '점' 또는 '선'인 상황이면
            if(curMakers.length === 1 || curMakers.length === 2) this.drawOff();
            let start = curMakers.indexOf(marker);
            path.removeAt(start);
            marker.setMap(null);
            curMakers.splice(start, 1)
          })
        }
        curMakers.push(marker);
      });
    }
    //폴리라인 지우기
    ,drawOff(){
      poly.setMap(null);
      this.draw = false;
      google.maps.event.removeListener(clickEventListner);
      curMakers.forEach(marker => marker.setMap(null));
      curMakers = [];
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