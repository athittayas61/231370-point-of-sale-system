<template>
  <div class="home">
    <router-link :to="{ name: 'Scan' }">New sale</router-link>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class Home extends Vue { }
</script>
