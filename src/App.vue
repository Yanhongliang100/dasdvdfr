<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import store from './store'
  export default{
    name: 'App',
    methods:{
      getUser(){
        let query = this.$route.query
        if(query.flag === 1){

        }
      }
    },
    created(){
      this.getUser()
    }
  }
</script>
