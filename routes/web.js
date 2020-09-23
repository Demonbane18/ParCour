const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const parcelController = require('../app/http/controllers/suppliers/parcelController')
const orderController = require('../app/http/controllers/suppliers/orderController')
const SPorderController = require('../app/http/controllers/service_providers/orderController')
const StatusController = require('../app/http/controllers/service_providers/statusController')
const SPriderController = require('../app/http/controllers/service_providers/riderController')
const SPcategoryController = require('../app/http/controllers/service_providers/categoryController')

//Middleware
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const service_provider = require('../app/http/middlewares/service_provider')

function initRoutes(app) {

    //routes
    app.get('/', homeController().index)
    app.post('/', homeController().update)
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
    app.get('/supplier/orders/:_id', auth, orderController().show)

    //service provider routes
    app.get('/service_provider/orders', service_provider, SPorderController().index)

    app.get('/service_provider/riders', service_provider, SPriderController().index)

    //category
    app.get('/service_provider/category', service_provider, SPcategoryController().index)
    app.get('/service_provider/add_category', service_provider, SPcategoryController().addCategory)
    app.post('/service_provider/add_category', service_provider, SPcategoryController().store)
    app.get('/service_provider/edit_category/:id', service_provider, SPcategoryController().editCategory)
    app.post('/service_provider/edit_category/:id', service_provider, SPcategoryController().edit)
    app.get('/service_provider/delete_category/:id', service_provider, SPcategoryController().delete)

    //riders
    app.get('/service_provider/riders', service_provider, SPriderController().index)


    //status
    app.post('/service_provider/order/status', service_provider, StatusController().update)

}

module.exports = initRoutes