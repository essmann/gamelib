// ProfileMenu.jsx
import React from "react";
import MenuContainer from "./MenuContainer";

function ProfileMenu({ user, onClose, onLogout }) {
  if (!user) {
    return (
      <MenuContainer className="profile_container" onClose={onClose}>
        <div className="profile_empty">
          <p>No user logged in.</p>
        </div>
      </MenuContainer>
    );
  }

  return (
    <MenuContainer className="profile_container" onClose={onClose}>
      <div className="profile_header">
        <h2>Profile</h2>
      </div>

      <div className="profile_body">
        <div className="profile_field">
          <strong>Username:</strong> {user.username || user}
        </div>

        {user.email && (
          <div className="profile_field">
            <strong>Email:</strong> {user.email}
          </div>
        )}

        {user.id && (
          <div className="profile_field">
            <strong>User ID:</strong> {user.id}
          </div>
        )}
      </div>

      <div className="profile_footer">
        <button className="logout_button" onClick={onLogout}>
          Logout
        </button>

        <button className="close_button" onClick={onClose}>
          Close
        </button>
      </div>
    </MenuContainer>
  );
}

export default ProfileMenu;
