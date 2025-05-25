const probs = [
    {
        id: 1,
        name: "开始!",
        content: 'Hi! 欢迎来到 Pix! 尝试输入一串 Python 代码, 以在控制台输出 "Hello, World!" 字符串吧!',
        io: {
            preset: "# 在这里输入代码\n",
            input: "",
            output: "Hello, World!\n"
        }
    },
    {
        id: 2,
        name: "开始2!",
        content: '2) Hi! 欢迎来到 Pix! 尝试输入一串 Python 代码, 以在控制台输出 "Hello, World2!" 字符串吧!',
        io: {
            preset: "# 在这里输入代码\n",
            input: "",
            output: "Hello, World2!\n"
        }
    }
]
export default probs;