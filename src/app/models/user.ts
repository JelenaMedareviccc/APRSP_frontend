import { Role } from "./role";

export class User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  contact: string;
  role: Role;
  token: string;
  tokenExpirationDate: Date;
  expiration: Date;

  constructor(userId: number, username: string, token: string, expiration: Date) {
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
