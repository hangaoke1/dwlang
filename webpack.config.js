const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        app: './src/index.tsx',
        // "editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js',
        // "dwLangWorker": './src/dwLang/dwLang.ts'
    },
    output: {
        globalObject: 'self',
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.pegjs', '.css']
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                loader: 'ts-loader'
            },
            {
                test: /\.pegjs$/,
                loader: 'pegjs-loader',
            },
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: 'file-loader',
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                __webpack_public_path__: '"/"',
            }
        }),
        new htmlWebpackPlugin({
            template: './src/index.html'
        }),
        new MonacoWebpackPlugin({
            publicPath: '/',
            customLanguages: [
                {
                    label: 'dwLang',
                    worker: {
                        id: 'vs/language/dwLang/dwLangWorker',
                        label: 'dwLang-worker',
                        entry: path.resolve(__dirname, './src/dwLang/dwLang.ts')
                    }
                }
            ],
        }),
    ]
}