const Order = require('../../../models/order');
const moment = require('moment');

function orderController() {
  return {
    store(req, res) {
      //Validate request
      const {
        phone,
        pickup_address,
        dropoff_address
      } = req.body;
      if (!phone || !pickup_address || !dropoff_address) {
        req.flash('error', 'All fields required!');
        return res.redirect('/parcel');
      }
      const order = new Order({
        supplier_id: req.user._id,
        name: req.user.name,
        company_name: req.user.company_name,
        items: req.session.order.info,
        phone,
        pickup_address,
        dropoff_address,
      });
      order
        .save()
        .then((result) => {
          Order.populate(result, {path:'supplier_id'}, (err, placedParcel) => {
            req.flash('success', 'Parcel booked successfully');
            delete req.session.order
            //Emit
            const eventEmitter = req.app.get('eventEmitter')
            eventEmitter.emit('parcelBooked', placedParcel)
            return res.redirect('/supplier/orders');
          })
         
        })
        .catch((err) => {
          req.flash('error', 'Something went wrong');
          return res.redirect('/parcel');
        });
    },
    async index(req, res) {
      const orders = await Order.find({
          supplier_id: req.user._id,
        },
        null, {
          sort: {
            createdAt: -1
          }
        }
      );
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
      res.render('supplier/orders.ejs', {
        orders: orders,
        moment: moment,
      });
    },
    async show(req, res) {
      const order = await Order.findById(req.params._id)
      // authorize user if the order has the same id
      if (req.user._id.toString() === order.supplier_id.toString()) {
        res.render('supplier/singleParcel', {
          order
        })
      } else {
        res.redirect('/')
      }
    }
  };
}

module.exports = orderController;