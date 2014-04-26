module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		concat: {
			dist: {
				src: ["src/intro.js", "src/*.js", "src/outro.js"],
				dest: "dist/ko-arrays.js"
			}
		},

		uglify: {
			options: {
				banner: "/* <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n"
			},
			build: {
				files: {
					"dist/ko-arrays.min.js": "dist/ko-arrays.js"
				}
			}
		},

		jasmine: {
			pivotal: {
				src: "dist/ko-arrays.js",
				options: {
					vendor: "lib/knockout-3.0.0.min.js",
					specs: "tests/*.js"
				}
			}
		},

		jshint: {
			files: ["dist/ko-arrays.js"],
			options: {
				eqnull: true,
				curly: true,
				forin: true,
				newcap: true,
				noempty: false,
				plusplus: false,
				quotmark: "double",
				nonew: false,
				unused: true
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-jasmine");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.registerTask("tests", ["concat", "jshint", "jasmine"]);
	grunt.registerTask("default", ["concat", "jshint", "jasmine", "uglify"]);
};