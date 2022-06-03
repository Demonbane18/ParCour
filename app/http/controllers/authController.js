const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
const randomstring = require('randomstring');
const nodemailer = require('nodemailer');
const config = require('../../config/config')
// const mailSender = require('../../config/mailSender');
const { clearConfigCache } = require('prettier');

function authController() {
    const _getRedirectURL = (req) => {
        //add other roles
        if(req.user.role === 'service_provider') {
            return '/service_provider/orders'
        }else if(req.user.role === 'supplier') {
            return '/supplier/orders'
        } else if(req.user.role === 'admin') {
            return '/admin/users'
        } else if(req.user.role === 'rider') {
            return '/rider/orders'
        }
    }

    //for verify email
 const sendVerifyMail =  async(name, email, user_id)=> {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port:465,
            secure: true,
            requireTLS: true,   
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        })
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: ' For verification mail',
            html: '<p> Hi ' + name + ', please click here to <a href="http://127.0.0.1:3000/verify?id='+user_id+'"> Verify </a> your email.</p>'
        }
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log("Email has been sent:-", info.response)
            }
        })
    } catch (error) {
        console.log(error.mesage)
    }
}
//for reset email
const sendResetPasswordMail =  async(name, email, token)=> {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port:465,
            secure: true,
            requireTLS: true,   
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        })
        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: ' For Reset Password',
            html: '<p> Hi ' + name + ', please click here to <a href="http://127.0.0.1:3000/reset_password?token='+token+'"> Reset </a> your password.</p>'
        }
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log("Email has been sent:-", info.response)
            }
        })
    } catch (error) {
        console.log(error.mesage)
    }
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

                    return res.redirect('/verification')
                })
                .catch((err) => {
                    req.flash('error', 'Something went wrong!');
                    return res.redirect('/register');
                });
        },
        logout(req, res) {
            req.logout()
            return res.redirect('/login')
        },
        //forgot password
        forgetLoad(req, res) {
            try {
                const sentlink = req.session.sentlink;
                req.session.sentlink = null;
                res.render('auth/forgot_password',{sentlink: sentlink});

            } catch (error) {
                console.log(error.message)
            }
        },
        async forgetVerify(req, res) {
            try {
                const email = req.body.email;
                if(email != null) {
                    const userData = await User.findOne({email: email});
                    if (userData) {
                        if (userData.is_verified === false) {
                            req.flash('error', 'Please verify your email');
                            return res.redirect('/forgot_password')
                        } else {
                            const randomString = randomstring.generate();
                            const updatedData = await User.updateOne({email:email},{$set:{token:randomString}})
                            sendResetPasswordMail(userData.name, userData.email, randomString);
                            req.flash('success', 'Please check your email to reset your password!');
                            return res.redirect('/forgot_password')
                        }
                        
                    } else {
                        req.flash('error', 'The email does not exist!');
                        req.flash('email', email);
                        return res.redirect('/forgot_password')
                    }
                } else {
                    req.flash('error', 'Please input email!');
                    return res.redirect('/forgot_password')
                }
                
            } catch (error) {
                console.log(error.message)
            }
        },
        async resetPasswordLoad(req, res) {
            try {
                const token = req.query.token;
                const tokenData = await User.findOne({token:token});
                if (tokenData) {
                    res.render('auth/reset_password',{user_id:tokenData._id});
                } else {
                    res.render('errors/404',{message: "Token is invalid"});
                }
            } catch (error) {
                console.log(error.message)
            }
        },
        async resetPassword(req, res) {
            try {
                const password = req.body.password;
                const user_id = req.body.user_id;
                
                const securePassword = await bcrypt.hash(password, 10);
                const updatedData = await User.findByIdAndUpdate({_id:user_id}, { $set:{ password:securePassword, token:''  }});
                console.log(updatedData);
                return res.redirect('/login')
            } catch (error) {
                console.log(error.message);
            }
        },
        //for verification and send mail link
        async verificationLoad(req, res) {
            try {
                if (req.user) {
                     const email = req.user.email;
                     res.render('auth/verification', {email: email});
                } else {
                    res.render('auth/verification', {email});
                }
               
            } catch (error) {
                console.log(error.message);
            }
        },
        async verifyMail(req, res) {
            try {
                const updatedInfo = await User.updateOne({_id:req.query.id}, {$set:{is_verified: true}})
                console.log(updatedInfo);
                res.render('auth/email_verified');
            } catch (error) {
                console.log(error.message);
            }
        },
        async sentVerificationLink(req, res) {
            try {
                const email =  req.body.email;
                const userData = await User.findOne({email: email});
                if (userData) {
                    sendVerifyMail(userData.name, userData.email, userData._id);
                    req.flash('success', 'Reset verification link sent successfully. Please check your email.');
                    return res.redirect('/verification')
                } else {
                    req.flash('error', 'The email does not exist');
                    res.render('auth/verification',{email:email})
                }
            } catch (error) {
                console.log(error.message)
            }
        },
        async changePassLoad(req, res) {
            try {
                if (req.user) {
                    const passwordEdited = req.session.passwordedited;
                    req.session.passwordedited = null;
                     const user = await User.findById(req.user._id);
                    res.render('change_password', {
                        user_id: user._id,
                        passwordEdited
                    });
                }
            } catch (error) {
                console.log(error.message);
            }
        },
        async editPass(req,res) {
            try {
                const {
                    user_id,
                    current_password,
                    new_password,
                    confirm_password
                } =  req.body;
                const user = await User.findById({
                    _id: user_id
                })
                if (!current_password || !new_password || !confirm_password) {
                    req.flash('error', 'All fields are required!');
                    return res.redirect('/change_password');
                } 
                const comparePassword = await bcrypt.compare(current_password, user.password)

                if (comparePassword) {
                    if (new_password == confirm_password) {
                        const hashedNewPassword = await bcrypt.hash(new_password, 10);
                        const updatedPass = await User.findByIdAndUpdate({_id:user_id}, { $set:{ password:hashedNewPassword }});
                        req.session.passwordedited = true
                        req.flash('success', "Your password has been updated");
                        return res.redirect('/change_password');
                    } else {
                        req.flash('error', "Password don't match");
                        return res.redirect('/change_password');
                    }
                }
                else {
                    req.flash('error', 'Wrong password');
                    return res.redirect('/change_password');
                }

            } catch (error) {
                console.log(error)
            }
        }
        
    };
}

module.exports = authController;