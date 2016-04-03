module.exports = function(grunt) {
  'use strict';

  grunt.config.init({
    pkg: grunt.file.readJSON('package.json')
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.config('uglify', {
    dist: {
      files: [{
        expand: true,
        src: 'src/**/*.js',
        dest: 'dist'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.config('copy', {
    dist: {
      files: [{
        src: 'dist.html',
        dest: 'dist/index.html'
      }, {
        expand: true,
        flatten: true,
        src: 'node_modules/js-sorting/dist/**/*.js',
        dest: 'dist/vendor/js-sorting/'
      }, {
        src: 'images/**/*.*',
        dest: 'dist/'
      }]
    },
    dev: {
      files: [{
        expand: true,
        src: 'src/**/*.js',
        dest: 'dist'
      }]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.config('clean', {
    dist: [
      'dist.html'
    ]
  });

  grunt.loadNpmTasks('grunt-jasmine-node-coverage');
  grunt.config('jasmine_node', {
    coverage: {
      coverage: { },
      options: {
        extensions: 'js',
        specNameMatcher: '.*-spec',
        captureExceptions: true
      }
    }
  });

  grunt.registerTask('dist', [
    'uglify:dist',
    'copy:dist',
    'clean:dist'
  ]);

  grunt.registerTask('dev', [
    'copy:dist',
    'copy:dev',
    'clean:dist'
  ]);

  grunt.registerTask('coverage', [
    'jasmine_node:coverage'
  ]);

  grunt.registerTask('default', [
    'dev',
    'dist',
    'coverage'
  ]);
};
