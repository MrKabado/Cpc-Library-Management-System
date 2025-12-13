'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { User, Mail, Lock, BookOpen } from 'lucide-react';
import { ButtonSubmit } from '@/components/button';
import { useStudent } from '@/app/context/StudentContext';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function SignUpPage() {
  const { setStudentData } = useStudent(); 

  const router = useRouter();
  const [name, setName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [course, setCourse] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  //authentication access
  useEffect(() => {
    const verifyStudent = async () => {
      try {
        const result = await api.get('/api/check-token');
        const role = result.data?.decoded?.role;

        if (!role) return;

        if (role === "student") {
          toast.success(result.data.message);
          router.push('/students/dashboard');
        }

        if (role === "admin") {
          toast.success(result.data.message);
          router.push('/admin/dashboard');
        }

      } catch (error: any) {
        console.log(error);
        return;
      }
    };

    verifyStudent();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!schoolId || schoolId.trim() === "") {
      toast.error("School Id must be numeric");
      setSubmitted(false);
      return;
    }

    if (!password || password.trim() === "") {
      toast.error("Password must not be empty or space");
      setSubmitted(false);
      return;
    }

    if (password != confirmPassword) {
      toast.error("Passwords do not mach");
      setSubmitted(false);
      return;
    }

    try {
      const response = await api.post('/api/students/register/request', {name, schoolId, email, password, course});
      if (response.data.success) {
        toast.success(response.data.message || "Registration successful! Please check your email for OTP.");

        setStudentData({
          name: name,
          schoolId: schoolId,
          email: email,
          password: password,
          course: course,
        })

        router.push('/students/auth/register/verify-otp');
      }

    } catch (error: any) {
      console.log(error);
      setSubmitted(false);
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error(error);
      }
      return;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image
              src="/cpc logo.png"
              alt="CPC Logo"
              width={70}
              height={70}
              className="rounded-full shadow-md object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Cordova Public College</h1>
          <p className="text-gray-600 mt-2 text-sm">Create your CPC eLibrary account</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                value={name}
                onChange={(e) => {setName(e.target.value)}}
              />
            </div>
          </div>

          {/* School ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School ID</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                inputMode='numeric'
                pattern='\d{1,8}'
                placeholder="Enter your School ID"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                min={1}
                maxLength={8}
                value={schoolId}
                onChange={(e) => {
                  setSchoolId(e.target.value);
                }}
              />
            </div>
          </div>
          
          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

              <select
                className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                required
              >
                <option hidden>Select</option>
                <option value="BSIT" className='text-blue-500'>BSIT</option>
                <option value="BEED" className='text-blue-500'>BEED</option>
                <option value="BSED" className='text-blue-500'>BSED</option>
                <option value="BSHM" className='text-blue-500'>BSHM</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                value={confirmPassword}
                onChange={(e) => {setConfirmPassword(e.target.value)}}
              />
            </div>
          </div>

          {/* Submit Button */}
          <ButtonSubmit props={{
            submitted: submitted,
            buttonType: 'submit',
            className: 'text-md w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors',
            btnText: 'Register',
            btnLoadingText: 'Registering',
          }} />

          {/* Already have an account */}
          <div className="text-center">
            <span className="text-gray-600 text-sm">Already have an account? </span>
            <button
              type="button"
              onClick={() => router.push('/students/auth/login')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
