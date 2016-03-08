"use strict";

var gulp = require("gulp"),
    path = require("path"),
    gutil = require("gulp-util"),
    webpack = require("webpack");


let minify = true,
    watch = false;


process.argv.forEach((arg) => {

    if (arg == "--dev" || arg == "-d") {
        minify = false;
        gutil.log("[TrainJamGame] dev flag passed, enabled");
    }

    if (arg == "--watch" || arg == "-w") {
        watch = true;
        gutil.log("[TrainJamGame] watch flag passed, enabled");
    }

});


var build = function (options, callback) {

    let plugins = [];

    if (options.minify) {
        plugins = [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
                output: {
                    comments: false,
                    semicolons: true
                }
            })
        ];
    }

    webpack({
        entry: options.entry,
        bail: !options.watch,
        watch: options.watch,
        devtool: "source-map",
        plugins: plugins,
        output: {
            path: options.path,
            filename: "[name].js"
        },
        module: {
            loaders: [{
                loader: "babel-loader",
                test: /\.js$/,
                include: [
                    path.join(__dirname, "src"),
                    path.join(__dirname, "node_modules", "momentumengine")
                ],
                query: {
                    plugins: ["transform-runtime"],
                    presets: ["es2015", "stage-0"]
                }
            }]
        }
    }, (error, stats) => {

        if (error) {

            let pluginError = new gutil.PluginError("webpack", error);

            if (callback) {
                callback(pluginError);
            } else {
                gutil.log("[Webpack]", pluginError);
            }

            return;

        }

        gutil.log("[Webpack]", stats.toString());

        if (callback) {
            callback();
        }

    });

};


gulp.task("game", (callback) => {
    build({
        entry: {
            "game": path.join(__dirname, "src", "main.js")
        },
        path: path.join(__dirname, "dist"),
        watch: watch,
        minify: minify
    }, callback);
});


gulp.task("default", ["game"]);
