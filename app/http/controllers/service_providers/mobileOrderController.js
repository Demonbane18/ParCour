function mobileOrderController() {
    return {
      async index(req, res) {
        return res.render("service_provider/mobile_orders");
        },
    }
}


module.exports = mobileOrderController;