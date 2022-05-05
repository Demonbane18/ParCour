//prettier-ignore
function rider ( req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'rider') {
        return next()
    }
    return res.redirect('/rider/orders')
}

module.exports = rider