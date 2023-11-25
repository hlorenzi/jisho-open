const path = require("path")
const CompressionPlugin = require("compression-webpack-plugin")


module.exports = {
    mode: "production",
	devtool: "source-map",
    
	entry: {
		main: path.resolve(__dirname, "src/main.tsx"),
	},
	
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, ".build"),
		publicPath: "/.build/",
	},
	
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use:
				{
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-typescript",
                            "babel-preset-solid",
                        ]
					}
				}
			}
		]
	},

	plugins: [
		new CompressionPlugin(),
	],
}