<template>
  <div class="regist">
    <div
      class="input-wrapper"
      v-if="who">
      <h4><span class="badge bg-warning ">누구랑 방문했나요?</span></h4>
      <input
        class="form-control form-control-lg"
        type="text"
        @keyup.enter="next('when')" />
    </div>
    <transition name="fade">
      <div
        class="input-wrapper"
        v-if="when">
        <h4><span class="badge  bg-warning ">언제 방문했나요?</span></h4>
        <input
          class="form-control form-control-lg"
          type="date" 
          @change="next('why')" />
      </div>
    </transition>
    <transition name="fade">
      <div
        class="input-wrapper"
        v-if="why">
        <h4><span class="badge bg-warning ">방문이유가 무엇인가요?</span></h4>
        <input
          class="form-control form-control-lg"
          type="text" 
          @keyup.enter="next('how')" />
      </div>
    </transition>
    <transition name="fade">
      <div
        class="input-wrapper"
        v-if="how">
        <h4><span class="badge bg-warning ">어땠나요?</span></h4>
        <input
          class="form-control form-control-lg"
          type="text" />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      who:true,
      when:false,
      why: false,
      how: false
    }
  },
  methods: {
    next(target) {
      this[target]= true;
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
      transition: opacity 1s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }
  }
</style>