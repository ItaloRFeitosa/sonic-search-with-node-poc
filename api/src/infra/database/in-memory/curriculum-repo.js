class CurriculumRepo {
  constructor() {
    this.database = new Map();
  }
  insert(curriculum) {
    this.database.set(curriculum.id, curriculum);
  }

  list() {
    return Array.from(this.database.values());
  }

  show(id) {
    return this.database.get(id);
  }
}

module.exports = CurriculumRepo;
