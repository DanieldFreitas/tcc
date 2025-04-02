function autorizacao(req, res, next) {
    if (req.session.professor) {
        return next();
    }
    return res.redirect("/professor/proflogin");
};

module.exports = autorizacao;
