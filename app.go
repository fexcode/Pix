package main

import (
	"context"
	"fmt"
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
