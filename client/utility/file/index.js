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
    return files.map(i => {
        return {
            code: fs.readFileSync(i, { encoding: 'utf8' }),
            path: i
        }
    })
}

const writeOneFile = (path, content) => {
    const fs = window.remixFileSystem;
    let index = path.lastIndexOf('/')
    
    // const folder = path.substring(0, index)
    const file = path.substring(index + 1, path.length)

    fs.writeFileSync(file, content)

}

export {
    writeBatchFile,
    readBatchFile,
    writeOneFile
}