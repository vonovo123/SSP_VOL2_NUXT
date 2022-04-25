<template>
  <div
    class="toast-container position-absolute p-3 top-0 start-50 translate-middle-x"
    id="toastPlacement">
    <div
      class="toast fade"
      :class="{'show': !!show}">
      <div class="toast-header">
        <!-- <img
          src="..."
          class="rounded me-2"
          alt="..." /> -->
        <strong class="me-auto">알림</strong>
      </div>
      <div
        class="toast-body"
        v-html="errorMessage">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type:String,
      default:""
    }
  },
}
</script>

<style lang="scss" scoped>
  .toast-container  {
    
  }
</style>