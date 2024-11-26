import User from "../model/userModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

const AdminController = {
  fetchingUsers: async (req: Request, res: Response) => {
    try {
      const { search } = req.query;

      const query: any = { role: { $ne: "admin" } };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      const isUsers = await User.find(query);

      res.json({ data: isUsers });
    } catch (error) {
      console.log(error);
    }
  },

  addingUser: async (req: Request, res: Response) => {
    try {
      console.log(req.body, "ading user boyd");
      const { name, email, password } = req.body;

      const isUser = await User.findOne({ email: email });
      if (isUser) {
        res.json({ error: "User is Allready registered" });
      }

      const salt = await bcrypt.genSalt(10);

      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: "user",
      });

      await newUser.save();

      res.json({ success: "Successfully registered user" });
    } catch (error) {
      console.log(error);
    }
  },

  editingUser: async (req: Request, res: Response) => {
    try {
      const { name, _id } = req.body;

      await User.updateOne({ _id: _id }, { $set: { name: name } });

      res.json({ success: "successfully updated username" });
    } catch (error) {
      console.log(error);
    }
  },

  deletingUser: async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;

      if (userId) {
        await User.findByIdAndDelete(userId);

        res.json({ success: "User Deleted Successfully" });
      } else {
        res.json({ error: "Some Error while deleting user" });
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export default AdminController;
