export default {
  rules: [
    {test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel-loader']},
    {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader'},
    {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
    {test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
    {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'},
    {test: /\.(jpe?g|png|gif)$/i, loader: 'file-loader?name=[name].[ext]'},
    {test: /\.ico$/, loader: 'file-loader?name=[name].[ext]'},
    {test: /(\.css|\.styl)$/, use: ['style-loader', 'css-loader', {loader: 'stylus-loader', options: {
      use: [require('nib')()],
      import: ['~nib/lib/nib/index.styl']
    }}]}
  ]
};
