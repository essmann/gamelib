
async function register(userData) {
    try {
        const response = await window.api.register(userData);

    } catch (error) {
            console.log(error);
    }
}

export default register;