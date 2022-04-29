<template>
  <input
    class="form-control form-control-lg"
    :type="type"
    :target="target" 
    :value="inputValue"
    :class="size"
    @input="input"
    @change="change" 
    @keyup="keyup" />
</template>

<script>
export default {
props: {
  type: {
    type: String,
    default: ""
  },
  target :{
    type: String,
    default: ""
  },
  next : {
    type :String,
    default : null
  },
  inputValue : {
    type :String,
    default : null
  }
},
emits:['input', 'change', 'keyup'],
methods: {
  input($event) {
    this.$emit('input', {target : this.target, value : $event.target.value})
  },
  change(){
      this.$emit('change', {next : this.next});
  },
  keyup() {
    this.$emit('keyup', {next : this.next});
  }
},
}
</script>

<style lang="scss" scoped>
</style>