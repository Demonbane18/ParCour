function errorRoutes(app) {
    //catch 404 and forward to error handler
    app.get('*', (req, res, next) => {
        res.status(404).render('errors/404', {
            title: "404",
            //disable layout.ejs
            layout: false
        })
    })

    app.use((req, res, next) => {
        if (!req.user) return next(createError(401, 'Please login to view this page.'))
        next()
    })
}

module.exports = errorRoutes