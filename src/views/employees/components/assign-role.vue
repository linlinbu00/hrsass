<template>
  <el-dialog :visible="isShowDialog" title="分配角色" @close="close">
    <!-- 分配角色 这里的label绑定的是值 roleIds是所有角色的id-->
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <el-button type="primary" size="small" @click="assignRoles">确定</el-button>
      <el-button size="small" @click="close">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { assignRoles } from '@/api/employees'
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
export default {
  props: {
    isShowDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      roleIds: [],
      list: []
    }
  },

  created() {
    this.getRoleList()
  },

  methods: {
    close() {
      this.roleIds = []
      this.$emit('update:isShowDialog', false) // .sync 子组件修改父组件的值
    },
    // 获取全部角色
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    },
    // 依据id获取
    async getUserDetailById(id) {
      const { roleIds = [] } = await getUserDetailById(id)
      this.roleIds = roleIds // 赋值本用户的角色
    },
    async assignRoles() {
      try {
        this.roleIds = await assignRoles({
          id: this.userId,
          roleIds: this.roleIds
        })
        this.$message.success('修改角色成功')
        this.close()
      } catch (error) {
        this.$message.error('修改角色失败')
        this.close()
      }
    }
  }
}
</script>

<style scoped>

</style>
