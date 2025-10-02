import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex  items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="mr-2 text-md text-gray-100">جاري التحميل...</span>
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex  items-center space-x-4 rtl:space-x-reverse bg-green-50 p-4 rounded-lg">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-100">
            أهلاً وسهلاً، {session.user?.name || 'المستخدم'}
          </p>
          <p className="text-xs text-gray-600">{session.user?.email}</p>
        </div>
        {session.user?.image && (
          <Image 
            src={session.user.image} 
            alt="صورة المستخدم"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full"
          />
        )}
        <button 
          onClick={() => signOut()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          تسجيل الخروج
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#363636] p-10 rounded-lg text-center">
      <p className="text-sm text-gray-600 mb-3">لم تسجل دخولك بعد</p>
      <button 
        onClick={() => signIn('google')}
        className="bg-green-700 my-4 py-4 mt-7 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center mx-auto space-x-2 rtl:space-x-reverse"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>تسجيل الدخول بجوجل</span>
      </button>
    </div>
  );
}
