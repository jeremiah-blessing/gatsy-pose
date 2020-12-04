const path = require('path')

exports.onCreatePage = async ({ page, actions}) => {
  const { createPage } = actions

  if (page.path.match(/^\/home\//)) {
    page.matchPath = "/home/*"
    createPage(page)
  }
}
      
