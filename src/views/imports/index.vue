<template>
  <UploadExcel :on-success="onSuccess" />
</template>

<script>
import UploadExcel from '@/components/UploadExcel'
import { importEmployee } from '@/api/employees'
export default {
  components: {
    UploadExcel
  },
  data() {
    return {
      // 映射关系数组
      userRelations: {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
    }
  },
  created() {
  },

  methods: {
    async onSuccess({ results }) {
      // console.log(results)
      const resArr = results.map(item => {
        const obj = {}
        for (const itemKey in item) {
          // 将对象遍历重写
          if (['correctionTime', 'timeOfEntry'].includes(this.userRelations[itemKey])) {
            obj[this.userRelations[itemKey]] = new Date(this.formatDate(item[itemKey], '/'))
          } else { obj[this.userRelations[itemKey]] = item[itemKey] }
        }
        return obj
      })
      await importEmployee(resArr)
      this.$message.success('员工表格插入成功')
    },
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style scoped>

</style>
