interface ISettings {
  title: string // Overrides the default title
  showSettings: boolean // Controls settings panel display
  showTagsView: boolean // Controls tagsview display
  showSidebarLogo: boolean // Controls siderbar logo display
  fixedHeader: boolean // If true, will fix the header component
  errorLog: string[] // The env to enable the errorlog component, default 'production' only
  sidebarTextTheme: boolean // If true, will change active text color for sidebar based on theme
}

// You can customize below settings :)
const settings: ISettings = {
  title: 'Test VUE fish',
  showSettings: true,
  showTagsView: true,//是否用tags标签打开路由 todo
  fixedHeader: true,//是否固定头部 todo
  showSidebarLogo: false,//是否显示左上方logo todo
  errorLog: ['production'],
  sidebarTextTheme: true,
}

export default settings
