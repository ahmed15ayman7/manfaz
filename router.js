app.use('/api/stores', storeRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/store-working-hours', storeWorkingHoursRoutes);
app.use('/api/user-locations', userLocationRoutes);
router.post('/gift-cards', createGiftCard);
router.get('/stores/:storeId/gift-cards', getGiftCards);
router.get('/gift-cards/:code/balance', checkGiftCardBalance);
router.post('/gift-cards/:code/redeem', redeemGiftCard);

// Rewards Routes
router.post('/rewards', createReward);
router.get('/stores/:storeId/rewards', getRewards);
router.post('/rewards/:id/redeem', redeemReward);
router.get('/users/:userId/rewards', getUserRewards);
router.get('/users/:userId/locations', getUserLocations);
router.post('/users/:userId/locations', createUserLocation);
router.put('/locations/:id', updateUserLocation);
router.delete('/locations/:id', deleteUserLocation);
router.put('/locations/:id/set-default', setDefaultLocation);

// المتاجر
router.get('/', getAllStores);
router.get('/:id', getStoreById);
router.post('/', createStore);
router.put('/:id', updateStore);
router.delete('/:id', deleteStore);

// تصنيفات المتجر
router.get('/:storeId/categories', getStoreCategories);
router.post('/:storeId/categories', createStoreCategory);

// منتجات المتجر
router.get('/:storeId/products', getStoreProducts);
router.post('/:storeId/products', createStoreProduct);

// عروض المتجر
router.get('/:storeId/offers', getStoreOffers);
router.post('/:storeId/offers', createStoreOffer);

// فروع المتجر
router.get('/:storeId/locations', getStoreLocations);
router.post('/:storeId/locations', createStoreLocation);

// الخصومات
router.get('/:storeId/discounts', getStoreDiscounts);
router.post('/:storeId/discounts', createDiscount);
router.put('/:storeId/discounts/:id', updateDiscount);
router.delete('/:storeId/discounts/:id', deleteDiscount);

// الكوبونات
router.get('/:storeId/coupons', getStoreCoupons);
router.post('/:storeId/coupons', createCoupon);
router.put('/:storeId/coupons/:id', updateCoupon);
router.delete('/:storeId/coupons/:id', deleteCoupon);
router.post('/:storeId/coupons/validate', validateCoupon);

router.get('/stores/:storeId/working-hours', getStoreWorkingHours);
router.post('/stores/:storeId/working-hours', setStoreWorkingHours);
router.put('/stores/:storeId/working-hours/:dayOfWeek', updateWorkingHours);
router.post('/stores/:storeId/special-days', addSpecialDay);
router.delete('/stores/:storeId/special-days/:id', deleteSpecialDay);
router.get('/stores/:storeId/check-open', checkStoreOpen);
