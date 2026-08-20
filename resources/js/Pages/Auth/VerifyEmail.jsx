import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ email, status, error }) {
    const { data, setData, post, processing, errors } = useForm({
        email: email || '',
        code: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.verify'));
    };

    const handleResend = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email SPMB" />

            <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Verifikasi Email</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Kami telah mengirimkan 6-digit kode verifikasi ke email <strong className="text-slate-700 dark:text-slate-300">{email}</strong>.
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/50">
                    {status}
                </div>
            )}

            {error && (
                <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-800 dark:bg-red-950/60 dark:text-red-400 border border-red-200/50 dark:border-red-800/50">
                    {error}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                {/* Hidden Email Input to keep it in form state */}
                <input type="hidden" name="email" value={data.email} />

                <div>
                    <InputLabel htmlFor="code" value="6-Digit Kode Verifikasi" />

                    <TextInput
                        id="code"
                        type="text"
                        name="code"
                        value={data.code}
                        maxLength="6"
                        className="mt-1 block w-full text-center text-xl font-bold tracking-widest border-slate-300 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder="123456"
                        isFocused={true}
                        onChange={(e) => setData('code', e.target.value.replace(/\D/g, ''))}
                        required
                    />

                    <InputError message={errors.code} className="mt-2 text-center" />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={processing}
                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors disabled:opacity-50"
                    >
                        Kirim Ulang Kode
                    </button>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('login')}
                            className="text-sm font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                        >
                            Kembali ke Login
                        </Link>
                        
                        <PrimaryButton className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 focus:ring-emerald-500" disabled={processing}>
                            Verifikasi
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
