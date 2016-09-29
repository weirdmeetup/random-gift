var webpack = require('webpack');

module.exports = {

    context: __dirname + '/src',
    entry: './index.js',

    output: {
        path: __dirname + '/public',
        filename: 'bundle.js'
    },

    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'eslint',
                exclude: [ /node_modules/ ]
            }
        ],

        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: [ /node_modules/ ],
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};
