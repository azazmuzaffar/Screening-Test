"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cssnano = require("cssnano");
const concat = require("gulp-concat");
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
var sass = require("gulp-sass")(require("sass"));
const livereload = require("gulp-livereload");
const notify = require("gulp-notify");
var reload = browsersync.reload;

// == Browser-sync task
gulp.task("browser-sync", function (done) {
  browsersync.init({
    server: "./",
    startPath: "webpage/index.html", // After it browser running [File path set]
    //    browser: 'chrome',
    host: "localhost",
    //    port: 4000,
    open: true,
    tunnel: true,
  });
  gulp.watch(["./**/*.html"]).on("change", reload); // [File path set]
  done();
});
// == Browser-sync task

// CSS task
gulp.task("css", () => {
  return gulp
    .src("assets/scss/app.scss")
    .pipe(plumber())
    .pipe(sass({ outputStyle: "expanded" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("public/css"))
    .pipe(
      notify({
        message: "SCSS has been processed!",
      })
    )
    .pipe(browsersync.stream())
    .pipe(livereload());
});

// Webfonts task
gulp.task("webfonts", () => {
  return gulp.src("assets/fonts/*.{ttf,woff,woff2,eot,svg}").pipe(gulp.dest("./public/fonts"));
});

gulp.task(
  "default",
  gulp.series("css", "webfonts", "browser-sync", () => {
    livereload.listen();
    gulp.watch(["assets/scss/**/*"], gulp.series("css"));
    gulp.watch(["assets/fonts/*"], gulp.series("webfonts"));
  })
);
