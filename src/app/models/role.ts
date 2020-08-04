export class Role {
  id: number;
  name: string;
  description: string;

  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}
