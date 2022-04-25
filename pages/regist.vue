<template>
  <div class="regist">
    <div
      class="input-wrapper">
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
        class="input-wrapper"
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
        class="input-wrapper"
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
        class="input-wrapper"
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
</template>

<script>
import CustomInput from '~/components/CustomInput';
export default {
  components: {
    CustomInput,
  },
  data() {
    return {
      registForm : this.initRegistForm()
    }
  },
  methods: {
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
    .input-wrapper {
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
        width:100%;
        height: 50px;
        padding-left: 50px;
        border-width: 5px;
        border-style: solid;
        border-color: black;
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