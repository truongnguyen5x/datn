const writeBatchFile = (data) => {
    data.forEach(i => writeOneFile(i.path, i.code))
}

const readBatchFile = () => {
    const fs = window.remixFileSystem;
    let files = fs.readdirSync('/')
    files = files.filter(i => {
        const stats = fs.statSync(i)
        return stats.isFile()
    })
    const res =  files.map(i => {
        return {
            code: fs.readFileSync(i, { encoding: 'utf8' }),
            path: i
        }
    })
    console.log(res)
    return res
}

const readOneFile = () => {

}

const writeOneFile = (path, content) => {
    const fs = window.remixFileSystem;
    // // let index = path.lastIndexOf('/')

    const paths = path.split('/')
    let currentPath = '/'
    let i = 0;
    for (; i < paths.length - 1; i++) {
        currentPath += "/" + paths[i]
        if (!fs.existsSync(currentPath)) {
            fs.mkdirSync(currentPath)
        }
    }
    currentPath += "/" + paths[i]
    fs.writeFileSync(currentPath, content)
    //    /a/b/c/t.txt
    //     0 1  2  3
    // const folder = path.substring(0, index)

    // old code
    // const file = path.substring(index + 1, path.length)

    // fs.writeFileSync(file, content)

    // fs.mkdirSync('/a')
    // fs.mkdirSync('/a')
    // fs.mkdirSync('/a/b')

}

const clearAll = () => {
    const fs = window.remixFileSystem;
    // unlinkSync
    // fs.unlinkSync('/')
    let files = fs.readdirSync('/')
    console.log(files)
    files.forEach(i => {
        removeFile('/' + i)
    })
}

const removeFile = (path) => {
    // console.log(path)
    try {
        const fs = window.remixFileSystem;
        const stats = fs.statSync(path)
        if (stats.isFile()) {
            console.log('is file', path)
            fs.unlinkSync(path)
        } else {

            console.log('is dir', path)
            let files = fs.readdirSync(path)
            // console.log(files)
            files.forEach(i => removeFile(path + '/' + i))
            fs.rmdirSync(path)
        }
    } catch (error) {
        console.log(error)
    }

}

export {
    writeBatchFile,
    readBatchFile,
    writeOneFile,
    clearAll
}