import models from "../models";
import resource from "../resources";

export default {
  list: async (req, res) => {
    try {
      let user_id = req.query.user_id;
      let CARTS = await models.Cart.find({
        user: user_id,
      })
        .populate("variedad")
        .populate({
          path: "product",
          populate: {
            path: "categorie",
          },
        });

      CARTS = CARTS.map((cart) => {
        return resource.Cart.cart_list(cart);
      });

      res.status(200).json({
        carts: CARTS,
      });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN ERROR",
      });
      console.log(error);
    }
  },
  register: async (req, res) => {
    try {
      let data = req.body;
      console.log(req.body);
      //Validamos si exite el producto en el carrito de compra
      if (data.variedad) {
        let valid_cart = await models.Cart.findOne({
          user: data.user,
          variedad: data.variedad,
          product: data.product,
        });
        if (valid_cart) {
          res.status(200).json({
            message: 403,
            message_text:
              "El producto con la variedad ya existe en el carrito de compra",
          });
          return;
        }
      } else {
        let valid_cart = await models.Cart.findOne({
          user: data.user,
          product: data.product,
        });
        if (valid_cart) {
          res.status(200).json({
            message: 403,
            message_text: "El producto ya existe en el carrito de compra",
          });
          return;
        }
      }

      //Validamos si el stock esta disponible

      if (data.variedad) {
        let valid_variedad = await models.Variedad.findOne({
          id_: data.variedad,
        });
        if (valid_variedad.stock < data.cantidad) {
          res.status(200).json({
            message: 403,
            message_text: "El stock no esta disponible",
          });
          return;
        }
      } else {
        let valid_product = await models.Product.findOne({
          _id: data.product,
        });
        if (valid_product.stock < data.cantidad) {
          res.status(200).json({
            message: 403,
            message_text: "El stock no esta disponible",
          });
          return;
        }
      }
      let CART = await models.Cart.create(data);
      res.status(200).json({
        cart: CART,
        message_text: "El carrito se registro con exito ",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "OCURRIO UN ERROR",
      });
    }
  },
  update: async (req, res) => {
    try {
      let data = req.body;

      //Validamos si el stock esta disponible

      if (data.variedad) {
        let valid_variedad = await models.Variedad.findOne({
          id_: data.variedad,
        });
        if (valid_variedad.stock < data.cantidad) {
          res.status(200).json({
            message: 403,
            message_text: "El stock no esta disponible",
          });
          return;
        }
      } else {
        let valid_product = await models.Product.findOne({
          _id: data.product,
        });
        if (valid_product.stock < data.cantidad) {
          res.status(200).json({
            message: 403,
            message_text: "El stock no esta disponible",
          });
          return;
        }
      }
      let CART = await models.Cart.findByIdAndUpdate({ _id: data._id }, data);
      res.status(200).json({
        cart: CART,
        message_text: "El carrito se actualizo con exito ",
      });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN ERROR",
      });
      console.log(error);
    }
  },
  delete: async (req, res) => {
    try {
      let _id = req.params.id;
      let CART = await models.Cart.findByIdAndDelete({ _id: _id });
      res.status(200).json({
        message_text: "El carrito se elimino con exito ",
      });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN ERROR",
      });
      console.log(error);
    }
  },
};
