<template>
  <textarea
    class="form-control"
    :class="size"
    :placeholder="placeholder"
    cols="30"
    rows="10"></textarea>
</template>

<script>
export default {
props: {
  size : {
    type: String,
    default :''
  },
  placeholder:{
    type:String,
    default:''
  }
},
}
</script>

<style lang="scss" scoped>
textarea {
  padding-top:15px;
  resize: none;
  border-radius: 10px;
  border:none;
}
.large{
        height:300px;
}
</style>