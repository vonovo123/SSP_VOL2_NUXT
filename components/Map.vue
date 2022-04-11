
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
        v-if="!draw"
        class="btn btn-light draw-btn"
        @click="drawPolyLine">
        활동경로 그리기
      </button>
      <button
        v-if="draw && !selected"
        class="btn btn-light draw-btn"
        @click="selectdrawPolyLineType('cur')">
        현재위치에서 시작
      </button>
      <button
        v-if="draw && !selected"
        class="btn btn-light draw-btn"
        @click="selectdrawPolyLineType('sel')">
        시작점 정하기
      </button>
      <button
        v-if="draw"
        class="btn btn-light draw-btn"
        @click="erasePolyLine">
        되돌리기
      </button>
    </span>
    <toasts
      :show="showToastFlag"
      :error-message="errorMessage" />
    <modal
      :show="modal"
      :content="modalContent"
      @close="cancel"
      @confirm="confirm" />  
  </div>
</template>

<script>
import Toasts from '~/components/Toasts'
import Modal from '~/components/Modal'
import Loader from '~/components/Loader'
import GoogleMap from '~/plugins/GoogleMap.js'
import { mapState } from 'vuex'
let googleMap = null;
export default {
  components: {
    Toasts,
    Loader,
    Modal
  },
  data() {
    return {
      coords: null,
      curPosMarker : null,
      drawPolygon : null,
      showToastFlag: false,
      errorMessage : '',
      draw : false,
      selected : false,
      clickEventListner : null,
      modal : false,
      modalContent: {
        title : '계속하시겠습니까?',
        body: '기록화면으로 이동합니다.',
        close : '닫기',
        confirm : '계속'
      }
    }
  },
  computed: {
    ...mapState('map', ['mapLoading'])
  },
 mounted() {
   this.$store.dispatch('map/initDataMap', {mapLoading:true})
   this.initGoogleMap();
   this.$store.dispatch('map/initDataMap', {mapLoading:false})
  },
  methods: {
    // 구글지도 불러오기 
    initGoogleMap(){
      const $map = document.getElementById('map');
      const center = { lat: 37.5642119, lng: 126.9845277 };
      googleMap = new GoogleMap($map, {zoom : 13, center}); 
    }
    // 현재위치 가져오기
    ,async initCurLocation(){
      try {
        this.$store.dispatch('map/initDataMap', {mapLoading:true})
        const pos = await this.getCurrentPosition();
        googleMap.setCenter(pos);
        return pos;
      } catch(error){
        this.showToast(error, 2000);
      } finally {
        this.$store.dispatch('map/initDataMap', {mapLoading:false})
      } 
    }
    // 현재위치 조회
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
    //마커 만들기 공통함수
    ,makeMarker(option,events){
      const marker = googleMap.createPolyLineMarker(option);
      Object.entries(events).forEach(([key, func]) => {
        marker.addListener(key, func);
      })
      return marker;
    }
    //polyLine의 시작점이 되는 마커 만들기
    ,makePolyLineStartMarker(position){
      const option = {
        position,
        draggable: true,
      }
      const events = {
        click : () => {
          // '점' 또는 '선'이 아니면
          if(googleMap.polyMarkers.length > 2) {
            this.coords = JSON.stringify(googleMap.drawPolygon())
          } 
          this.showModal();
          this.erasePolyLine();
        },
        dragend : (e) => {
          googleMap.polyLine.getPath().getArray()[0] = e.latLng;
        }
      }
      const marker = this.makeMarker(option, events);
      googleMap.polyMarkers.push(marker);
      this.curPosMarker = marker;
    }
    // 경로그리기 버튼 선택 
    ,drawPolyLine(){
      this.draw = true;
      // PolyLine 만들기
      googleMap.createPolyLine({
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
    }
    // 경로그리기 - 현재위치에서 버튼 선택
    ,async selectdrawPolyLineType(type){
      this.selected = true;
      if(type === 'cur'){
        let position = await this.initCurLocation();
        let latLng = new google.maps.LatLng(position.lat, position.lng)
        //현재위치에 마커 만들기
        this.makePolyLineStartMarker(latLng);
        this.drawPolyLineClickEvent()
      } if(type === 'sel'){
        this.showToast(`지도를 터치해서 시작점을 지정해주세요.`);
        // 사용자 지정 위치에 마커 만들기
        const clickEventListner = googleMap.addEventListner('click', (e) => {
          this.hideToast();
          this.makePolyLineStartMarker(e.latLng);
          this.drawPolyLineClickEvent();
          googleMap.removeListener(clickEventListner);
        })
      }
    }
    //그리기 상태에서 지도 클릭시 새로운 마커 만들기
    ,drawPolyLineClickEvent(){
      const cb = (e) => {
        //시작마커 이동 불가능하도록 변경
        this.curPosMarker.setDraggable(false);
        const option = {
          position: e.latLng,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 3,
          },
            draggable: false,
        }
        const events = {
          click : ()=>{
            googleMap.removePolyLineMarker(marker);
            //시작마커만남을경우 시작마커 이동가능하도록 변경
            if(googleMap.polyMarkers.length === 1) this.curPosMarker.setDraggable(true);
          }
        }
        //polyLine을 구성할 추가마커 만들기
        const marker = this.makeMarker(option, events)
        googleMap.polyMarkers.push(marker);
      }
      this.clickEventListner = googleMap.addEventListner('click', cb)      
    }
    //전체 polyLine 지우기
    ,erasePolyLine(){
      this.draw = false;
      this.selected = false;
      if(this.showToastFlag) this.hideToast();
      googleMap.removePolyLine();
      googleMap.removeListener(this.clickEventListner)
    }
    // 토스트창 보이기
    ,showToast(message, time){
      if(this.showToastFlag) return;
        this.errorMessage = message;
        this.showToastFlag = true;
        if(!time) return;
        setTimeout(()=>{
          this.hideToast();
        }, time)
    }
    // 토스트창 감추기
    ,hideToast(){
      this.showToastFlag = false;
      this.errorMessage = ``;
    },
    showModal(){
      this.modal = true;
    },
    cancel(){
      this.modal = false;
      this.drawPolygon.setMap(null);
      this.drawPolygon = null;
      this.coords = null;
    },
    confirm(){
      this.$store.dispatch('map/initDataMap', {coords : this.coords})  
      this.modal = false;
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
    justify-content: center;
    & .btn {
    }
    .cur-btn{
    
    }
    .draw-btn{
    
    }
    
  }
  

}
  
</style>