// Packages
var gulp = require("gulp"),
	sass = require("gulp-sass"),
	imagemin = require("gulp-imagemin"),
	uglify = require("gulp-uglify"),
	concat = require("gulp-concat"),
	del = require("del"),
	rsync = require ("rsyncwrapper").rsync;

var path = {
	styles: 		'src/scss/**/*.scss',
	scripts: 		['src/js/*.js'], // tip: add 'src/js/vendor/vendor.js' for vendors
	images: 		'src/images/**/*.{jpg,gif,png}'
}

// Uglify JS
gulp.task('jsmin', function(){
	gulp.src(path.scripts)
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(gulp.dest('assets/js/'))
});

// Sass compiler and compress css
gulp.task('sass', function() {
	gulp.src(path.styles)
	.pipe(sass({outputStyle: 'compressed'
	})).on('error', function(err) {
			console.log('ERROR:', err.message);
	})
	.pipe(gulp.dest('assets/css/'))
});

// Images Task
gulp.task('imagemin', function(){
	return gulp.src(path.images)
	.pipe(imagemin({
		optimizationLevel: 7,
		progressive: true,
		interlaced: true
	}))
	.pipe(gulp.dest('assets/images/'))
});

// Clean Task
gulp.task('clean', function(cb) {
    del('assets/', cb)
});

// Build
gulp.task('build', function(){
	rsync({
		src: '', // source path
		dest: '', // destination
		exclude: ['node_modules', '.DS_Store', '.editorconfig', '.gitignore'],
		recursive: true,
		compareMode: 'checksum',
		// deleteAll: true, (optional)
		onStdout: function( data ) {
			console.log( data.toString() );
		}
	}, function( error, stdout, stderr, cmd ) {
		console.log('Build - END');
	});
});

// Default Task
gulp.task('default', ['clean'], function(){
	gulp.start('jsmin','sass','imagemin')
});

// Gulp Watch
gulp.task('watch', function(){
	gulp.watch(path.styles, ['sass']);
	gulp.watch(path.scripts, ['jsmin']);
	gulp.watch(path.images, ['imagemin']);
})
