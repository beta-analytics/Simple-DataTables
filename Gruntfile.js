module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');

	grunt.initConfig({
		jshint: {
			all: ['vanilla-dataTables.js']
		},
		qunit: {
			all: ['tests/index.html']
		}
	});

	grunt.registerTask('test', ['jshint', 'qunit']);
	grunt.registerTask('default', ['test']);
};
