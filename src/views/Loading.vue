<template>
  <div class="loading flex--center">
    <div class="loading__content">
      <div class="loading__content__circle"></div>
      <h1 class="loading__content__text">
        <slot>Loading...</slot>
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loading'
}
</script>

<style lang="scss" scoped>
.loading {
  width: 100%;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: rgba(#fff, 0.5);
  &__content {
    text-align: center;
    &__circle {
      width: 120px;
      height: 120px;
      border: 16px solid #f3f3f3;
      border-radius: 50%;
      border-top: 16px solid #3498db;
      -webkit-animation: spin 2s linear infinite; // Safari
      animation: spin 2s linear infinite;
    }
  }
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>