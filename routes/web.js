const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const parcelController = require('../app/http/controllers/suppliers/parcelController')
const orderController = require('../app/http/controllers/suppliers/orderController')
const SPorderController = require('../app/http/controllers/service_providers/orderController')
const r_orderController = require('../app/http/controllers/rider/r_orderController')
const StatusController = require('../app/http/controllers/service_providers/statusController')
const r_statusController = require('../app/http/controllers/rider/r_statusController')
const SPriderController = require('../app/http/controllers/service_providers/riderController')
const SPcategoryController = require('../app/http/controllers/service_providers/categoryController')
const vehicleController = require('../app/http/controllers/service_providers/vehicleController')
const subController = require('../app/http/controllers/service_providers/subController')
const mobileOrderController = require('../app/http/controllers/service_providers/mobileOrderController')
const userController = require('../app/http/controllers/admin/userController')
const spController = require('../app/http/controllers/admin/spController')
const trackController = require('../app/http/controllers/trackController')


//Middleware
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const rider = require('../app/http/middlewares/rider')
const service_provider = require('../app/http/middlewares/service_provider')
const admin = require('../app/http/middlewares/admin')

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

    app.get('/trackParcel', trackController().index)


    app.get('/parcel', parcelController().index)
    app.post('/update-parcel', parcelController().update)
    app.get('/delete-parcel', parcelController().delete)

    //supplier routes
    app.post('/orders', auth, orderController().store)
    app.get('/supplier/orders', auth, orderController().index)
    app.get('/supplier/orders/:_id', auth, orderController().show)


    //service provider routes
    //Orders
    app.get('/service_provider/orders', service_provider, SPorderController().index)
    app.post('/service_provider/orders', service_provider, SPorderController().searchOrder)
    app.get('/service_provider/completed_orders', service_provider, SPorderController().complete)
    app.get('/service_provider/cancelled_orders', service_provider, SPorderController().cancel)

    //Riders
    app.get('/service_provider/riders', service_provider, SPriderController().index)
    app.post('/service_provider/riders', service_provider, SPriderController().search)

    //category
    app.get('/service_provider/category', service_provider, SPcategoryController().index)
    app.get('/service_provider/add_category', service_provider, SPcategoryController().addCategory)
    app.post('/service_provider/add_category', service_provider, SPcategoryController().store)
    app.get('/service_provider/edit_category/:id', service_provider, SPcategoryController().editCategory)
    app.post('/service_provider/edit_category/:id', service_provider, SPcategoryController().edit)
    app.get('/service_provider/delete_category/:id', service_provider, SPcategoryController().delete)

    //riders -> SP
    app.get('/service_provider/riders', service_provider, SPriderController().index)
    app.get('/service_provider/add_rider', service_provider, SPriderController().addRider)
    app.post('/service_provider/add_rider', service_provider, SPriderController().store)
    app.get('/service_provider/edit_rider/:id', service_provider, SPriderController().editRider)
    app.post('/service_provider/edit_rider/:id', service_provider, SPriderController().edit)
    app.get('/service_provider/delete_rider/:id', service_provider, SPriderController().delete)

    //Vehicles
    app.get('/service_provider/vehicles', service_provider, vehicleController().index)
    app.post('/service_provider/vehicles', service_provider, vehicleController().search)
    app.get('/service_provider/add_vehicle', service_provider, vehicleController().addVehicle)
    app.post('/service_provider/add_vehicle', service_provider, vehicleController().store)
    app.get('/service_provider/edit_vehicle/:id', service_provider, vehicleController().editVehicle)
    app.post('/service_provider/edit_vehicle/:id', service_provider, vehicleController().edit)
    app.get('/service_provider/delete_vehicle/:id', service_provider, vehicleController().delete)

    //subscription
    app.get('/service_provider/subscription', service_provider, subController().index)
    
    //mobile orders
    app.get('/service_provider/mobile_orders', service_provider, mobileOrderController().index)

    //status
    app.post('/service_provider/order/status', service_provider, StatusController().update)
    app.post('/rider/order/status', rider, r_statusController().update)

    //assign rider
    app.post('/service_provider/assign_rider/:id', service_provider, SPorderController().searchRider)
    app.get('/service_provider/assign_rider/:id/:id1', service_provider, SPorderController().assign)
    app.get('/service_provider/assign_rider/:id', service_provider, SPorderController().assignRider)


    //admin routes

    //User
    app.get('/admin/users', admin, userController().index)
    app.post('/admin/users', admin, userController().search)
    app.get('/admin/add_user', admin, userController().addUser)
    app.post('/admin/add_user', admin, userController().store)
    app.get('/admin/delete_user/:id', admin, userController().deleteUser)

    //Service Provider
    app.get('/admin/service_providers', admin, spController().index)
    app.get('/admin/add_service_provider', admin, spController().addServiceProvider)
    app.post('/admin/add_service_provider', admin, spController().store)
    app.get('/admin/edit_service_provider/:id', admin, spController().editServiceProvider)
    app.post('/admin/edit_service_provider/:id', admin, spController().edit)
    app.get('/admin/delete_service_provider/:id', admin, spController().delete)


    //Rider
    app.get('/rider/orders', rider, r_orderController().index)

}

module.exports = initRoutes