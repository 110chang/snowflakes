module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      files: [
        'src/**/*.js'
      ],
      tasks: ['browserify'],
      /*options: {
        livereload: true
      }*/
    },

    browserify: {
      dist : {
        src : 'src/main.js',  // エントリーポイントとなるファイル
        dest : 'public/js/all.js'  // 出力するファイル名
      },
      options: {
        browserifyOptions: {
          debug: true
        }
      }
    }
  });

  //matchdepでpackage.jsonから"grunt-*"で始まる設定を読み込む
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('w', ['watch']);
  grunt.registerTask('b', ['browserify']);
};
