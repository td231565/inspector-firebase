<template>
  <div class="manage">
    <div class="manage__controls">
      <button class="manage__controls__toggle btn" @click="toggleMenu"></button>
      <button class="btn btn__square btn__square" @click="backToHome">上一步</button>

      <transition name="step-fade" mode="out-in">
        <ul class="manage__controls__menu" v-show="isMenuActive">
          <li class="manage__controls__menu__item"
            v-for="(f, i) in manageFunctions"
            :key="i+1"
            @click="chooseFunction(i)">{{ f }}
          </li>
        </ul>
      </transition>
    </div>

    <div class="manage__main">
      <component :is="managePath" />
    </div>

  </div>
</template>

<script>
import ManageModel from '../components/ManageModel'
import ManageFormFormat from '../components/ManageFormFormat'

export default {
  name: 'manage',
  components: {
    ManageModel,
    ManageFormFormat
  },
  data () {
    return {
      managePath: ManageModel,
      manageComponents: [ManageModel, ManageFormFormat],
      manageFunctions: ['模型管理', '表格樣式管理'],
      isMenuActive: false
    }
  },
  computed: {

  },
  methods: {
    toggleMenu () {
      this.isMenuActive = !this.isMenuActive
    },
    chooseFunction (i) {
      this.managePath = this.manageComponents[i]
      this.toggleMenu()
    },
    backToHome () {
      this.$emit('backToHome')
    }
  }
}
</script>

<style lang="scss" scoped>
.manage {
  width: 70%;
  height: 100%;
  margin: auto;

  @include ae1100 {
    width: 75%;
  }
  @include ae768 {
    width: 100%;
  }

  &__controls {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    background-color: $bg_stepBar;
    &__toggle {
      width: 2.2rem;
      height: 2.2rem;
      margin: 0 0 0 1rem;
      padding: 0;
      background-color: transparent;
      background-image: url(../assets/menu.svg);
      border: none;
    }
    &__menu {
      position: absolute;
      top: 100%;
      left: 0;
      background-color: #fff;
      box-shadow: 2px 2px 4px #808080;
      overflow: hidden;
      z-index: 9;
      &__item {
        padding: 0.5rem 1rem;
        display: flex;
        cursor: pointer;
        &:hover {
          color: #fff;
          background-color: rgba(#000, 0.3);
        }
      }
    }
  }

  &__main {
    height: calc(100% - 50px);
    overflow: auto;
  }
}

.step-fade-enter-active, .step-fade-leave-active {
  height: 100%;
  transition: all .3s;
}

.step-fade-enter, .step-fade-leave-to {
  height: 0;
}
</style>