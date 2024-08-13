export function getUser() {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export function getToken() {
    return sessionStorage.getItem('token');
}

export function setUserSession(user, token) {
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);
}

export function removeUserSession() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
}

export function isLoggedIn() {
    return !!getToken();
}
