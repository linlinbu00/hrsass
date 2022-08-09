<template>
  <el-row style="width: 100%" type="flex" justify="space-between">
    <el-col>
      <span>{{ treeData.name }}</span>
    </el-col>
    <el-col :span="10">
      <el-row type="flex" justify="space-between">
        <el-col>
          <span>{{ treeData.manager }}</span>
        </el-col>
        <el-col :span="21">
          <el-dropdown style="margin-left: 10px" @command="clickItem">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'TreeTool',
  props: {
    treeData: {
      type: Object,
      default: () => ({})
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    /**
     * dropDown 菜单上面有一个command方法可以监听到子菜单点击的那一项
     在子菜单上绑定一个command属性，其对应的值作为这个方法的参数传入
    */
    async clickItem(type) {
      if (type === 'add') {
        console.log('add')
        this.$emit('handelAddDepts', this.treeData)
      } else if (type === 'edit') {
        console.log('edit')
        this.$emit('handelEditDepts', this.treeData)
      } else {
        await this.$confirm('确认删除吗？')
        await delDepartments(this.treeData.id)
        this.$emit('getDepartments')
      }
    }
  }
}
</script>

<style></style>
