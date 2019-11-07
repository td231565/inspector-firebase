<template>
  <div class="landing">
    <SignIn />
  </div>
</template>

<script>
// @ is an alias to /src
import SignIn from '@/components/SignIn.vue'

export default {
  name: 'landing',
  components: {
    SignIn
  }
}
</script>

<style lang="sass" scoped>

</style>