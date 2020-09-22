const order = require("../../../models/order")
const Order = require('../../../models/order')

//prettier-ignore
function orderController() {
    return {
        index(req, res) {
            order.find({
                status: {
                    $ne: 'completed'
                }
            }, null, {
                sort: {
                    'createdAt': -1
                }
            }).populate('supplier_id', '-password').exec((err, orders) => {
                if (req.xhr) {
                    return res.json(orders)
                } else {
                    return res.render('service_provider/orders')
                }
            })
        }
    }
}

module.exports = orderController