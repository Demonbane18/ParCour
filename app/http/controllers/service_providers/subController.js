function subController() {
    return {
      async index(req, res) {
        return res.render("service_provider/subscription");
        },
    }
}


module.exports = subController;