
function riderController() {
    return {
        index(req, res) {
            return res.render('service_provider/riders')
        }
    }
}


module.exports = riderController;