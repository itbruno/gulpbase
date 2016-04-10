// Settings
// ------------------------------------------
var gulp		= require("gulp"),
	sass		= require("gulp-sass"),
	imagemin	= require("gulp-imagemin"),
	uglify		= require("gulp-uglify"),
	concat		= require("gulp-concat"),
	del			= require("del"),
	watch		= require("chokidar");

// Paths
var path = {
	styles:		'src/scss/**/*.scss',
	scripts:	['src/js/*.js'], // tip: add 'src/js/vendor/vendor.js' for vendors
	images:		'src/images/**/*.{jpg,gif,png}'
}

// Functions for tasks
// ------------------------------------------
// Concat and Minify Javascript files
function gb_jsmin() {
	gulp.src(path.scripts)
	.pipe(concat('main.js'))
	.pipe(uglify())
	.on('error', function(err) {
			console.log('[JS] error:', err.message);
	})
	.pipe(gulp.dest('assets/js/'))
};

// Minify and Compile Scss files
function gb_styles() {
	gulp.src(path.styles)
	.pipe(sass({outputStyle: 'compressed'
	})).on('error', function(err) {
			console.log('[SCSS] error::', err.message);
	})
	.pipe(gulp.dest('assets/css/'))
};

// Compress images
function gb_imagemin() {
	return gulp.src(path.images)
	.pipe(imagemin({
		optimizationLevel: 7,
		progressive: true,
		interlaced: true
	})).on('error', function(err) {
			console.log('[IMAGE] error:', err.message);
	})
	.pipe(gulp.dest('assets/images/'))
};

// Clean
function gb_clean(cb) {
	del('assets/', cb);
};

// Wath files and load tasks
function gb_watch() {
	gulp.watch(path.styles, gulp.series('gb_styles'));
	gulp.watch(path.scripts, gulp.series('gb_jsmin'));
	gulp.watch(path.images, gulp.series('gb_imagemin'));
};

// Default task
function gb_default(done) {
	gulp.series('gb_clean',
		gulp.parallel('gb_styles','gb_jsmin','gb_imagemin')
	);
	done();
};

// Define Tasks
// ------------------------------------------
gulp.task(gb_jsmin);
gulp.task(gb_styles);
gulp.task(gb_imagemin);
gulp.task(gb_clean);
gulp.task(gb_watch);
gulp.task('default', gb_default);
