
const path = require('path')
const development = process.env.NODE_ENV != 'production'

module.exports = {
    mode: development ? "development" : "production",
    entry: './ide/index.js',
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "main-ide.js",
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-react", ["@babel/preset-env", { modules: 'commonjs' }]],
                        plugins: ["@babel/plugin-transform-runtime"]
                    }
                }
            }
        ]
    },
    node: {
        fs: 'empty'
    }
}
