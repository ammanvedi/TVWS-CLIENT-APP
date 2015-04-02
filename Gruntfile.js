// Generated on 2015-01-26 using generator-angular 0.10.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      css: {
        files: ['**/*.scss'],
        tasks: ['compass:dist']
      },
      scripts: {
        files: ['app/scripts/**/*.js'],
        tasks: ['concat:dist', 'concat:lib', 'uglify:target'] 
      }
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 5,

        },
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'app/images/',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}', '!build/*'],   // Actual patterns to match
          dest: 'app/images/build/'                  // Destination path prefix
        }]
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      target:
      {
        files: {
          'app/scripts/build/lib/lib.min.js' : ['app/scripts/build/lib/lib.concat.js']
        }
      }
    },
    concat: {
      options:{
        separator: ';'
      },
      dist:{
        src: ['app/scripts/app.js', 'app/scripts/services.js', 'app/scripts/directives.js', 'app/scripts/custommarker.js', 'app/scripts/controllers/*.js'],
        dest: 'app/scripts/build/client/client.concat.js'
      },
      lib:{
        src:['app/bower_components/jquery/dist/jquery.min.js',
        'app/bower_components/jqf/jqf.js',
        'app/bower_components/semantic-ui/dist/semantic.min.js',
        'app/bower_components/hcharts/highcharts.src.js',
        'app/bower_components/angular/angular.min.js',
        'app/bower_components/angular-animate/angular-animate.min.js',
        'app/bower_components/angular-cookie/angular-cookie.min.js',
        'app/bower_components/angular-resource/angular-resource.min.js',
        'app/bower_components/angular-route/angular-route.min.js',
        'app/bower_components/angular-sanitize/angular-sanitize.min.js',
        'app/bower_components/moment/min/moment-with-locales.min.js',
        'app/bower_components/angular-moment/angular-moment.min.js',
        'app/bower_components/ng-file-upload/angular-file-upload-shim.min.js',
        'app/bower_components/ng-file-upload/angular-file-upload.min.js',
        'app/bower_components/ngmap/build/scripts/ng-map.min.js',
        'app/bower_components/highcharts-ng/dist/highcharts-ng.min.js'

        ],
        dest: 'app/scripts/build/lib/lib.concat.js'
      }
    },



    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
      },
      dist: {
        options: {
          sassDir: '<%= yeoman.app %>/styles',
          cssDir: '<%= yeoman.app %>/styles/build'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },





    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

  });



  grunt.registerTask('builddev', [
  'compass:dist', 'concat:dist'
  ]);



  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
