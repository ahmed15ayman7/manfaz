"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOTP, resendOTP } from "@/lib/actions/auth.action";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { Suspense } from "react";
const VerifyPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
    const [retimeLeft, setReTimeLeft] = useState(180); // 3 minutes
    const [canResend, setCanResend] = useState(false);
    const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const containerRef = useRef<HTMLDivElement>(null);

    const userId = searchParams.get("userId");

    useEffect(() => {
        if (!userId) {
            router.back();
            return;
        }

        // إنشاء التايمر
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // تنظيف التايمر عند إلغاء تحميل المكون
        return () => clearInterval(timer);
    }, [userId, timeLeft]); // إضافة timeLeft كتبعية للتأثير

    // إضافة مستمع للصق على مستوى الكونتينر
    const handleContainerPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const pastedValue = e.clipboardData.getData('text').trim();

        // التحقق من أن النص الملصق يحتوي على أرقام فقط
        if (!pastedValue || !/^\d+$/.test(pastedValue)) return;

        // أخذ أول 4 أرقام فقط
        const numbers = pastedValue.slice(0, 4);

        // ملء الخانات بالأرقام
        const newOtp = [...otp];
        for (let i = 0; i < numbers.length && i < 4; i++) {
            newOtp[i] = numbers[i];
        }
        setOtp(newOtp);

        // تحريك المؤشر إلى آخر خانة
        const lastIndex = Math.min(numbers.length - 1, 3);
        const lastInput = inputRefs[lastIndex]?.current as HTMLInputElement | null;
        lastInput?.focus();
    };

    const handleChange = (index: number, value: string) => {
        // التحقق من أن القيمة رقم فقط
        if (!/^\d*$/.test(value)) return;

        if (value.length > 1) {
            // في حالة اللصق، نتحقق من أن كل الأرقام صحيحة
            const pastedValue = value.slice(0, 4);
            if (!/^\d+$/.test(pastedValue)) return;

            // توزيع الأرقام الملصقة على الخانات
            const newOtp = [...otp];
            for (let i = 0; i < pastedValue.length && index + i < 4; i++) {
                newOtp[index + i] = pastedValue[i];
            }
            setOtp(newOtp);

            // تحريك المؤشر إلى آخر خانة تم ملؤها
            const lastIndex = Math.min(index + pastedValue.length - 1, 3);
            const nextInput = inputRefs[lastIndex]?.current as HTMLInputElement | null;
            nextInput?.focus();
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // التنقل التلقائي للخانة التالية
        if (value && index < 3) {
            const nextInput = inputRefs[index + 1]?.current as HTMLInputElement | null;
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = inputRefs[index - 1]?.current as HTMLInputElement | null;
            prevInput?.focus();
        }
    };

    const handleResendOTP = async () => {
        if (!canResend) return;

        try {
            await resendOTP(userId as string);
            setTimeLeft(180); // إعادة ضبط التايمر إلى 3 دقائق
            setCanResend(false);
            toast.success("تم إعادة إرسال الرمز بنجاح");
        } catch (error) {
            toast.error("حدث خطأ أثناء إعادة إرسال الرمز");
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join("");
        if (otpString.length !== 4) {
            toast.error("الرجاء إدخال الرمز كاملاً");
            return;
        }

        try {
            const response = await verifyOTP(userId as string, otpString);
            console.log(response);
            if (response.status) {
                // تسجيل الدخول باستخدام next-auth بعد التحقق
                const result = await signIn("credentials", {
                    email: response.data.email,
                    password: response.data.password, // سنحتاج لتمرير كلمة المرور من صفحة التسجيل
                    phone: response.data.phone,
                    role: response.data.role,
                    isVerified: response.data.isVerified,
                    redirect: false,
                });
                console.log(result);

                if (result?.error) {
                    toast.error("حدث خطأ أثناء تسجيل الدخول");
                    return;
                }

                toast.success("تم التحقق وتسجيل الدخول بنجاح");
                router.push('/');
            }
        } catch (error) {
            console.log(error);
            toast.error("حدث خطأ أثناء التسجيل");
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gray-50"
            ref={containerRef}
            onPaste={handleContainerPaste}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg"
            >
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        التحقق من رقم الهاتف
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        تم إرسال رمز التحقق إلى رقم هاتفك
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="flex justify-center space-x-4 " style={{ direction: "ltr" }}>
                        {otp.map((digit, index) => (
                            <motion.input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-14 h-14 text-center text-2xl border-2 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                                whileFocus={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            />
                        ))}
                    </div>

                    <div className="text-center text-sm">
                        {timeLeft > 0 ? (
                            <p className="text-gray-600">
                                يمكنك إعادة إرسال الرمز بعد {Math.floor(timeLeft / 60)}:
                                {(timeLeft % 60).toString().padStart(2, "0")}
                            </p>
                        ) : (
                            <button
                                onClick={handleResendOTP}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                إعادة إرسال الرمز
                            </button>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleVerify}
                        className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        تحقق
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};
export default function page() {
    return (
        <Suspense fallback={<div className="w-full h-24  rounded-md animate-pulse flex gap-5">
            <div className="w-1/4 h-full  bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-1/4 h-full bg-gray-200 rounded-md animate-pulse"></div>
            <div className="w-1/4 h-full bg-gray-200 rounded-md animate-pulse"></div>
        </div>}>
            <VerifyPage />
        </Suspense>
    )
}
