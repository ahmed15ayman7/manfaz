"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl'; // Using next-intl for localization
import { useRouter } from 'next/navigation'; // Using Next.js router for navigation
import CusTextButton from '@/components/ui/cus_text_button'; // Adjust the import according to your structure
import CusTextFormField from '@/components/ui/cus_text_form_field'; // Adjust the import according to your structure
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
const RegisterView: React.FC = () => {
  const t = useTranslations(); // Using next-intl for translations
  const router = useRouter(); // For navigation
  // Function to validate email format
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusPhone, setFocusPhone] = useState(false);
  let [phone, setPhone] = useState('');
  function validateEmail(email: string|undefined): string | undefined {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!re.test(String(email).toLowerCase())) return t('invalid_email');
  }

  // Function to validate password strength
  function validatePassword(password: string|undefined): string | undefined {
    if (!password) return t('password_required');
    if (password.length < 6) return t('password_too_short');
  }
  function validateName(name: string|undefined): string | undefined {
    if (!name) return t('name_required');
    if (name.length < 3) return t('name_too_short');
  }
  const handleRegister = () => {
    // Add your registration logic here
    router.push('/path/to/your/successPage'); // Adjust the route accordingly
  };

  return (
    <div className="bg-lightGrey h-screen">
      <div className="flex flex-col items-center justify-center h-full p-5 gap-2">
        <img src="/assets/images/manfaz_logo.png" alt="Manfaz Logo" className="h-36 mb-8" />
        <h1 className="text-2xl font-bold text-center text-primary">{t('create_account')}</h1>
        <p className="text-gray-600 text-center mb-8">{t('description_create_account')}</p>
        
        <CusTextFormField
          hintText={t('full_name')}
          validator={(value) => validateName(value)}
        />
        <CusTextFormField
          hintText={t('email')}
          validator={(value) => validateEmail(value)}
        />
        <div className="" style={{direction:"ltr"}}>

<PhoneInput
  country={"sa"}
  onFocus={e=>setFocusPhone(true)}
  onBlur={e=>setFocusPhone(false)}
  containerClass={`border rounded-[16px] py-2  bg-white ${focusPhone ? 'ring-2  outline-none' : 'border-gray-300 '}`}
  dropdownStyle={{border:"none !important"}}
  value={phone}
  onChange={(phone: string) => setPhone(phone)}
/>
  </div>
        <CusTextFormField
              fillColor="bg-white" // Use Tailwind CSS class directly
              hintText={t('password')}
              
              controller={(value) => setPassword(value)}
              validator={validatePassword}
              handelShowPassword={()=>setShowPassword(!showPassword)}
              isObscureText={!showPassword}
              suffixIcon={showPassword ? <IconEyeOff /> : <IconEye />}
        />
        
        <CusTextButton
          buttonText={t('sign_up')}
          textStyle="text-white" // Use Tailwind CSS class directly
          onPressed={handleRegister}
          backgroundColor="bg-primary" // Use Tailwind CSS class directly
          borderSideColor="border-primary" // Use Tailwind CSS class directly
        />

        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="mx-2">{t('or_sign_in_with')}</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <button onClick={() => { /* Handle Google sign-in */ }}>
          <img src="/assets/svg/google.svg" alt="Google Sign In" className="w-8 h-8" />
        </button>

        <div className="mt-4">
          <span>{t('already_have_an_account')}</span>
          <button onClick={() => router.push('/path/to/login')} className="text-blue-500">
            {t('login_here')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;