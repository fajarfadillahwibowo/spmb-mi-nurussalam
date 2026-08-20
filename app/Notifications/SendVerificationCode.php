<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendVerificationCode extends Notification
{
    use Queueable;

    protected string $code;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $code)
    {
        $this->code = $code;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Kode Verifikasi SPMB MI Nurussalam Sidogede')
            ->greeting('Halo!')
            ->line('Terima kasih telah mendaftar di Sistem Penerimaan Murid Baru (SPMB) MI Nurussalam Sidogede.')
            ->line('Berikut adalah 6-digit kode verifikasi email Anda:')
            ->line($this->code)
            ->line('Kode ini akan kedaluwarsa dalam waktu 15 menit.')
            ->line('Jika Anda tidak merasa mendaftar, silakan abaikan email ini.');
    }
}
