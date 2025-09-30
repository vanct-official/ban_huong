import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Subscriber = sequelize.define("Subscriber", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

export default Subscriber;
