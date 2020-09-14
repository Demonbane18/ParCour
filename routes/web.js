const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const parcelController = require('../app/http/controllers/suppliers/parcelController')
const orderController = require('../app/http/controllers/suppliers/orderController')
const guest = require('../app/http/middlewares/guest')

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
    app.post('/orders', orderController().store)
    app.get('/supplier/orders', orderController().index)
}

module.exports = initRoutes