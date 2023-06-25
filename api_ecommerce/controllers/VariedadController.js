import models from "../models";

export default {
  register: async (req, res) => {
    try {
      let data = req.body;
      let variedad_exits = await models.Variedad.findOne({
        valor: data.valor,
        product: data.product,
      });
      var variedad = null;
      if (variedad_exits) {
        data.stock = variedad_exits.stock + data.stock;
        await models.Variedad.findByIdAndUpdate(
          { _id: variedad_exits.id },
          data
        );
        variedad = await models.Variedad.findById({ _id: variedad_exits.id });
      } else {
        variedad = await models.Variedad.create(data);
      }

      res.status(200).json({ variedad: variedad });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA variedad ",
      });
      console.log(error);
    }
  },
  update: async (req, res) => {
    try {
      let data = req.body;

      await models.Variedad.findByIdAndUpdate({ _id: data._id }, data);

      let variedad = await models.Variedad.findById({ _id: data._id });

      res.status(200).json({ variedad: variedad });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA variedad ",
      });
      console.log(error);
    }
  },
  delete: async (req, res) => {
    try {
      let _id = req.params.id;

      await models.Variedad.findByIdAndDelete({ _id: _id });
      res.status(200).json({ message: "Se elimino la variedad" });
    } catch (error) {
      res.status(500).send({
        message: "OCURRIO UN PROBLEMA variedad ",
      });
      console.log(error);
    }
  },
};
