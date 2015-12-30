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
    },
    electron: {
        osxBuild: {
            options: {
                name: 'Jarvis',
                dir: '.',
                out: 'build',
                version: '0.25.3',
                platform: 'darwin',
                arch: 'x64'
            }
        }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-docco');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-electron');

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('docs', [
    'docco'
  ]);

  grunt.registerTask('start', [
    'shell'
  ]);

  grunt.registerTask('build', [
    'electron'
  ]);
};
