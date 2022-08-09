<template>
  <div>
    <el-upload
      :http-request="upload"
      :before-upload="beforeUpload"
      :limit="1"
      action="#"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list.sync="fileList"
      :class="{completed:isCompleted}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercentage" :percentage="percentage" />
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云的包
// 需要实例化
const cos = new COS({
  SecretId: 'AKIDrbAVdYGl23pNgjYUChy0oOjsoVx9TYQ2',
  SecretKey: 'SfeNq43pOBkIepytZ3II6fy84l00kHbh'
})
// 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了
export default {
  name: 'UploadImage',
  data() {
    return {
      // 是否显示进度条
      showPercentage: false,
      percentage: 0,
      fileList: [{
        url: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg2.doubanio.com%2Fview%2Frichtext%2Flarge%2Fpublic%2Fp161916213.jpg&refer=http%3A%2F%2Fimg2.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1662273578&t=8cfca8a130fa8057ee34a98fad1dd7e9'
      }],
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    // 是否显示上传图片框
    isCompleted() {
      return this.fileList.length === 1
    }
  },
  created() {

  },
  methods: {
    // 进行上传操作
    upload({ file }) {
    //   console.log(params.file)
      if (file) {
        // 执行上传操作
        cos.putObject({
          Bucket: 'linlin-1313213512', // 存储桶
          Region: 'ap-nanjing', // 地域
          Key: file.name, // 文件名
          Body: file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认 标准模式即可
          // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
          onProgress: ({ percent }) => {
            this.percentage = percent * 100
          }
        }, (err, data) => {
          // data返回数据之后 应该如何处理
          // console.log(err || data)
          if (err) {
            return this.$message.error(err?.message || '上传出错')
          }
          this.fileList.forEach(item => {
            if (item.uid === file.uid) {
              item.url = `http://${data.Location}`
              item.upload = true
            }
          })
        })
        setTimeout(() => {
          // 隐藏进度条 重置进度
          this.showPercentage = false
          this.percentage = 0
        }, 1500)
      }
    },
    // 上传文件之前的钩子
    beforeUpload(file) {
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('文件类型不匹配')
        return false
      }
      const maxSize = 5 * 1024 * 1024 // 1M=1024KB 1KB = 1024B
      if (file.size > maxSize) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      // 检查完毕后开始上传前显示进度条
      this.showPercentage = true
    },
    // 文件改变时的钩子 添加文件、上传成功和上传失败时都会被调用
    changeFile(file, fileList) {
      // 直接push会添加重复
      this.fileList = fileList
    },
    // 删除图片
    handleRemove(file, fileList) {
      // file是当前点击的图片 fileList是更改过后的图片列表 注意是操作后的列表
      // console.log(file, fileList)
      // this.fileList = this.fileList.filter((i) => i.uid !== file.uid) 可以通过过滤来获得新列表 如果uid一致则删除
      this.fileList = fileList // 或者直接赋值
    },
    // 点击图片预览
    handlePictureCardPreview(file) {
      // file是当前点击的图片
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
.completed{
  ::v-deep .el-upload--picture-card{
    display: none;
  }
}
</style>
