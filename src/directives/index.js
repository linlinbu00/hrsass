export const imgError = {
  inserted(el, options) {
    // el 指令绑定的元素
    // console.log(el)
    console.log(options.value)
    // 如果图片出错了 给一个默认图片
    el.onerror = function() {
      el.src = options.value
    }
  }
}
export const focus = {
  inserted: function(el) {
    // console.log(el)
    el.focus()
  }
}
