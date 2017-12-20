module.exports = function(grunt) {
  // Load Grunt tasks declared in the package.json file
  require('jit-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    express: {
      another: {
        options: {
          port: 9001,
          hostname: "localhost",
          bases: ['output'],
          livereload: true,
          //open: 'http://localhost:<%= express.another.options.port%>/draft-saad-mpls-rsvp-te-mbb-intf-label.html'
        }
      }
    },
    watch: {
      another: {
        files: ['draft-saad-mpls-rsvp-te-mbb-intf-label.md'],
        tasks: ['kramdown_rfc2629'],
        options: {
          livereload: 1337,
        }
      }
    },
    kramdown_rfc2629: {
      another: {
        src: ['draft-saad-mpls-rsvp-te-mbb-intf-label.md']
      }
    }
  });

  grunt.registerTask('default', ['kramdown_rfc2629']);
  grunt.registerTask('server', ['kramdown_rfc2629', 'express', 'watch'])
};
