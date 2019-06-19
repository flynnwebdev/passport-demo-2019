function secure(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        //    res.redirect('/login')
        res.sendStatus(403)
    }
}

module.exports = secure
