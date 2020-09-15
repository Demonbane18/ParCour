const Order = require('../../../models/order');
const moment = require('moment');

function orderController() {
  return {
    store(req, res) {
      //Validate request
      const { phone, pickup_address, dropoff_address } = req.body;
      if (!phone || !pickup_address || !dropoff_address) {
        req.flash('error', 'All fields required!');
        return res.redirect('/parcel');
      }
      const order = new Order({
        supplier_id: req.user._id,
        items: req.session.order.info,
        phone,
        pickup_address,
        dropoff_address,
      });
      order
        .save()
        .then((result) => {
          req.flash('success', 'Parcel booked successfully');
          delete req.session.parcel;
          return res.redirect('/supplier/orders');
        })
        .catch((err) => {
          req.flash('error', 'Something went wrong');
          return res.redirect('/parcel');
        });
    },
    async index(req, res) {
      const orders = await Order.find(
        {
          supplier_id: req.user._id,
        },
        null,
        { sort: { createdAt: -1 } }
      );
      res.render('supplier/orders.ejs', {
        orders: orders,
        moment: moment,
      });
    },
  };
}

module.exports = orderController;
