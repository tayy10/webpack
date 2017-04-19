const path = require('path'),
    Root_path = path.resolve(__dirname),
    Entry_path = path.resolve(Root_path, 'index'),
    Build_path = path.resolve(Root_path, '_build'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
    // entry: string | Array<string>
    // 入口文件地址
    entry: Entry_path,
    output: {
        // 文件输出目录
        path: Build_path,
        filename: 'res/j/[name].[hash:8].js',
        publicPath: Build_path
    },
    module: {
        rules: [
            // 编译需引用 style-laoder、css-loader
            // npm i --save-dev style-loader css-loader
            // 处理静态资源文件，将css文件单独拎出来
            // 使用extract-text-webpack-plugin插件
            // npm i --save-dev extract-text-webpack-plugin
            // 编译less需引用less-loader
            // npm i --save-dev less-loader
            {
                test: /\.(css|less)$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                importantLoaders: 1,
                                minimize: true
                            }
                        },
                        "less-loader"
                    ]
                })
            },
            // 编译es6需要babel环境
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ['es2015']
                        }
                    }
                ]
            },
            // 给图片添加md5
            // npm i --save-dev url-loader
            {
                test: /\.(png|jpg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            name: '/res/i/[name].[hash:8].[ext]',
                            limit: 10000
                        }
                    }
                ]
            },
            // 对静态页面中的img标签引用的图片添加md5
            // npm i --save-dev html-loader
            {
                test: /\.html/,
                use: {
                    loader: "html-loader",
                    options: {
                        attrs: "img:src img:data-src"
                    }
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'default.html',
            template: path.resolve(Root_Path, 'default.html'),
            hash: false,
            minify: {
                caseSensitive: false,
                collapseBooleanAttributes: true,
                collapseWhitespace: false
            },
            showErrors: false
        }),
        new webpack.optimize.UglifyJsPlugin(),
        // 合并css文件
        new ExtractTextPlugin({
            filename: 'res/c/index.[contenthash:8].css'
        }),
        // 编译之前，清空output的文件夹
        new CleanWebpackPlugin(['dist', '_build', 'build'], {
            root: Root_Path
        })
    ]
};