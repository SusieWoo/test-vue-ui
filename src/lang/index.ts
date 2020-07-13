import Vue from 'vue'
import VueI18n from 'vue-i18n'

import { getLanguage } from '@/utils/cookies'

// element-ui built-in lang
import elementEnLocale from 'element-ui/lib/locale/lang/en.js'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN.js'
import elementEsLocale from 'element-ui/lib/locale/lang/es.js'
import elementJaLocale from 'element-ui/lib/locale/lang/ja.js'
import elementKoLocale from 'element-ui/lib/locale/lang/ko.js'

// User defined lang
import enLocale from './en'
import zhLocale from './zh'
import esLocale from './es'
import jaLocale from './ja'
import koLocale from './ko'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  zh: {
    ...zhLocale,
    ...elementZhLocale
  },
  es: {
    ...esLocale,
    ...elementEsLocale
  },
  ja: {
    ...jaLocale,
    ...elementJaLocale
  },
  ko: {
    ...koLocale,
    ...elementKoLocale
  }
}

export const getLocale = () => {
  const cookieLanguage = getLanguage()
  if (cookieLanguage) {
    return cookieLanguage
  }
  // navigator.language 返回一个字符串,该字符串代表用户的首先语言，通常是浏览器使用的语言。navigator.language为只读属性。
  const language = navigator.language.toLowerCase()
  const locales = Object.keys(messages)
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale
    }
  }

  // Default language is english
  return 'en'
}

const i18n = new VueI18n({
  locale: getLocale(),
  messages,
  silentTranslationWarn: true,//去掉warning

})

export default i18n
