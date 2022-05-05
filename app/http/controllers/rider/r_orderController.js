const order = require("../../../models/order")
const Order = require('../../../models/order')
const Rider = require("../../../models/rider");
const User = require('../../../models/user');

//prettier-ignore
function r_orderController() {
    return {
      index(req, res) {
        const searchedOrder = req.session.ordersearched;
        const termOrder = req.session.term_order;
        req.session.term_order = null;
        if (!searchedOrder) {
                  order
                    .find({
                        status: {
                          $nin: ['completed', 'cancelled'],
                        },
                        service_provider: req.user.company_name,
                        delivered_by: req.user.name,
                      },
                      null, {
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
                         req.session.ordersearched = null;
                        return res.render('rider/orders', {
                        term_order: null
                        });
                        }
                        });
                        }
                        else {
                          orders = searchedOrder
                          if (req.xhr) {
                            return res.json(orders);
                          } else {
                             return res.render('rider/orders', {
                                term_order: termOrder
                             });
                          }
                        
        }
        
        },
        async searchOrder(req, res) {
            const {
              term_order
            } = req.body;
            if (!term_order) {
              req.session.ordersearched = null;
              return res.redirect('/rider/orders');
            }
            //find order by text index search and sort it based on text score
            const orders = await order.find({
                $text: {
                  $search: term_order,
                },
                service_provider: req.user.company_name,
                delivered_by: req.user.name,
                status: {
                  $nin: ['completed', 'cancelled'],
                },
              }, {
                score: {
                  $meta: "textScore"
                }
              }, (err, result) => {
                if (err) {
                  req.flash('error', 'Error! Something went wrong');
                  return res.redirect('/rider/orders');
                }
                if (!result.length) {
                  req.flash('error', 'no text');
                  req.session.ordersearched = null
                  req.session.term_order = null
                   return res.redirect('/rider/orders');
                }
              }).sort({
                score: {
                  $meta: "textScore"
                }
              })
              .populate('supplier_id', '-password')
              .exec((err, orders) => {
                if (err) {
                   req.flash('error', 'Error! Something went wrong');
                   return res.redirect('/rider/orders');
                }
                req.session.ordersearched = orders
                req.session.term_order = term_order
                return res.redirect('/rider/orders');
              })
  
      },
      complete(req, res) {
        order
          .find(
            {
              status: {
                $eq: 'completed',
              },
              service_provider: req.user.company_name,
              delivered_by: req.user.name,
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
              return res.render('rider/completed_orders');
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
              delivered_by: req.user.name,
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
              return res.render('rider/cancelled_orders');
            }
          });
      },

    };
}

module.exports = r_orderController