const Parcel = require("../../../models/parcel");
function categoryController() {
    return {
        async index(req, res) {
            const parcels = await Parcel.find()
            //render parcel data
            return res.render('service_provider/category', {
                parcels: parcels
            })
        }, 
        addCategory(req,res) {
             return res.render('service_provider/add_category')
             },
        async store(req, res) {
            const {
                vehicle_type,
                image,
                weight,
                price
            } = req.body;
             //validate request
             if (!vehicle_type || !image || !weight || !price) {
                 req.flash('error', 'All fields are required!');
                 req.flash('vehicle_type', vehicle_type);
                 req.flash('image', image);
                 req.flash('weight', weight);
                 req.flash('price', price);
                 return res.redirect('/service_provider/add_category');
             }

             //check if vehicle type exists
             Parcel.exists({
                 vehicle_type: vehicle_type
             }, (err, result) => {
                 if(result) {
                      req.flash('error', 'Vehicle type already exists');
                      req.flash('image', image);
                      req.flash('weight', weight);
                      req.flash('price', price);
                      return res.redirect('/service_provider/add_category');
                 }
             })
             //create a vehicle category
             const parcel = new Parcel({
                 vehicle_type,
                 image,
                 weight,
                 price
             });

             parcel
                 .save()
                 .then((parcel) => {
                     //redirect back to parcel list*

                     return res.redirect('/service_provider/category');
                 })
                 .catch((err) => {
                     req.flash('error', 'Something went wrong!');
                     return res.redirect('/service_provider/add_category');
                 });


        },
         editCategory(req, res) {
            Parcel.findById(req.params.id, (err, parcel) => {
                if (err)
                    return console.log(err);

                res.render('service_provider/edit_category', {
                    id: parcel._id,
                    vehicle_type: parcel.vehicle_type,
                    image: parcel.image,
                    weight: parcel.weight,
                    price: parcel.price
                });
            });
   
         },
         async edit(req, res) {
             var id = req.params.id;
             const {
                 vehicle_type,
                 image,
                 weight,
                 price
             } = req.body;
             //validate request
             if (!vehicle_type || !image || !weight || !price) {
                 req.flash('error', 'All fields are required!');
                  req.flash('vehicle_type', vehicle_type);
                  req.flash('image', image);
                  req.flash('weight', weight);
                  req.flash('price', price);
                return res.redirect('/service_provider/edit_category/' + id);
             }

             //check if vehicle type exists
             Parcel.exists({
                         _id: {
                             '$ne': id
                         },
                 vehicle_type: vehicle_type
             }, (err, result) => {
                 if (result) {
                     req.flash('error', 'You cannot edit a vehicle type of another category!');
                      req.flash('image', image);
                      req.flash('weight', weight);
                      req.flash('price', price);
                      return res.redirect('/service_provider/edit_category/' + id);

                 } else {
                     Parcel.findById(id, (err, parcel) => {
                             if (err) {
                                 return console.log(err)
                             }
                             parcel.vehicle_type = vehicle_type;
                             parcel.image = image;
                             parcel.weight = weight;
                             parcel.price = price;
                             parcel.save((err) => {
                                 if (err)
                                     return console.log(err);

                                 Parcel.find(function (err, parcels) {
                                     if (err) {
                                         console.log(err);
                                     } else {
                                         req.app.locals.parcels = parcels;
                                     }
                                 });
                             })
                         })
                         .then((parcel) => {
                             //redirect back to parcel list*
                             req.flash('success', 'Category edited!');
                             return res.redirect('/service_provider/edit_category/' + id);
                         })
                         .catch((err) => {
                             req.flash('error', 'Something went wrong!');
                             return res.redirect('/service_provider/edit_category/' + id);
                         });

                 }
             })
          
             

         },
         delete(req,res) {
             Parcel.findByIdAndRemove(req.params.id, (err) => {
                 if (err)
                     return console.log(err);

                 Parcel.find((err, parcels) => {
                     if (err) {
                         console.log(err);
                     } else {
                         req.app.locals.parcels = parcels;
                     }
                 });

                 req.flash('success', 'Category deleted!');
                 res.redirect('/service_provider/category/');
             });


         }
        }

    }



module.exports = categoryController;