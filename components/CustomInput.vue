<template>
  <input
    class="form-control form-control-lg border-none"
    :type="type"
    :target="target" 
    :value="inputValue"
    :data-placeholder="dataPlaceholder"
    :class="[size, date]"
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
  },
  date:{
    type :String,
    default : null
  },
  size : {
    type :String,
    default : null
  },
  dataPlaceholder : {
    type :String,
    default : null
  },
},
emits:['input', 'change', 'keyup'],
methods: {
  input($event) {
    this.$emit('input', {target : this.target, value : $event.target.value})
  },
  change(e){
      const target = e.target;
      if(target.value === ''){
        target.classList.add("date_empty");
      } else {
        target.classList.remove('date_empty');
      }
      this.$emit('change', {next : this.next});
  },
  keyup() {
    this.$emit('keyup', {next : this.next});
  }
},
}
</script>

<style lang="scss" scoped>
.border-none {
  border:none
}
.date_empty:before {
  content: attr(data-placeholder);
  color : #7f7f7f;
  font-size:16px;
  width: calc(100%);
}
</style>