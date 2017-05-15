import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

export default function(dev = true) {
  return [
    // Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(dev ? 'dev' : 'production'),
      __DEV__: dev
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      noInfo: true, // set to false to see a list of every file being bundled.
      options: {
        context: '/',
        postcss: () => [autoprefixer],
      }
    })
  ];
};
