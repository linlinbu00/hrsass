<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="`${showTitle}部门[${currentNode.name}]`" :visible="isShowAddDialog" @close="close">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="form" label-width="120px" :model="formData" :rules="formDataRules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" placeholder="请选择" @focus="getEmployeeSimple">
          <!-- 需要循环生成选项   这里做一下简单的处理 显示的是用户名 存的也是用户名-->
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="close">取消</el-button>
      </span>
    </template>

  </el-dialog>
</template>
<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    isShowAddDialog: {
      type: Boolean,
      default: false
    },
    currentNode: {
      type: Object,
      default: null
    }

  },
  data() {
    // 部门名称是否重复
    const checkName = async(rule, value, callback) => {
      // 拿到所有数据
      const { depts } = await getDepartments()
      let currentChildren = null
      if (this.formData.id) {
        // 编辑的时候 找到他的兄弟判断
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.pid && item.id !== this.currentNode.id
        })
      } else {
        // 添加是添加子节点 判断
        currentChildren = depts.filter(item => {
          return item.pid === this.currentNode.id
        })
      }
      const isRepeat = currentChildren.some(item => item.name === value)
      if (isRepeat) {
        return Promise.reject('部门名称重复啦')
      }
    }
    // 部门编码是否重复
    const checkCode = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = null
      if (this.formData.id) {
        // 编辑
        isRepeat = depts.some(item => item.code === value && item.id !== this.currentNode.id)
      } else {
        // 新增
        isRepeat = depts.some(item => item.code === value)
      }
      if (isRepeat) {
        return Promise.reject('部门编码重复')
      }
    }
    return {
      peoples: [],
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      formDataRules: {
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur'
          },
          { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }],
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
          {
            validator: checkCode,
            trigger: 'blur'
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  computed: {
    // 控制标题
    showTitle() {
      return this.formData.id ? '编辑' : '添加'
    }
  },
  methods: {
    async getDetailById(id) {
      this.formData = await getDepartDetail(id)
    },
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    async submit() {
      await this.$refs.form.validate()
      if (this.formData.id) {
        await updateDepartments(this.formData)
      } else {
        await addDepartments({ ...this.formData, pid: this.currentNode.id }) // 调用新增接口
      }
      this.$message.success(`${this.showTitle}成功`)
      this.$emit('getDepartments')
      this.close()
    },
    close() {
      // sync修饰符 关闭弹层
      this.$emit('update:isShowAddDialog', false)
      // 重置表单
      this.$refs.form.resetFields()
      // 清空
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    }
  }
}
</script>

<style>

</style>
