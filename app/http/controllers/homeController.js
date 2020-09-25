const Parcel = require("../../models/parcel");
const ServiceProvider = require("../../models/service_provider");

function homeController() {
  return {

    async index(req, res) {
      var passedVariable = req.session.valid;
      const selection = req.session.select;
      req.session.valid = null;
      req.session.select = null;
      const service_providers = await ServiceProvider.find();
      const parcels = await Parcel.find({
        service_provider: selection
      });
      
      // console.log(parcels);
      return res.render("home", {
        parcels: parcels,
        passedVariable,
        service_providers: service_providers,
        selection
      });
    },
    update(req, res) {
      //  const {
      //    name,
      //    started
      //  } = req.body;
      // selectCategory.updateOne({

      // }, {
      //   name: name
      // }, (err, data) => {
      //   if (err) {
      //     req.session.valid = true;
      //     req.session.select = req.body;
      //     return res.redirect('/#vehicleList')
      //   }
      //   req.session.valid = true;
      //   req.session.select = req.body;
      //   return res.redirect('/#vehicleList')
      // })
      req.session.valid = true;
      req.session.select = req.body.name;
      return res.redirect('/#vehicleList')
    }
  };
}



module.exports = homeController;