const Order = require('../../../models/order')

function statusController() {
    return {
        update(req, res) {
            //update status of order this is the tracking basically
            Order.updateOne({
                _id: req.body.order_id
            }, {
                status: req.body.status
            }, (err, data) => {
                if (err) {

                    return res.redirect('/service_provider/orders')
                }
                return res.redirect('/service_provider/orders')
            })
        }
    }
}

module.exports = statusController;