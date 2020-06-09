const { exec } = require('child_process');
const fs = require('fs');
const gulp = require('gulp');
const gTsc = require('gulp-tsc');
const path = require('path');
const rimraf = require('rimraf');

const DIST_PATH = path.resolve(__dirname, 'dist');
const SRC_PATH = path.resolve(__dirname, 'src');
let files = [
    'README.md'
];

gulp.task('clean', cb => {
    console.log('clean dist folder ...');

    rimraf(DIST_PATH, cb);
});

gulp.task('tsc', () => {
    const tsconfigFilePath = path.resolve(__dirname, 'tsconfig.json');
    const srcs = [path.resolve(__dirname, '**/**.ts')];
    return gulp.src(srcs)
        .pipe(gTsc({ project: tsconfigFilePath }));
});

gulp.task('files', () => {
    console.log('copy other files ...');

    const srcs = files.map(filename => path.resolve(__dirname, filename));
    return gulp
        .src(srcs)
        .pipe(gulp.dest(DIST_PATH));
})

gulp.task('package', cb => {
    console.log('copy package.json ...');

    const pkg = require('./package.json');
    pkg.fils = [
        '**/*.ts',
        'README.md'
    ];
    pkg.scripts = {};
    fs.writeFileSync(path.resolve(DIST_PATH, 'package.json'), JSON.stringify(pkg, null, 2), 'utf8');

    cb();
});

gulp.task('npm-publish', cb => {
    console.log('npm publish ...');

    exec('npm publish', { cwd: DIST_PATH, encoding: 'utf8' }, (error, stdout, stderr) => {
        if (stdout) { console.log(stdout); }
        if (error) { throw error; }
        cb();
    });
});

gulp.task('publish', gulp.series('clean', 'tsc', 'files', 'package', 'npm-publish'));
