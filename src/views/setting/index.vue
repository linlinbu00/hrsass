<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 放置页签 -->
          <el-tab-pane label="角色管理">
            <!-- 新增角色按钮 -->
            <el-button
              icon="el-icon-plus"
              size="small"
              type="primary"
              @click="editDialogVisible=true"
            >新增角色</el-button>

            <!-- 表格 -->
            <el-table
              :data="list"
              stripe
              border
              style="margin-top: 10px"
            >
              <el-table-column
                type="index"
                prop="date"
                label="序号"
                width="50"
              />
              <el-table-column
                prop="name"
                label="角色名称"
                width="180"
              />
              <el-table-column
                prop="description"
                label="描述"
              />
              <el-table-column
                label="操作"
              >
                <template v-slot="{row}">
                  <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="getRoleDetail(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">
                    删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row type="flex" justify="center" align="middle" style="margin-top:10px">
              <el-pagination
                background
                layout="prev, pager, next"
                :page-size="page.pagesize"
                :total="page.total"
                :current-page="page.page"
                @current-change="changeCurrent"
              />
            </el-row>
          </el-tab-pane>
          <!-- 公司信息 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top:20px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:50%" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:50%" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:50%" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="formData.remarks" type="textarea" :rows="3" disabled style="width:50%" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 编辑弹窗 -->
    <el-dialog :title="`${editForm.id ? '编辑' : '添加'}角色`" :visible="editDialogVisible" @close="closeEditDialog">
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="roleRules"
        label-width="80px"
      >
        <el-form-item label="角色名" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button
          type="primary"
          @click="updateRole"
        >确 定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="分配权限" :visible="showPermissionDialog" @close="closePerm">
      <el-tree ref="treeRef" :props="props" default-expand-all :data="permissionList" check-strictly="" show-checkbox node-key="id" :default-checked-keys="checkedKeys" />
      <template #footer>
        <el-button type="primary" @click="btnPermOK">确认</el-button>
        <el-button @click="closePerm">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRoleList, getCompanyInfo, deleteRole, updateRole, getRoleDetail, addRole, assignPerm } from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { transListToTree } from '@/utils'
export default {
  data() {
    return {
      currentRoleId: '',
      // 默认勾选权限的id数组
      checkedKeys: [],
      props: {
        label: 'name'
      },
      permissionList: [],
      showPermissionDialog: false,
      editDialogVisible: false,
      editForm: {},
      roleRules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      list: [],
      formData: [],
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 2,
        total: 0 // 记录总数
      }
    }
  },
  computed: {
    ...mapGetters(['companyId'])

  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo()
  },
  methods: {
    closePerm() {
      this.showPermissionDialog = false
      this.checkedKeys = []
    },
    async btnPermOK() {
      // 调用el-tree的方法
      // console.log(this.$refs.permTree.getCheckedKeys())
      const checkedKeys = this.$refs.treeRef.getCheckedKeys()
      await assignPerm({
        id: this.currentRoleId,
        permIds: checkedKeys
      })
      this.$message.success('分配权限成功')
      this.closePerm()
    },
    // 分配权限
    async assignPerm(id) {
      this.currentRoleId = id
      // 转成树形
      this.permissionList = transListToTree(await getPermissionList(), '0')
      const { permIds } = await getRoleDetail(id)
      // 指定默认选中的节点
      this.checkedKeys = permIds
      this.showPermissionDialog = true
    },
    async getRoleList() {
      const { rows, total } = await getRoleList(this.page)
      // console.log(rows)
      this.list = rows
      this.page.total = total
    },
    // 监听页码更改 对应切换数据
    changeCurrent(page) {
      this.page.page = page
      this.getRoleList()
    },
    //
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        const len = this.list.length
        if (len === 1 && this.page.page > 1) {
          this.page.page--
        }
        // 只有点击了确定 才能进入到下方
        await deleteRole(id) // 调用删除接口
        this.getRoleList() // 重新加载数据
        this.$message.success('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 拿到当前点击的数据信息
    async getRoleDetail(id) {
      this.editDialogVisible = true
      this.editForm = await getRoleDetail(id)
    },
    closeEditDialog() {
      // 关闭弹窗
      this.editDialogVisible = false
      // 重置表单数据
      this.$refs.editFormRef.resetFields()
    },
    // 更新角色信息
    async updateRole() {
      if (this.editForm.id) {
        await updateRole(this.editForm)
      } else {
        await addRole(this.editForm)
      }
      this.$message.success('成功')
      this.getRoleList()
      this.closeEditDialog()
    }
  }
}
</script>

<style>

</style>
