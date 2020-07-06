<template>
  <div id="wangeditor">
    <div ref="editorElem" style="text-align:left"></div>
  </div>
</template>
<script>
import E from "wangeditor";
export default {
  name: "editorElem",
  data() {
    return {
      editor: null,
      editorContent: ""
    };
  },
  props: ["catchData", "content"], // 接收父组件的方法
  watch: {
    content: {
      handler: function(p) {
        if (p) {
          this.editor.txt.html(this.content);
        } else {
          this.editor && this.editor.txt.html("请编辑内容");
        }
      },
      immediate: true
    },
    // content() {
    //   this.editor.txt.html(this.content);
    // }
  },
  mounted() {
    this.editor = new E(this.$refs.editorElem);
    this.editor.customConfig.onchange = html => {
      this.editorContent = html;
      this.catchData(this.editorContent); // 把这个html通过catchData的方法传入父组件
    };
    this.editor.customConfig.uploadImgServer = `/attachment/upload?access_token=${localStorage.getItem(
      "access_token"
    )}`;
    this.editor.customConfig.uploadFileName = "attachments";
    this.editor.customConfig.uploadImgParamsWithUrl = true;
    this.editor.customConfig.menus = [
      // 菜单配置
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];

    this.editor.customConfig.uploadImgHooks = {
      before: function(xhr, editor, files) {
        // 图片上传之前触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，files 是选择的图片文件
        // 如果返回的结果是 {prevent: true, msg: 'xxxx'} 则表示用户放弃上传
        // return {
        //     prevent: true,
        //     msg: '放弃上传'
        // }
      },
      success: function(xhr, editor, result) {
        this.imgUrl = `/attachment/download/${result[0].id}`;
      },
      fail: function(xhr, editor, result) {
        // 图片上传并返回结果，但图片插入错误时触发
        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
      },
      error: function(xhr, editor) {
        console.log(xhr);
      },
      customInsert: function(insertImg, result, editor) {
        // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
        // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果
        insertImg(`/attachment/download/${result[0].id}`);
      }
    };

    this.editor.create(); // 创建富文本实例
    if (!this.content) {
      this.editor.txt.html("请编辑内容");
    }
  }
};
</script>
<style lang="scss" rel="stylesheet/scss">
#wangeditor {
  width: 41rem;
}
</style>