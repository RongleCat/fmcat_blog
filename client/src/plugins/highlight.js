import Vue from 'vue'
import Hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
let Highlight = {}
Highlight.install = (Vue, options) => {
  Vue.directive('highlight', el => {
    let blocks = el.querySelectorAll('pre code')
    blocks.forEach(block => {
      Hljs.highlightBlock(block)
    })
  })
}

Vue.use(Highlight)