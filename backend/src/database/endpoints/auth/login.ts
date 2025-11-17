import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../../models/user/user";

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const passwordMatch = await bcrypt.compare(password, user.dataValues.password);

  if (!passwordMatch) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  // Password matches → create session
  req.session.user = {
    id: user.dataValues.user_id,
    username: user.dataValues.username,
    email: user.dataValues.email,
    games_last_modified: user.dataValues.games_last_modified,
  };

  console.log(
    "Login successful. Session has been created and updated in session store MySQL."
  );

  return res.json(req.session.user);
}

export default login;
