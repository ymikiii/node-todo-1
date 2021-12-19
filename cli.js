#!/user/bin/env node

const program = require('commander')
const api = require('./index.js')

program.option('-x, --xxx', 'here is x')

program
    .command('add')
    .description('添加一个任务')
    .action((...args) => {
        // console.log(args.slice(0, -1).join(' '))
        const words = args.slice(0, -1).join(' ')
        api.add(words)
    })

program
    .command('clear')
    .description('清空任务')
    .action(() => {
        api.clear()
    })
// program.parse(process.argv)
if (process.argv.length === 2) {
    api.showAll()
}