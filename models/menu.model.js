import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,     // remove __v
      transform(doc, ret) {
        // Convert _id → id (number)
        ret.id = parseInt(ret._id.toString().slice(-6), 16);
        // delete ret._id;

        // Convert camelCase → snake_case for timestamps
        ret.created_at = ret.createdAt;
        ret.updated_at = ret.updatedAt;
        delete ret.createdAt;
        delete ret.updatedAt;

        return ret;
      },
    },
  }
);



const Menu = mongoose.model('Menu', menuSchema);
export default Menu;
