const db = require('./db.js')
const inquirer = require('inquirer')

module.exports.add = async (title) => {
    const list = await db.read()
    list.push({
        title,
        done: false
    })
    await db.write(list)
}
module.exports.clear = async (title) => {
    await db.write([])
}

function askForAction(list, index) {
    inquirer.prompt({
        type: 'list',
        name: 'action',
        message: '请选择操作',
        choices: [{
            name: '退出',
            value: 'quit'
        },
            {
                name: '已完成',
                value: 'markAsDone'
            },
            {
                name: '未完成',
                value: 'markAsUnDone'
            },
            {
                name: '改标题',
                value: 'updateTitle'
            },
            {
                name: '删除',
                value: 'remove'
            }
        ]
    }).then(answers2 => {
        switch (answers2.action) {
            case 'markAsDone':
                list[index].done = true
                db.write(list)
                break;
            case 'markAsUnDone':
                list[index].done = false
                db.write(list)
                break;
            case 'updateTitle':
                inquirer.prompt({
                    type: 'input',
                    name: 'title',
                    message: '新的标题',
                    default: list[index].title // 旧的标题
                }).then(answers => {
                    list[index].title = answers.title
                    db.write(list)
                })
                break;
            case 'remove':
                list.splice(index, 1)
                db.write(list)
                break;
        }
    })
}

function askForCreatTask(list) {
    inquirer.prompt({
        type: 'input',
        name: 'title',
        message: '输入任务标题'
    }).then(answer => {
        list.push({
            title: answer.title,
            done: false
        })
        db.write(list)
    })
}
module.exports.showAll = async (title) => {
    const list = await db.read()
    // list.map((task, index) => {
    //     console.log(`${task.done ? '[x]':'[_]'} ${index + 1} - ${task.title}`);
    // })
    inquirer
        .prompt({
            type: 'list',
            name: 'index',
            message: '请选择你想操作的任务',
            choices: [{
                name: ' - 退出',
                value: '-1'
            }, {
                name: ' + 创建任务',
                value: '-2'
            }, ...list.map((task, index) => {
                return {
                    name: `${task.done ? '[x]':'[_]'} ${index + 1} - ${task.title}`,
                    value: index.toString()
                }
            })]
        })
        .then(answers => {
            const index = parseInt(answers.index)
            if (index >= 0) { // 选中了一个任务
                askForAction(list, index)
            } else if (index === -2) { // 创建任务
                askForCreatTask(list)
            }
        })
}