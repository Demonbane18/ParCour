const Order = require('../../../models/order');
const moment = require('moment');
const orderid = require('order-id')('mysecret');
const id = orderid.generate();

function orderController() {
  return {
    store(req, res) {
      //Validate request
      const {
        phone,
        service_provider,
        pickup_address,
        dropoff_address,
        item_name,
        item_qty,
        perishable,
        item_weight,

        item_name2,
        item_qty2,
        perishable2,
        item_weight2,
      
        item_name3,
        item_qty3,
        perishable3,
        item_weight3,

        item_name4,
        item_qty4,
        perishable4,
        item_weight4,

        item_name5,
        item_qty5,
        perishable5,
        item_weight5,


      } = req.body;
      if (!phone || !pickup_address || !dropoff_address || !item_name || !item_weight) {
        req.flash('error', 'All fields required!');
        return res.redirect('/parcel');
      }

      const item1 = {
        item_name: item_name,
        item_qty: item_qty,
        perishable_check: perishable ? 'perishable':'no',
        item_weight: item_weight
      }

      const item2 = {
        item_name: item_name2,
        item_qty: item_qty2,
        perishable_check: perishable2 ? 'perishable':'no',
        item_weight: item_weight2
      }

      const item3 = {
        item_name: item_name3,
        item_qty: item_qty3,
        perishable_check: perishable3 ? 'perishable':'no',
        item_weight: item_weight3
      }


      const item4 = {
        item_name: item_name4,
        item_qty: item_qty4,
        perishable_check: perishable4 ? 'perishable':'no',
        item_weight: item_weight4
      }

      const item5 = {
        item_name: item_name5,
        item_qty: item_qty5,
        perishable_check: perishable5 ? 'perishable':'no',
        item_weight: item_weight5
      }

      const itemList = {
        item1: item1,
        item2: item2,
        item3: item3,
        item4: item4,
        item5: item5
      };


      const order = new Order({
        tracking_id: id,
        service_provider,
        supplier_id: req.user._id,
        name: req.user.name,
        company_name: req.user.company_name,
        items: req.session.order.info,
        parcelDetails: itemList,
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
    },

  };
}

module.exports = orderController;