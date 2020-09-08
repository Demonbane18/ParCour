function parcelController() {
    return {
        index(req, res) {
            res.render('customer/parcel')
        }
    }
}

module.exports = parcelController