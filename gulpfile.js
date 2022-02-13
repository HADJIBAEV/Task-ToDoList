'use strict';
/* */
const   {src, dest}  = require('gulp'),
        gulp         = require('gulp'),
        scss         = require('gulp-sass'),
        browsersync  = require("browser-sync").create(),
        del          = require("del"),
        concat       = require('gulp-concat'),
        plumber      = require("gulp-plumber"),
        autoprefixer = require('gulp-autoprefixer'),
        cleanCSS     = require('gulp-clean-css'),
        posthtml     = require("gulp-posthtml"),
        htmlmin      = require("gulp-htmlmin"),
        imagemin     = require("gulp-imagemin"),
        fileInclude  = require("gulp-file-include"),
        uglify       = require("gulp-uglify-es").default,
        webp         = require('gulp-webp'),
        // webphtml     = require('gulp-webp-html'),
        gcmq         = require('gulp-group-css-media-queries');
        // sourcemap    = require("gulp-sourcemaps"),      
        // postcss      = require("gulp-postcss"),        
        // minify       = require("gulp-minify"),
/* */
let project_folder   = "build";
let source_folder    = "app";
let path = {
            build: {
                     html:  project_folder + "/",
                     css:   project_folder + "/css/",
                     js:    project_folder + "/js/",
                     img:   project_folder + "/img/",
                     fonts: project_folder + "/fonts/",
                     pdf:   project_folder + "/pdf/",
            },
            src:   {
                     html:  [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
                     css:   source_folder + '/scss/*.scss',  //style.scss
                     js:    source_folder + "/js/*.js",
                     img:   source_folder + "/img/**/*.{png,jpg,svg,gif,ico,webp}",
                     fonts: source_folder + "/fonts/*.ttf",
                     pdf:   source_folder + "/pdf/*.pdf"
            },
            watch: {
                     html:  source_folder + "/**/*.html",
                     css:   source_folder + "/scss/**/*.scss",
                     js:    source_folder + "/js/**/*.js",
                     img:   source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
            },
            clean:  './' + project_folder + "/*"
}
/*--------------------------------------- №= 1 TASK CLEAN ---------------------------------------*/

gulp.task("clean", function() {
    return del(path.clean);               // deleting all files in build folders
});
/*--------------------------------------- №= 2 TASK HTML ---------------------------------------*/

// gulp.task( "html", function() {
    function html(){
    return gulp.src(path.src.html)
                .pipe(fileInclude()) 
                .pipe(plumber ())
                .pipe(posthtml()) 
                // .pipe(htmlmin({ collapseWhitespace: true }))   
                .pipe(dest(path.build.html))                         // unload html file!!!
                .pipe(browsersync.stream())
                           
}

/*--------------------------------------- №= 3 TASK CSS ---------------------------------------*/

// gulp.task("css", function() {
function css() {
    return src (path.src.css)
        .pipe(plumber ())                                           // для отслеживания ошибок
        .pipe (
            scss({                                                  // scss -> css
                outputStyle: 'expanded'                             //use compressed  or expanded!!!
                }).on('error', scss.logError)
        ) 
        // .pipe(dest(path.build.css)) 
        // .pipe(browsersync.stream()) 
        // .pipe(
        //     autoprefixer({
        //         overrideBrowserslist: ["last 3 versions"],   
        //         cascade: true
        //     }) 
        // )     
        // .pipe(gcmq())
        // .pipe(cleanCSS())                                           // clean css file!!!
        // .pipe(concat('style.min.css'))                              // rename new mincss file!!!
        .pipe(dest(path.build.css))                                 // unload mincss file!!!
        .pipe(browsersync.stream())
}


/*--------------------------------------- №= 4 TASK JS ---------------------------------------*/
// gulp.task( "js", function() 
function js() {
    return gulp.src(path.src.js)
                .pipe(fileInclude())                                // in the js file write (@@include('Name js file'))!!!
                .pipe(plumber ())
                .pipe(dest(path.build.js))  
                // .pipe(
                //     uglify()                                        // clean js file!!
                // )
                // .pipe(concat('script.min.js'))                      // rename new minjs file!!!
                .pipe(dest(path.build.js))                          // unload js file!!!
                .pipe(browsersync.stream())                       
};


/*--------------------------------------- №= 4 TASK IMG ---------------------------------------*/
gulp.task("images", function() {
        return gulp.src(path.src.img)                               // PNG,JPG,SVG,png,jpg,svg !!!
                // .pipe(
                //     webp({
                //         quality: 70

                //      })
                // )
                // .pipe(gulp.dest(path.build.img)) 
                .pipe(src(path.src.img))                                            
                // .pipe(
                //     imagemin({
                //         progressive: true,
                //         svgoPlugins: [{ removeViewBox: false }],  
                //         interlaced:  true,
                //         optimizationLevel: 3                            //use option 0 to 7!!!                      
                // }))
                .pipe(gulp.dest(path.build.img))                 // unload img file!!!
                .pipe(browsersync.stream())
});


/*--------------------------------------- №= 6 TASK Fonts ---------------------------------------*/
gulp.task( "fonts", function() {
    return gulp.src(path.src.fonts)
                .pipe(dest(path.build.fonts))                      // unload html file!!!                     
});
/*--------------------------------------- №= 7 TASK PDF ---------------------------------------*/
gulp.task( "pdf", function() {
    return gulp.src(path.src.pdf)
                .pipe(dest(path.build.pdf))                        // unload html file!!!                    
});

/*--------------------------------------- №= 8 TASK SERVER ---------------------------------------*/

gulp.task('browserSync', function (params) {
    browsersync.init({
        server: {
            baseDir: "./" + project_folder + "/"
        },
        port: 3000,
        notify:false
    })
});


function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.css], css);
}



// gulp.task('watchFiles', function (params) {
//     gulp.watch([path.watch.html], html);
//     gulp.watch([path.watch.css], css);
//     gulp.watch([path.watch.js], js);
//     gulp.watch([path.watch.img], img);
// })

let build  = gulp.series("clean", html, css, "images",  gulp.parallel(js,  "fonts", "pdf", watchFiles,"browserSync"));


exports.html = html;
exports.styles = css;
exports.html = js;
exports.build = build;
// exports.default=watch;