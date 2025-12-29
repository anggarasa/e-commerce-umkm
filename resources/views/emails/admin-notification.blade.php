<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $notification->title }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                                {{ $storeName }}
                            </h1>
                            <p style="margin: 10px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 14px;">
                                Admin Notification
                            </p>
                        </td>
                    </tr>

                    <!-- Notification Badge -->
                    <tr>
                        <td style="padding: 30px 40px 0 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="background-color: {{ $typeColor['bg'] }}; border-left: 4px solid {{ $typeColor['border'] }}; padding: 16px 20px; border-radius: 0 8px 8px 0;">
                                        <h2 style="margin: 0; color: {{ $typeColor['text'] }}; font-size: 18px; font-weight: 600;">
                                            {{ $notification->title }}
                                        </h2>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Message -->
                    <tr>
                        <td style="padding: 24px 40px;">
                            <p style="margin: 0; color: #374151; font-size: 16px; line-height: 1.6;">
                                {{ $notification->message }}
                            </p>
                        </td>
                    </tr>

                    <!-- Order Details (if available) -->
                    @if($orderNumber || $customerName || $total)
                    <tr>
                        <td style="padding: 0 40px 24px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 16px 0; color: #111827; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Detail Pesanan
                                        </h3>
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            @if($orderNumber)
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">No. Pesanan</td>
                                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">{{ $orderNumber }}</td>
                                            </tr>
                                            @endif
                                            @if($customerName)
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Pelanggan</td>
                                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">{{ $customerName }}</td>
                                            </tr>
                                            @endif
                                            @if($total)
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Total</td>
                                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">Rp {{ number_format($total, 0, ',', '.') }}</td>
                                            </tr>
                                            @endif
                                            @if($cancellationReason)
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%; vertical-align: top;">Alasan Pembatalan</td>
                                                <td style="padding: 8px 0; color: #dc2626; font-size: 14px; font-weight: 500;">{{ $cancellationReason }}</td>
                                            </tr>
                                            @endif
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    @endif

                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px; text-align: center;">
                            <a href="{{ $actionUrl }}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);">
                                {{ $actionText }}
                            </a>
                        </td>
                    </tr>

                    <!-- Timestamp -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                                Notifikasi dikirim pada {{ $notification->created_at->format('d M Y, H:i') }} WIB
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #6b7280; font-size: 14px;">
                                &copy; {{ date('Y') }} {{ $storeName }}. All rights reserved.
                            </p>
                            <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                                Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
