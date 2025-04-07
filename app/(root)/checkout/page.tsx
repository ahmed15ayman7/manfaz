"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import useCartStore from "@/store/useCartStore";
import { useState, useEffect, Suspense } from "react";
import { IconCash, IconClock, IconCreditCard, IconMedal, IconPlus, IconStar, IconTrophy, IconWallet } from "@tabler/icons-react";
import { useQueries, useQuery, useMutation } from "@tanstack/react-query";
import useStore from "@/store/useLanguageStore";
import LoadingComponent from "@/components/shared/LoadingComponent";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
// import PhoneInput from 'react-phone-input-2'
// import "react-phone-input-2/lib/style.css"
import { Select, MenuItem, SelectChangeEvent, Box, Typography, Chip, Divider, Card, Grid, Avatar, CardContent, Rating, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from "@mui/material";
import { createOrder } from "@/lib/actions/orders.actions";
import { OrdersStore, PaymentMethod, Service, ServiceParameter, Store, UserLocation, Worker } from "@/interfaces";
import axiosInstance from "@/lib/axios";
import API_ENDPOINTS from "@/lib/apis";
import { SkeletonLoader } from "@/components/shared/skeleton-loader";
import { motion } from "framer-motion";
import { calculateDistance } from "@/lib/utils";
import WorkerCard from "@/components/cards/WorkerCard";
import Image from "next/image";


// Helper to detect card type
const getCardType = (number: string) => {
  if (/^4/.test(number)) return "visa";
  if (/^5[1-5]/.test(number)) return "mastercard";
  return "default";
};

// Helper to format card number
const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "") // remove non-digits
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
const getWorker = async ({ id, locale }: { id: string; locale: string }) => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.workers.getById(id, { lang: locale })
  );
  return res.data.data as Worker;
};
const getServiceParameter = async ({
  id,
  locale,
  type,
}: {
  id: string;
  locale: string;
  type: string;
}) => {
  const res =
    type === "serviceParameter"
      ? await axiosInstance.get(
        API_ENDPOINTS.serviceParameters.getById(id, { lang: locale })
      )
      : await axiosInstance.get(
        API_ENDPOINTS.services.getById(id, { lang: locale })
      );
  return res.data.data;
};

const getService = async ({
  id,
  locale,
  type,
}: {
  id: string;
  locale: string;
  type: string;
}) => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.stores.product(id, { lang: locale, type })
  );
  return res.data.data;
};
const getUserLocations = async ({
  id,
  locale,
}: {
  id: string;
  locale: string;
}) => {
  const res = await axiosInstance.get(
    API_ENDPOINTS.userLocations.getAll(id, { lang: locale }, false)
  );
  return res.data.data;
};

function CheckoutPage() {
  const router = useRouter();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const parameterId = searchParams.get("parameterId");
  const serviceId = searchParams.get("serviceId");
  const workerId = searchParams.get("workerId");

  const { items, removeItem, clearCart } = useCartStore();
  const { locale } = useStore();
  const [focusPhone, setFocusPhone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [selectedServiceId, setSelectedServiceId] = useState(
    {} as (typeof items)[0]
  );
  const [formData, setFormData] = useState({
    locationId: "",
    latitude: 0,
    longitude: 0,
    address: "",
    notes: "",
    serviceId: items[0]?.id || "",
    providerId: "",
    store: [
      {
        id: "",
        storeId: "",
        orderId: "",
        store: {},
        order: {},
        products: [
          {
            id: "",
            product: {},
            productId: "",
            orders: {},
            orderId: "",
            quantity: 0,
          },
        ],
      },
    ] as OrdersStore[],
    price: 0,
    totalAmount: 0,
  });

  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    name: "",
  });

  const handleAddressChange = (
    event: SelectChangeEvent<string>,
    id: string | undefined
  ) => {
    const selectedAddress = event.target.value;
    if (selectedAddress === "new") {
      router.push(`/user-locations/${id || ""}`);
    } else {
      let location = locations?.find(
        (location) => location.id === selectedAddress
      );
      setFormData((prev) => ({
        ...prev,
        locationId: location?.id || "",
        latitude: location?.latitude || 0,
        longitude: location?.longitude || 0,
        address: location?.address || "",
      }));
    }
  };

  const handleServiceSelect = (item: any) => {
    setSelectedServiceId(item);
    setFormData((prev) => ({ ...prev, serviceId: item.id }));
  };
  let { data: worker, isLoading: workerLoading } = useQuery({
    queryKey: [locale, "worker", serviceId, workerId],
    queryFn: () => getWorker({ id: workerId || "", locale }),
  });
  let { data: service, isLoading: serviceLoading } = useQuery({
    queryKey: [locale, "service", serviceId],
    queryFn: () =>
      getServiceParameter({ id: serviceId || "", locale, type: "service" }),
  });
  let { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: [locale, "services", parameterId],
    queryFn: () =>
      getServiceParameter({
        id: parameterId || "",
        locale,
        type: "serviceParameter",
      }),
  });
  const MotionCard = motion(Card);
  // Use useQueries instead of mapping over items with individual useQuery hooks
  const itemQueries = useQueries({
    queries:
      items?.map((item) => ({
        queryKey: [item?.type, item?.id, locale],
        queryFn: () =>
          item?.type === "service"
            ? getServiceParameter({
              id: item?.id,
              locale,
              type: "serviceParameter",
            })
            : getService({ id: item?.id, locale, type: "delivery" }),
        enabled: !!item?.id && !!locale,
      })) || [],
  });
  let { data: userData, status } = useSession();

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])
  const isLoading = itemQueries?.some((query) => query?.isLoading);
  const isError = itemQueries?.some((query) => query?.isError);
  const { data: locations, isLoading: locationsLoading } = useQuery<
    UserLocation[]
  >({
    queryKey: [locale, "location", userData?.user?.locations[0]?.id],
    queryFn: () => getUserLocations({ id: userData?.user?.id || "", locale }),
  });
  let [distance, setDistance] = useState<number | null>(null)
  useEffect(() => {
    if (userLocation) {
      setDistance(userLocation && worker?.user?.locations?.[0] ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        worker.user.locations[0].latitude,
        worker.user.locations[0].longitude
      ) : null)
      setFormData((prev) => ({
        ...prev,
        totalAmount: service?.price || 0,
      }))
    }
  }, [worker, userLocation, service])
  useEffect(() => {
    setSelectedServiceId(items[0]);
    if (status !== "loading" && userData && userData?.user) {
      setFormData({
        locationId: locations?.[0]?.id || "",
        store: itemQueries
          ?.map((query) => {
            return query?.data?.type
              ? null
              : {
                id: "",
                storeId: query?.data?.storeId || "",
                store: {},
                order: {},
                orderId: "",
                products: items
                  .filter(
                    (item) =>
                      item?.type === "delivery" &&
                      item?.id === query?.data?.id
                  )
                  .map((item) => ({
                    id: "",
                    orders: {},
                    orderId: "",
                    product: {},
                    productId: item?.id || "",
                    quantity: item?.quantity || 0,
                  })),
              };
          })
          .filter((item) => item !== null) as OrdersStore[],
        latitude: 0,
        longitude: 0,
        address: "",
        notes: "",
        serviceId: items[0]?.id || "",
        providerId: "", // Assuming providerId will be set later
        price: service && !workerLoading && !serviceLoading && !servicesLoading && workerId && serviceId && parameterId ? service?.price || 0 : getTotalPrice(),
        totalAmount: service && !workerLoading && !serviceLoading && !servicesLoading && workerId && serviceId && parameterId ? service?.price || 0 : getTotalPrice(),
      });
    }
  }, [status, userData, items, itemQueries, service]);

  const getTotalPrice = () => {
    return (
      itemQueries?.reduce(
        (total, query) => total + (query?.data?.price || 0),
        0
      ) || 0
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentDialogOpen = () => {
    setOpenPaymentDialog(true);
    setPaymentError("");
  };

  const handlePaymentDialogClose = () => {
    setOpenPaymentDialog(false);
    setPaymentError("");
  };

  const createTapChargeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await axiosInstance.post(
        API_ENDPOINTS.payments.tap.createCharge({}, true),
        data
      );
      return response.data;
    },
  });

  // إضافة دوال التحقق من صحة البيانات
  const validateCardNumber = (number: string) => {
    // التحقق من رقم البطاقة باستخدام خوارزمية Luhn
    const digits = number.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validateExpiryDate = (month: string, year: string) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    const expYear = parseInt(`20${year}`);

    if (expMonth < 1 || expMonth > 12) return false;
    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;

    return true;
  };

  const validateCVC = (cvc: string) => {
    const digits = cvc.replace(/\D/g, '');
    return digits.length >= 3 && digits.length <= 4;
  };

  const validateLocation = (latitude: number, longitude: number) => {
    // التحقق من صحة الإحداثيات
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  };

  const validateAmount = (amount: number) => {
    return amount > 0 && amount <= 100000; // مثال للحد الأقصى
  };

  // تحديث handleCardPayment
  const handleCardPayment = async () => {
    try {
      setPaymentLoading(true);
      setPaymentError("");

      // التحقق من صحة بيانات البطاقة
      if (!validateCardNumber(cardDetails.number)) {
        setPaymentError(t("payment.invalid_card_number"));
        return;
      }

      if (!validateExpiryDate(cardDetails.expiryMonth, cardDetails.expiryYear)) {
        setPaymentError(t("payment.invalid_expiry_date"));
        return;
      }

      if (!validateCVC(cardDetails.cvc)) {
        setPaymentError(t("payment.invalid_cvc"));
        return;
      }

      if (!cardDetails.name.trim()) {
        setPaymentError(t("payment.name_required"));
        return;
      }

      // التحقق من صحة المبلغ
      if (!validateAmount(formData.totalAmount)) {
        setPaymentError(t("payment.invalid_amount"));
        return;
      }

      const chargeData = {
        amount: formData.totalAmount,
        currency: "SAR",
        description: "Payment for services",
        customer: {
          first_name: userData?.user?.name,
          email: userData?.user?.email,
          phone: userData?.user?.phone,
        },
        source: {
          number: cardDetails.number.replace(/\s/g, ''),
          exp_month: cardDetails.expiryMonth,
          exp_year: cardDetails.expiryYear,
          cvc: cardDetails.cvc,
          name: cardDetails.name,
        },
        redirect: {
          url: window.location.origin + "/payment-callback",
        },
        reference: {
          transaction: "txn_" + Date.now(),
          order: "ord_" + Date.now(),
        },
      };

      const result = await createTapChargeMutation.mutateAsync(chargeData);

      if (result.status === "success") {
        // إنشاء الطلب بعد نجاح الدفع
        await handleSubmit();
        handlePaymentDialogClose();
        router.push("/orders");
      } else {

        setPaymentError(t("payment.failed"));
      }
    } catch (error: any) {
      console.log(error)
      setPaymentError(error.message || t("payment.failed"));
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (paymentMethod === "credit_card") {
      handlePaymentDialogOpen();
      return;
    }

    try {
      if (userData?.user?.id) {
        const response = await createOrder(
          {
            paymentMethod,
            latitude: formData.latitude,
            longitude: formData.longitude,
            address: formData.address,
            notes: formData.notes,
            serviceId: parameterId || "",
            price: formData.price,
            totalAmount: formData.totalAmount,
            userId: userData?.user?.id,
            status: "pending",
            paymentStatus: "pending",
            id: "",
            providerId: workerId || "",
            store: formData.store,
          },
          workerId ? "service" : selectedServiceId.type
        );
        if (response.status) {
          removeItem(formData.serviceId);
          router.push(`/orders`);
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  if (!items?.length && !workerId) {
    return (
      <div className=" mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">{t("checkout.empty_cart")}</h1>
        <p className="text-gray-600 mb-6">{t("checkout.empty_cart_message")}</p>
        <button
          onClick={() => router.push("/")}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
        >
          {t("checkout.browse_services")}
        </button>
      </div>
    );
  }

  if (isLoading || status === "loading") {
    return <LoadingComponent />;
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500">Error loading service details</p>
      </div>
    );
  }
  return (
    <>
      <div className=" mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">{t("checkout.title")}</h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2 space-y-6">
            {!workerLoading && !serviceLoading && !servicesLoading && workerId && serviceId && parameterId && <WorkerCard worker={worker!} distance={distance || 0} isRow />}
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                {t("checkout.contact_info")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t("checkout.phone")}
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    {t("checkout.address")}
                  </label>
                  <Select
                    value={formData.locationId}
                    onChange={(e) => handleAddressChange(e, userData?.user?.id)}
                    // displayEmpty
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {!locationsLoading &&
                      locations?.map((location, index) => (
                        <MenuItem key={index} value={location.id}>
                          {location.address}
                        </MenuItem>
                      ))}
                    <MenuItem value="new">
                      <IconPlus /> {t("checkout.add_new_address")}
                    </MenuItem>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">
                    {t("checkout.notes")}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">
                {t("checkout.payment_method")}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`flex items-center gap-3 p-4 border rounded-lg ${paymentMethod === "cash" ? "border-primary bg-primary/5" : ""
                    }`}
                >
                  <IconCash className="text-primary" size={24} />
                  <span>{t("checkout.cash")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`flex items-center gap-3 p-4 border rounded-lg ${paymentMethod === "credit_card"
                    ? "border-primary bg-primary/5"
                    : ""
                    }`}
                >
                  <IconCreditCard className="text-primary" size={24} />
                  <span>{t("checkout.card")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("tabby")}
                  className={`flex items-center gap-3 p-4 border rounded-lg ${paymentMethod === "tabby" ? "border-primary bg-primary/5" : ""
                    }`}
                >
                  <img src="/imgs/tabby.png" alt="Tabby" className="w-10 h-6" />
                  <span>{t("checkout.tabby")}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("tamara")}
                  className={`flex items-center gap-2 p-4 border rounded-lg ${paymentMethod === "tamara"
                    ? "border-primary bg-primary/5"
                    : ""
                    }`}
                >
                  <img src="/imgs/tamara.png" alt="Tamara" className="w-10 h-6" />
                  <span>{t("checkout.tamara")}</span>
                </button>
              </div>
            </div>

            {/* Cart Items */}
            {!workerLoading && !serviceLoading && !servicesLoading && workerId && serviceId && parameterId ? null : (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  {t("checkout.order_summary")}
                </h2>
                <div className="space-y-4 mb-4">
                  {items?.map((item, index) => {
                    const query = itemQueries[index];
                    const itemData = query?.data;

                    return (
                      <div
                        key={item?.id}
                        style={{
                          backgroundColor:
                            selectedServiceId?.id === item?.id ? "#5A9CFF50" : "",
                        }}
                        className={`flex p-2  items-center gap-4 border-b pb-4  cursor-pointer border ${selectedServiceId?.id === item?.id
                          ? "  border-primary  rounded-lg"
                          : "last:border-transparent "
                          }`}
                        onClick={() => handleServiceSelect(item)}
                      >
                        {itemData?.imageUrl ||
                          (itemData?.images?.[0] && (
                            <img
                              src={itemData?.imageUrl || itemData?.images?.[0]}
                              alt={itemData.name}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          ))}
                        <div className="flex-1">
                          <h3 className="font-medium">{itemData?.name}</h3>
                          {itemData?.name && (
                            <p className="text-sm text-gray-600">
                              {itemData.name}
                            </p>
                          )}
                          <p className="text-primary font-medium mt-1">
                            {item.quantity} - {itemData?.price}{" "}
                            {t("home_service_details_view.price")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item?.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="">
            {!workerLoading && !serviceLoading && !servicesLoading && workerId && serviceId && parameterId ? (
              <Box className="mb-3">
                <Grid container spacing={4}>
                  {/* Service Details */}
                  <Grid item xs={12}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-white"
                    >
                      <Box className="relative bg-white h-48">
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                        <Box className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <Box className="absolute bottom-4 left-4 text-white">
                          <Typography variant="h4">{service.name}</Typography>
                          <Box className="flex items-center gap-2">
                            <Rating value={service.rating} readOnly precision={0.1} size="small" />
                            <Typography variant="body2">
                              ({service.ratingCount} ratings)
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item xs={6}>
                            <Box className="flex items-center gap-2">
                              <IconClock className="text-blue-600" />
                              <div>
                                <Typography variant="body2" color="textSecondary">
                                  Duration
                                </Typography>
                                <Typography variant="h6">
                                  {service.duration} min
                                </Typography>
                              </div>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box className="flex items-center gap-2">
                              <IconMedal className="text-purple-600" />
                              <div>
                                <Typography variant="body2" color="textSecondary">
                                  Warranty
                                </Typography>
                                <Typography variant="h6">
                                  {service.warranty} months
                                </Typography>
                              </div>
                            </Box>
                          </Grid>
                        </Grid>
                        <Divider className="my-4" />
                        <Typography variant="body1" className="mb-4">
                          {service.description}
                        </Typography>
                        <Box className="flex items-center justify-between">
                          <Typography variant="h4" color="primary">
                            {service.price} {t("home_service_details_view.price")}
                          </Typography>
                          <Chip
                            icon={<IconStar size={16} />}
                            label={`${service.rating} Rating`}
                            color="primary"
                          />
                        </Box>
                      </CardContent>
                    </motion.div>
                  </Grid>
                </Grid>
              </Box>
            ) : null}
            <div className="bg-white rounded-lg p-6 shadow-sm h-fit">

              <h2 className="text-xl font-semibold mb-4">
                {t("checkout.order_summary")}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">
                    {t("checkout.services_count", {
                      count: workerId ? 1 : items?.length,
                    })}
                  </span>
                  <span>{workerId ? 1 : items?.length}</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span>{t("checkout.total_amount")}</span>
                  <span>
                    {formData.totalAmount} {t("home_service_details_view.price")}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-600 transition-colors"
              >
                {t("checkout.confirm_order")}
              </button>
            </div>
          </div>
        </form>
      </div>

      <Dialog open={openPaymentDialog} onClose={handlePaymentDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle className="flex items-center justify-between">
          {t("payment.card_details")}
          <div className="w-10 h-6 relative">
            <Image
              src={
                getCardType(cardDetails.number) === "visa"
                  ? "/imgs/visa.png"
                  : getCardType(cardDetails.number) === "mastercard"
                    ? "/imgs/mastercard.png"
                    : "/imgs/default.png"
              }
              alt="Card Type"
              fill
              className="object-contain"
            />
          </div>
        </DialogTitle>

        <DialogContent>
          <div className="space-y-4 mt-2">
            {paymentError && <div className="text-red-500">{paymentError}</div>}

            <TextField
              fullWidth
              label={t("payment.card_number")}
              value={cardDetails.number}
              onChange={(e) =>
                setCardDetails({
                  ...cardDetails,
                  number: formatCardNumber(e.target.value),
                })
              }
              inputProps={{ maxLength: 19 }}
            />

            <div className="grid grid-cols-2 gap-4">
              <TextField
                label={t("payment.expiry_month")}
                value={cardDetails.expiryMonth}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, expiryMonth: e.target.value })
                }
                placeholder="MM"
              />
              <TextField
                label={t("payment.expiry_year")}
                value={cardDetails.expiryYear}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, expiryYear: e.target.value })
                }
                placeholder="YY"
              />
            </div>

            <TextField
              fullWidth
              label={t("payment.cvc")}
              value={cardDetails.cvc}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, cvc: e.target.value })
              }
              inputProps={{ maxLength: 4 }}
            />

            <TextField
              fullWidth
              label={t("payment.name_on_card")}
              value={cardDetails.name}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, name: e.target.value })
              }
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handlePaymentDialogClose} disabled={paymentLoading}>
            {t("common.cancel")}
          </Button>
          <Button
            onClick={handleCardPayment}
            variant="contained"
            color="primary"
            disabled={paymentLoading}
          >
            {paymentLoading ? <CircularProgress size={24} /> : t("payment.pay_now")}
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<SkeletonLoader type="details" />}>
      <CheckoutPage />
    </Suspense>
  );
}
