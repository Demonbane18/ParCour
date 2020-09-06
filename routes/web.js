function initRoutes(app) {
    app.get('/', function(req, res) {
        res.render('home')
    })

    app.get('/parcel', (req, res) => {
        res.render('customer/parcel')
    })
    
    app.get('/login', (req, res) => {
        res.render('auth/login')
    })
    
    app.get('/register', (req, res) => {
        res.render('auth/register')
    })
}

module.exports = initRoutes