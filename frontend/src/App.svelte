<script>
  import codemirror from "codemirror";
  import { onMount } from "svelte";
  import {
    CheckPythonAvailable,
    RunPythonCode,
    FetchPorbsFromServer,
    SaveUserData,
    LoadUserData,
  } from "../wailsjs/go/main/App.js";
  import { main } from "../wailsjs/go/models";
  // import probs from "./probs.js";
  let probs = [
    {
      id: 0,
      name: "请稍等,正在获取题目信息...",
      content:
        'Hi! 欢迎来到 Pix! 尝试输入一串 Python 代码, 以在控制台输出 "Hello, World!" 字符串吧!',
      io: {
        preset: "#===分割线,勿删===\n#在这里输入代码, 请不要改动上方的代码\n",
        // "input": "",
        // output: "Hello, World!\n"
        tests: [
          {
            input: "",
            outputs: ["Hello, World!\n"],
          },
        ],
      },
    },
  ];

  let editor;
  let probNumber = 1;

  let outputtext = "";
  let oc = "white";
  let runState = "运行";

  $: recentProb = probs[probNumber - 1];
  $: probTitle = recentProb.name;
  $: problem = recentProb.content; // 显示的题目内容

  console.log("prob:", recentProb);

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

    // @ts-ignore
    editor.setValue(recentProb.io.preset);

    FetchPorbsFromServer().then((result) => {
      if (typeof result === "boolean") {
        console.log("FetchPorbsFromServer result is boolean:", result);
        if (result) {
          // 这里处理 success 为 true 的情况
        } else {
          // 这里处理 success 为 false 的情况
        }
      } else {
        console.log("FetchPorbsFromServer result:", result);
        if (result) {
          probs = result;
        }
      }
    });

    LoadUserData().then((result) => {
      if (typeof result === "boolean") {
        console.log("LoadUserData result is boolean:", result);
        if (!result) {
          SaveUserData(
            new main.UserData({
              max_probs: 0,
            })
          ).then((result) => {
            console.log("SaveUserData result:", result);
            if (!result) {
              alert("你的用户信息加载失败！");
            }
          });
        }
      } else {
        console.log("LoadUserData result:", result);
        if (result) {
          probNumber = result.max_probs + 1;
          console.log("probNumber:", probNumber);
        } else {
          SaveUserData(
            new main.UserData({
              max_probs: 0,
            })
          ).then((result) => {
            console.log("SaveUserData result:", result);
            if (!result) {
              alert("你的用户信息加载失败！");
            }
          });
        }
      }
    });
  });

  async function btnClicked() {
    runState = "运行中...";
    console.log("btnClicked");
    console.log("code:", editor.getValue());

    await checkCode().then((result) => {
      if (result.status) {
        alert("恭喜你，运行成功！");
        runState = "运行";
        nextProb();
      } else {
        console.log("checkCode result:", result);

        RunPythonCode(editor.getValue()).then((result) => {
          console.log("RunPythonCode result:", result);
          outputtext = result.toString();
          oc = "white";
        });

        runState = "不对哦, 再试试吧！";
      }
    });
  }

  async function checkCode() {
    let testPromises = recentProb.io.tests.map(async (test) => {
      let input = test.input + editor.getValue().split("===分割线,勿删===")[1];
      console.log("input:", input);

      let outputs = test.outputs;
      let result = await RunPythonCode(input).then((result) => {
        // console.log("Result: ", result);
        return result.toString();
      });
      return outputs.some((output) => {
        console.log("output:", output, "result:", result);

        return result.trim() === output.trim();
      });
    });

    let results = await Promise.all(testPromises);
    console.log("checkCode results:", results);

    let toreturn = {
      status: results.every((item) => item === true),
      results,
    };
    return toreturn;
  }

  function nextProb() {
    if (probNumber < probs.length) {
      probNumber++;
      recentProb = probs[probNumber - 1];
      probTitle = recentProb.name;
      problem = recentProb.content; // 显示的题目内容
      outputtext = "";
      oc = "white";
      runState = "运行";
      // @ts-ignore
      editor.setValue(recentProb.io.preset);
    } else {
      alert("恭喜你，全部题目都做完了！");
    }
    SaveUserData(
      new main.UserData({
        max_probs: probNumber - 1,
      })
    ).then((result) => {
      console.log("SaveUserData result:", result);
      if (!result) {
        alert("你的用户信息保存失败！");
      }
    });
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
    <div class="div3 prob">
      <h1>{probTitle}</h1>
      <p>{problem}</p>
    </div>
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
    border-bottom: #8d929b90 1px solid;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Open Sans",
      "Helvetica Neue",
      sans-serif;
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
