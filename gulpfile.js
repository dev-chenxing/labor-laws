const { series, src, dest } = require("gulp");
const gulpPug = require("gulp-pug");
const gulpStylus = require("gulp-stylus");

const pug = (done) => {
    src("./src/**/*.pug", { ignore: "./src/partials/**/*.pug" }).pipe(gulpPug()).pipe(dest("./dist"));
    done();
};

const stylus = (done) => {
    src("./src/_stylus/*.styl").pipe(gulpStylus()).pipe(dest("./dist/assets/css/"));
    done();
};

exports.build = series(pug, stylus);
