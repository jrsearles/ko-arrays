module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),

		uglify: {
			options: {
				banner: "/* <%= pkg.name %> <%= grunt.template.today('yyyy-mm-dd') %> */\n"
			},
			build: {
				files: {
					"dist/ko.arrays.min.js": "src/ko.arrays.js"
				}
			}
		},

		jasmine: {
			pivotal: {
				src: "src/*.js",
				options: {
					vendor: "lib/knockout-3.0.0.min.js",
					specs: "tests/*.js"
				}
			}
		},

		jshint: {
			files: ["src/*.js"],
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

	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-jasmine");
	grunt.loadNpmTasks("grunt-contrib-uglify");

	grunt.registerTask("tests", ["jshint","jasmine"]);
	grunt.registerTask("default", ["jshint","jasmine","uglify"]);
};