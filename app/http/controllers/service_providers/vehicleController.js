const Vehicle = require("../../../models/vehicle");
const Parcel = require("../../../models/parcel");
const User = require('../../../models/user');
function vehicleController() {
    return {
      async index(req, res) {
        const vehicleAdded = req.session.vehicleadded;
        req.session.vehicleadded = null;
        const vehicles = await Vehicle.find();

        //render parcel data
        return res.render('service_provider/vehicles', {
          vehicles: vehicles,
          vehicleAdded,
        });
        },
        async addVehicle(req, res) {
            const service_provider = req.user.company_name;
            const parcels = await Parcel.find({
              service_provider: service_provider
            })
            return res.render('service_provider/add_vehicle', {
              parcels: parcels
            });
          },
          //POST button submit store new vehicle
          async store(req, res) {
              const {
                vehicle_type,
                color,
                brand,
                car_model,
                plate_number,
                image,
                weight
              } = req.body;
              //validate request
              if (!color || !brand || !car_model || !plate_number || !image || !weight) {
                req.flash('error', 'All fields are required!');
                req.flash('color', color);
                req.flash('brand', brand);
                req.flash('model', car_model);
                req.flash('plate_number', plate_number);
                req.flash('image', image);
                req.flash('weight', weight);
                return res.redirect('/service_provider/add_vehicle');
              }
              //check if vehicle exists
              Vehicle.exists({
                plate_number: plate_number
              }, (err, result) => {
                if (result) {
                  req.flash('error', "There's already another vehicle that have the same plate number!");
                  req.flash('vehicle_type', vehicle_type);
                  req.flash('color', color);
                  req.flash('brand', brand);
                  req.flash('model', car_model);
                  req.flash('image', image);
                  req.flash('weight', weight);
                  return res.redirect('/service_provider/add_vehicle');
                }
              })

              //create a new vehicle
              const vehicle = new Vehicle({
                vehicle_type,
                color,
                brand,
                car_model,
                plate_number,
                service_provider: req.user.company_name,
                image,
                weight
              });

              vehicle
                .save()
                .then((vehicle) => {
                  //redirect back to vehicle list*
                  req.session.vehicleadded = true;
                  return res.redirect('/service_provider/vehicles');
                })
                .catch((err) => {
                  req.flash('error', 'Something went wrong!');
                  return res.redirect('/service_provider/add_vehicle');
                });

            },
            //index edit vehicle
            async editVehicle(req, res) {
                const vehicleEdited = req.session.vehicleedited;
                req.session.vehicleedited = null;
                const service_provider = req.user.company_name;
                const parcels = await Parcel.find({
                  service_provider: service_provider
                })

                Vehicle.findById(req.params.id, (err, vehicle) => {
                  if (err)
                    return console.log(err);

                  res.render('service_provider/edit_vehicle', {
                    id: vehicle._id,
                    vehicle_type: vehicle.vehicle_type,
                    color: vehicle.color,
                    brand: vehicle.brand,
                    car_model: vehicle.car_model,
                    plate_number: vehicle.plate_number,
                    service_provider: req.user.company_name,
                    image: vehicle.image,
                    weight: vehicle.weight,
                    parcels: parcels,
                    vehicleEdited
                  });
                });

              },
              async edit(req, res) {
                  var id = req.params.id;
                  const {
                    vehicle_type,
                    color,
                    brand,
                    car_model,
                    plate_number,
                    image,
                    weight
                  } = req.body;
                  //validate request
                  if (!vehicle_type || !color || !brand || !car_model || !plate_number || !image || !weight) {
                    req.flash('error', 'All fields are required!');
                    req.flash('vehicle_type', vehicle_type);
                    req.flash('color', color);
                    req.flash('brand', brand);
                    req.flash('model', car_model);
                    req.flash('plate_number', plate_number);
                    req.flash('image', image);
                    req.flash('weight', weight);
                    return res.redirect('/service_provider/edit_vehicle/' + id);
                  }

                  //check if plate_number exists
                  Vehicle.exists({
                    _id: {
                      '$ne': id
                    },
                    plate_number: plate_number
                  }, (err, result) => {
                    if (result) {
                      req.flash('error', 'You cannot edit a vehicle of another existing plate number!');
                      req.flash('vehicle_type', vehicle_type);
                      req.flash('color', color);
                      req.flash('brand', brand);
                      req.flash('model', car_model);
                      req.flash('image', image);
                      req.flash('weight', weight);
                      return res.redirect('/service_provider/edit_vehicle/' + id);

                    } else {
                      Vehicle.findById(id, (err, vehicle) => {
                          if (err) {
                            return console.log(err)
                          }
                          vehicle.vehicle_type = vehicle_type;
                          vehicle.color = color;
                          vehicle.brand = brand;
                          vehicle.plate_number = plate_number;
                          vehicle.car_model = car_model;
                          vehicle.image = image;
                          vehicle.weight = weight;
                          vehicle.save((err) => {
                            if (err)
                              return console.log(err);

                            Vehicle.find(function (err, vehicles) {
                              if (err) {
                                console.log(err);
                              } else {
                                req.app.locals.vehicles = vehicles;
                              }
                            });
                          })
                        })
                        .then((vehicle) => {
                          //redirect back to vehicle list*
                          req.flash('success', 'Vehicle edited!');
                          req.session.vehicleedited = true;
                          return res.redirect('/service_provider/edit_vehicle/' + id);
                        })
                        .catch((err) => {
                          req.flash('error', 'Something went wrong!');
                          return res.redirect('/service_provider/edit_vehicle/' + id);
                        });

                    }
                  })



                },
                //delete vehicle
                delete(req, res) {
                  Vehicle.findByIdAndRemove(req.params.id, (err) => {
                    if (err)
                      return console.log(err);

                    Vehicle.find((err, vehicles) => {
                      if (err) {
                        console.log(err);
                      } else {
                        req.app.locals.vehicles = vehicles;
                      }
                    });

                    res.redirect('/service_provider/vehicles/');
                  });

                  }
}
}

module.exports = vehicleController;