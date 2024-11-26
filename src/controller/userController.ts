import { Request, Response } from "express";
import User from "../model/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

interface decode {
  user: string;
  iat: number;
}

const userController = {
  signUp: async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, email, password } = req.body;

      const noUser = await User.findOne();

      // hashing password
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let user;

      if (!noUser) {
        // if there is no users then this user as a admin
        const adminData = new User({
          name,
          email,
          password: hashedPassword,
          role: "admin",
        });

        user = await adminData.save();
      } else {
        const isUser = await User.findOne({ email: email });

        // checking the user is allready existing or not
        if (isUser) {
          return res.json({ error: "This User is allready registered" });
        } else {
          // adding user
          const userData = new User({
            name,
            email,
            password: hashedPassword,
            role: "user",
          });

          user = await userData.save();
        }
      }

      const token = jwt.sign(
        { user: user?._id },
        process.env.JWT_SECRET as string
      );

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 100 * 60 * 60 * 24,
        })
        .json({ success: "Successfully Signed Up" });
    } catch (error) {
      console.log("something happened when signuping", error);
      return res.status(500).json({ Error: "Internal Error" });
    }
  },

  fetchingUserData: async (req: Request, res: Response): Promise<any> => {
    try {
      let token: string | null = null;

      if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
      } else if (req.headers && req.headers.authorization) {
        const authHeader = req.headers.authorization;

        if (authHeader.startsWith("Bearer ")) {
          token = authHeader.split(" ")[1];
        }
      }

      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized User token not provided" });
      }

      const verifyToken = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as decode;

      if (!verifyToken) {
        res.status(401).json({ error: "Not a valid token" });
      }

      let userData;

      try {
        userData = await User.findById(verifyToken.user);
      } catch (error) {
        return res.status(500).json({ message: "User is Not getting" });
      }

      res.json(userData);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: "something wrong with verifying token" });
    }
  },

  login: async (req: Request, res: Response): Promise<any> => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.json({ error: "User is Not existing" });
      } else {
        const isPassword = await bcrypt.compare(password, user.password);

        if (!isPassword) {
          return res.json({ error: "Password is wrong" });
        } else {
          const token = jwt.sign(
            { user: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: "30d" }
          );

          res
            .cookie("token", token, {
              httpOnly: true,
              maxAge: 100 * 60 * 60 * 24,
            })
            .json({ success: "Successfully Logged in" });
        }
      }
    } catch (error) {
      console.log(error, "Something went while logging");
      res.status(500).json({ message: "Something wrong with loggin" });
    }
  },

  editingProfile: async (req: Request, res: Response) => {
    try {
      console.log(req.body, "editing profile");

      const { name, email, bio, image } = req.body;

      const isUser = await User.findOne({ email });

      if (!isUser) {
        res.json({ error: "Unkwown user" });
      }

      await User.updateOne(
        { email: email },
        {
          $set: {
            name: name,
            bio,
            profile: image,
          },
        }
      );

      res.json({ success: true });
    } catch (error) {
      console.log("some kind of error while editing the profile", error);
      res.status(500).json({ message: "error while edting the profile" });
    }
  },

  resettingPassword: async (req: Request, res: Response): Promise<any> => {
    try {
      console.log(req.body, "this is form of the password");

      const { currentpassword, password, email } = req.body;

      const user = await User.findOne({ email: email });

      if (!user) {
        res.status(404).json({ error: "cant find the user" });
      } else {
        const passwordMath = await bcrypt.compare(
          currentpassword,
          user.password
        );

        if (!passwordMath) {
          return res.json({ error: "Password is not match" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.updateOne(
          { email: email },
          {
            $set: { password: hashedPassword },
          }
        );
      }

      res.json({ success: "Password changed successfullly" });
    } catch (error) {
      console.log(error, "Error while reseting password");
      res.status(500).json({ error: "Something wrong with reseting password" });
    }
  },

  deletingImage: async (req: Request, res: Response) => {
    try {
      const email = req.query.data;

      const user = await User.findOneAndUpdate(
        { email },
        { $set: { profile: null } }
      );

      if (!user) {
        res.json({ error: "Can't find the user" });
      }

      res.json({ success: "Successfully Deleted Images" });
    } catch (error) {
      console.log(error, "Something went wrong while deleting the image");
      res.status(500);
    }
  },

  logout: (req: Request, res: Response) => {
    try {
      console.log("user Logged out");
      res.clearCookie("token").send({ something: "Logout" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Some Error while Logging Out" });
    }
  },
};

export default userController;
