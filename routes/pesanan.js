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

  router.get("/edit/(:id)", function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM buah where id=" + req.params.id,
        function (err, databuah) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/buah");
          } else {
            if (databuah.length <= 0) {
              req.flash("msg_error", "buah can't be find!");
              res.redirect("/buah");
            } else {
              console.log(databuah);
              req.getConnection(function (err, connection) {
                var query = connection.query(
                  "SELECT * FROM customer", 
                  function (err, rows) {
                    if (err) {
                      var errornya = ("Error Selecting : %s ", err);
                      req.flash("msg_error", errors_detail);
                      res.redirect("/pesan");
                    } else {
                      if (rows.length <= 0) {
                        req.flash("msg_error", "customer can't be find!");
                        res.redirect("/pesan");
                      } else {
                        console.log(rows);
                        res.render("pesanan/edit", { title: "Edit Pesanan ", data: rows, databuah: databuah[0],
                        id_customer: "",
                        qty: "",
                        tgl_pesan: "",
                        id_buah: "", },
                        );
                      }
                    }
                  }
                );
              });
            }
          }
        }
      );
    });
    
  });

module.exports = router;
