var exec = require('child_process').exec;
var gulp = require('gulp');

gulp.task('server', function (cb) {
    exec('node app/index.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('mongo', function (cb) {
    exec('mongod --dbpath ./data/db', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('style', function (cb) {
    exec('sass --watch app/sass:app/public/css', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('launch', function (cb) {
    var opener = require("opener");
    opener("http://localhost:81/");
});

gulp.task('default', ['mongo', 'server', 'style', 'launch'], () => {
    // place code for your default task here
    console.log('started');
});