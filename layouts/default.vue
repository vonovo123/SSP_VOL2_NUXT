<template>
  <div class="container container-xxl">
    <Header />
    <Nuxt />
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/Header'
import Footer from '~/components/Footer'
export default {
components: {
  Header,
  Footer
},
}
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";    
  .container  {
    
  }
</style>