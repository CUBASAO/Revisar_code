import mongoose, { Schema } from "mongoose";
const CuponesSchema = new Schema(
  {
    code: { type: String, maxlength: 50, required: true },
    type_discount: { type: Number, required: true, default: 1 }, //por porcentaje 1 o por moneda 2
    discount: { type: Number, required: true }, //por moneda o por porcentaje
    type_count: { type: Number, require: true, default: 1 }, //ilimitada 1 o limitada 2
    num_use: { type: Number, required: false },
    type_segment: { type: Number, required: false, default: 1 }, //1 cupon por producto y 2 seria por categoria
    state: { type: Number, required: false, default: 1 }, //1 es activo y 2 inactivo
    products: [{ type: Object }], //[{_id: asdasd},{_id: dsadsa }]
    categories: [{ type: Object }],
  },
  {
    timestamps: true,
  }
);

const Cupone = mongoose.model("cupones", CuponesSchema);
export default Cupone;
