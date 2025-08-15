import mockUsers from '@/services/mockData/users.json';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class UserService {
  constructor() {
    this.users = mockUsers;
  }

  async authenticate(email, role, assignedEventIds = []) {
    await delay(500);
    
    // Find or create user
    let user = this.users.find(u => u.email === email);
    
    if (!user) {
      // Create new user
      user = {
        Id: this.users.length + 1,
        email,
        name: this.extractNameFromEmail(email),
        role,
        assignedEventIds: role === 'entrepreneur' ? assignedEventIds : [],
        createdAt: new Date().toISOString()
      };
      this.users.push(user);
    } else {
      // Update existing user role if needed
      user.role = role;
      if (role === 'entrepreneur') {
        user.assignedEventIds = assignedEventIds;
      }
    }

    return {
      ...user,
      roleLabel: this.getRoleLabel(role)
    };
  }

  extractNameFromEmail(email) {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._]/g, ' ');
  }

  getRoleLabel(role) {
    const labels = {
      'saas_admin': 'Administrador SaaS',
      'owner': 'Propietario',
      'entrepreneur': 'Emprendedor'
    };
    return labels[role] || 'Usuario';
  }

  async getAll() {
    await delay(300);
    return [...this.users];
  }

  async getById(id) {
    await delay(200);
    const user = this.users.find(u => u.Id === parseInt(id));
    if (!user) throw new Error('Usuario no encontrado');
    return { ...user };
  }

  async create(userData) {
    await delay(400);
    const newUser = {
      Id: Math.max(...this.users.map(u => u.Id)) + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, userData) {
    await delay(400);
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) throw new Error('Usuario no encontrado');
    
    this.users[index] = { ...this.users[index], ...userData };
    return { ...this.users[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.users.findIndex(u => u.Id === parseInt(id));
    if (index === -1) throw new Error('Usuario no encontrado');
    
    this.users.splice(index, 1);
    return true;
  }
}

export default new UserService();
export { UserService };