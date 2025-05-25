<script>
  // @ts-ignore
  import codemirror from "codemirror";
  import { onMount } from "svelte";
  import {
    CheckPythonAvailable,
    // @ts-ignore
    RunPythonCode,
  } from "../wailsjs/go/main/App.js";
  let editor;
  onMount(() => {
    // 检测python是否可用
    CheckPythonAvailable().then((available) => {
      if (available) {
        console.log("Python is available");
      } else {
        console.log("Python is not available");
        alert("你的python环境没有安装成功，请先安装python环境后再使用该软件！");
      }
    });

    editor = codemirror.fromTextArea(document.getElementById("t"), {
      lineNumbers: true,
      matchBrackets: true,
      indentUnit: 4,
      indentWithTabs: true,
      tabSize: 4,
      lineWrapping: true,
      autoCloseBrackets: true,
      autoCloseTags: true,
      styleActiveLine: true,
      styleActiveSelected: true,
      mode: "python",
      theme: "monokai",
      keymap: "sublime",
      autofocus: true,
      extraKeys: {
        "Ctrl-Space": "autocomplete", // 使用 Ctrl-Space 触发自动补全
      },
    });
    // @ts-ignore
    editor.setSize("100%", "100%");
  });

  let outputtext = "";
  $: oc = "white";
  $: runState = "运行";

  async function btnClicked() {
    runState = "运行中...";
    console.log("btnClicked");
    console.log("code:", editor.getValue());

    await RunPythonCode(editor.getValue()).then((result) => {
      console.log("Result: ", result);
      let strresult = result.toString();
      // 换行符替换成<br>
      outputtext = strresult;

      if (
        strresult.includes("Traceback (most recent call last):") ||
        (strresult.includes("SyntaxError:") &&
          strresult.includes("File ") &&
          strresult.includes("line "))
      ) {
        oc = "#ff6969e5"; // 红色
      } else {
        oc = "white";
      }
    });

    runState = "再运行一次";
  }
</script>

<main>
  <div class="parent">
    <div class="div1">
      <textarea id="t" class="textarea"></textarea>
    </div>

    <div class="div2 output">
      <button on:click={btnClicked}>{runState}</button>
      <h2>输出：</h2>
      <div class="output-content" style="color: {oc}">{outputtext}</div>
    </div>
    <div class="div3 prob">..................</div>
  </div>
</main>

<style>
  .parent {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(9, 1fr);
    height: 100vh;
    width: 100vw;
  }

  .div1 {
    grid-column: span 4 / span 4;
    grid-row: span 6 / span 6;
    grid-column-start: 1;
    grid-row-start: 4;
  }

  .div2 {
    grid-column: span 2 / span 2;
    grid-row: span 6 / span 6;
    grid-column-start: 5;
    grid-row-start: 4;
  }

  .div3 {
    grid-column: span 6 / span 6;
    grid-row: span 3 / span 3;
    grid-column-start: 1;
    grid-row-start: 1;
  }

  .prob {
    padding: 10px;
    background-color: rgb(39, 40, 34);
    color: white;
    font-size: 1.2em;
    border-bottom: #8d929b90 1px solid;
  }
  .output {
    padding: 10px;
    /*color: white;*/
    background-color: rgb(39, 40, 34);
    overflow-y: auto;
    scrollbar-width: thin;
    border-left: 1px solid #8d929b69;

    & .output-content {
      margin-top: 10px;
      white-space: pre-wrap; /* 保留换行符并自动换行 */
    }

    & button {
      margin-top: 10px;
      background-color: #54575c;
      color: white;
      border: 2px solid #8d929b;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
    }

    & h2 {
      border-bottom: 1px solid #8d929b;
      margin: 2px;
      color: white;
    }
  }
</style>
