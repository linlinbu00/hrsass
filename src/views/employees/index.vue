<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools>
        <template #before>
          <span>共166条记录</span>
        </template>
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportToExcel">导出</el-button>
          <el-button size="small" type="primary" @click="isShowAddEmpDialog=true">新增员工</el-button>
        </template>
      </PageTools>
      <!-- 放置表格和分页 -->
      <el-card>
        <el-table border :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column prop="username" label="姓名" sortable="" />
          <el-table-column label="头像">
            <template v-slot="{row}">
              <el-avatar :src="row.staffPhoto" style="width: 80px; height: 80px" @click.native="showQrCode(row.staffPhoto)">
                <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg2.doubanio.com%2Fview%2Frichtext%2Flarge%2Fpublic%2Fp161916213.jpg&refer=http%3A%2F%2Fimg2.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662273578&t=8cfca8a130fa8057ee34a98fad1dd7e9" alt="">
              </el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable="" />
          <el-table-column prop="formOfEmployment" label="聘用形式" :formatter="formatEmployment" sortable="" />
          <el-table-column prop="departmentName" label="部门" sortable="" />
          <el-table-column label="入职时间" sortable="">
            <!-- 过滤器插槽 -->
            <template v-slot="{row}">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable="" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :total="page.total"
            :page-size="page.size"
            :current-page="page.page"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 新增员工弹层组件 -->
    <add-employee :is-show-add-emp-dialog.sync="isShowAddEmpDialog" />
    <!-- 二维码弹层 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 角色弹框 -->
    <AssignRole ref="assignRole" :is-show-dialog.sync="isShowDialog" :user-id="userId" />
  </div>
</template>

<script>
import QrCode from 'qrcode'
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import addEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
import { formatDate } from '@/filters'
export default {
  components: { addEmployee, AssignRole },
  data() {
    return {
      userId: null,
      isShowDialog: false,
      showCodeDialog: false,
      isShowAddEmpDialog: false,
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      }
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    // 编辑角色
    async editRole(id) {
      this.userId = id // props传值 是异步的
      await this.$refs.assignRole.getUserDetailById(id) // 父组件调用子组件方法
      this.isShowDialog = true
    },
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (url) {
        this.showCodeDialog = true // 数据更新了希望页面立刻更新为最新的 此刻需要使用$nextTick
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    async exportToExcel() {
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 1、获取需要导出的数据
      const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
      // 2、调用自己封装的方法进行数据的转化
      const data = this.formatData(headers, rows)
      const { export_json_to_excel } = await import('@/utils/Export2Excel')
      const tHeader = Object.keys(headers) // 拿到所有的key组成的数组

      export_json_to_excel({
        header: tHeader, // 表头 必填
        data, // 具体数据 必填
        filename: 'excel-list', // 非必填
        autoWidth: true, // 非必填
        bookType: 'xlsx' // 非必填

      })
    },
    formatData(headers, rows) {
      return rows.map(item => {
        // item 为对象 ->
        // 替换成数组即可 ->
        // 数组的结构要和headers对应起来 ->
        return Object.keys(headers).map(key => {
          if (['timeOfEntry', 'correctionTime'].includes(headers[key])) {
            return formatDate(item[headers[key]])
          }
          if (headers[key] === 'formOfEmployment') {
            return EmployeeEnum.hireType.find(child => child.id === +item[headers[key]])?.value || '未知'
          }
          // key -> 中文的key
          // 预期 -> 返回当前项的值
          // 值在哪？-> item为真实的数据对象 -> 取到正确的值返回即可

          // 返回值的思路
          // 1. 数据里面的key是中文还是英文？ -> 英文
          // 2. headers里面取到中文key对应的英文key
          // 3. 直接去数据对象里面取数据
          return item[headers[key]]
        })
      })
    },

    // 删除员工
    async delEmployee(id) {
      try {
        await this.$confirm('是否确认删除')
        await delEmployee(id)
        await this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 获取员工列表
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.page)
      this.list = rows
      this.page.total = total
    },
    changePage(page) {
      this.page.page = page
      this.getEmployeeList()
    },
    // 格式化员工等级 有一定映射关系
    formatEmployment(row, column, cellValue, index) {
      // 要去找 1所对应的值
      const currentData = EmployeeEnum.hireType.find(item => item.id === cellValue)?.value
      return currentData || '未知'
    }
  }
}
</script>

<style>

</style>
