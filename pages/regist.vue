<template>
  <div class="regist">
    <div class="regist-wrapper">
      <div class="image-wrapper">
        <img
          alt=""
          class="map-img"
          :src="mapSnapShotUrl" />
      </div>
      <div class="input-wrapper">
        <div
          class="custom-input-wrapper">
          <h4><span class="badge bg-warning ">누구랑 방문했나요?</span></h4>
          <CustomInput
            :type="'text'"
            :input-value="registForm.who.value"
            :target="'who'"
            :next="'when'"
            @input="inputValue"
            @keyup="next" />
        </div>
        <transition name="fade">
          <div
            class="custom-input-wrapper"
            v-if="registForm.when.visibility">
            <h4><span class="badge  bg-warning ">언제 방문했나요?</span></h4>
            <CustomInput
              :type="'date'"
              :input-value="registForm.when.value"
              :target="'when'"
              :next="'why'"
              @input="inputValue"
              @change="next" />
          </div>
        </transition>
        <transition name="fade">
          <div
            class="custom-input-wrapper"
            v-if="registForm.why.visibility">
            <h4><span class="badge bg-warning ">왜 여길 방문했나요?</span></h4>
            <CustomInput
              :type="'text'"
              :input-value="registForm.why.value"
              :target="'why'"
              :next="'how'"
              @input="inputValue"
              @keyup="next" />
          </div>
        </transition>
        <transition name="fade">
          <div
            class="custom-input-wrapper"
            v-if="registForm.how.visibility">
            <h4><span class="badge bg-warning ">어땠나요?</span></h4>
            <CustomInput
              :type="'text'"
              :input-value="registForm.how.value"
              :target="'how'"
              :next="'registBtn'"
              @input="inputValue"
              @keyup="next" />
          </div>
        </transition>
        <transition name="fade">
          <button
            type="button"
            class="btn btn-success"
            v-if="registForm.registBtn.visibility">
            등록하기
          </button>
        </transition>
        <transition name="fade">
          <button
            type="button"
            class="btn btn-danger"
            v-if="registForm.registBtn.visibility"
            @click="reset">
            삭제
          </button>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import CustomInput from '~/components/CustomInput';
const {GOOGLE_API_KEY} = process.env
export default {
  components: {
    CustomInput,
  },
  data() {
    return {
      registForm : this.initRegistForm(),
      mapSnapShotUrl : this.setShapshotUrl(),
    }
  },
  methods: {
    setShapshotUrl() {
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
      staticMapUrl += '&size=600x600';
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
      .image-wrapper{
        width:50%;
        .map-img{
          border-radius: 5%;
        }
      }
      .input-wrapper{
        width:50%;
        margin-right:5%;
        margin-left:5%;
        .custom-input-wrapper {
                position:relative;
                margin-bottom: 50px;
                .badge{
                  position:absolute;
                  left:-15px;
                  top:-20px;
                  z-index: 3;
                }
                .input{
                  position:relative;
                  width:80%;
                  height: 50px;
                  padding-left: 50px;
                  border-width: 5px;
                  border-style: solid;
                  border-color: black;
                }
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