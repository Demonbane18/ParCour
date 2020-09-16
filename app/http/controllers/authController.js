const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport')

function authController() {
    const _getRedirectURL = (req) => {
        //add other roles
        return req.user.role === 'service_provider' ? '/service_provider/orders' : '/supplier/orders'
    }

    return {
        login(req, res) {
            res.render('auth/login');
        },
        postLogin(req, res, next) {
            const {
                email,
                password
            } = req.body;
            //check login input
            if (!email || !password) {
                req.flash('error', 'All fields are required!');
                return res.redirect('/login');
            }
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    req.flash('error', info.message)
                    return next(err)
                }
                if (!user) {
                    req.flash('error', info.message)
                    return res.redirect('/login')
                }

                req.logIn(user, (err) => {
                    if (err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    //return if wrong role
                    return res.redirect(_getRedirectURL(req))
                })
            })(req, res, next)
        },
        register(req, res) {
            res.render('auth/register');
        },
        async postRegister(req, res) {
            const {
                name,
                company_name,
                phone,
                address,
                email,
                password,
                confirm_password
            } = req.body;
            //validate request
            if (!name || !company_name || !phone || !address || !email || !password || !confirm_password) {
                req.flash('error', 'All fields are required!');
                req.flash('name', name);
                req.flash('company_name', company_name);
                req.flash('phone', phone);
                req.flash('address', address);
                req.flash('email', email);
                return res.redirect('/register');
            }

            //check if email exists
            User.exists({
                    email: email,
                },
                (err, result) => {
                    if (result) {
                        req.flash('error', 'Email already taken!');
                        req.flash('name', name);
                        req.flash('company_name', company_name);
                        req.flash('phone', phone);
                        req.flash('address', address);
                        req.flash('email', email);
                        return res.redirect('/register');
                    }
                }
            );

            //check if password match
            if (password != confirm_password) {
                req.flash('error', "Password don't match!");
                req.flash('name', name);
                req.flash('company_name', company_name);
                req.flash('phone', phone);
                req.flash('address', address);
                req.flash('email', email);
                return res.redirect('/register');
            }


            //hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            //create a user
            const user = new User({
                name,
                company_name,
                phone,
                address,
                email,
                password: hashedPassword,
            });

            user
                .save()
                .then((user) => {
                    //

                    return res.redirect('/');
                })
                .catch((err) => {
                    req.flash('error', 'Something went wrong!');
                    return res.redirect('/register');
                });
        },
        logout(req, res) {
            req.logout()
            return res.redirect('/login')
        }
    };
}

module.exports = authController;