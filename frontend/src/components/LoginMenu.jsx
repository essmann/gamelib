import { useState } from "react";
import MenuContainer from "./MenuContainer";
import login from "../api/endpoints/auth/login";

function LoginMenu({ onClose, openRegisterMenu, setUser, user }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const data = await login({ email, password });
      console.log(data);
      console.log("username: data.username : " + data.username);
      setUser(data);

      console.log("user data after request: " + data);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    }
  };

  const handleRegisterClick = () => {
    onClose();
    openRegisterMenu(true);
  };

  return (
    <MenuContainer className="login_container" onClose={onClose}>
      <form className="login" onSubmit={handleSubmit}>
        <div className="login_header">
          <h2>Login</h2>
        </div>

        <div className="login_body">
          <div className="input_group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              className="login_input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input_group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="login_input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error_message">{error}</div>}
        </div>

        <div className="login_footer">
          <button type="submit" className="login_button">
            Sign In
          </button>
          <button type="button" className="close_button" onClick={onClose}>
            Cancel
          </button>
        </div>

        <div className="register_footer_container">
          <div className="register_footer">Not registered?</div>
          <span className="register_btn" onClick={handleRegisterClick}>
            Register
          </span>
        </div>
      </form>
    </MenuContainer>
  );
}

export default LoginMenu;
