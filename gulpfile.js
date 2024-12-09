const { series, src, dest } = require("gulp");
const Pug = require("gulp-pug");
const Stylus = require("gulp-stylus");
const Hjson = require("gulp-hjson");
const rupture = require("rupture");

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

const hjson = (done) => {
    src("./src/_js/*.hjson")
        .pipe(Hjson({ to: "json" }))
        .pipe(dest("./dist/js"));
    done();
};

const pug = (done) => {
    src("./src/**/*.pug", { ignore: "./src/partials/**/*.pug" })
        .pipe(
            Pug({
                filters: {
                    law: law,
                },
                locals: {
                    baseUrl: "/labor-laws",
                },
            })
        )
        .pipe(dest("./dist"));
    done();
};

const stylus = (done) => {
    src("./src/_stylus/*.styl")
        .pipe(Stylus({ use: rupture() }))
        .pipe(dest("./dist/assets/css/"));
    done();
};

const images = (done) => {
    src("./assets/images/favicon_64x64.png", { encoding: false }).pipe(dest("./dist/assets/images"));
    done();
};

const js = (done) => {
    src("./src/_js/**/*.js").pipe(dest("./dist/js"));
    done();
};

exports.build = series(hjson, pug, stylus, images, js);
