import { 
  Group, 
  CreateGroup, 
  UpdateGroup, 
  GroupMember, 
  GroupWithMembers,
  GroupInvitation,
  GroupMoodSummary,
  GroupActivity
} from '../models/Group';
import { BaseServiceImpl } from './BaseService';
import { ValidationError } from '../utils/errors';

export interface GroupService {
  createGroup(data: Partial<Group>, createdBy: string): Promise<Group>;
  findByUser(userId: string): Promise<Group[]>;
  addMember(groupId: string, userId: string, role?: 'admin' | 'member'): Promise<boolean>;
  removeMember(groupId: string, userId: string): Promise<boolean>;
  getMembers(groupId: string): Promise<GroupWithMembers | null>;
  updateMemberRole(groupId: string, userId: string, role: 'admin' | 'member'): Promise<boolean>;
  isMember(groupId: string, userId: string): Promise<boolean>;
  isAdmin(groupId: string, userId: string): Promise<boolean>;
  getGroupActivity(groupId: string): Promise<GroupActivity | null>;
  getGroupMoodSummary(groupId: string, dateFrom: string, dateTo: string): Promise<GroupMoodSummary | null>;
}

export class GroupServiceImpl extends BaseServiceImpl<Group> implements GroupService {
  private members: GroupMember[] = [];
  private invitations: GroupInvitation[] = [];

  constructor() {
    super('groups.json');
    this.loadMembers();
    this.loadInvitations();
  }

  validateCreate(data: Partial<Group>): Group {
    const { name, description, settings } = data;
    
    if (!name || name.trim().length === 0) {
      throw new ValidationError('Group name is required');
    }

    if (name.length > 100) {
      throw new ValidationError('Group name must be less than 100 characters');
    }

    if (description && description.length > 500) {
      throw new ValidationError('Description must be less than 500 characters');
    }

    return {
      id: '', // Will be set in create method
      name: name.trim(),
      description: description?.trim(),
      createdBy: '', // Will be set in create method
      members: [],
      settings: settings || {
        allowAnonymousMoods: false,
        requireApprovalForJoins: false,
        moodVisibility: 'members-only',
        allowMemberInvites: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Group;
  }

  validateUpdate(data: Partial<Group>): Partial<Group> {
    const validated: Partial<Group> = {};

    if (data.name) {
      if (data.name.trim().length === 0) {
        throw new ValidationError('Group name cannot be empty');
      }
      if (data.name.length > 100) {
        throw new ValidationError('Group name must be less than 100 characters');
      }
      validated.name = data.name.trim();
    }

    if (data.description !== undefined) {
      if (data.description && data.description.length > 500) {
        throw new ValidationError('Description must be less than 500 characters');
      }
      validated.description = data.description?.trim();
    }

    if (data.settings) {
      validated.settings = data.settings;
    }

    validated.updatedAt = new Date();
    return validated;
  }

  async createGroup(data: Partial<Group>, createdBy: string): Promise<Group> {
    const validatedData = this.validateCreate(data);
    
    const newGroup = {
      ...validatedData,
      id: this.generateId(),
      createdBy,
      members: [createdBy], // Creator is automatically a member
    };

    this.data.push(newGroup);
    
    // Add creator as admin member
    await this.addMember(newGroup.id, createdBy, 'admin');
    
    await this.saveData();
    await this.saveMembers();
    
    return newGroup;
  }

  async findByUser(userId: string): Promise<Group[]> {
    const userGroups = this.data.filter(group => 
      group.members.includes(userId)
    );
    return userGroups;
  }

  async addMember(groupId: string, userId: string, role: 'admin' | 'member' = 'member'): Promise<boolean> {
    const group = await this.findById(groupId);
    if (!group) return false;

    // Check if user is already a member
    if (group.members.includes(userId)) return false;

    // Add to group members array
    group.members.push(userId);
    await this.update(groupId, { members: group.members });

    // Add to members table
    const member: GroupMember = {
      userId,
      groupId,
      role,
      joinedAt: new Date(),
    };
    this.members.push(member);
    await this.saveMembers();

    return true;
  }

  async removeMember(groupId: string, userId: string): Promise<boolean> {
    const group = await this.findById(groupId);
    if (!group) return false;

    // Don't allow removing the creator
    if (group.createdBy === userId) return false;

    // Remove from group members array
    group.members = group.members.filter(id => id !== userId);
    await this.update(groupId, { members: group.members });

    // Remove from members table
    this.members = this.members.filter(
      member => !(member.groupId === groupId && member.userId === userId)
    );
    await this.saveMembers();

    return true;
  }

  async getMembers(groupId: string): Promise<GroupWithMembers | null> {
    const group = await this.findById(groupId);
    if (!group) return null;

    const memberDetails = this.members
      .filter(member => member.groupId === groupId)
      .map(member => ({
        user: {
          id: member.userId,
          username: `user_${member.userId.slice(-6)}`, // Mock username
          firstName: `User`,
          lastName: member.userId.slice(-6),
        },
        role: member.role,
        joinedAt: member.joinedAt,
      }));

    return {
      ...group,
      memberDetails,
    };
  }

  async updateMemberRole(groupId: string, userId: string, role: 'admin' | 'member'): Promise<boolean> {
    const group = await this.findById(groupId);
    if (!group) return false;

    // Don't allow changing creator's role
    if (group.createdBy === userId) return false;

    const memberIndex = this.members.findIndex(
      member => member.groupId === groupId && member.userId === userId
    );

    if (memberIndex === -1) return false;

    this.members[memberIndex].role = role;
    await this.saveMembers();
    return true;
  }

  async isMember(groupId: string, userId: string): Promise<boolean> {
    const group = await this.findById(groupId);
    return group ? group.members.includes(userId) : false;
  }

  async isAdmin(groupId: string, userId: string): Promise<boolean> {
    const member = this.members.find(
      m => m.groupId === groupId && m.userId === userId
    );
    return member ? member.role === 'admin' : false;
  }

  async getGroupActivity(groupId: string): Promise<GroupActivity | null> {
    const group = await this.findById(groupId);
    if (!group) return null;

    // Mock activity data - in real implementation, this would query mood entries
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    return {
      groupId,
      groupName: group.name,
      recentMoods: Math.floor(Math.random() * 50), // Mock data
      newMembers: Math.floor(Math.random() * 5),
      activeMembers: Math.floor(Math.random() * group.members.length),
      lastActivity: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000),
    };
  }

  async getGroupMoodSummary(groupId: string, dateFrom: string, dateTo: string): Promise<GroupMoodSummary | null> {
    const group = await this.findById(groupId);
    if (!group) return null;

    // Mock summary data - in real implementation, this would aggregate mood data
    const totalMembers = group.members.length;
    const activeMembers = Math.floor(totalMembers * 0.7); // 70% active

    return {
      groupId,
      groupName: group.name,
      period: 'custom',
      dateFrom,
      dateTo,
      totalMembers,
      activeMembers,
      averageMoods: {
        energy: 3.2,
        happiness: 3.8,
        stress: 2.1,
        anxiety: 2.0,
        motivation: 3.5,
      },
      memberContributions: group.members.slice(0, activeMembers).map((userId, index) => ({
        userId,
        username: `user_${userId.slice(-6)}`,
        entries: Math.floor(Math.random() * 20),
        lastEntry: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      })),
    };
  }

  private async loadMembers(): Promise<void> {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const dataPath = path.join(process.cwd(), 'tmp', 'members.json');
      
      if (fs.existsSync(dataPath)) {
        const fileData = fs.readFileSync(dataPath, 'utf8');
        this.members = JSON.parse(fileData);
      }
    } catch (error) {
      console.warn('Could not load members data:', error);
      this.members = [];
    }
  }

  private async loadInvitations(): Promise<void> {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const dataPath = path.join(process.cwd(), 'tmp', 'invitations.json');
      
      if (fs.existsSync(dataPath)) {
        const fileData = fs.readFileSync(dataPath, 'utf8');
        this.invitations = JSON.parse(fileData);
      }
    } catch (error) {
      console.warn('Could not load invitations data:', error);
      this.invitations = [];
    }
  }

  private async saveMembers(): Promise<void> {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const tmpDir = path.join(process.cwd(), 'tmp');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      
      const dataPath = path.join(tmpDir, 'members.json');
      fs.writeFileSync(dataPath, JSON.stringify(this.members, null, 2));
    } catch (error) {
      console.warn('Could not save members data:', error);
    }
  }

  private async saveInvitations(): Promise<void> {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      const tmpDir = path.join(process.cwd(), 'tmp');
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }
      
      const dataPath = path.join(tmpDir, 'invitations.json');
      fs.writeFileSync(dataPath, JSON.stringify(this.invitations, null, 2));
    } catch (error) {
      console.warn('Could not save invitations data:', error);
    }
  }

  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Singleton instance
export const groupService = new GroupServiceImpl();
