import mockSubjects from "@/services/mockData/subjects.json";

class SubjectsService {
  constructor() {
    this.subjects = [...mockSubjects];
  }

  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.subjects];
  }

  async getById(id) {
    await this.delay();
    const subject = this.subjects.find(s => s.Id === parseInt(id));
    if (!subject) {
      throw new Error("Subject not found");
    }
    return { ...subject };
  }

  async create(subjectData) {
    await this.delay();
    const newSubject = {
      ...subjectData,
      Id: Math.max(...this.subjects.map(s => s.Id), 0) + 1,
      id: (Math.max(...this.subjects.map(s => s.Id), 0) + 1).toString()
    };
    this.subjects.push(newSubject);
    return { ...newSubject };
  }

  async update(id, updates) {
    await this.delay();
    const index = this.subjects.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Subject not found");
    }
    
    this.subjects[index] = {
      ...this.subjects[index],
      ...updates,
      Id: parseInt(id),
      id: id.toString()
    };
    
    return { ...this.subjects[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.subjects.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Subject not found");
    }
    
    this.subjects.splice(index, 1);
    return true;
  }
}

export default new SubjectsService();