const { series, src, dest } = require("gulp");
const gulpPug = require("gulp-pug");
const gulpStylus = require("gulp-stylus");

function law(text, options) {
    function parse(line) {
        if (/^目\s*录$/.test(line)) return `<p class="text-center"><strong>${line}</strong></p>`;
        else {
            const index = line.search(/\s/);
            if (index > 0) {
                const label = line.slice(0, index);
                if (/[章节]$/.test(label)) return `<p class="text-center"><strong>${line}</strong></p>`;
                else if (/条$/.test(label)) return `<p><strong>${label}</strong> ${line.slice(index)}</p>`;
                else return `<p>${line}</p>`;
            } else return `<p>${line}</p>`;
        }
    }
    const lines = text.split("\n").map((line) => parse(line.trim()));
    return lines.join("");
}

const pug = (done) => {
    src("./src/**/*.pug", { ignore: "./src/partials/**/*.pug" })
        .pipe(
            gulpPug({
                filters: {
                    law: law,
                },
            })
        )
        .pipe(dest("./dist"));
    done();
};

const stylus = (done) => {
    src("./src/_stylus/*.styl").pipe(gulpStylus()).pipe(dest("./dist/assets/css/"));
    done();
};

const images = (done) => {
    src("./assets/images/*").pipe(dest("./dist/assets/images"));
    done();
};

exports.build = series(pug, stylus, images);
