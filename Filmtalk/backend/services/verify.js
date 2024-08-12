import { buildResponse } from '../utils/util.js';
import { verifyToken } from '../utils/auth.js';

function verify(requestBody) {
    if (!requestBody.user || !requestBody.user.username || !requestBody.token) {
        return buildResponse(401, { verified: false, message: 'Incorrect request body' });
    }

    const user = requestBody.user;
    const token = requestBody.token;
    const verification = verifyToken(user, token);
    if (!verification.verified) {
        return buildResponse(401, verification);
    }

    return buildResponse(200, {
        verified: true,
        message: 'Token is valid',
        user: user,
        token: token,
    });
}

const _verify = verify;
export { _verify as verify };