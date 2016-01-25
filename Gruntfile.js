module.exports = function(grunt) {

    'use strict';

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    
    grunt.initConfig({
        jshint: {
            options: {
              
              
            },
            all: [
                '*.js', 
                'modules/**/*.js',
                '!bower_components/**/*.js'
            ]
        },
        nodeunit: {
            util: ['test/index.js']
        },
        watch: {
            all: {
                files: ['<%= jshint.all %>'],
                tasks: ['test'],
            },
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: './',
                    keepalive : true
                }
            }
        }
    });

    grunt.registerTask('debug', ['jshint:all']);
    grunt.registerTask('server', ['connect:server']);
    grunt.registerTask('default', ['debug', 'watch']);

};