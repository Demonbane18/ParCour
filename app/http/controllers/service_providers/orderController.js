const order = require("../../../models/order")
const Order = require('../../../models/order')

//prettier-ignore
function orderController() {
    return {
      index(req, res) {
        order
          .find(
            {
              status: {
                $nin: ['completed', 'cancelled'],
              },
              service_provider: req.user.company_name,
            },
            null,
            {
              sort: {
                createdAt: -1,
              },
            }
          )
          .populate('supplier_id', '-password')
          .exec((err, orders) => {
            if (req.xhr) {
              return res.json(orders);
            } else {
              return res.render('service_provider/orders');
            }
          });
      },
      complete(req, res) {
        order
          .find(
            {
              status: {
                $eq: 'completed',
              },
              service_provider: req.user.company_name,
            },
            null,
            {
              sort: {
                createdAt: -1,
              },
            }
          )
          .populate('supplier_id', '-password')
          .exec((err, completed_orders) => {
            if (req.xhr) {
              return res.json(completed_orders);
            } else {
              return res.render('service_provider/completed_orders');
            }
          });
      },
      cancel(req, res) {
        order
          .find(
            {
              status: {
                $eq: 'cancelled',
              },
              service_provider: req.user.company_name,
            },
            null,
            {
              sort: {
                createdAt: -1,
              },
            }
          )
          .populate('supplier_id', '-password')
          .exec((err, cancelled_orders) => {
            if (req.xhr) {
              return res.json(cancelled_orders);
            } else {
              return res.render('service_provider/cancelled_orders');
            }
          });
      },
    };
}

module.exports = orderController