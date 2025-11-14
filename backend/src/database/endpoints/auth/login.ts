import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/user/user";
async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user) {
    const passwordMatch = await bcrypt.compare(
      password,
      user.dataValues.password
    );
    if (passwordMatch) {
      req.session.user = {
        id: user.dataValues.user_id,
        username: user.dataValues.username,
      };
    }
  }
  console.log(
    "Login successful. Session has been created and updated in session store MySQL."
  );
  res.json({
    success: true,
    message: "Logged in successfully",
  });
}

export default login;
