const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);



//  user:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User"
//     }


// const tasks = await Task.find()
// .populate("user");

// const user = await User.findById(id);

// const tasks = await Task.find({
//     user:id
// });



module.exports = mongoose.model("Task", taskSchema);