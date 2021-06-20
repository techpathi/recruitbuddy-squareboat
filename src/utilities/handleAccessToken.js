const handleAccessToken = {};

handleAccessToken.save = (accessToken) => {
    localStorage.setItem('accessToken', accessToken);
    return true;
}

handleAccessToken.delete = () => {
    localStorage.removeItem('accessToken');
}

handleAccessToken.getToken = () => {
    const authToken = localStorage.getItem('accessToken');
    return authToken;
}

export default handleAccessToken;