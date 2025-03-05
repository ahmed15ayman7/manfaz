"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl'; // Assuming you're using i18next for localization
import { useRouter } from 'next/navigation'; // Using Next.js router for navigation
import { toast } from 'react-toastify';
import CusTextButton from '@/components/ui/cus_text_button'; // Adjust the import according to your structure
import CusTextFormField from '@/components/ui/cus_text_form_field'; // Adjust the import according to your structure
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { FormControl } from '@mui/material';
import { signIn } from 'next-auth/react';
const LoginView: React.FC = () => {
  const t = useTranslations(); // Using i18next for translations
  const router = useRouter(); // For navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [focusPhone, setFocusPhone] = useState(false);
  const [role, setRole] = useState<'user' | 'worker' | "store">('user');
  const [isPhoneInput, setIsPhoneInput] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const phoneInputRef = React.useRef<any>(null);
  const emailInputRef = React.useRef<any>(null);

  // دالة للتحقق مما إذا كان المدخل رقم هاتف
  const checkIfPhone = (value: string) => {
    // نزيل كل الرموز ماعدا الأرقام
    const numbersOnly = value.replace(/[^0-9]/g, '');
    // إذا كان المدخل يحتوي على 3 أرقام أو أكثر، نعتبره رقم هاتف
    return value.length <= 1 && numbersOnly.length >= 1;
  };

  // دالة للتحكم في تغيير القيمة
  const handleInputChange = (value: string) => {
    setEmailOrPhone(value);
    setIsPhoneInput(checkIfPhone(value));
  };

  // Function to validate email format
  function validateEmail(email: string | undefined): string | undefined {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(String(email).toLowerCase())) return t('invalid_email');
  }

  // Function to validate password strength
  function validatePassword(password: string | undefined): string | undefined {
    if (!password) return t('password_required');
    if (password.length < 6) return t('password_too_short');
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let toastId = toast.loading(t('please_wait'));

    try {
      const result = await signIn('credentials', {
        [isPhoneInput ? 'phone' : 'email']: emailOrPhone,
        password,
        role,
        redirect: false,
        callbackUrl: '/api/auth/session'
      });

      const response = await fetch('/api/auth/session');
      const session = await response.json();

      console.log('User Data:', session.user);

      if (result?.error && !result.ok) {
        toast.update(toastId, {
          render: t('login_failed'),
          type: 'error',
          isLoading: false,
          autoClose: 3000,
          closeButton: true
        });
      } else {
        if (!session.user.isVerified) {
          toast.update(toastId, {
            render: t('verify_your_account'),
            type: 'info',
            isLoading: false,
            autoClose: 3000,
            closeButton: true
          });
          sessionStorage.setItem('temp_auth', JSON.stringify({
            phone: session.user.phone,
            email: session.user.email,
            password: session.user.password
          }));
          router.push(`/verify?userId=${session.user.id}`);
        }
        else {
          if (result?.url) {
            toast.update(toastId, {
              render: t('login_success'),
              type: 'success',
              isLoading: false,
              autoClose: 3000,
              closeButton: true
            });
            router.push(result.url);
          }
        }
      }
    } catch (error) {
      console.log(error);
      toast.update(toastId, {
        render: t('login_failed'),
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        closeButton: true
      });
    }
  };

  useEffect(() => {
    setIsPhoneInput(checkIfPhone(emailOrPhone));
  }, [emailOrPhone]);

  useEffect(() => {
    if (isPhoneInput && phoneInputRef.current) {
      phoneInputRef.current.focus();
      setFocusPhone(true);
    } else if (!isPhoneInput && emailInputRef.current?.focus) {
      emailInputRef.current.focus();
    }
  }, [isPhoneInput]);

  return (
    <div className="bg-white h-screen">
      <div className="flex flex-col items-center gap-2 justify-center h-full p-5">
        <img src="/assets/images/manfaz_logo.png" alt="Manfaz Logo" className="h-36 mb-8" />
        <h1 className="text-2xl text-center font-bold text-primary">{t('welcome')}</h1>
        <p className="text-gray-600 mb-8 text-center">{t('login_description')}</p>

        <div className="relative min-w-[300px]">
          {!isPhoneInput ? (
            <CusTextFormField
              ref={emailInputRef}
              fillColor="bg-white"
              hintText={t('email_or_phone')}
              controller={setEmailOrPhone}
              validator={validateEmail}
            />
          ) : (
            <div className="" style={{ direction: "ltr" }}>
              <PhoneInput
                inputProps={{
                  ref: phoneInputRef
                }}
                country={"sa"}
                onFocus={e => setFocusPhone(true)}
                onBlur={e => setFocusPhone(false)}
                containerClass={`border rounded-[16px] py-2 bg-white ${focusPhone ? 'ring-2 outline-none' : 'border-gray-300'}`}
                dropdownStyle={{ border: "none !important" }}
                value={emailOrPhone}
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>
        <FormControl style={{ borderRadius: "16px !important" }} sx={{
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderRadius: "16px !important"
            }
          }
        }} className='min-w-[300px]' >
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value as 'user' | 'worker' | "store")}
            className="bg-white rounded-[16px] h-[48px] min-w-[300px]"
          >
            <MenuItem value="user">{t('user')}</MenuItem>
            <MenuItem value="worker">{t('worker')}</MenuItem>
            <MenuItem value="store">{t('store')}</MenuItem>
          </Select>
        </FormControl>
        <CusTextFormField
          fillColor="bg-white" // Use Tailwind CSS class directly
          hintText={t('password')}

          controller={(value) => setPassword(value)}
          validator={validatePassword}
          handelShowPassword={() => setShowPassword(!showPassword)}
          isObscureText={!showPassword}
          suffixIcon={showPassword ? <IconEyeOff /> : <IconEye />} // Adjust icon as needed
        />

        <button onClick={() => { /* Handle forgot password */ }} className="text-blue-500">
          {t('forgot_password')}
        </button>

        <CusTextButton
          buttonText={t('login')}
          borderRadius={16}
          textStyle="text-white" // Use Tailwind CSS class directly
          onPressed={(e) => handleSubmit(e)}
          buttonWidth={300}
          backgroundColor="bg-primary" // Use Tailwind CSS class directly
          borderSideColor="border-primary" // Use Tailwind CSS class directly
        />

        <div className="flex items-center my-4">
          <div className="flex-grow h-[2px] bg-gray-300 min-w-[80px]"></div>
          <span className="mx-2">{t('or_sign_in_with')}</span>
          <div className="flex-grow h-[2px] bg-gray-300 min-w-[80px]"></div>
        </div>

        <button onClick={() => { /* Handle Google sign-in */ }}>
          <img src="/assets/svg/google.svg" alt="Google Sign In" className="w-8 h-8" />
        </button>

        <div className="mt-4">
          <span>{t('no_account')}</span>
          <button onClick={() => router.push('/register')} className="text-blue-500">
            {t('sign_up_now')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;