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
        <div
          class="custom-input-wrapper">
          <CustomInput
            :type="'text'"
            :input-value="registForm.when.value"
            :target="'when'"
            :next="'button'"
            :size="'small'"
            :placeholder="'제목'"
            @input="inputValue"
            @change="next" />
        </div>
        
        <div class="custom-input-wrapper">
          <CustomTextArea
            :size="'large'"
            :placeholder="'이 장소에서의 추억을 기록해보세요.'" />
        </div>
        <div
          class="custom-input-wrapper">
          <CustomInput
            :type="'date'"
            :input-value="registForm.when.value"
            :target="'when'"
            :next="'button'"
            :size="'small'"
            :date="'date_empty'"
            :data-placeholder="'날짜'" 
            @input="inputValue"
            @change="next" />
        </div>
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
      const innerWidth = document.querySelector('.image-wrapper').offsetWidth;
      const mapSnapShotUrl = this.setShapshotUrl(innerWidth, 640)
      document.querySelector('#static-map-image').setAttribute('src', mapSnapShotUrl)
      document.querySelector('#static-map-image').addEventListener('click', e => {
        let top = document.querySelector('.image-wrapper').getBoundingClientRect().top;
        let left = document.querySelector('.image-wrapper').getBoundingClientRect().left;
        console.log(e.clientY, e.clientX);
        console.log(top,left);
        const $cover = document.createElement('div');
        $cover.classList.add('marker-cover');
        const $marker = document.createElement('input');
        $marker.classList.add('marker');
        $marker.type = 'text'
        $cover.style['top'] = (e.clientY - top) + 'px';
        $cover.style['left'] = (e.clientX - left - 60) + 'px';
        $cover.appendChild($marker)
        document.querySelector('.image-wrapper').appendChild($cover);
        $marker.focus();
      })
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
          const innerWidth = document.querySelector('.image-wrapper').offsetWidth;
          console.log("innerWidth", innerWidth)
          const mapSnapShotUrl = this.setShapshotUrl(innerWidth, 640)
          document.querySelector('#static-map-image').setAttribute('src', mapSnapShotUrl)
        })
      }
      
    },
    setShapshotUrl(width, heigth) {
      console.log(width,heigth);
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
      staticMapUrl += '&zoom=17';
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
      console.log(next);
      //if(!this.registForm[next].visibility) this.registForm[next].visibility= true;
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
    max-width:1280px;
    max-height: 600px;
    .regist-wrapper{
      display: flex;
      justify-content:center;
      border-radius: 1%;
      overflow: hidden;
      border : 2px solid none;
      .image-wrapper{
        width:50%;
        position: relative;
      }
      .input-wrapper{
        width:48%;
        padding-top:3px;
        margin-left :1%;
        margin-right :1%;
        .custom-input-wrapper {
                overflow: visible;
                position:relative;
                margin-bottom: 10px;
          }
      }
      .btn-wrapper {
        display: flex;
        .btn{
          width:80%;
          height:100px;
        }
      }
    }
    .image-wrapper ::v-deep .marker-cover{
          position:absolute;
          width :120px;
          height :50px;
          background-color: black;
          color:white;
          border-radius: 10px;
          align-content: center;
          z-index:5;
          
        .marker{
          width:98%;
          margin-top:8%;
          padding-left:5%;
          height:60%;
          background-color: black;
          border:none;
          color : white;
          overflow: hidden;
        }
        .marker:focus {
          outline: none;
        }

    }
    .image-wrapper ::v-deep .marker-cover::after{
      content: " ";
      position: absolute;
      bottom: 100%;  /* At the top of the tooltip */
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent transparent black transparent;

    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity 0.5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }
  }
</style>