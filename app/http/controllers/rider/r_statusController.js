const Order = require('../../../models/order')

function r_statusController() {
    return {
        update(req, res) {
            //update status of order this is the tracking basically
            Order.updateOne({
                _id: req.body.order_id
            }, {
                status: req.body.status
            }, (err, data) => {
                if (err) {

                    return res.redirect('/rider/orders')
                }
                //emit event
                const eventEmitter = req.app.get('eventEmitter')
                eventEmitter.emit('parcelUpdated', {id: req.body.order_id, status: req.body.status})
                return res.redirect('/rider/orders')
            })
        }
    }
}

module.exports = r_statusController;