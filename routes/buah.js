var express = require("express");
var router = express.Router();

/* GET Customer page. */

router.get("/", function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query("SELECT * FROM buah", function (err, rows) {
      if (err) var errornya = ("Error Selecting : %s ", err);
      req.flash("msg_error", errornya);
      res.render("buah/list", { title: "Buah", data: rows });
    });
    //console.log(query.sql);
  });
});

router.delete("/delete/(:id)", function (req, res, next) {
  req.getConnection(function (err, connection) {
    var customer = {
      id: req.params.id,
    };

    var delete_sql = "delete from buah where ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        delete_sql,
        customer,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Delete : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/buah");
          } else {
            req.flash("msg_info", "Delete Customer Success");
            res.redirect("/buah");
          }
        }
      );
    });
  });
});
router.get("/edit/(:id)", function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM buah where id=" + req.params.id,
      function (err, rows) {
        if (err) {
          var errornya = ("Error Selecting : %s ", err);
          req.flash("msg_error", errors_detail);
          res.redirect("/buah");
        } else {
          if (rows.length <= 0) {
            req.flash("msg_error", "Buah can't be find!");
            res.redirect("/buah");
          } else {
            console.log(rows);
            res.render("buah/edit", { title: "Edit ", data: rows[0] });
          }
        }
      }
    );
  });
});
router.put("/edit/(:id)", function (req, res, next) {
  req.assert("name", "Please fill the name").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_name = req.sanitize("nama").escape().trim();
    v_harga = req.sanitize("harga").escape().trim();
    v_deskripsi = req.sanitize("deskripsi").escape().trim();
    v_stok = req.sanitize("stok").escape();

    var customer = {
      nama: v_name,
      harga: v_harga,
      email: v_deskripsi,
      stok: v_stok,
    };

    var update_sql = "update buah SET ? where id = " + req.params.id;
    req.getConnection(function (err, connection) {
      var query = connection.query(update_sql, buah, function (err, result) {
        if (err) {
          var errors_detail = ("Error Update : %s ", err);
          req.flash("msg_error", errors_detail);
          res.render("customer/edit", {
            nama: req.param("nama"),
            harga: req.param("harga"),
            deskripsi: req.param("deskripsi"),
            stok: req.param("stok"),
          });
        } else {
          req.flash("msg_info", "Update buah success");
          res.redirect("/buah/edit/" + req.params.id);
        }
      });
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("buah/add-buah", {
      nama: req.param("nama"),
      deskripsi: req.param("deskripsi"),
    });
  }
});

router.post("/add", function (req, res, next) {
  req.assert("nama", "Please fill the name").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_nama = req.sanitize("nama").escape().trim();
    v_harga = req.sanitize("harga").escape().trim();
    v_deskripsi = req.sanitize("deskripsi").escape().trim();
    v_stok = req.sanitize("stok").escape();

    var buah = {
      nama: v_nama,
      harga: v_harga,
      deskripsi: v_deskripsi,
      stok: v_stok,
    };

    var insert_sql = "INSERT INTO buah SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(insert_sql, buah, function (err, result) {
        if (err) {
          var errors_detail = ("Error Insert : %s ", err);
          req.flash("msg_error", errors_detail);
          res.render("buah/add-buah", {
            nama: req.param("nama"),
            harga: req.param("harga"),
            deskripsi: req.param("deskripsi"),
            stok: req.param("stok"),
          });
        } else {
          req.flash("msg_info", "Create buah success");
          res.redirect("/buah");
        }
      });
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("buah/add-buah", {
      name: req.param("nama"),
      address: req.param("deskripsi"),
    });
  }
});

router.get("/add", function (req, res, next) {
  res.render("buah/add-buah", {
    title: "Add New Buah",
    nama: "",
    harga: "",
    deskripsi: "",
    stok: "",
  });
});

module.exports = router;
