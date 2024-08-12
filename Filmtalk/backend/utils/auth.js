import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;

function generateToken(userInfo) {
    if (!userInfo) {
        return null;
    }

    // Ensure JWT_SECRET is set in your environment variables
    const token = sign(
        { username: userInfo.username, email: userInfo.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    return token;
}

function verifyToken(user, token) {
    try {
        // Extract username from the user object
        const username = user.username;

        // Log the value and type of username
        console.log('Verifying token for username:', username);
        console.log('Type of username:', typeof username);

        // Ensure username is a string and not empty
        if (typeof username !== 'string' || !username) {
            throw new TypeError('username must be a non-empty string');
        }

        const decoded = verify(token, process.env.JWT_SECRET);
        if (decoded.username.toLowerCase().trim() !== username.toLowerCase().trim()) {
            return {
                verified: false,
                message: 'Invalid user'
            };
        }

        return {
            verified: true,
            message: 'Valid token'
        };
    } catch (err) {
        console.error('Error verifying token:', err);
        return {
            verified: false,
            message: 'Invalid token'
        };
    }
}

const _generateToken = generateToken;
export { _generateToken as generateToken };
const _verifyToken = verifyToken;
export { _verifyToken as verifyToken };

