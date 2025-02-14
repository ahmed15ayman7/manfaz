"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl'; // Assuming you're using i18next for localization
import { useRouter } from 'next/navigation'; // Using Next.js router for navigation
import {toast} from 'react-toastify';
import axios from 'axios';
import CusTextButton from '@/components/ui/cus_text_button'; // Adjust the import according to your structure
import CusTextFormField from '@/components/ui/cus_text_form_field'; // Adjust the import according to your structure
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { apiUrl } from '@/constant'; // Adjust the import according to your structure
import { setUserData } from '@/lib/actions/user.action';
const LoginView: React.FC = () => {
  const t = useTranslations(); // Using i18next for translations
  const router = useRouter(); // For navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Function to validate email format
  function validateEmail(email: string|undefined): string | undefined {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(String(email).toLowerCase())) return t('invalid_email');
  }

  // Function to validate password strength
  function validatePassword(password: string|undefined): string | undefined {
    if (!password) return t('password_required');
    if (password.length < 6) return t('password_too_short');
  }

  const handleSubmit = async (event: React.FormEvent) => {  
    event.preventDefault();
    console.log(email,password);
    
    let toastId = toast.loading(t('please_wait'));
    try {
      let res = await axios.post(`${apiUrl}/auth/login`,{
        email,
        password
      })
      if(res.status === 200){
        toast.update(toastId, {
          render: t('login_success'),
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          closeButton: true
        });
        res.data?.data!==null && await setUserData(res.data?.data);
        router.push('/');
      }else{
        toast.update(toastId, {
          render: t('login_failed'),
          type: 'error',
          isLoading: false,
          autoClose: 3000,
          closeButton: true
        });
      }
    } catch (error) {
      toast.update(toastId, {
        render: t('login_failed'),
        type: 'error',
        isLoading: false,
        autoClose: 3000,
        closeButton: true
      });
    }
  };

  return (
    <div className="bg-white h-screen">
      <div className="flex flex-col items-center gap-2 justify-center h-full p-5">
        <img src="/assets/images/manfaz_logo.png" alt="Manfaz Logo" className="h-36 mb-8" />
        <h1 className="text-2xl text-center font-bold text-primary">{t('welcome')}</h1>
        <p className="text-gray-600 mb-8 text-center">{t('login_description')}</p>
        
        <CusTextFormField
          fillColor="bg-white" // Use Tailwind CSS class directly
          hintText={t('email')}
          controller={(value) => setEmail(value)}
          validator={validateEmail}
        />
        <CusTextFormField
          fillColor="bg-white" // Use Tailwind CSS class directly
          hintText={t('password')}
          
          controller={(value) => setPassword(value)}
          validator={validatePassword}
          handelShowPassword={()=>setShowPassword(!showPassword)}
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
          onPressed={(e)=>handleSubmit(e)}
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