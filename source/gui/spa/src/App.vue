<template>
    <v-app id="app">
        <home/>
    </v-app>
</template>

<script>
import Home from './components/Home'

export default {
  name: 'App',
  components: {
    Home
  }
}
</script>

<style>
    @import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons';
    @import 'vuetify/dist/vuetify.min.css';
</style>
