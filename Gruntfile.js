/*! *//*!
 * bottle-o-messages v1.0.0 - "Sogeking no shima deeeeeee - One Piece"
 * ~~~~~~~~~~~~~~~~~~
 *
 * Run it in command line:
 * grunt
 *
 * ~~~~~~~~~~~~~~~~~~
 * Copyright 2015 Achraf Chouk <achrafchouk@gmail.com>
 */

module.exports = function (grunt){
    //------ [REGISTER CONFIGURATION] ------//

    grunt.initConfig({
        //project settings
        ach: {
            configs: {
                /* COLORS */
                blue: '#4387bf',
                bluedark: '#3883c0',
                green: '#55bb3a',
                greendark: '#047f40',
                //normal
                white: '#ffffff',
                black: '#000000',
                //grays
                graymetal: '#33455a',
                graylighter: '#f7f7f7',
                graylight: '#dae1e8',
                gray: '#696d73',
                graydarker: '#2e2e2e',
                //alerts
                info: '#3498db',
                warning: '#e67e22',
                danger: '#e74c3c',
                success: '#2ecc71',
                //social
                facebook: '#466fa7',
                googleplus: '#dd4b39',
                linkedin: '#0976b4',
                twitter: '#2caae2',

                /* FONTS */
                fontopensans: '"Open Sans", sans-serif',
            },
            flatten: true,
            name: 'bottle',
            path: {
                src: 'assets',
                bow: 'bower_components',
                tar: 'public'
            }
        },

        //pachakes are listed here
        pkg: grunt.file.readJSON('package.json'),

        //JShint validation
        jshint: {
            all: [
                '<%= ach.path.src %>/js/*.js'
            ]
        },

        //1. remove any previously-created files
        clean: {
            before: [
                //targets
                '<%= ach.path.tar %>/css/*',
                '<%= ach.path.tar %>/fonts/*',
                '<%= ach.path.tar %>/img/*',
                '<%= ach.path.tar %>/js/*'
            ],
            after: [
                //sources
                '<%= ach.path.src %>/ach.css',
                '<%= ach.path.src %>/ach.js'
            ]
        },

        //2. move fonts and images into the destinated folder
        copy: {
            main: {
                files: [
                    {
                        //assets
                        cwd: '<%= ach.path.src %>/',
                        expand: true,
                        flatten: false,
                        src: [
                            'favicon.ico',
                            'messages.json',
                        ],
                        dest: '<%= ach.path.tar %>/'
                    },
                    {
                        //fonts
                        cwd: '<%= ach.path.src %>/fonts/',
                        expand: true,
                        flatten: false,
                        src: [
                            '**/*'
                        ],
                        dest: '<%= ach.path.tar %>/fonts/'
                    },
                    {
                        //font-awesome
                        expand: true,
                        flatten: true,
                        src: [
                            //FontAwesome
                            '<%= ach.path.bow %>/font-awesome-bower/fonts/*'
                        ],
                        dest: '<%= ach.path.tar %>/fonts/'
                    },
                    {
                        //images
                        cwd: '<%= ach.path.src %>/img/',
                        expand: true,
                        flatten: false,
                        src: [
                            '**/*'
                        ],
                        dest: '<%= ach.path.tar %>/img/'
                    }
                ]
            }
        },

        //3. less compilation
        less: {
            main: {
                options: {
                    modifyVars: '<%= ach.configs %>',
                    optimization: 2
                },
                files: {
                    //main css
                    '<%= ach.path.src %>/ach.css': [
                        '<%= ach.path.src %>/less/*.less'
                    ]
                }
            }
        },

        //4. minify CSS files
        cssmin: {
            compress: {
                files: {
                    '<%= ach.path.tar %>/css/<%= ach.name %>.css': [
                        //font-awesome
                        '<%= ach.path.bow %>/font-awesome-bower/css/font-awesome.css',
                        //normalize.css
                        '<%= ach.path.bow %>/normalize.css/normalize.css',
                        //main
                        '<%= ach.path.src %>/ach.css'
                    ]
                }
            }
        },

        //5. uglify JS files
        uglify: {
            options: {
                preserveComments: 'some'
            },
            my_target: {
                files: {
                    '<%= ach.path.tar %>/js/<%= ach.name %>.js': [
                        //jQuery
                        '<%= ach.path.bow %>/jquery/dist/jquery.js',
                        //main
                        '<%= ach.path.src %>/js/ach.js'
                    ]
                }
            }
        }
    });

    //------ [REGISTER MODULES] ------//

    //remove any previously-created files
    grunt.loadNpmTasks('grunt-contrib-clean');

    //move fonts and images into the destinated folder
    grunt.loadNpmTasks('grunt-contrib-copy');

    //minify CSS files
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //JShint validation
    grunt.loadNpmTasks('grunt-contrib-jshint');

    //less compilation
    grunt.loadNpmTasks('grunt-contrib-less');

    //uglify JS files
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //------ [REGISTER TASKS] ------//

    //JShint validation task: grunt hint
    grunt.registerTask('hint',      ['jshint']);

    //default task: grunt default / grunt
    grunt.registerTask('default',   ['clean:before','copy','less','cssmin','uglify','clean:after']);
};
