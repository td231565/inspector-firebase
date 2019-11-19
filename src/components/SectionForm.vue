<template>
  <section class="home__bottom__section home__bottom__section__form">
    <h3>步驟4：建立 BIM 自主查驗表</h3>
    <ul class="form">
      <li class="form__items">
        <label class="form__items__title">視點名稱</label>
        <input class="form__items__cells log__name" type="text" v-model="name" disabled />
      </li>
      <li class="form__items">
        <label class="form__items__title">樓層位置</label>
        <input class="form__items__cells log__floor" type="text" v-model="floor" disabled />
      </li>
      <li class="form__items">
        <label class="form__items__title">查驗人員</label>
        <select class="form__items__cells log__inspector" v-model="selectedInspector">
          <option>尚未查驗</option>
          <option v-for="(inspector, index) in inspectorsList" :key="'i' + index+1">{{ inspector }}</option>
        </select>
      </li>
      <li class="form__items">
        <label class="form__items__title">隨行人員</label>
        <input class="form__items__cells log__accompany" type="text" v-model="accompany" placeholder="以半形逗號區隔" />
      </li>
      <li class="form__items">
        <label class="form__items__title">查驗日期</label>
        <input class="form__items__cells log__date" type="date" v-model="date" placeholder="yyyy-mm-dd"/>
      </li>
      <li class="form__items">
        <label class="form__items__title">查驗類型</label>
        <select class="form__items__cells log__category" v-model="category">
          <option value="建築">建築</option>
          <option value="結構">結構</option>
          <option value="MEP">MEP</option>
          <option value="ICT">ICT</option>
        </select>
      </li>
      <li class="form__items">
        <label class="form__items__title">自主檢查紀錄是否提送</label>
        <select class="form__items__cells log__selfCheckState" v-model="selfCheckState">
          <option value="符合">符合</option>
          <option value="不符合">不符合</option>
        </select>
      </li>
      <li class="form__items">
        <label class="form__items__title">圖說與模型是否一致</label>
        <select class="form__items__cells log__status" v-model="status">
          <option value="符合">符合</option>
          <option value="不符合">不符合</option>
        </select>
      </li>
      <li class="form__items form__items__problem">
        <label class="form__items__title">檢核結果說明</label>
        <textarea class="form__items__cells log__problem" v-model="problem"></textarea>
      </li>
      <li class="form__items">
        <label class="form__items__title"></label>
        <div class="form__items__cells log__help">
          <div class="console__result">
            <p class="console__result__text">上傳完成！</p>
          </div>
          <button type="button" class="btn btn__square btn__step" title="完成" onclick="updateLogToDB(selectedMarkId)">送出表單</button>
          <button type="button" class="btn btn__square btn--danger" id="deleteDataBtn" title="刪除" onclick="controlPopframeWarning.reveal()">刪除表單</button>
        </div>
      </li>
      <li class="form__items">
        <label class="form__items__title"></label>
        <p class="form__items__cells log__help">點選「送出表單」後，再列印報表</p>
      </li>
    </ul>
  </section>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'SectionForm',
  data () {
    return {
      name: '名稱',
      floor: '樓層',
      inspectorsList: ['Allen', 'Bryan', 'Cayon'],
      selectedInspector: '尚未查驗',
      accompany: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      category: 'MEP',
      selfCheckState: '符合',
      status: '符合',
      problem: 'OK'
    }
  }
}
</script>

<style lang="sass" scoped>
.form
  width: 50%
  margin: auto

  @include ae1100
    width: 65%
  @include ae768
    width: 80%
  @include ae480
    width: 100%

  &__items
    padding: 3px 6px
    display: flex
    &__title
      width: 90px
      margin-right: 10px
      padding: 3px 0
      text-align: right
    &__cells
      width: calc(100% - 100px)
      padding: 3px 6px
      font-size: 0.8rem
    &__footer
      padding-top: 30px
      justify-content: flex-end

.log
  // &__floor, &__name
  //   color: #4d4d4d
  //   background-color: #EBEBE4
  &__problem
    height: 80px
  &__help
    display: flex
    justify-content: flex-end
    color: #505050
    border: none
</style>