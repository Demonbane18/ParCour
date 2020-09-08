const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const parcelController = require('../app/http/controllers/suppliers/parcelController')

function initRoutes(app) {

    //routes
    app.get('/', homeController().index)
    app.get('/parcel', parcelController().index)
    app.get('/login', authController().login)
    app.get('/register', authController().register)
}

module.exports = initRoutes