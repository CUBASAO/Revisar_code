import token from "../services/token";

export default {
  verifyEcommerce: async (req, rest, next) => {
    if (!req.headers.token) {
      rest.status(404).send({
        message: "NO SE ENVIO EL TOKEN",
      });
    }
    const response = await token.decode(req.headers.token);
    if (response) {
      if (response.rol == "cliente" || response.rol == "admin") {
        next();
      } else {
        rest.status(403).send({
          message: "NO ESTA PERMITIDO VISITAR ESTA RUTA verifyEcommerce:rapi_ecommerce\middlewares\auth.js",
        });
      }
    } else {
      rest.status(403).send({
        message: "EL TOKEN NO ES VALIDO",
      });
    }
  },
  verifyAdmin: async (req, rest, next) => {
    if (!req.headers.token) {
      rest.status(404).send({
        message: "NO SE ENVIO EL TOKEN",
      });
    }
    const response = await token.decode(req.headers.token);
    if (response) {
      if (response.rol == "admin") {
        next();
      } else {
        rest.status(403).send({
          message: "NO ESTA PERMITIDO VISITAR ESTA RUTA verifyAdmin:api_ecommerce\middlewares\auth.js",
        });
      }
    } else {
      rest.status(403).send({
        message: "TOKEN INVALIDO",
      });
    }
  },
};
