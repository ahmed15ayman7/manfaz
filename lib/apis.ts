import { BASE_URL } from './config';
const appendQueryParams = (url: string, params: Record<string, any> = {}, isBaseUrl = true) => {
  const query = new URLSearchParams(params).toString();
  return query ? `${isBaseUrl ? BASE_URL : ''}${url}?${query}` : `${isBaseUrl ? BASE_URL : ''}${url}`;
};
const API_ENDPOINTS = {
  auth: {
    register: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/auth-admin/register', params, isBaseUrl),
    login: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/auth-admin/login', params, isBaseUrl),
    changePassword: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/auth-admin/change-password', params, isBaseUrl),
    resendVerificationCode: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/auth-admin/resend-verification-code', params, isBaseUrl),
    verifyAccount: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/auth-admin/verify-account', params, isBaseUrl),
    refreshToken: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/auth-admin/refresh', params, isBaseUrl),
    deleteAccount: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/auth-admin/delete-account', params, isBaseUrl),
  },
  users: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/users', params, isBaseUrl),
    getById: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/users/${id}`, params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/users/${id}`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/users/${id}`, params, isBaseUrl),
  },
  categories: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/categories', params, isBaseUrl),
    create: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/categories', params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/categories/${id}`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/categories/${id}`, params, isBaseUrl),
  },
  services: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/services', params, isBaseUrl),
    create: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/services', params, isBaseUrl),
    getById: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/services/${id}`, params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/services/${id}`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/services/${id}`, params, isBaseUrl),
  },
  serviceParameters: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/service-parameters', params, isBaseUrl),
    create: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/service-parameters', params, isBaseUrl),
    getById: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/service-parameters/${id}`, params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/service-parameters/${id}`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/service-parameters/${id}`, params, isBaseUrl),
  },
  workers: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/workers', params, isBaseUrl),
    create: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/workers', params, isBaseUrl),
    getById: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/workers/${id}`, params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/workers/${id}`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/workers/${id}`, params, isBaseUrl),
    reviews: {
      getAll: (workerId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/workers/${workerId}/reviews`, params, isBaseUrl),
      create: (workerId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/workers/${workerId}/reviews`, params, isBaseUrl),
      update: (workerId: string, id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/workers/${workerId}/reviews/${id}`, params, isBaseUrl),
      delete: (workerId: string, id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/workers/${workerId}/reviews/${id}`, params, isBaseUrl),
    },
  },
  deliveryDrivers: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/delivery-drivers', params, isBaseUrl),
    getById: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/delivery-drivers/${id}`, params, isBaseUrl),
    create: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/delivery-drivers', params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/delivery-drivers/${id}`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/delivery-drivers/${id}`, params, isBaseUrl),
  },
  orders: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/orders', params, isBaseUrl),
    create: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/orders', params, isBaseUrl),
    getById: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/orders/${id}`, params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/orders/${id}`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/orders/${id}`, params, isBaseUrl),
  },
  stores: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/stores', params, isBaseUrl),
    getById: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${id}`, params, isBaseUrl),
    create: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/stores', params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${id}`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${id}`, params, isBaseUrl),
    categories: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/categories`, params, isBaseUrl),
    products: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/products`, params, isBaseUrl),
    product: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/products/${id}`, params, isBaseUrl),
    offers: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/offers`, params, isBaseUrl),
    locations: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/locations`, params, isBaseUrl),
    discounts: {
      getAll: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/discounts`, params, isBaseUrl),
      create: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/discounts`, params, isBaseUrl),
      update: (storeId: string, id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/discounts/${id}`, params, isBaseUrl),
      delete: (storeId: string, id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/discounts/${id}`, params, isBaseUrl),
    },
    coupons: {
      getAll: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/coupons`, params, isBaseUrl),
      create: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/coupons`, params, isBaseUrl),
      update: (storeId: string, id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/coupons/${id}`, params, isBaseUrl),
      delete: (storeId: string, id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/coupons/${id}`, params, isBaseUrl),
      validate: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/coupons/validate`, params, isBaseUrl),
    },
    giftCards: {
      create: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/gift-cards`, params, isBaseUrl),
      getAll: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/gift-cards`, params, isBaseUrl),
      checkBalance: (code: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/gift-cards/${code}/balance`, params, isBaseUrl),
      redeem: (code: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/gift-cards/${code}/redeem`, params, isBaseUrl),
    },
    rewards: {
      create: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/rewards', params, isBaseUrl),
      getAll: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/rewards`, params, isBaseUrl),
      redeem: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/rewards/${id}/redeem`, params, isBaseUrl),
      getUserRewards: (userId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/users/${userId}/rewards`, params, isBaseUrl),
      update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/rewards/${id}`, params, isBaseUrl),
      delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/rewards/${id}`, params, isBaseUrl),
    },
    workingHours: {
      get: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/working-hours`, params, isBaseUrl),
      set: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/working-hours`, params, isBaseUrl),
      update: (storeId: string, day: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/working-hours/${day}`, params, isBaseUrl),
      addSpecialDay: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/special-days`, params, isBaseUrl),
      deleteSpecialDay: (storeId: string, id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/special-days/${id}`, params, isBaseUrl),
      checkOpen: (storeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/${storeId}/check-open`, params, isBaseUrl),
    },
  },
  offers: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/stores/offers/all', params, isBaseUrl),
    findOne: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/stores/offers/one/${id}`, params, isBaseUrl),
  },
  userLocations: {
    getAll: (userId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/locations/${userId}`, params, isBaseUrl),
    create: (userId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/locations/${userId}`, params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/locations/${id}`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/locations/${id}`, params, isBaseUrl),
    setDefault: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/locations/${id}/set-default`, params, isBaseUrl),
  },
  employees: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/employees', params, isBaseUrl),
    getById: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/employees/${id}`, params, isBaseUrl),
    create: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/employees', params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/employees/${id}`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/employees/${id}`, params, isBaseUrl),
    updatePermissions: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/employees/${id}/permissions`, params, isBaseUrl),
    updateRole: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/employees/${id}/role`, params, isBaseUrl),
    toggleActive: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/employees/${id}/toggle-active`, params, isBaseUrl),
  },
  employeeActivities: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/employee-activities', params, isBaseUrl),
    getByEmployee: (employeeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/employee-activities/employees/${employeeId}`, params, isBaseUrl),
    getAuditLogs: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/employee-activities/audit-logs', params, isBaseUrl),
  },
  reports: {
    getDashboardStats: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/reports/dashboard', params, isBaseUrl),
    getSalesReport: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/reports/sales', params, isBaseUrl),
    getRevenueReport: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/reports/revenue', params, isBaseUrl),
    getEmployeePerformance: (employeeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/reports/employees/${employeeId}/performance`, params, isBaseUrl),
    getEmployeeActivities: (employeeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/reports/employees/${employeeId}/activities`, params, isBaseUrl),
    exportToExcel: (reportType: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/reports/export/${reportType}`, params, isBaseUrl),
    exportToPDF: (reportType: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/reports/export/${reportType}/pdf`, params, isBaseUrl),
  },
  settings: {
    get: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/settings', params, isBaseUrl),
    update: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/settings', params, isBaseUrl),
    backup: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/settings/backup', params, isBaseUrl),
    restore: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/settings/restore', params, isBaseUrl),
  },
  wallets: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/wallets', params, isBaseUrl),
    getById: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/wallets/${id}`, params, isBaseUrl),
    getByUserId: (userId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/wallets/${userId}/user`, params, isBaseUrl),
    create: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/wallets', params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/wallets/${id}`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/wallets/${id}`, params, isBaseUrl),
    transactions: {
      getAll: (walletId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/wallets/${walletId}/transactions`, params, isBaseUrl),
      create: (walletId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/wallets/${walletId}/transactions`, params, isBaseUrl),
      update: (walletId: string, id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/wallets/${walletId}/transactions/${id}`, params, isBaseUrl),
      delete: (walletId: string, id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/wallets/${walletId}/transactions/${id}`, params, isBaseUrl),
    },
  },
  notifications: {
    getAll: (type: string, id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/notifications/${type}/${id}`, params, isBaseUrl),
    markAsRead: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/notifications/${id}/mark-as-read`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/notifications/${id}`, params, isBaseUrl),
  },
  payments: {
    wallet: {
      deposit: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/payments/wallet/deposit', params, isBaseUrl),
      withdraw: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/payments/wallet/withdraw', params, isBaseUrl),
      getTransactions: (walletId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/wallets/${walletId}/transactions/user`, params, isBaseUrl),
    },
    worker: {
      payout: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/payments/worker/payout', params, isBaseUrl),
      checkPayoutStatus: (payoutId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/payments/worker/payout/${payoutId}`, params, isBaseUrl),
    },
    tap: {
      createCharge: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/payments/charges', params, isBaseUrl),
      getCharge: (chargeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/payments/charges/${chargeId}`, params, isBaseUrl),
      refundCharge: (chargeId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/payments/charges/${chargeId}/refunds`, params, isBaseUrl),
      createPayout: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/payments/payouts', params, isBaseUrl),
      getPayout: (payoutId: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/payments/payouts/${payoutId}`, params, isBaseUrl),
      handleCallback: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/payments/callback', params, isBaseUrl),
    },
  },
  posts: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/posts', params, isBaseUrl),
    getById: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/posts/${id}`, params, isBaseUrl),
    create: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/posts', params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/posts/${id}`, params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/posts/${id}`, params, isBaseUrl),
  },
  support: {
    contact: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/support/contact', params, isBaseUrl),
  },
  ratings: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/ratings', params, isBaseUrl),
  },
  notes: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/notes', params, isBaseUrl),
    create: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/notes', params, isBaseUrl),
    delete: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/notes/${id}`, params, isBaseUrl),
    update: (id: string, params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams(`/notes/${id}`, params, isBaseUrl),
  },
  coupons: {
    getAll: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/coupons', params, isBaseUrl),
    apply: (params: Record<string, any>, isBaseUrl: boolean = true) => appendQueryParams('/coupons/apply', params, isBaseUrl),
  },
};

export default API_ENDPOINTS;

// أنواع البيانات للمدفوعات
export interface TapChargeRequest {
  amount: number;
  currency: string;
  description: string;
  customer: {
    first_name: string;
    email: string;
    phone: string;
  };
  source: {
    id: string;
  };
  redirect: {
    url: string;
  };
  reference: {
    transaction: string;
    order: string;
  };
}

export interface TapPayoutRequest {
  amount: number;
  currency: string;
  description: string;
  beneficiary: {
    name: string;
    account_number: string;
    bank_name: string;
    bank_code: string;
    country: string;
    currency: string;
  };
  reference: {
    transaction: string;
    order: string;
  };
}

export interface TapCallbackResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  description: string;
  reference: {
    transaction: string;
    order: string;
  };
}
