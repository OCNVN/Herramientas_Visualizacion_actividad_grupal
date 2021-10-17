const path = require('path');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
        {
            test: /\.(png|jpe|csv?g|gif)$/i,
            use: [
                {
                    loader: 'file-loader',
                },
            ],
        },
        
      ],
  },
  devServer: {
    static: './dist',
  },
};