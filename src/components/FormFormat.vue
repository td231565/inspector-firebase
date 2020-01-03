<template>
  <ul class="form">
    <!-- 客製表格內容 -->
    <li class=""
      v-for="(column, i) in selectedFormFormat"
      :key="i+1">

      <!-- 下拉選單 -->
      <div class="form__items" v-if="column.type === 'select' && column.name !== '查驗人員'">
        <label class="form__items__title">{{ column.name }}</label>
        <select class="form__items__cells" :name="column.name" required>
          <option>請選擇</option>
          <option
            :type="column.type"
            v-for="(option, index) in JSON.parse(column.content)"
            :key="index+10"
            :value="option"
            :selected="option === column.value">
            {{ option }}
          </option>
        </select>
      </div>

      <div class="form__items" v-else-if="column.name === '查驗人員'">
        <label class="form__items__title">{{ column.name }}</label>
        <select class="form__items__cells" :name="column.name" required>
          <option>請選擇</option>
          <option>尚未查驗</option>
          <option v-if="!!column.value"
            :value="column.value"
            selected>{{ column.value }}</option>
          <option v-if="column.value !== userInfo.name"
            :value="userInfo.name">{{ userInfo.name }}</option>
        </select>
      </div>

      <!-- 多行文字 -->
      <div class="form__items" v-else-if="column.type === 'textarea'">
        <label class="form__items__title">{{ column.name }}</label>
        <textarea class="form__items__cells"
          :name="column.name" :value="column.value" required></textarea>
      </div>

      <!-- 單行文字 -->
      <div class="form__items" v-else-if="column.type === 'text'">
        <label class="form__items__title">{{ column.name }}</label>
        <input class="form__items__cells"
          :name="column.name" :type="column.type" :value="column.value" required />
      </div>

      <!-- 日期 -->
      <div class="form__items" v-else-if="column.type === 'date'">
        <label class="form__items__title">{{ column.name }}</label>
        <input class="form__items__cells"
          :name="column.name" :type="column.type" :value="column.value" required />
      </div>
    </li>

  </ul>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'FormFormat',
  props: {
    selectedFormFormat: Object
  },
  data () {
    return {
      
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userState.userInfo,
    })
  }
}
</script>

<style lang="scss" scoped>

</style>