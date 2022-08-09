<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission('0',1)">添加权限</el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type===1" type="text" @click="addPermission(row.id,2)">添加</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 编辑弹层 -->
    <el-dialog :title="title" :visible="showDialog" @close="btnCancel">
      <!-- 表单 -->
      <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width:90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width:90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  delPermission,
  getPermissionDetail,
  updatePermission
} from '@/api/permission.js'
import { transListToTree } from '@/utils'
export default {
  data() {
    return {
      list: [],
      // formData数据和rules校验规则
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 点击添加时候已经知道类型
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      },
      // 新增或者编辑弹框的校验规则，
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    // 判断是编辑还是新增 确认弹层标题
    title() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async editPermission(id) {
      const res = await getPermissionDetail(id)
      // console.log(res)
      this.formData = res // 数据回显
      this.showDialog = true
    },
    async delPermission(id) {
      try {
        await this.$confirm('确认删除?')
        await delPermission(id)
        this.$message.success('删除成功')
        this.getPermissionList()
      } catch (error) {
        this.$message.error('删除失败')
      }
    },
    // 获取权限 处理成树形结构
    async getPermissionList() {
      this.list = transListToTree(await getPermissionList(), '0')
    },
    // 接收两个参数 当点击添加🐖页面🐖权限点的时候 传入pid 0 和类型 1
    async addPermission(pid, type) {
      this.showDialog = true
      this.formData.pid = pid
      this.formData.type = type
    },
    // 清空 重置 关弹层
    btnCancel() {
      this.showDialog = false
      this.$refs.perForm.resetFields()
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      }
    },
    async btnOK() {
      await this.$refs.perForm.validate()
      try {
        // 存在id--编辑 不存在--新增
        if (this.formData.id) {
          await updatePermission(this.formData) // 更新
          // console.log('编辑')
        } else {
          await addPermission(this.formData)
        }
        this.$message.success(this.title + '成功')
        this.btnCancel()
        this.getPermissionList()
      } catch (error) {
        console.log(error)
        this.$message.error(this.title + '失败')
        this.btnCancel()
      }
    }
  }
}
</script>

<style>

</style>
