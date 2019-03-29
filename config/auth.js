module.exports = {
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            console.log('Authenticated');
            return next();
        }
        console.log('Could not authenticate')
        req.flash('error_msg', 'Please login first');
        res.redirect('/users/login');
    }
}