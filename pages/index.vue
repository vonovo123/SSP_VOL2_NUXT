<template>
  <Map />
</template>

<script>
import axios from 'axios';
import Map from '~/components/Map'
export default {
  components: {
    Map,
  },
  mounted () {
  },
  data() {
  return {
  }
  },
  methods: {
    async setData() {
      this.data = await fetch();
    }
  },
  created () {
    //this.setData();
  },

}

async function fetch(){
  const payLoad = {
    title :'frozen',
    type: 'movie',
    year : '2020',
    page: 1
  }
  console.log(process.client)
  const url = process.client
    ? '/api/test'
    : `${process.env.CLIENT_URL}/api/test`
  return await axios.post(url, payLoad)
}
</script>
<style lang="scss" scoped>

</style>