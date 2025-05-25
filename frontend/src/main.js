import './style.css'
import App from './App.svelte'
import "codemirror"
import "codemirror/lib/codemirror.css"
import "codemirror/theme/monokai.css";
import "codemirror/mode/python/python"
import "codemirror/keymap/sublime"
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/edit/closetag.js";


const app = new App({
  target: document.getElementById('app')
})

export default app
