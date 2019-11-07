<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('watchUserState')
  }
}
</script>

<style lang="sass">
@import './sass/_variables'
@import './sass/_elements'
@import './sass/_base'

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: $dark_blue_defalt

#nav
  // padding: 30px
  border-bottom: 1px solid $grey
  a
    font-weight: bold
    color: $dark_blue_defalt
    &.router-link-exact-active
      color: $light_green

</style>
