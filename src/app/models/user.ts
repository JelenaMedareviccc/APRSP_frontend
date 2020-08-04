import { Role } from "./role";

export class User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  contact: string;
  role: Role;
  token: string;
  tokenExpirationDate: Date;
  expiration: Date;

  constructor(userId, username, token, expiration) {
    this.username = username;
    this.token = token;
    this.id = userId;
    this.expiration = expiration;
  }

  get _token() {
    if (!this.expiration || new Date() > this.expiration) {
      return null;
    }
    return this.token;
  }
}
