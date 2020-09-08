const Parcel = require("../../models/parcel");

function homeController() {
  return {
    async index(req, res) {
      const parcels = await Parcel.find();
      //   console.log(parcels);
      return res.render("home", {
        parcels: parcels,
      });
    },
  };
}

module.exports = homeController;
