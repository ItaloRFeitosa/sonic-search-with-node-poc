const uuid = require("uuid");

class Curriculum {
  constructor(name, specialties) {
    this.id = uuid.v4();
    this.name = name;
    this.specialties = specialties;
  }

  toString() {
    const specialties = this.specialties.join(",");

    return `${this.name}-${specialties}`;
  }
}

module.exports = Curriculum;
