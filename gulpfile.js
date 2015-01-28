// Packages
var gulp = require("gulp"),
	sass = require("gulp-ruby-sass"),
	imagemin = require("gulp-imagemin"),
	del = require("del"),
	uglify = require("gulp-uglify");

var path = {
	styles: ['dev/style/', 'assets/style/'],
	scripts: ['dev/js/', 'assets/js']
}

// Uglify JS
gulp.task('jsmin', function(){
	gulp.src(path.scripts[0] + '*.js')
	.pipe(uglify())
	.pipe(gulp.dest(path.scripts[1]))
});

// Styles
gulp.task('compile-sass', function(){
	return gulp.src(path.styles[0] + '*.scss')
		.pipe(sass({
			style: "compressed",
			noCache: true
		})).on('error', function(err) {
			console.log(err.message);
		})
		.pipe(gulp.dest(path.styles[1]))
});

// Images Task
gulp.task('imagemin', function(){
	return gulp.src('dev/images/*')
	.pipe(imagemin({
		optimizationLevel: 7,
		progressive: true,
		interlaced: true	
	}))
	.pipe(gulp.dest('assets/images'))
});

// Clean Task
gulp.task('clean', function(cb) {
    del(['assets/'], cb)
});

gulp.task('default', ['clean'], function(){
	gulp.start('jsmin','compile-sass', 'imagemin')
});

// Gulp Watch
gulp.task('watch', function(){
	gulp.watch('dev/sass/*.scss', ['compile-sass']);
	gulp.watch('dev/images', ['imagemin']);
})

// Exports
module.exports = gulp;