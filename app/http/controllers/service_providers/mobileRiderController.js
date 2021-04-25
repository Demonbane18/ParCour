
function mobileRiderController() {
    return {
      async index(req, res) {
        return res.render("service_provider/mobile_riders");
        },
    }
}


module.exports = mobileRiderController;