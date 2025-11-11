import MenuContainer from "./MenuContainer";
function LoginMenu({ onClose, openRegisterMenu }) {
  
    const handleSubmit = () => {};
  const handleRegisterClick = () => {
    onClose();
    openRegisterMenu(true);
  }
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
              id="username"
              type="text"
              placeholder="Enter your email"
              className="login_input"
            />
          </div>

          <div className="input_group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="login_input"
            />
          </div>
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
          <span className="register_btn" onClick={handleRegisterClick}>Register</span>
        </div>
      </form>
    </MenuContainer>
  );
}

export default LoginMenu;
