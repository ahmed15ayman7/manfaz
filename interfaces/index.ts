export interface User {
    id: string;
    name: string;
    token: string;
    email: string;
    phone: string;
    password: string;
    imageUrl?: string;
    role: UserRole;
    verificationCode?: number;
    createdAt?: Date;
    updatedAt?: Date;
    Worker: Worker[];
    DeliveryDriver: DeliveryDriver[];
    Order: Order[];
    Wallet?: Wallet;
    locations: UserLocation[];
}

type UserRole = "user" | "store" | "worker";

export interface UserLocation {
    id: string;
    userId: string;
    user: User;
    name: string;
    address: string;
    apartment?: string;
    floor?: string;
    building?: string;
    street?: string;
    area?: string;
    city: string;
    latitude: number;
    longitude: number;
    isDefault: boolean;
    type: "home" | "work" | "club" | "hotel" | "school" | "party";
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServiceParameter {
    id: string;
    name: string;
    description?: string;
    imageUrl?: string;
    price: number;
    warranty?: number;
    installmentAvailable: boolean;
    installmentMonths?: number;
    monthlyInstallment?: number;
    serviceId: string;
    status: "active" | "inactive";
    sortOrder: number;
    rating?: number;
    ratingCount?: number;
    faqs?: Record<string, any>; // JSON field for FAQs
    whatIncluded?: Record<string, any>; // JSON field for included features
    createdAt: Date;
    updatedAt: Date;
}
export interface Category {
    id: string;
    name: string;
    subName?: string; // Optional field for subName
    slug: string;
    description?: string;
    info?: string; // Additional information
    price?: number;
    imageUrl?: string;
    type: "service" | "delivery"; // Enum for ServiceType
    status: "active" | "inactive" | "archived";
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    Service: Service[]; // Array of related services
    Store: Store[]; // Array of related stores
    WorkerCategory: WorkerCategory[]
}
export interface WorkerCategory {
    id: string;
    worker: Worker; // Array of related services
    category: Category; // Array of related stores
    workerId: string;
    categoryId: string;
}
export interface Service {
    id: string;
    name: string;
    slug: string;
    description?: string;
    subName?: string;
    categoryId: string;
    type: "service" | "delivery";
    subType?: "delivery_service" | "delivery_driver";
    price?: number;
    duration?: number;
    availability: boolean;
    imageUrl?: string;
    iconUrl?: string;
    rating: number;
    ratingCount: number;
    warranty?: number;
    installmentAvailable: boolean;
    installmentMonths?: number;
    monthlyInstallment?: number;
    createdAt: Date;
    updatedAt: Date;
    parameters: ServiceParameter[]; // Array of service parameters
}

export interface Store {
    id: string;
    name: string; // اسم المتجر
    description?: string; // وصف المتجر
    type: string; // التصنيف الرئيسي (مثل: مأكولات ومشروبات)
    logo?: string; // شعار المتجر
    coverImage?: string; // صورة الغلاف
    images: string[]; // صور إضافية للمتجر
    address: string; // عنوان المتجر
    locations: StoreLocation[]; // فروع المتجر
    phone?: string; // رقم الهاتف
    email?: string; // البريد الإلكتروني
    workingHours: StoreWorkingHours[];
    categoryId?: string;
    category?: Category;
    rating: number; // التقييم
    priceDriver?: number;
    reviewsCount: number; // عدد التقييمات
    isActive: boolean; // حالة المتجر
    status: "active" | "inactive" | "closed"; // حالة المتجر
    minOrderAmount?: number; // الحد الأدنى للطلب
    deliveryFee?: number; // رسوم التوصيل
    categories: StoreCategory[]; // تصنيفات المتجر الداخلية
    products: Product[]; // المنتجات
    offers: StoreOffer[]; // العروض
    orders: Order[]; // الطلبات
    createdAt: Date; // تاريخ الإنشاء
    updatedAt: Date; // آخر تحديث
    Coupon: Coupon[]; // الكوبونات
    Reward: Reward[]; // المكاف
    Discount: Discount[];
    GiftCard: GiftCard[]
    OrdersStore: OrdersStore[]

}
export interface OrdersStore {
    id: string;
    orderId: string;
    order?: Order;
    storeId: string;
    store?: Store;
    products: ProductsOrder[]
}
export interface ProductsOrder {
    id: string;
    orderId: string;
    orders?: OrdersStore;
    productId: string;
    product?: Product;
    quantity: number
}
export interface Order {
    id: string;
    userId: string;
    user?: User;
    serviceId: string;
    service?: Service;
    providerId: string;
    provider?: Worker;
    deliveryDriverId?: string;
    deliveryDriver?: DeliveryDriver;
    description?: string;
    imageUrl?: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    notes: string;
    price?: number;
    duration?: number;
    status: OrderStatus;
    totalAmount: number;
    paymentStatus: PaymentStatus;
    paymentMethod?: PaymentMethod;
    createdAt?: Date;
    updatedAt?: Date;
    store?: OrdersStore[];
    scheduleOrder?: ScheduleOrder
}
export type PaymentMethod = "cash" | "credit_card" | "tamara" | "tabby";
export type OrderStatus = "pending" | "in_progress" | "completed" | "canceled";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface Worker {
    id: string;
    userId: string;
    user?: User;
    title: string;
    description: string;
    isAvailable: boolean;
    isFavorite: boolean;
    hourlyRate: number;
    jobSuccessRate: number;
    totalEarned: number;
    skills: string[];
    rating: number;
    reviewsCount: number;
    createdAt: Date;
    updatedAt: Date;
    isVerified: boolean;
    totalJobsDone: number;
    about?: string;
    experiences: WorkExperience[];
    reviews: Review[];
    Order: Order[];
    earnings: Earning[];
    schedule: Schedule[];
    WorkerCategory: WorkerCategory[]
}
export interface Earning {
    id: string;
    amount: number;
    createdAt: Date;
    updatedAt: Date;
    worker: Worker;
    workerId: string;
}
// Enums
export enum StatusEnum {
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELED = "CANCELED",
}

export enum ShiftEnum {
    MORNING = "MORNING",
    EVENING = "EVENING",
    NIGHT = "NIGHT",
}

export enum WorkerTypeEnum {
    DRIVER = "DRIVER",
    TECHNICIAN = "TECHNICIAN",
    ELECTRICIAN = "ELECTRICIAN",
    PLUMBER = "PLUMBER",
    OTHER = "OTHER",
}

export enum PriorityEnum {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}
export interface ScheduleOrder {
    id: string;
    scheduleId: string;
    orderId: string;
    order: Order;
    schedule: Schedule;
    createdAt: Date;
    updatedAt: Date;
}

// Schedule Interface
export interface Schedule {
    id: string;
    workerId: string;
    scheduledTime: Date;
    date: Date;
    day: string; // e.g., "Monday", "Tuesday"
    shiftType: ShiftEnum;
    worker: Worker;
    location?: string;
    scheduleOrders: ScheduleOrder[]; // Array of Order IDs
    maxOrders: number;
    ordersCount: number;
    isFull: boolean;
    status: StatusEnum;
    priority: PriorityEnum;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkExperience {
    id: string;
    workerId: string;
    worker: Worker;
    title: string;
    company: string;
    duration: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Review {
    id: string;
    workerId: string;
    worker: Worker;
    userId: string;
    user: User;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface DeliveryDriver {
    id: string;
    userId: string;
    user?: User;
    vehicleType?: string;
    license?: string;
    availability: boolean;
    rating: number;
    reviewsCount: number;
    completedOrders: number;
    earnings: number;
    createdAt: Date;
    updatedAt: Date;
    orders: Order[];
}
export interface Wallet {
    id: string;
    userId: string;
    user?: User;
    balance: number;
    transactions: Transaction[];
    createdAt: Date;
    updatedAt: Date;
}
export interface Transaction {
    id: string;
    walletId: string;
    wallet?: Wallet;
    type: "deposit" | "withdrawal";
    amount: number;
    status: "pending" | "completed" | "failed";
    createdAt: Date;
    updatedAt: Date;
}

// موقع المتجر (فرع)
export interface StoreLocation {
    id: string;
    name: string; // اسم الفرع
    address: string; // العنوان
    latitude: number;
    longitude: number;
    phone?: string; // رقم الهاتف
}
export interface StoreOfferProduct {
    id: string;
    storeOfferId: string;
    storeOffer: StoreOffer;
    productId: string;
    product: Product;
}
// العروض الخاصة بالمتجر
export interface StoreOffer {
    id: string
    storeId: string
    store: Store
    name: string // اسم العرض
    description?: string // وصف العرض
    type: string // نوع العرض (مثل: عروض رمضان، عروض اللمة)
    image?: string // صورة العرض
    startDate?: Date // تاريخ بداية العرض
    endDate?: Date // تاريخ نهاية العرض
    discount?: Number // قيمة الخصم
    isActive: Boolean
    products: StoreOfferProduct[] // المنتجات التي يطبق عليها العرض
    createdAt: Date
    updatedAt: Date
}

// أوقات العمل
export interface StoreWorkingHours {
    id: string;
    storeId: string;
    store: Store;
    dayOfWeek: number; // 0 for Sunday, 1 for Monday, etc.
    isOpen: boolean;
    openTime: string; // Format: "HH:mm"
    closeTime: string; // Format: "HH:mm"
    breakStart?: string; // Optional: Break start time
    breakEnd?: string; // Optional: Break end time
    isSpecialDay: boolean; // If it's a special holiday or occasion
    specialDate?: Date; // Date of the special day
    note?: string; // Additional notes
    createdAt: Date;
    updatedAt: Date;
}


// تصنيفات داخل المتجر
export interface StoreCategory {
    id: string;
    name: string; // اسم التصنيف
    description?: string;
    image?: string;
    isActive: boolean;
    sortOrder: number;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}

// المنتج داخل المتجر
export interface Product {
    id: string;
    name: string; // اسم المنتج
    description?: string;
    price: number; // سعر المنتج
    discountPrice?: number; // السعر بعد الخصم
    salePrice?: number; // السعر بعد التخفيض
    storeId: string; // المتجر التابع له المنتج
    store?: Store;
    images: string[]; // صور المنتج
    categoryId: string; // التصنيف التابع له المنتج
    category?: StoreCategory;
    stock: number; // الكمية المتاحة
    isAvailable: boolean; // متاح أم لا
    ingredients?: string[]; // المكونات
    extras?: Json; // الإضافات
    ProductsOrder: ProductsOrder[]
    rating: number; // التقييم
    reviewsCount: number; // عدد التقييمات
    createdAt: Date;
    updatedAt: Date;
    StoreOfferProduct: StoreOfferProduct[];
}
type Json = {
    [key: string]: Json | Json[]
}
// الكوبونات (كود خصم)
export interface Coupon {
    id: string;
    code: string; // كود الخصم
    discountPercentage?: number; // نسبة الخصم
    discountAmount?: number; // قيمة الخصم
    minOrderAmount?: number; // الحد الأدنى للطلب لاستخدام الكوبون
    maxDiscount?: number; // الحد الأقصى للخصم
    expiryDate: Date; // تاريخ الانتهاء
    isActive: boolean;
}

// الخصومات
export interface Discount {
    id: string;
    productId: string; // المنتج الذي ينطبق عليه الخصم
    percentage?: number; // نسبة الخصم
    amount?: number; // قيمة الخصم
    startDate: Date;
    endDate: Date;
    isActive: boolean;
}

// بطاقة الهدايا
export interface GiftCard {
    id: string;
    code: string; // كود البطاقة
    amount: number; // القيمة المالية للبطاقة
    expiryDate: Date; // تاريخ الانتهاء
    isRedeemed: boolean; // هل تم استخدامها
}

// المكافآت
export interface Reward {
    id: string;
    userId: string; // المستخدم المستفيد
    points: number; // النقاط المكتسبة
    description?: string; // وصف المكافأة
    createdAt: Date;
}
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType
    relatedId: string;
    senderId: string;
    orderId: string;
    isRead: boolean;
    createdAt: Date;
    updatedAt: Date;

    // العلاقات الاختيارية مع النماذج المختلفة
    user?: User
    sender?: User
    order?: Order
}

export enum NotificationType {
    user,
    employee,
    worker
}
