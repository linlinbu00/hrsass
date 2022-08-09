<template>
  <div v-loading="loading" class="dashboard-container">
    <div class="app-container">
      <el-card>
        <tree-tool :tree-data="company" :is-root="true" @handelAddDepts="handelAddDepts" />
      </el-card>
      <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
        <template v-slot="{ data }">
          <tree-tool :tree-data="data" :is-root="false" @handelEditDepts="handelEditDepts" @getDepartments="getDepartments" @handelAddDepts="handelAddDepts" />
        </template>
      </el-tree>
    </div>
    <!-- 弹层 -->
    <add-dept ref="addDept" :is-show-add-dialog.sync="isShowAddDialog" :current-node="currentNode" @getDepartments="getDepartments" />
  </div>
</template>

<script>
import { transListToTree } from '@/utils/index.js'
import TreeTool from './components/tree-tool.vue'
import { getDepartments } from '@/api/departments'
import AddDept from './components/add-dept.vue'
export default {
  components: {
    TreeTool,
    AddDept
  },
  data() {
    return {
      currentNode: {},
      isShowAddDialog: false,
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      departs: [
        {
          name: '总裁办',
          manager: '曹操',
          children: [{ name: '董事会', manager: '曹丕' }]
        },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }
      ],
      company: { name: '江苏传智播客', manager: '负责人' }
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    handelAddDepts(node) {
      this.isShowAddDialog = true
      this.currentNode = node
    },
    handelEditDepts(node) {
      this.isShowAddDialog = true
      this.currentNode = node
      this.$refs.addDept.getDetailById(node.id)
    },
    async getDepartments() {
      try {
        this.loading = true
        const res = await getDepartments()
        console.log(res.depts)
        this.company = {
          name: res.companyName,
          manager: res.companyManage || '管理员',
          id: ''
        }
        this.departs = transListToTree(res.depts, '')
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  width: 850px;
  margin: 50px auto;
}
</style>
