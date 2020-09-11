const User = require('../../models/user')

function authController() {
    return {
        login(req, res) {
            res.render('auth/login')
        },
        register(req, res) {
            res.render('auth/register')
        },
        postRegister(req, res) {
            const {
                name,
                company_name,
                phone,
                address,
                email,
                password

            } = req.body
            //validate request
            if (!name || !company_name || !phone || !address || !email || !password)
                console.log(req.body)

        }

    }
}

module.exports = authController