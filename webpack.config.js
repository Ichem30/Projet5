const path = require('path')
const glob = require('glob')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const PATHS = {
  src: path.join(__dirname, 'src')
}

const sharedHtmlWebpackConf = name => {
  const result = name === 'index' ? {} : { chunks: ['main'] }
  result.favicon = path.resolve(__dirname, './camera.webp')
  result.template = path.resolve(__dirname, `./src/html/${name}.html`)
  result.filename = `${name}.html`
  return result
}

const config = {
  entry: {
    main: path.resolve(__dirname, './src/app.js')
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    publicPath: '',
    assetModuleFilename: './src/assets/[name][ext]',
    clean: true
  },
  devServer: {
    port: 8090,
    compress: false,
    static: {
      directory: path.join(__dirname, '/')
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(sharedHtmlWebpackConf('index', 'Nina Carducci')),
    new MiniCssExtractPlugin(),
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    }),
    new webpack.DefinePlugin({
      DEBUG: process.env.NODE_ENV === 'development',
      VERSION: JSON.stringify(require('./package.json').version)
    }),
    new CopyPlugin({
      patterns: [
        { from: 'robots.txt', to: 'robots.txt' },
        { from: 'serve.json', to: 'serve.json' }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader' 
        ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|otf|cur|mp4|webp)$/i,
        type: 'asset/resource'
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    },
   
    minimizer: [
     
      new TerserPlugin(), 
      new CssMinimizerPlugin(),
    
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.sharpMinify,
          options: {
            encodeOptions: {
              jpeg: {
               
                quality: 100
              },
             
              avif: {
              
                lossless: true
              },

              
              png: {},

            
              gif: {}
            }
          }
        }
      })
    ]
  },
  devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : 'eval-source-map'
}

module.exports = (env, argv) => {
  console.log(`mode = ${argv.mode}, NODE_ENV = ${process.env.NODE_ENV}`)

  return config
}
