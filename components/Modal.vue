<template>
  <div class="regist">
    <div
      id="modal"
      class="modal fade"
      ref="modal"
      tabindex="-1"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              class="modal-title"
              id="exampleModalLabel">
              {{ content.title }}
            </h5>
            <button
              type="button"
              class="btn-close"
              @click="hideModal"
              aria-label="Close"></button>
          </div>
          <div class="modal-body">
            {{ content.body }}
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="hideModal">
              {{ content.close }}
            </button>
            <button
              type="button"
              class="btn btn-primary">
              {{ content.confirm }}
            </button>
          </div>
        </div>
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
    content: {
      type: Object,
      default: () => {
        return {
          title : '',
          body : '',
          close : '',
          confirm : ''
        }
      }
    }
  },
  data() {
    return {
      modal: null,
    }
  },
  emits:["close"],
  methods: {
    hideModal() {
      this.$emit('close');
    }
  },
  mounted () {
    if(process.client){
      console.log(this.$refs);
      this.modal = this.getBootstrapModal(this.$refs.modal)
    }
  },
  watch: {
    show: function(){
      if(this.show) this.modal.show();
      else {
        this.modal.hide();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .regist {

  }
</style>