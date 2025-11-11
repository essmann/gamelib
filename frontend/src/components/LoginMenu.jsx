import MenuContainer from "./MenuContainer";

function LoginMenu({onClose}){
    return (
        <MenuContainer className="login_container"> 
            <form className="login">
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
                    
                    <button 
                        type="button" 
                        className="close_button" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </MenuContainer>
    )
}

export default LoginMenu;