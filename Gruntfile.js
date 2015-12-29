module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochaTest: {
      test: {
        options: {
          reporter: 'nyan'
        },
        src: ['test/**/*.js']
      }
    },
    docco: {
      debug: {
        src: ['electron/**/*.js'],
        options: {
          output: 'docs/'
        }
      }
    },
    shell: {
      options: {
        stderr: false
      },
      target: {
        command: 'electron .'
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('docs', [
    'docco'
  ]);

  grunt.registerTask('start', [
    'shell'
  ]);
};
