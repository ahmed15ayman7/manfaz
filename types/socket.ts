export interface Order {
  id: string;
  status: string;
  type: 'service' | 'delivery';
}

export interface Reward {
  id: string;
  title: string;
  description?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
}

export interface Location {
  id: string;
  name: string;
  isDefault: boolean;
}

export interface Worker {
  id: string;
  name: string;
  rating?: number;
  earnings?: number;
}

// أنواع الأحداث للمستخدم العادي
export interface UserEvents {
  'walletUpdated': { balance: number; transaction: Transaction };
  'newReward': Reward;
  'rewardRedeemed': Reward;
  'rewardDeleted': { id: string; type: string };
  'orderCreated': Order;
  'orderUpdated': Order;
  'orderCompleted': Order;
  'newLocation': Location;
  'defaultLocationChanged': Location;
  'passwordChanged': { timestamp: number };
  'verificationCodeResent': { timestamp: number };
  'accountVerified': { timestamp: number };
}

// أنواع الأحداث للعامل
export interface WorkerEvents {
  'newOrder': { type: string; order: Order };
  'orderUpdated': Order;
  'newReview': Review;
  'earningsUpdated': { totalEarned: number };
  'profileUpdated': Worker;
  'scheduleUpdated': { workerId: string; schedule: any };
} 