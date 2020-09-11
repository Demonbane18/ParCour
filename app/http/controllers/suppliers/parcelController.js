function parcelController() {
    return {
        index(req, res) {

            res.render('customer/parcel')
        },
        update(req, res) {
            // let order = {
            //     info: {
            //         orderId: { info: orderObject, qty:0},
            //     },
            //     total_price: 0,
            //     total_qty: 0

            // }
            // for the first time creating parcel and adding basic object structure
            if (!req.session.order) {
                req.session.order = {
                    info: {},
                    total_price: 0,
                    total_qty: 0
                }
            }
            let order = req.session.order
            console.log(req.body)
            //Check if info does not exist in parcel add a parcel
            if (!order.info[req.body._id]) {
                order.info[req.body._id] = {
                    info: req.body,
                    qty: 1
                }
                order.total_qty = order.total_qty + 1;
                order.total_price = order.total_price + req.body.price
            } else {
                //add more parcel if added again
                order.info[req.body._id].qty = order.info[req.body._id].qty + 1
                order.total_qty = order.total_qty + 1;
                order.total_price = order.total_price + req.body.price

            }
            return res.json({
                total_qty: req.session.order.total_qty
            })
        }
    }
}

module.exports = parcelController