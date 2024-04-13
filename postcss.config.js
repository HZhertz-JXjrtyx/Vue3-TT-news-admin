export default ({ file }) => {
  const designWidth = file.dirname.includes('node_modules/vant') ? 375 : 750
  return {
    plugins: {
      postcsspxtoviewport: {
        viewportWidth: designWidth
      }
    }
  }
}
