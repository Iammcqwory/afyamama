
export enum Sender {
  User = 'user',
  AI = 'ai',
  Warning = 'warning',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  reactions?: Record<string, number>;
  imageUrl?: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role?: 'mother' | 'father' | 'guardian' | 'helper' | 'healthcare_worker' | 'other';
  familyType?: 'single_parent' | 'couple' | 'kinship' | 'orphan_hub';
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface Village {
  id: string;
  name: string;
  description: string;
  type: 'dueDate' | 'region' | 'topic' | 'role' | 'kinship';
  memberCount: number;
}

export interface VillageMessage {
  id: string;
  villageId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  text: string;
  timestamp: number;
}
