const Rider = require("../../../models/rider");
const User = require('../../../models/user');
const bcrypt = require('bcrypt');
function riderController() {
    return {
        async index(req, res) {
            const riderAdded = req.session.rideradded;
            const searchedRider = req.session.ridersearched;
            const termRider = req.session.term_rider
            req.session.term_rider = null;
            req.session.ridersearched = null;
            req.session.rideradded = null;
            const riders = await Rider.find({
                company_name: req.user.company_name
            })
            //render parcel data
            return res.render('service_provider/riders', {
                riders: riders,
                riderAdded,
                searchedRider,
                term_rider: termRider
                })
                },
                async search(req, res) {
                        const {
                            term_rider
                        } = req.body;
                        if (!term_rider) {
                            return res.redirect('/service_provider/riders');
                        }
                        //find rider by text index search and sort it based on text score
                        const riders = await Rider.find({
                                $text: {
                                    $search: term_rider,
                                },
                                service_provider: req.user.company_name
                            }, {
                                score: {
                                    $meta: "textScore"
                                }
                            }, (err, result) => {
                                if (err) {
                                    req.flash('error', 'Error! Something went wrong');
                                    return res.redirect('/service_provider/riders');
                                }
                                if (!result.length) {
                                    req.flash('blank', term_rider);
                                }
                            }).sort({
                                score: {
                                    $meta: "textScore"
                                }
                            })
                            .then((riders) => {
                                    req.session.ridersearched = riders
                                    req.session.term_rider = term_rider
                                    return res.redirect('/service_provider/riders');
                 })
                 .catch((err) => {
                     req.flash('error', 'Error! Something went wrong');
                     return res.redirect('/service_provider/riders');
                 });
         },
        addRider(req, res) {
                return res.render('service_provider/add_rider')
            },
            async store(req, res) {
              const {
                name,
                license,
                age,
                gender,
                image,
                phone,
                address,
                email       
              } = req.body
              //validate request
              if (
                !name ||
                !image ||
                !license ||
                !age ||
                !phone ||
                !address ||
                !email 
              ) {
                req.flash('error', 'All fields are required!')
                req.flash('name', name)
                req.flash('license', license)
                req.flash('age', age)
                req.flash('image', image)
                req.flash('phone', phone)
                req.flash('address', address)
                req.flash('email', email)
                return res.redirect('/service_provider/add_rider')
              }
              //check if vehicle type exists
              Rider.exists(
                {
                  license: license,
                },
                (err, result) => {
                  if (result) {
                    req.flash('error', 'You already created this rider user!')
                    req.flash('name', name)
                    req.flash('age', age)
                    req.flash('gender', gender)
                    req.flash('image', image)
                    req.flash('phone', phone)
                    req.flash('address', address)
                    req.flash('email', email)
                    return res.redirect('/service_provider/add_rider')
                  }
                }
              )      
           
              //create a new rider
              const rider = new Rider({
                name,
                company_name: req.user.company_name,
                license,
                age,
                gender,
                image,
                phone,
                address,
                email,
              })

              rider
                .save()
                .then((rider) => {
                  //redirect back to rider list*
                  req.session.rideradded = true
                  return res.redirect('/service_provider/riders')
                })
                .catch((err) => {
                  req.flash('error', 'Something went wrong!Rider!')
                  return res.redirect('/service_provider/add_rider')
                })
            },
                    //index edit rider
                    editRider(req, res) {
                            const riderEdited = req.session.rideredited;
                            req.session.rideredited = null;
                            Rider.findById(req.params.id, (err, rider) => {
                                if (err)
                                    return console.log(err);
                                //email and pass will be edited by the rider himself
                                res.render('service_provider/edit_rider', {
                                    id: rider._id,
                                    name: rider.name,
                                    image: rider.image,
                                    license: rider.license,
                                    age: rider.age,
                                    gender: rider.gender,
                                    phone: rider.phone,
                                    address: rider.address,
                                    riderEdited
                                });
                            });

                        },
                        async edit(req, res) {
                                var id = req.params.id;
                                const {
                                     name,
                                         image,
                                         license,
                                         age,
                                         gender,
                                         phone,
                                         address
                                } = req.body;
                                //validate request
                                if (!name || !image || !license || !age || !phone || !address) {
                                    req.flash('error', 'All fields are required!');
                                    req.flash('name', name);
                                    req.flash('license', license);
                                    req.flash('age', age);
                                    req.flash('image', image);
                                    req.flash('phone', phone);
                                    req.flash('address', address);
                                    return res.redirect('/service_provider/edit_rider');
                                }

                                //check if different rider name exists
                                Rider.exists({
                                    _id: {
                                        '$ne': id
                                    },
                                    name: name
                                }, (err, result) => {
                                    if (result) {
                                        req.flash('error', 'You cannot edit a rider of different name!');
                                         req.flash('license', license);
                                         req.flash('age', age);
                                         req.flash('image', image);
                                         req.flash('phone', phone);
                                         req.flash('address', address);
                                        return res.redirect('/service_provider/edit_rider/' + id);

                                    } else {
                                        Rider.findById(id, (err, rider) => {
                                                if (err) {
                                                    return console.log(err)
                                                }
                                                rider.name = name;
                                                rider.license = license;
                                                rider.age = age;
                                                rider.gender = gender;
                                                rider.image = image;
                                                rider.phone = phone;
                                                rider.address = address;
                                                rider.save((err) => {
                                                    if (err)
                                                        return console.log(err);

                                                    Rider.find(function (err, riders) {
                                                        if (err) {
                                                            console.log(err);
                                                        } else {
                                                            req.app.locals.riders = riders;
                                                        }
                                                    });
                                                })
                                            })
                                            .then((parcel) => {
                                                //redirect back to rider list*
                                                req.flash('success', 'Rider edited!');
                                                req.session.rideredited = true;
                                                return res.redirect('/service_provider/edit_rider/' + id);
                                            })
                                            .catch((err) => {
                                                req.flash('error', 'Something went wrong!');
                                                return res.redirect('/service_provider/edit_rider/' + id);
                                            });

                                    }
                                })
                    },

                    //delete rider
                    async delete(req,res) {
                        const rider = await Rider.findById(req.params.id)
                        
                        User.findOneAndDelete({
                                name: rider.name
                            },(err) => {
                                if (err){
                                return console.log(err);
                            }
                            });
                        Rider.findByIdAndRemove(req.params.id, (err) => {
                            if (err){
                                return console.log(err);
                            }
                            Rider.find((err, riders) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    req.app.locals.riders = riders;
                                }
                            });

                            return res.redirect('/service_provider/riders');
                        });


         }
                    

}
}

module.exports = riderController;