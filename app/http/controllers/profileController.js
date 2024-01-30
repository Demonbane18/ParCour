const User = require('../../models/user');
const dupeChecker = require('../../config/dupeChecker')
function profileController() {

    return {
        async index(req, res) {
            try {
                const profileEdited = req.session.profileedited;
                req.session.profileedited = null;
                const user = await User.findById(req.user._id);
                res.render('profile', {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    is_verified: user.is_verified,
                    profileEdited
                });
            } catch (error) {
                console.log(error.message)
            }
            
        },
        async editProfile(req, res) {
                const {
                    name,
                    phone,
                    address,
                } = req.body;
                const id = req.user._id;

                 //validate request
                 
                 if (!name || !phone || !address) {
                    req.flash('error', 'All fields are required!');
                    return res.redirect('/profile');
                }

        const nameCheck = dupeChecker.nameCheck(id,name);
        console.log(nameCheck)
        const phoneCheck =  dupeChecker.phoneCheck(id,phone);
        if( nameCheck == true) {
            req.flash('error', 'Name already taken!');
            return res.redirect('/profile');
        }
        if( phoneCheck == true) {
            req.flash('error', 'Phone already taken!');
            return res.redirect('/profile');
        }

const updatedUser = await User.findByIdAndUpdate({_id:id}, {$set:{name: name, phone:phone, address:address}})
    if (updatedUser) {
        req.session.profileedited = true
        return res.redirect('/profile');  
    }
    else {
      
        console.log(err.message);
        req.flash('error', 'Something went wrong!');
        return res.redirect('/profile');
    };
           
        }
    }
}
module.exports = profileController;