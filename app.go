package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"syscall"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) CheckPythonAvailable() (bool, string) {
	cmd := exec.Command("python", "-c", "print('Hello, Python!')")
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	err := cmd.Run()
	if err != nil {
		return false, err.Error()
	}
	return true, "Python is available"
}

func (a *App) RunPythonCode(code string) (string, bool) {
	// 要运行结果
	cmd := exec.Command("python", "-c", code)
	cmd.SysProcAttr = &syscall.SysProcAttr{HideWindow: true}
	out, err := cmd.CombinedOutput()

	if err != nil {
		return string(out), false
	}
	fmt.Print("USR IN|\t\t\n", code, "\n==================================\n")
	fmt.Print("GO OUT|\t\t\n", string(out), "\n===============================\n")
	return string(out), true
}

/*
{
        "content": "Hi! 欢迎来到 Pix! 尝试输入一串 Python 代码, 以在控制台输出 \"Hello, World!\" 字符串吧!",
        "id": 1,
        "io": {
            "preset": "#===分割线,勿删===\n#在这里输入代码, 请不要改动上方的代码\n",
            "tests": [
                {
                    "input": "",
                    "outputs": [
                        "Hello, World!\n"
                    ]
                }
            ]
        },
        "name": "开始!"
    },
*/

type ProbJSON struct {
	Content string `json:"content"`
	ID      int    `json:"id"`
	IO      struct {
		Preset string `json:"preset"`
		Tests  []struct {
			Input   string   `json:"input"`
			Outputs []string `json:"outputs"`
		} `json:"tests"`
	} `json:"io"`
	Name string `json:"name"`
}

func (a *App) FetchPorbsFromServer() ([]ProbJSON, bool) {
	var serverUrl string = "https://xnors.pythonanywhere.com/pixprobs"
	resp, err := http.Get(serverUrl)
	if err != nil {
		return []ProbJSON{}, false
	}
	defer resp.Body.Close()
	var prob []ProbJSON
	err = json.NewDecoder(resp.Body).Decode(&prob)
	if err != nil {
		return []ProbJSON{}, false
	}
	return prob, true
}

type UserData struct {
	MaxProbs int `json:"max_probs"`
}

func (a *App) SaveUserData(userData UserData) bool {
	// 保存json到文件
	jsonData, err := json.Marshal(userData)
	if err != nil {
		fmt.Print("ERROR when SaveUserData", err)
		return false
	}
	err = os.WriteFile("userData.json", jsonData, 0644)
	if err != nil {
		fmt.Print("ERROR when SaveUserData", err)
		return false
	}
	return true
}

func (a *App) LoadUserData() (UserData, bool) {
	// 从文件读取json
	jsonData, err := os.ReadFile("userData.json")
	if err != nil {
		fmt.Print("ERROR when LoadUserData", err)
		return UserData{}, false
	}
	var userData UserData
	err = json.Unmarshal(jsonData, &userData)
	if err != nil {
		fmt.Print("ERROR when LoadUserData", err)
		return UserData{}, false
	}
	return userData, true
}
