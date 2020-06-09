const path = require('path');


module.exports = {
    entry: {
        'main': path.resolve(__dirname, 'main.ts'),
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        devtoolModuleFilenameTemplate: '../[resource-path]',
    },

    resolve: {
        extensions: ['.ts', '.js'],
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            }
        ]
    },

    devtool: 'source-map',
}
