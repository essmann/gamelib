
async function login(userData) {
    try {
        const response = await window.api.login(userData);

    } catch (error) {
            console.log(error);
    }
}

export default login;