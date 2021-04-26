import * as jwt from 'jsonwebtoken';

export default class TokenService {
  getCurrentUserIdFromToken(token: string) {
    const decodedToken = jwt.verify(token, 'fcfe7f47-193e-41d8-814d-3c5985ee2832');

    return decodedToken.id;
  }

  getCurrentUserEmail(token: string) {
    const decodedToken = jwt.verify(token, 'fcfe7f47-193e-41d8-814d-3c5985ee2832');

    return decodedToken.email;
  }
}
