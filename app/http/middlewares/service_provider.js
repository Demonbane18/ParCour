//prettier-ignore
function service_provider ( req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'service_provider') {
        return next()
    }
    return res.redirect('/service_provider/orders')
}

module.exports = service_provider