<template>
  <el-card class="container">
    <el-tabs>
      <el-tab-pane label="登录账户设置">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px" class="form">
          <el-form-item label="姓名" prop="username" style="width:40%">
            <el-input v-model="formData.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password2" style="width:40%">
            <el-input v-model="formData.password2" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveUserDetailById">更新</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人详情">
        <!-- 放置个人详情 -->
        <component :is="UserInfo" />
        <!-- <user-info /> -->
      </el-tab-pane>
      <el-tab-pane label="岗位信息">
        <!-- 放置岗位详情 -->
        <component :is="JobInfo" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from '@/views/employees/components/user-info.vue'
import JobInfo from '@/views/employees/components/job-info.vue'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data() {
    return {
      UserInfo: 'UserInfo',
      JobInfo: 'JobInfo',
      formData: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'

          }
        ],
        password2: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur'
          }
        ]

      }
    }
  },

  created() {
    this.getUserDetailById()
  },

  methods: {
    async  getUserDetailById() {
      this.formData = await getUserDetailById(this.$route.params.id)
    },
    // 更新
    async saveUserDetailById() {
      try {
        // 这里面写password2原因是后端对密码进行了加密处理 不想让加密的乱七八糟的密码数据回显 但是当你提交更新数据时给后端的字段仍然是password
        await this.$refs.formRef.validate()
        await saveUserDetailById({
          ...this.formData,
          password: this.formData.password2
        })
        this.$message.success('更新成功')
      } catch (error) {
        this.$message.error(error.methods || '更新失败')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  margin: 20px
  };
  .form{
    margin-top: 20px;
  }
</style>
