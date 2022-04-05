<template>
  <div 
    :style="{ 
      width: `${size}rem`, 
      height: `${size}rem`,
      color: `${color}`,
      zIndex
    }"
    :class="{
      absolute,
      fixed
    }"
    class="spinner-border"></div>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 2
    },
    absolute: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 0
    },
    color: {
      type:String,
      default:'#FDC000'
    }
  }
}
</script>

<style lang="scss" scoped>
.spinner-border {
  margin: auto;
  left: 0;
  bottom: 0;
  right: 0;
  top : 0;
  &.absolute {
    position: absolute;
  }
  &.fixed {
    position: fixed;
  }
}
</style>