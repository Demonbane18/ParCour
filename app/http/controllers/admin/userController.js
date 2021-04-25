function userController() {
    return {
      async index(req, res) {
        return res.render("admin/users");
        },
    }
}


module.exports = userController;