<template>
  <div class="regist">
    <div class="regist-wrapper">
      <div class="image-wrapper">
        <img
          id="static-map-image"
          alt=""
          class="map-img" />
      </div>
      <div class="input-wrapper">
        <div class="custom-input-wrapper">
          <CustomTextArea
            :size="'large'"
            :placeholder="'이 장소에서의 추억을 기록해보세요.'" />
        </div>
        <transition name="fade">
          <div
            class="custom-input-wrapper">
            <h4><span class="badge  bg-warning ">언제?</span></h4>
            <CustomInput
              :type="'date'"
              :input-value="registForm.when.value"
              :target="'when'"
              :next="'button'"
              :size="'small'"
              @input="inputValue"
              @change="next" />
          </div>
        </transition>
        <transition name="fade">
          <div
            class="custom-input-wrapper">
            <h4><span class="badge  bg-warning ">누구랑?</span></h4>
            <CustomInput
              :type="'date'"
              :input-value="registForm.when.value"
              :target="'when'"
              :next="'button'"
              :size="'small'"
              @input="inputValue"
              @change="next" />
          </div>
        </transition>
        <transition name="fade">
          <div class="btn-wrapper">
            <button
              type="button"
              class="btn btn-success">
              등록하기
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="reset">
              취소
            </button>
          </div>
        </transition>
      </div>       
    </div> 
  </div>
</template>
<script>
const {GOOGLE_API_KEY} = process.env
import CustomInput from '~/components/CustomInput';
import CustomTextArea from '~/components/CustomTextArea';

export default {
  components: {
    CustomInput,
    CustomTextArea
  },
  mounted () {
    if(process.client){
      //const {innerWidth, innerHeight} = window;
      const innerWidth = document.querySelector('.regist').offsetWidth;
      const mapSnapShotUrl = this.setShapshotUrl(Math.floor(innerWidth * 0.48), 600)
      document.querySelector('#static-map-image').setAttribute('src', mapSnapShotUrl)
    }
    this.addResizeEvent();
    
  },
  data() {
    return {
      registForm : this.initRegistForm(),
      testText : ""
    }
  },
  methods: {
    addResizeEvent() {
      if(process.client){
        window.addEventListener('resize', () => {
          console.log('resize');
          const innerWidth = document.querySelector('.regist').offsetWidth;
          const mapSnapShotUrl = this.setShapshotUrl(Math.floor(innerWidth * 0.45), 600)
          document.querySelector('#static-map-image').setAttribute('src', mapSnapShotUrl)
        })
      }
      
    },
    setShapshotUrl(width, heigth) {
      let arr = []
      if(this.$store.state.map.coords) this.$store.state.map.coords.forEach(coord => {
        let {lat, lng} = coord;
        arr.push([lat, lng]);
        
      })
      var staticMapUrl = 'https://maps.googleapis.com/maps/api/staticmap';

      //Set the Google Map Center.
      if(arr.length > 0){
        const [lat, lng] = arr[0];
        staticMapUrl += '?center=' + lat + ',' + lng;
      } else {
        staticMapUrl += '?center=' + 40.737102 + ',' + -73.990318;
      }
      //Set the Google Map Size.
      staticMapUrl += `&size=${width}x${heigth}`;
      //Set the Google Map Zoom.
      staticMapUrl += '&zoom=13';
      staticMapUrl += `&key=${GOOGLE_API_KEY}`;
      staticMapUrl += `&path=fillcolor:0xAA000033|color:0xFFFFFF00|weight:10`
      //|40.737102,-73.990318|40.749825,-73.987963|40.752946,-73.987384|40.755823,-73.986397`;
      if(arr.length > 0) arr.forEach(([lat, lng]) => {
          staticMapUrl += `|${lat},${lng}`;
      });
      if(arr.length > 0){
        const [lat, lng] = arr[0];
        staticMapUrl += `|${lat},${lng}`;
      }
      return staticMapUrl
    },
    initRegistForm(){
      return {
        who:{
          value:'',
          visibility : true
        },
        when:{
          value:'',
          visibility : false
        },
        why:{
          value:'',
          visibility : false
        },
        how:{
          value:'',
          visibility : false
        },
        registBtn:{
          visibility : false
        }
      }
    },
    next({next}) {
      if(!this.registForm[next].visibility) this.registForm[next].visibility= true;
    },
    reset(){
      this.registForm = this.initRegistForm();
    },
    inputValue({target, value}){
      this.registForm[target].value = value;
    }
  },
}
</script>

<style lang="scss" scoped>
  .regist {
    .regist-wrapper{
      display: flex;
      justify-content:center;
      .image-wrapper{
        width:50%;
        .map-img{
          border-top-left-radius: 5%;
          border-bottom-left-radius: 5%;
        }
      }
      .input-wrapper{
        width:50%;
        background-color:burlywood;
        .custom-input-wrapper {
                position:relative;
                margin-bottom: 50px;
                .badge{
                  position:absolute;
                  top:-20px;
                  z-index: 3;
                }
          }
      }
      .btn-wrapper {
        display: flex;
        .btn{
          width:80%
        }
      }
      
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity 0.5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }
  }
</style>