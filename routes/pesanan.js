var express = require("express");
var router = express.Router();

/* GET pesanan page. */

router.get("/", function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query("SELECT * FROM pesanan", function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("pesanan/list", { title: "buah", data: rows });
      });
      //console.log(query.sql);
    });
  });


module.exports = router;
