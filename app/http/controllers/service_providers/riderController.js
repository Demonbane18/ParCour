const Rider = require("../../../models/rider")
function riderController() {
    return {
        async index(req, res) {
            const riders = await Rider.find()
            //render parcel data
            return res.render('service_provider/riders', {
                riders: riders
            })
        }
    }
}


module.exports = riderController;