const Order = require("../../models/order");

function trackController() {

    return {
        async index(req, res) {
            const url =  req.protocol + '://' + req.get('host') + req.originalUrl
            const captured = /track=([^&]+)/.exec(url)[1];
            const result = captured ? captured : 'default';
            const order = await Order.findOne({tracking_id: result})
            //check if email exists
       
            // authorize user if the order has the same tracking
              res.render('trackParcel', {
                order
              })
         
          },
          async track(req, res) {
            const id = req.params.id
            const order = await Order.findById(id)
            res.render('rider/trackDelivery', {
              order
            })
          }
    }


}
module.exports = trackController;



