import MenuContainer from "./MenuContainer";
import "../styling/registerMenu.css";

function RegisterMenu({onClose}){
    return (
        <MenuContainer className="register_container"> 
            <form className="register">
                <div className="register_header">
                    <h2>Create Account</h2>
                </div>
                
                <div className="register_body">
                    <div className="input_group">
                        <label htmlFor="reg_username">Username</label>
                        <input 
                            id="reg_username"
                            type="text" 
                            placeholder="Choose a username" 
                            className="register_input"
                        />
                    </div>
                    
                    <div className="input_group">
                        <label htmlFor="reg_email">Email</label>
                        <input 
                            id="reg_email"
                            type="email" 
                            placeholder="Enter your email" 
                            className="register_input"
                        />
                    </div>
                    
                    <div className="input_group">
                        <label htmlFor="reg_password">Password</label>
                        <input 
                            id="reg_password"
                            type="password" 
                            placeholder="Create a password" 
                            className="register_input"
                        />
                    </div>
                    
                    <div className="input_group">
                        <label htmlFor="reg_confirm_password">Confirm Password</label>
                        <input 
                            id="reg_confirm_password"
                            type="password" 
                            placeholder="Re-enter your password" 
                            className="register_input"
                        />
                    </div>
                </div>
                
                <div className="register_footer">
                    <button type="submit" className="register_button">
                        Sign Up
                    </button>
                    
                    <button 
                        type="button" 
                        className="cancel_button" 
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </MenuContainer>
    )
}

export default RegisterMenu;