
function vehicleController() {
    return {
        async index(req, res) {
            return res.render('service_provider/vehicles')
        }
    }
}

module.exports = vehicleController;