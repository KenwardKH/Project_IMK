import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, ArrowLeft } from 'lucide-react'; // Import ikon panah kiri
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: '',
    password: '',
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

  return (
    <>
      <Head title="Log in" />
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">

        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-4 left-4 flex items-center text-[#2563eb] hover:text-[#1e40af] transition-colors text-sm font-medium cursor-pointer "
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 space-y-6 border border-[#e2e8f0] transition-all">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-[#1e293b]">Welcome Back 👋</h1>
            <p className="text-sm text-[#64748b]">Login to your account to continue</p>
          </div>

          {status && (
            <div className="text-sm text-green-600 text-center font-medium">{status}</div>
          )}

          <form className="space-y-5" onSubmit={submit}>
            <div>
              <Label htmlFor="email" className="text-sm text-[#334155] font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                autoFocus
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className="mt-2 text-[#0f172a] placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-all"
                placeholder="you@example.com"
              />
              <InputError message={errors.email} />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm text-[#334155] font-medium">
                  Password
                </Label>
                {canResetPassword && (
                  <TextLink
                    href={route('password.request')}
                    className="text-sm text-[#2563eb] hover:underline"
                  >
                    Forgot?
                  </TextLink>
                )}
              </div>
              <Input
                id="password"
                type="password"
                required
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="mt-2 text-[#0f172a] placeholder:text-[#94a3b8] focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] transition-all"
                placeholder="Enter your password"
              />
              <InputError message={errors.password} />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                name="remember"
                checked={data.remember}
                onClick={() => setData('remember', !data.remember)}
              />
              <Label htmlFor="remember" className="text-sm text-[#334155]">Remember me</Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2563eb] hover:bg-[#1e40af] text-white font-semibold py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              disabled={processing}
            >
              {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Log in
            </Button>

            <p className="text-sm text-center text-[#64748b]">
              Don’t have an account?{' '}
              <TextLink href={route('register')} className="text-[#2563eb] hover:underline font-medium">
                Sign up
              </TextLink>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
