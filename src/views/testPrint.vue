<template>
  <div class="print">
    <table>
      <tbody>
        <tr v-for="(row, i) in tableList" :key="i+1">
          <td v-for="(col, n) in row.col" :key="n+1"
            
            :colspan="longestColLength / row.col.length">
            {{ col.key }}：{{ col.value }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Print',
  data () {
    return {
      tableList: [
        {
          order: 1,
          col: [
            { key: '欄位名稱1-1', value: '值1-1' },
            { key: '欄位名稱1-2', value: '值1-2' },
            { key: '欄位名稱1-3', value: '值1-3' }
          ],
        },
        {
          order: 2,
          col: [
            { key: '欄位名稱2-1', value: '值2-1' },
            { key: '欄位名稱2-2', value: '值2-2' }
          ],
        },
        {
          order: 3,
          col: [
            { key: '欄位名稱3-1', value: '值3-1' }
          ]
        }
      ]
    }
  },
  computed: {
    longestColLength () {
      return this.tableList.map(row => row.col.length).sort().pop()
    }
  }
}
</script>

<style lang="scss" scoped>
table, tr, td {
  text-align: left;
  border: 1px solid green;
}

table {
  width: 100%;
}
</style>