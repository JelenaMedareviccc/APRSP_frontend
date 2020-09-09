export class Role {
  roleId: number;
  name: string;
  description: string;

  constructor(roleId: number, name: string, description: string) {
    this.roleId = roleId;
    this.name = name;
    this.description = description;
  }
}
