// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import UploadImage from './ImageUpload'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
// import Lang from './lang'
// import TagsView from '@/components/TagsView'

import Lang from './lang'

import TagsView from '@/components/TagsView'

export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component(PageTools.name, PageTools)
    Vue.component(UploadExcel.name, UploadExcel)
    Vue.component(UploadImage.name, UploadImage)
    Vue.component(ScreenFull.name, ScreenFull) // 注册全屏组件
    Vue.component(ThemePicker.name, ThemePicker) // 注册全屏组件
    // Vue.component(Lang.name, Lang) // 注册全屏组件
    Vue.component(TagsView.name, TagsView)

    Vue.component(Lang.name, Lang)
  }
}
