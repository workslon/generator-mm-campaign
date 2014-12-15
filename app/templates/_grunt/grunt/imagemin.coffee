module.exports =
  all:
    files: [
      expand: true
      cwd: 'src/img/'
      src: ['**/*.{png,jpg,gif}']
      dest: 'public/img/'
    ]
