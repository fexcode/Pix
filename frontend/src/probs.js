const probs = [
    {
        id: 1,
        name: "开始!",
        content: 'Hi! 欢迎来到 Pix! 尝试输入一串 Python 代码, 以在控制台输出 "Hello, World!" 字符串吧!',
        io: {
            preset: "#===分割线,勿删===\n#在这里输入代码, 请不要改动上方的代码\n",
            // input: "",
            // output: "Hello, World!\n"
            tests: [
                {
                    input: "",
                    outputs: ["Hello, World!\n"]
                },
            ]
        }
    },
    {
        id: 2,
        name: "两数之和",
        content: '给你两个数 a 和 b，求它们的和。',
        io: {
            preset: "a = 1\nb = 2\n# 在这里输入代码, 请不要改动上方的代码\n#===分割线,勿删===\n",
            tests: [
                {
                    input: "a = 1\nb = 2\n",
                    outputs: ["3", "3.0"]
                },
                {
                    input: "a = 1\nb = 114514\n",
                    outputs: ["114515", "114515.0"]
                },
                {
                    input: "a = -1\nb = 114514.1\n",
                    outputs: ["114513.1"]
                },
            ]
        }
    }
]
export default probs;