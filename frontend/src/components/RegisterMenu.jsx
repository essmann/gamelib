import { useState } from "react";
import MenuContainer from "./MenuContainer";
import "../styling/registerMenu.css";
import register from "../api/endpoints/auth/register";
function RegisterMenu({onClose}){
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    
    const [errors, setErrors] = useState({});
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };
    
    const validate = () => {
        const newErrors = {};
        
        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }
        
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        
        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        
        return newErrors;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newErrors = validate();
        if (Object.keys(newErrors).length === 0) {
            // Form is valid - submit data
            
            await register(formData);
            console.log("Form submitted:", formData);
            // Add your registration logic here
        } else {
            setErrors(newErrors);
        }
    };
    
    return (
        <MenuContainer className="register_container" onClose={onClose}> 
            <form className="register" onSubmit={handleSubmit}>
                <div className="register_header">
                    <h2>Create Account</h2>
                </div>
                
                <div className="register_body">
                    <div className="input_group">
                        <label htmlFor="reg_username">Username</label>
                        <input 
                            id="reg_username"
                            name="username"
                            type="text" 
                            placeholder="Choose a username" 
                            className={`register_input ${errors.username ? 'error' : ''}`}
                            value={formData.username}
                            onChange={handleChange}
                        />
                        {errors.username && <span className="error_message">{errors.username}</span>}
                    </div>
                    
                    <div className="input_group">
                        <label htmlFor="reg_email">Email</label>
                        <input 
                            id="reg_email"
                            name="email"
                            type="email" 
                            placeholder="Enter your email" 
                            className={`register_input ${errors.email ? 'error' : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <span className="error_message">{errors.email}</span>}
                    </div>
                    
                    <div className="input_group">
                        <label htmlFor="reg_password">Password</label>
                        <input 
                            id="reg_password"
                            name="password"
                            type="password" 
                            placeholder="Create a password" 
                            className={`register_input ${errors.password ? 'error' : ''}`}
                            value={formData.password}
                            onChange={handleChange}
                        />
                        {errors.password && <span className="error_message">{errors.password}</span>}
                    </div>
                    
                    <div className="input_group">
                        <label htmlFor="reg_confirm_password">Confirm Password</label>
                        <input 
                            id="reg_confirm_password"
                            name="confirmPassword"
                            type="password" 
                            placeholder="Re-enter your password" 
                            className={`register_input ${errors.confirmPassword ? 'error' : ''}`}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && <span className="error_message">{errors.confirmPassword}</span>}
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