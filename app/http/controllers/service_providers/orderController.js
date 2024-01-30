const order = require("../../../models/order")
const Order = require('../../../models/order')
const Rider = require("../../../models/rider");
const User = require('../../../models/user');

//prettier-ignore
function orderController() {
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
                        return res.render('service_provider/orders', {
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
                             return res.render('service_provider/orders', {
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
              return res.redirect('/service_provider/orders');
            }
            //find order by text index search and sort it based on text score
            const orders = await order.find({
                $text: {
                  $search: term_order,
                },
                service_provider: req.user.company_name,
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
                  return res.redirect('/service_provider/orders');
                }
                if (!result.length) {
                  req.flash('error', 'no text');
                  req.session.ordersearched = null
                  req.session.term_order = null
                   return res.redirect('/service_provider/orders');
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
                   return res.redirect('/service_provider/orders');
                }
                req.session.ordersearched = orders
                req.session.term_order = term_order
                return res.redirect('/service_provider/orders');
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
      async assignRider(req, res) {
        const searchedRider = req.session.ridersearched;
        const termRider = req.session.term_rider
        req.session.term_rider = null;
        req.session.ridersearched = null;

        const riders = await Rider.find({
          company_name: req.user.company_name
      })

        const riderAssigned = req.session.riderassigned;
        req.session.riderassigned = null;

        Order.findById(req.params.id, (err, order) => {
          if (err)
              return console.log(err);
          //order info
          res.render('service_provider/assign_rider', {
              riders: riders,
              order: order,
              id: order._id,
              tracking_id: order.tracking_id,
              riderAssigned,
              searchedRider,
              term_rider: termRider
          });
      });
      },
      async searchRider(req, res) {
        const {
            term_rider
        } = req.body;
        const id = req.params.id;
        if (!term_rider) {
            return res.redirect('/service_provider/assign_rider/'+id);
        }
        //find rider by text index search and sort it based on text score
        const riders = await Rider.find({
                $text: {
                    $search: term_rider,
                },
                company_name: req.user.company_name
            }, {
                score: {
                    $meta: "textScore"
                }
            }, (err, result) => {
                if (err) {
                    req.flash('error', 'Error! Something went wrong');
                    return res.redirect('/service_provider/assign_rider/'+id);
                }
                if (!result.length) {
                    req.flash('blank', term_rider);
                }
            }).sort({
                score: {
                    $meta: "textScore"
                }
            })
            .then((riders) => {
                    req.session.ridersearched = riders
                    req.session.term_rider = term_rider
                    return res.redirect('/service_provider/assign_rider/'+id);
 })
 .catch((err) => {
     req.flash('error', 'Error! Something went wrong');
     return res.redirect('/service_provider/assign_rider/'+id);
 });
},

        async assign(req, res) {
          const {
            id,
            id1
          } = req.params

          const order = await Order.findById(id)
          const rider = await Rider.findById(id1)
          order.delivered_by = rider.name;
          order.status = 'confirmed';
          order
          .save()
          .then((result) => {
            req.flash('success', 'Rider assigned successfully');
            return res.redirect('/service_provider/orders');
           
          })
          .catch((err) => {
            req.flash('error', 'Something went wrong');
            return res.redirect('/service_provider/assign_rider/'+id);
          });
        }   
    };
}

module.exports = orderController