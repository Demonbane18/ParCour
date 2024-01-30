const User = require('../../../models/user.js');
const CompanyName = require('../../../models/service_provider');
const bcrypt = require('bcrypt');
function userController() {
    return {
      async index(req, res) {
        const userAdded = req.session.useradded;
        const searchedUser = req.session.usersearched;
        const termUser = req.session.term_user
        req.session.term_user = null;
        req.session.usersearched = null;
        req.session.useradded = null;
        const users = await User.find({
          
        })

        //render user data
        return res.render('admin/users', {
          users: users,
          userAdded,
          searchedUser,
          term: termUser
          });
          },
          async search(req, res) {
              const {
                term
              } = req.body;
              if (!term) {
                return res.redirect('/admin/users');
              }
              //find user by text index search and sort it based on text score
              const users = await User.find({
                  $text: {
                    $search: term,
                  },
                }, {
                  score: {
                    $meta: "textScore"
                  }
                }, 
                (err, result) => {
                  if (err) {
                    req.flash('error', 'Error! Something went wrong');
                    return res.redirect('/admin/users');
                  }
                  if (!result.length) {
                    req.flash('blank', term);
                  }
                }
                ).sort({
                  score: {
                    $meta: "textScore"
                  }
                })
                .then((users) => {
                  req.session.usersearched = users
                  req.session.term_user = term
                  return res.redirect('/admin/users');
                })
                .catch((err) => {
                    req.flash('error', 'Error! Something went wrong');
                    return res.redirect('/admin/users');
    });
},
    async addUser(req, res) {
            const company_names = await CompanyName.find();
            return res.render('admin/add_user', {
              company_names: company_names
            })
        },
        async store(req, res) {
          const {
            name,
            role,
            company_name,
            phone,
            address,
            email,
            password,
            confirm_password
        } = req.body;
        console.log(req.body)
        //validate request
        if (!name || !company_name || !phone || !address || !email || !password || !confirm_password) {
            req.flash('error', 'All fields are required!');
            req.flash('name', name);
            req.flash('company_name', company_name);
            req.flash('phone', phone);
            req.flash('address', address);
            req.flash('email', email);
            return res.redirect('/admin/add_user');
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
                    return res.redirect('/admin/add_user');
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
            return res.redirect('/admin/add_user');
        }


        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create a user
        const user = new User({
            name,
            role,
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

                return res.redirect('/admin/users');
            })
            .catch((err) => {
                req.flash('error', 'Something went wrong!');
                return res.redirect('/admin/add_user');
            });
        },

                //delete user
                async deleteUser(req,res) {
                    const user = await User.findById(req.params.id)
                    
                    User.findOneAndDelete({
                            name: user.name
                        },(err) => {
                            if (err){
                            return console.log(err);
                        }
                        });
                    User.findByIdAndRemove(req.params.id, (err) => {
                        if (err){
                            return console.log(err);
                        }
                        User.find((err, users) => {
                            if (err) {
                                console.log(err);
                            } else {
                                req.app.locals.users = users;
                            }
                        });

                        return res.redirect('/admin/users');
                    });


     }
    }
}


module.exports = userController;