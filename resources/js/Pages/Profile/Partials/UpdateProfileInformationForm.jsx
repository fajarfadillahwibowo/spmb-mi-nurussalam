import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import Swal from 'sweetalert2';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;
    const photoInput = useRef();
    const [photoPreview, setPhotoPreview] = useState(
        user.profile_photo_path ? `/storage/${user.profile_photo_path}` : null
    );

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            _method: 'patch',
            username: user.username,
            email: user.email,
            profile_photo: null,
        });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('profile_photo', file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('profile.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Profil berhasil diperbarui.',
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
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    Informasi Profil
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Perbarui informasi profil akun dan alamat email Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                
                {/* Profile Photo */}
                <div className="flex items-center gap-6">
                    <div className="shrink-0">
                        {photoPreview ? (
                            <img src={photoPreview} alt="Profile Preview" className="h-20 w-20 object-cover rounded-full border-4 border-slate-100 dark:border-slate-800 shadow-sm" />
                        ) : (
                            <div className="h-20 w-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 border-4 border-slate-100 dark:border-slate-700 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div>
                        <InputLabel value="Foto Profil" />
                        <input
                            type="file"
                            ref={photoInput}
                            onChange={handlePhotoChange}
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-900/30 dark:file:text-emerald-400"
                        />
                        <InputError className="mt-2" message={errors.profile_photo} />
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        className="mt-1 block w-full"
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        required
                        isFocused
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.username} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Alamat email Anda belum terverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800 ml-1"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                Tautan verifikasi baru telah dikirim ke alamat email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton className="bg-emerald-600 hover:bg-emerald-500" disabled={processing}>Simpan</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
