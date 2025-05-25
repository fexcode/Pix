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
        content: '给你两个数 a 和 b，求它们的和。\n 注意给出的a和b只是示例数值, 请不要直接输出3',
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
    },
    {
        id: 2,
        name: "列表求和",
        content: '给你一个列表 nums，列表中包含若干个整数，求列表中所有整数的和。',
        io: {
            preset: "ls = [1, 2, 3, 4, 5]\n#===分割线,勿删===\n# 在这里输入代码, 请不要改动上方的代码\n",
            tests: [
                {
                    input: "ls = [1, 2, 3, 4, 5]\n",
                    outputs: ["15", "15.0"]
                },
                {
                    input: "ls = [0]\n",
                    outputs: ["0", "0.0"]
                },
                {
                    input: "ls = [-1, 2, -3, 4, 5]\n",
                    outputs: ["7", "7.0"]
                },
            ]
        }
    }
]
export default probs;