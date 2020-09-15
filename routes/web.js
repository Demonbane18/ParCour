const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const parcelController = require('../app/http/controllers/suppliers/parcelController')
const orderController = require('../app/http/controllers/suppliers/orderController')
const SPorderController = require('../app/http/controllers/service_providers/orderController')
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')

function initRoutes(app) {

    //routes
    app.get('/', homeController().index)
    app.get('/login', guest, authController().login)
    app.get('/login', authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)

    app.get('/parcel', parcelController().index)
    app.post('/update-parcel', parcelController().update)

    //supplier routes
    app.post('/orders', auth, orderController().store)
    app.get('/supplier/orders', auth, orderController().index)

    //service provider routes
    app.get('/service_provider/orders', auth, SPorderController().index)
}

module.exports = initRoutes