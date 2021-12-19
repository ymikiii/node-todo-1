const homedir = require('os').homedir()
const home = process.env.HOME || homedir
const path = require('path')
const dbPath = path.join(home, '.todo')
const fs = require('fs')
const {
    resolve
} = require('path')
const db = {
    // 这里表示 path 默认等于 dbPath
    read(path = dbPath) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, {
                flag: 'a+'
            }, (error, data) => {
                if (error) {
                    reject(error)
                    console.log(error);
                } else {
                    let list
                    try {
                        list = JSON.parse(data.toString())
                    } catch (error1) {
                        list = []
                    }
                    resolve(list)
                }
            })
        })

    },
    write(list, path = dbPath) {
        return new Promise((resolve, reject) => {
            const string = JSON.stringify(list)
            fs.writeFile(path, string + '\n', (error) => {
                if (error) return reject(error)
                resolve()

            })
        })

    }
}

module.exports = db