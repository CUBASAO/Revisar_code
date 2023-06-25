import models from "../models";
import resources from "../resources";
import fs from "fs";
import path from "path";

export default {
  register: async (req, res) => {
    try {
      let data = req.body;

      let valid_Product = await models.Product.findOne({ title: data.title });

      if (valid_Product) {
        res.status(200).json({
          code: 403,
          message: "El producto ya existe",
        });
        return;
      }

      data.slug = data.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      if (req.files) {
        var img_path = req.files.imagen.path;
        var name = img_path.split("\\");
        var portada_name = name[2];
        data.portada = portada_name;
      }

      let product = await models.Product.create(data);

      res.status(200).json({
        message: "El producto se registro con exito",
      });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA",
      });
      console.log(error);
    }
  },
  update: async (req, res) => {
    try {
      let data = req.body;

      let valid_Product = await models.Product.findOne({
        title: data.title,
        _id: { $ne: data._id },
      });
      if (valid_Product) {
        res.status(200).json({
          code: "403",
          message: "El producto ya existe  existe",
        });
        return;
      }

      data.slug = data.title
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      if (req.files && req.files.imagen) {
        var img_path = req.files.imagen.path;
        var name = img_path.split("\\");
        var portada_name = name[2];
        data.portada = portada_name;
      }
      await models.Product.findByIdAndUpdate({ _id: data._id }, data);

      res.status(200).json({
        message: "El producto se actualizo  con exito",
      });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA",
      });
    }
  },
  list: async (req, res) => {
    var filter=[];
    try {
      if (req.query.search && req.query.search.trim() !== "") {
        filter.push({ title: new RegExp(req.query.search, "i") });
      }
      if (req.query.categorie && req.query.categorie.trim() !== "") {
        filter.push({ categorie: req.query.categorie });
      }

      let products = [];
      if (filter.length > 0) {
        products = await models.Product.find({ $and: filter }).populate(
          "categorie"
        );
      } else {
        products = await models.Product.find().populate("categorie");
      }
      products = products.map((product) => {
        return resources.Product.product_list(product);
      });

      res.status(200).json({
        products: products,
      });
    } catch (error) {
      console.log(error);

      res.status(500).send({
        message: "OCURRIO UN PROBLEMA ++++",
      });
    }
  },
  remove: async (req, res) => {
    try {
      let _id = req.query._id;
      await models.Product.findByIdAndDelete({ _id: _id });
      res.status(200).json({
        message: "El producto se elimino con  existe",
      });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA",
      });
    }
  },
  obtener_imagen: async (req, res) => {
    try {
      var img = req.params["img"];

      fs.stat("./uploads/product/" + img, function (err) {
        if (!err) {
          let path_img = "./uploads/product/" + img;
          res.status(200).sendFile(path.resolve(path_img));
        } else {
          let path_img = "./uploads/product.jpg";
          res.status(200).sendFile(path.resolve(path_img));
        }
      });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA ob_img",
      });

      console.log(error);
    }
  },
  show: async (req, res) => {
    try {
      var _product_id = req.params.id;
      let PRODUCT = await models.Product.findById({
        _id: _product_id,
      }).populate("categorie");

      let VARIEDADES = await models.Variedad.find({ product: _product_id });

      res.status(200).json({
        product: resources.Product.product_list(PRODUCT, VARIEDADES),
      });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA ob_img",
      });
      console.log(error);
    }
  },
  register_imagen: async (req, res) => {
    try {
      var img_path = req.files.imagen.path;
      var name = img_path.split("\\");
      var imagen_name = name[2];

      let product = await models.Product.findByIdAndUpdate(
        { _id: req.body._id },
        {
          $push: {
            galerias: {
              imagen: imagen_name,
              _id: req.body.__id,
            },
          },
        }
      );
      res.status(200).json({
        message: "La imagen se subio perfectamente",
        imagen: {
          imagen:
            "http://localhost:3000" +
            "/api/products/uploads/product/" +
            imagen_name,
          _id: req.body.__id,
        },
      });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA reg_img",
      });
    }
    console.log(error);
  },
  remove_imagen: async (req, res) => {
    try {
      await models.Product.findByIdAndUpdate(
        { _id: req.body._id },
        {
          $pull: {
            galerias: {
              _id: req.body.__id,
            },
          },
        }
      );
      res.status(200).json({
        message: "La imagen se elimino perfectamente",
      });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA remove_im",
      });
    }
  },
};
