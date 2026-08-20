import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    useEffect(() => {
        if (status) {
            Swal.fire({
                title: 'Berhasil!',
                text: status, // Normally this will be translated by Laravel, e.g. "Kami sudah mengirim email tautan setel ulang kata sandi Anda!"
                icon: 'success',
                confirmButtonColor: '#059669',
                background: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
                color: document.documentElement.classList.contains('dark') ? '#f1f5f9' : '#1e293b',
                customClass: {
                    popup: 'rounded-3xl border border-slate-200 dark:border-slate-800',
                    confirmButton: 'rounded-xl font-bold px-6 py-2.5 shadow-sm',
                }
            });
        }
    }, [status]);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Kata Sandi" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
                Lupa kata sandi Anda? Tidak masalah. Cukup beri tahu kami alamat email Anda dan kami akan mengirimi Anda tautan setel ulang kata sandi melalui email yang memungkinkan Anda memilih kata sandi baru.
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                        Alamat Email
                    </label>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="w-full justify-center bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl" disabled={processing}>
                        Kirim Tautan Setel Ulang Kata Sandi
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
