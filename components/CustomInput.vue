<template>
  <input
    class="form-control form-control-lg"
    :type="type"
    :target="target" 
    :value="inputValue"
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
.input{
        position:relative;
        width:100%;
        height: 50px;
        padding-left: 50px;
        border-width: 5px;
        border-style: solid;
        border-color: black;
}

</style>