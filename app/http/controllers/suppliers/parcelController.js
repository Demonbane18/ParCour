function parcelController() {
    return {
        index(req, res) {
            res.render('customer/parcel')
        },
        update(req, res) {
            // let parcelData = {
            //     info: {
            //         orderId: { info: orderObject, qty:0},
            //     },
            //     total_price: 0,
            //     total_qty: 0

            // }
            // for the first time creating parcel and adding basic object structure
            if (!req.session.parcelData) {
                req.session.parcelData = {
                    info: {},
                    total_price: 0,
                    total_qty: 0
                }
            }
            let parcelData = req.session.parcelData
            console.log(req.body)
            //Check if info does not exist in parcel add a parcel
            if (!parcelData.info[req.body._id]) {
                parcelData.info[req.body._id] = {
                    info: req.body,
                    qty: 1
                }
                parcelData.total_qty = parcelData.total_qty + 1;
                parcelData.total_price = cart.total_price + req.body.price
            } else {
                //add more parcel if added again
                parcelData.info[req.body._id].qty = parcelData.info[req.body._id].qty + 1
                parcelData.total_qty = parcelData.total_qty + 1;
                parcelData.total_price = parcelData.total_price + req.body.price

            }
            return res.json({
                total_qty: req.session.parcelData.total_qty
            })
        }
    }
}

module.exports = parcelController