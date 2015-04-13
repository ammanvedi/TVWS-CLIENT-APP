// Generated on 2015-01-26 using generator-angular 0.10.0
'use strict';



module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    watch: {
      css: {
        files: ['**/*.scss'],
        tasks: ['compass:dist']
      },
      scripts: {
        files: ['app/scripts/**/*.js'],
        tasks: ['concat:dist', 'concat:lib', 'uglify:target', 'ngdocs'] 
      }
    },
    ngdocs: {
       options: {
           dest: 'app/views/docs',
           html5Mode: true,
           scripts: [
               'app/bower_components/angular/angular.js',
               'app/bower_components/angular-animate/angular-animate.js',

           ]
       },
       api: {
           src: ['app/scripts/services.js', 'app/scripts/controllers/*.js'],
           title: 'Code Documentation - Measurespace'
       }
    },

    imagemin: {
      dist: {
        options: {
          optimizationLevel: 5,

        },
        files: [{
          expand: true,  
          cwd: 'app/images/',
          src: ['**/*.{png,jpg,gif}', '!build/*'],
          dest: 'app/images/build/'
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
    compass: {
      options: {
      },
      dist: {
        options: {
          sassDir: 'app/styles',
          cssDir: 'app/styles/build'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },


  });

  grunt.registerTask('buildsite', [
  'concat:dist', 'concat:lib', 'uglify:target', 'ngdocs', 'compass:dist'
  ]);

    grunt.registerTask('buildsiteimg', [
  'concat:dist', 'concat:lib', 'uglify:target', 'ngdocs', 'imagemin:dist', 'compass:dist'
  ]);
};
