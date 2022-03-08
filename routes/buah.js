var express = require("express");
var router = express.Router();

/* GET buah page. */

router.get("/", function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query("SELECT * FROM buah", function (err, rows) {
      if (err) var errornya = ("Error Selecting : %s ", err);
      req.flash("msg_error", errornya);
      res.render("buah/list", { title: "buah", data: rows });
    });
    //console.log(query.sql);
  });
});

router.delete("/delete/(:id)", function (req, res, next) {
  req.getConnection(function (err, connection) {
    var buah = {
      id: req.params.id,
    };

    var delete_sql = "delete from buah where ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(delete_sql, buah, function (err, result) {
        if (err) {
          var errors_detail = ("Error Delete : %s ", err);
          req.flash("msg_error", errors_detail);
          res.redirect("/buah");
        } else {
          req.flash("msg_info", "Delete buah Success");
          res.redirect("/buah");
        }
      });
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
            req.flash("msg_error", "buah can't be find!");
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
    v_name = req.sanitize("name").escape().trim();
    v_stok = req.sanitize("stok").escape().trim();
    v_harga = req.sanitize("harga").escape().trim();
    v_deskripsi = req.sanitize("deskripsi").escape();

    var buah = {
      name: v_name,
      harga: v_harga,
      stok: v_stok,
      deskripsi: v_deskripsi,
    };

    var update_sql = "update buah SET ? where id = " + req.params.id;
    req.getConnection(function (err, connection) {
      var query = connection.query(update_sql, buah, function (err, result) {
        if (err) {
          var errors_detail = ("Error Update : %s ", err);
          req.flash("msg_error", errors_detail);
          res.render("buah/edit", {
            name: req.param("name"),
            harga: req.param("harga"),
            stok: req.param("stok"),
            deskripsi: req.param("deskripsi"),
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
      name: req.param("name"),
      harga: req.param("harga"),
    });
  }
});

router.post("/add", function (req, res, next) {
  req.assert("name", "Please fill the name").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_name = req.sanitize("name").escape().trim();
    v_stok = req.sanitize("stok").escape().trim();
    v_harga = req.sanitize("harga").escape().trim();
    v_deskripsi = req.sanitize("deskripsi").escape();

    var buah = {
      name: v_name,
      harga: v_harga,
      stok: v_stok,
      deskripsi: v_deskripsi,
    };

    var insert_sql = "INSERT INTO buah SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(insert_sql, buah, function (err, result) {
        if (err) {
          var errors_detail = ("Error Insert : %s ", err);
          req.flash("msg_error", errors_detail);
          res.render("buah/add-buah", {
            name: req.param("name"),
            harga: req.param("harga"),
            stok: req.param("stok"),
            deskripsi: req.param("deskripsi"),
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
      name: req.param("name"),
      harga: req.param("harga"),
    });
  }
});

router.get("/add", function (req, res, next) {
  res.render("buah/add-buah", {
    title: "Add New buah",
    name: "",
    stok: "",
    deskripsi: "",
    harga: "",
  });
});


router.post("/pesan/add", function (req, res, next) {
  req.assert("id_customer", "Please fill the name").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_id_customer = req?.sanitize("id_customer")?.escape()?.trim();
    v_id_buah = req?.sanitize("id_buah")?.escape()?.trim();
    v_qty = req?.sanitize("qty")?.escape()?.trim();
    v_tgl_pesan = req?.sanitize("tgl_pesan")?.escape();

    var buah = {
      id_customer: v_id_customer,
      id_buah: v_id_buah,
      qty: v_qty,
      tgl_pesan: v_tgl_pesan,
    };

    var insert_sql = "INSERT INTO pesanan SET ?";

    req.getConnection(function (err, connection) {
      var query = connection.query(insert_sql, buah, function (err, result) {
        if (err) {
          var errors_detail = ("Error Insert : %s ", err);
          req.flash("msg_error", errors_detail);
          res.render("buah/pesan", {
            id_customer: req.param("id_customer"),
            id_buah: req.param("id_buah"),
            qty: req.param("qty"),
            tgl_pesan: req.param("tgl_pesan"),
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
    res.render("buah/pesan", {
      id_customer: req.param("id_customer"),
      id_buah: req.param("id_buah"),
    });
  }
});

router.post("/pembayaran/add", function (req, res, next) {
  req.assert("id_pesanan", "Please fill the name").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_id_pesanan = req?.sanitize("id_pesanan")?.escape()?.trim();
    v_tgl_bayar = req?.sanitize("tgl_bayar")?.escape()?.trim();

    var buah = {
      id_pesanan: v_id_pesanan,
      tgl_bayar: v_tgl_bayar,
    };

    var insert_sql = "INSERT INTO pembayaran SET ?";

    req.getConnection(function (err, connection) {
      var query = connection.query(insert_sql, buah, function (err, result) {
        if (err) {
          var errors_detail = ("Error Insert : %s ", err);
          req.flash("msg_error", errors_detail);
          res.render("buah/pembayaran", {
            id_pesanan: req.param("id_pesanan"),
            tgl_bayar: req.param("tgl_bayar"),
          });
        } else {
          req.flash("msg_info", "Create pembayaran success");
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
    res.render("buah/pesan", {
      id_customer: req.param("id_customer"),
      id_buah: req.param("id_buah"),
    });
  }
});
router.post("/pembayaran/add", function (req, res, next) {
  req.assert("id_pembayaran", "Please fill the name").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
    v_id_pesanan = req?.sanitize("id_pesanan")?.escape()?.trim();
    v_tgl_bayar = req?.sanitize("tgl_bayar")?.escape()?.trim();

    var buah = {
      id_pesanan: v_id_pesanan,
      tgl_bayar: v_tgl_bayar,
    };

    var insert_sql = "INSERT INTO pembayaran SET ?";

    req.getConnection(function (err, connection) {
      var query = connection.query(insert_sql, buah, function (err, result) {
        if (err) {
          var errors_detail = ("Error Insert : %s ", err);
          req.flash("msg_error", errors_detail);
          res.render("buah/pesan", {
            id_pesanan: req.param("id_pesanan"),
            tgl_bayar: req.param("tgl_bayar"),
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
    res.render("pesanan/pembayaran", {
      id_pesanan: req.param("id_pesanan"),
      tgl_bayar: req.param("tgl_bayar"),
    });
  }
});

router.get("/pembayaran/pesanan/(:id_pesanan)", function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM pesanan where id_pesanan=" + req.params.id_pesanan,
      function (err, rows) {
        if (err) {
          var errornya = ("Error Selecting : %s ", err);
          req.flash("msg_error", errors_detail);
          res.redirect("/pesanan");
        } else {
          if (rows.length <= 0) {
            req.flash("msg_error", "buah can't be find!");
            res.redirect("/pesanan");
          } else {
            console.log(rows);
            res.render("pesanan/pembayaran", { title: "pesanan ", data: rows[0] });
          }
        }
      }
    );
  });
});

router.get("/pesan/(:id)", function (req, res, next) {
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
                      res.render("buah/pesan", { title: "Pesan ", data: rows, databuah: databuah[0],
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


router.delete("/dlt/(:id_pesanan)", function (req, res, next) {
  req.getConnection(function (err, connection) {
    var buah = {
      id_pesanan: req.params.id_pesanan,
    };

    var delete_sql = "delete from pesanan where ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(delete_sql, buah, function (err, result) {
        if (err) {
          var errors_detail = ("Error Delete : %s ", err);
          req.flash("msg_error", errors_detail);
          res.redirect("/pesanan");
        } else {
          req.flash("msg_info", "Delete pesanan Success");
          res.redirect("/pesanan");
        }
      });
    });
  });
});


router.get("/edit/pesanan/(:id_pesanan)", function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM pesanan where id_pesanan=" + req.params.id_pesanan,
      function (err, rows) {
        if (err) {
          var errornya = ("Error Selecting : %s ", err);
          req.flash("msg_error", errornya);
          res.redirect("/pesanan");
        } else {
          if (rows.length <= 0) {
            req.flash("msg_error", "buah can't be find!");
            res.redirect("/pesanan");
          } else {
            console.log(rows);
            res.render("pesanan/edit", { title: "Edit Pesanan ", data: rows[0] });
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
    v_name = req.sanitize("name").escape().trim();
    v_stok = req.sanitize("stok").escape().trim();
    v_harga = req.sanitize("harga").escape().trim();
    v_deskripsi = req.sanitize("deskripsi").escape();

    var buah = {
      name: v_name,
      harga: v_harga,
      stok: v_stok,
      deskripsi: v_deskripsi,
    };

    var update_sql = "update buah SET ? where id = " + req.params.id;
    req.getConnection(function (err, connection) {
      var query = connection.query(update_sql, buah, function (err, result) {
        if (err) {
          var errors_detail = ("Error Update : %s ", err);
          req.flash("msg_error", errors_detail);
          res.render("buah/edit", {
            name: req.param("name"),
            harga: req.param("harga"),
            stok: req.param("stok"),
            deskripsi: req.param("deskripsi"),
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
      name: req.param("name"),
      harga: req.param("harga"),
    });
  }
});


module.exports = router;
