<template>
  <div class="landing flex--center">
    <SignIn />
  </div>
</template>

<script>
// @ is an alias to /src
import SignIn from '@/components/LandingSignIn.vue'

export default {
  name: 'landing',
  components: {
    SignIn
  }
}
</script>

<style lang="sass" scoped>
.landing
  height: 100vh
</style>