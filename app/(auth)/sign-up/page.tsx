import Navbar from '@/components/nav/navbar';
import SignUpForm from '@/components/auth/signUpForm';

export default function page() {
  return (
    <>
      <Navbar />
      <main className='flex min-h-svh flex-col items-center justify-center p-6 md:p-10'>
        <div className='w-full max-w-sm md:max-w-4xl'>
          <SignUpForm />
        </div>
      </main>
    </>
  );
}
