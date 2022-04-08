import Vue from 'vue'
import { Modal } from 'bootstrap'

Vue.mixin({
   methods: {
      getBootstrapModal($el) {
         return new Modal($el);
      },
   },
})