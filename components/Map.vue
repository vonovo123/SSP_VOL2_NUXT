
<template>
  <div class="map-container">
    <Loader
      v-if="mapLoadingFlag"
      :size="3"
      :z-index="9"
      absolute />
    <div
      class="map"
      id="map"></div>
    <span
      class="btn-box"
      v-if="!mapLoadingFlag"> 
      <button
        v-if="!drawFlag"
        class="btn btn-light draw-btn"
        @click="drawPolyLine">
        활동경로 그리기
      </button>
      <button
        v-if="drawFlag && !selWayFlag"
        class="btn btn-light draw-btn"
        @click="selectdrawPolyLineType('cur')">
        현재위치에서 시작
      </button>
      <button
        v-if="drawFlag && !selWayFlag"
        class="btn btn-light draw-btn"
        @click="selectdrawPolyLineType('sel')">
        시작점 정하기
      </button>
      <button
        v-if="drawFlag"
        class="btn btn-light draw-btn"
        @click="erasePolyLine">
        되돌리기
      </button>
    </span>
    <Toast
      :show="toastFlag"
      :error-message="errorMessage" />
    <Modal
      :show="modalFlag"
      :content="modalContent"
      @close="hideModal"
      @confirm="confirmModal" />  
  </div>
</template>

<script>
import Toast from '~/components/Toast'
import Modal from '~/components/Modal'
import Loader from '~/components/Loader'
import GoogleMap from '~/plugins/GoogleMap.js'
//import { mapState } from 'vuex'
//지도관련 변수
let googleMap = null;
let clickEventListner = null;
let drawPolygonCoord = null;
export default {
  components: {
    Toast,
    Loader,
    Modal
  },
  created () {
      this.modalContent = {
      title : '',
      body: '',
      close : '',
      confirm : ''
    }
  },
  mounted() {
    this.initGoogleMap();
  },
  data() {
    return {
      mapLoadingFlag :true,
      drawFlag : false,
      selWayFlag : false,
      modalFlag : false,
      toastFlag: false,
      modalContent: null,
      errorMessage : ''
    }
  },
  computed: {
    //...mapState('map', ['mapLoadingFlag'])
  },
  
  methods: {
    // 구글지도 불러오기 
    initGoogleMap(){
        const $map = document.getElementById('map');
        const center = { lat: 37.5642119, lng: 126.9845277 };
        googleMap = new GoogleMap($map, {zoom : 16, center});
        if(!googleMap) this.showToast('지도불러오기에 실패했습니다.<br/> 인터넷 연결상태를 확인후 다시 시도해주세요.')
        this.mapLoadingFlag = false;
    }
    // 현재위치 가져오기
    ,async initCurLocation(){
      try {
        this.mapLoadingFlag = true;
        const pos = await this.getCurrentPosition();
        return pos;
      } catch(error){
        this.showToast(error, 2000);
      } finally {
        this.mapLoadingFlag = false;
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
    //polyLine의 시작점이 되는 마커 만들기
    ,makePolyLineStartMarker(position){
      const option = {
        position,
        draggable: true,
      }
      //시작점 마커 이벤트
      const events = {
        //클릭 이벤트
        click : () => {
          // marker의 수가 3개 이상(도형)이면 
          if(googleMap.polyMarkers.length > 2) {
            drawPolygonCoord = googleMap.createPolygon();
          } 
          const modalContent = {
            title : '계속하시겠습니까?',
            body: '기록화면으로 이동합니다.',
            close : '닫기',
            confirm : '계속'
          }
          this.showModal(modalContent);
          this.erasePolyLine();
        },
        //드레그 end 이벤트
        dragend : (e) => {
          googleMap.polyLine.getPath().getArray()[0] = e.latLng;
        }
      }
      //polyLine의 첫번째 마커 여부
      const isFirst = true;
      googleMap.createPolyLineMarker(option, events, isFirst);
    }
    // 경로선택 
    ,drawPolyLine(){
      this.drawFlag = true;
      // PolyLine 만들기
      googleMap.createPolyLine({
        strokeColor: "#000000",
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
    }
    // 경로그리기
    ,async selectdrawPolyLineType(type){
      this.selWayFlag = true;
      //현재위치에서 시작
      if(type === 'cur'){
        let position = await this.initCurLocation();
        googleMap.setCenter(position);
        const latLng = googleMap.createLatLng(position);
        //현재위치에 마커 만들기
        this.makePolyLineStartMarker(latLng);
        this.drawPolyLineClickEvent()
      //선택 위치에서 시작  
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
        googleMap.curPosMarker.setDraggable(false);
        const option = {
          position: e.latLng,
          icon: {
            path: googleMap.polyLineIconPath,
            scale: 3
          },
          draggable: false,
        }
        const events = {
          click : ()=>{
            googleMap.removePolyLineMarker(marker);
            //시작마커만남을경우 시작마커 이동가능하도록 변경
            if(googleMap.polyMarkers.length === 1) googleMap.curPosMarker.setDraggable(true);
          }
        }
        //polyLine을 구성할 추가마커 만들기
        const marker = googleMap.createPolyLineMarker(option, events)
      }
      clickEventListner = googleMap.addEventListner('click', cb)      
    }
    //전체 polyLine 지우기
    ,erasePolyLine(){
      this.drawFlag = false;
      this.selWayFlag = false;
      googleMap.removePolyLine();
      googleMap.removeListener(clickEventListner)
      if(this.toastFlag) this.hideToast();
    }
    // 토스트창 보이기
    ,showToast(message, time){
      if(this.toastFlag) return;
      this.errorMessage = message;
      this.toastFlag = true;
      if(!time) return;
      setTimeout(()=>{
        this.hideToast();
      }, time)
    }
    // 토스트창 감추기
    ,hideToast(){
      this.toastFlag = false;
      this.errorMessage = ``;
    },
    //모달창열기
    showModal(content){
      this.modalContent = content
      this.modalFlag = true;
    },
    //모달창 닫기
    hideModal(){
      this.modalFlag = false;
      googleMap.removePolygon()
    },
    //모달창 confirm
    confirmModal(){
      this.modalFlag = false;
      this.$store.dispatch('map/initDataMap', {coords : drawPolygonCoord})  
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