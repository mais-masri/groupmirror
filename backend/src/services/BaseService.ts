import { generateUUID } from '../utils/auth';

// Base interface for all services
export interface BaseService<T> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

// Abstract base service with common functionality
export abstract class BaseServiceImpl<T extends { id: string }> implements BaseService<T> {
  protected data: T[] = [];
  protected dataFile: string;

  constructor(dataFile: string) {
    this.dataFile = dataFile;
    this.loadData();
  }

  // Abstract methods to be implemented by subclasses
  abstract validateCreate(data: Partial<T>): T;
  abstract validateUpdate(data: Partial<T>): Partial<T>;

  // Common CRUD operations
  async findAll(): Promise<T[]> {
    return [...this.data];
  }

  async findById(id: string): Promise<T | null> {
    return this.data.find(item => item.id === id) || null;
  }

  async create(data: Partial<T>): Promise<T> {
    const validatedData = this.validateCreate(data);
    const newItem = {
      ...validatedData,
      id: generateUUID(),
    } as T;

    this.data.push(newItem);
    await this.saveData();
    return newItem;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;

    const validatedData = this.validateUpdate(data);
    this.data[index] = { ...this.data[index], ...validatedData };
    await this.saveData();
    return this.data[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.data.splice(index, 1);
    await this.saveData();
    return true;
  }

  // Helper methods
  async findByField<K extends keyof T>(field: K, value: T[K]): Promise<T | null> {
    return this.data.find(item => item[field] === value) || null;
  }

  async findByFields(fields: Partial<T>): Promise<T[]> {
    return this.data.filter(item =>
      Object.entries(fields).every(([key, value]) => item[key as keyof T] === value)
    );
  }

  async count(): Promise<number> {
    return this.data.length;
  }

  // Data persistence methods
  private async loadData(): Promise<void> {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const dataPath = path.join(process.cwd(), 'tmp', this.dataFile);
      
      if (fs.existsSync(dataPath)) {
        const fileData = fs.readFileSync(dataPath, 'utf8');
        this.data = JSON.parse(fileData);
        
        // Convert date strings back to Date objects
        this.data = this.data.map(item => this.deserializeDates(item));
      }
    } catch (error) {
      console.warn(`Could not load data from ${this.dataFile}:`, error);
      this.data = [];
    }
  }

  protected async saveData(): Promise<void> {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const tmpDir = path.join(process.cwd(), 'tmp');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      
      const dataPath = path.join(tmpDir, this.dataFile);
      const serializedData = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(dataPath, serializedData);
    } catch (error) {
      console.warn(`Could not save data to ${this.dataFile}:`, error);
    }
  }

  private deserializeDates(item: any): T {
    const deserialized = { ...item };
    
    // Convert common date fields
    const dateFields = ['createdAt', 'updatedAt', 'joinedAt', 'lastLoginAt', 'expiresAt'];
    dateFields.forEach(field => {
      if (deserialized[field] && typeof deserialized[field] === 'string') {
        deserialized[field] = new Date(deserialized[field]);
      }
    });
    
    return deserialized;
  }

  // Reset data (useful for testing)
  async resetData(): Promise<void> {
    this.data = [];
    await this.saveData();
  }
}
