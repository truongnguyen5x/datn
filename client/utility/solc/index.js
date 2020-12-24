import solc from 'solc'
/**
 * Function use solc to compile source code
 * @param {Object[]} data  data for compile source code
 * @param {string} data[].path path of file in source code
 * @param {string} data[].code source code of a file
 */
const compileSourceCode = async (data) => {
    const input = {
        language: 'Solidity',
        sources: {
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    }
    data.forEach(i => {
        input.sources[i.path] = {
            content: i.code
        }
    });
    var output = JSON.parse(
        solc.compile(JSON.stringify(input))
    );
    return output
}

export {
    compileSourceCode
}