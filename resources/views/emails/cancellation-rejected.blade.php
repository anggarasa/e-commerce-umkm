<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Permintaan Pembatalan Ditolak - {{ config('app.name') }}</title>
  <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>

<body
  style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600"
          style="margin: 0 auto; max-width: 600px;">

          <!-- Header -->
          <tr>
            <td
              style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                {{ $storeName }}
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                Notifikasi Pembatalan
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td
              style="background-color: #ffffff; padding: 40px; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">

              <!-- Greeting -->
              <p style="margin: 0 0 20px 0; font-size: 18px; color: #1e293b;">
                Halo, <strong>{{ $order->customer_name }}</strong>! 👋
              </p>

              <p style="margin: 0 0 24px 0; color: #475569; font-size: 15px;">
                Kami ingin memberitahukan bahwa permintaan pembatalan pesanan Anda telah <strong style="color: #dc2626;">ditolak</strong>.
              </p>

              <!-- Status Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color: #fee2e2; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0; font-size: 48px;">❌</p>
                    <p style="margin: 12px 0 0 0; color: #991b1b; font-weight: 600; font-size: 18px;">
                      Permintaan Pembatalan Ditolak
                    </p>
                    <p style="margin: 8px 0 0 0; color: #b91c1c; font-size: 14px;">
                      Pesanan Anda akan tetap diproses sesuai jadwal.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Order Info Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color: #eff6ff; border-left: 4px solid #4361ee; border-radius: 0 10px 10px 0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 8px 0; font-weight: 600; color: #1e40af;">📋 Informasi Pesanan</p>
                    <p style="margin: 0; color: #1e40af; font-size: 14px;">
                      <strong>Nomor Pesanan:</strong> #{{ $order->order_number }}
                    </p>
                    <p style="margin: 8px 0 0 0; color: #1e40af; font-size: 14px;">
                      <strong>Status Saat Ini:</strong> {{ $order->status_label }}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Cancellation Reason Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 0 10px 10px 0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0 0 8px 0; font-weight: 600; color: #92400e;">📝 Alasan Pembatalan Anda</p>
                    <p style="margin: 0; color: #92400e; font-size: 14px; font-style: italic;">
                      "{{ $cancellationReason }}"
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Info Message -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color: #f1f5f9; border-radius: 10px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; color: #475569; font-size: 14px;">
                      💡 <strong>Informasi:</strong> Jika Anda memiliki pertanyaan atau kendala mengenai pesanan ini,
                      silakan hubungi tim customer service kami. Kami siap membantu Anda.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Order Items -->
              <p style="font-weight: 600; color: #1e293b; margin: 0 0 16px 0; font-size: 16px;">📦 Detail Pesanan</p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 20px;">
                @foreach($order->items as $index => $item)
                <tr>
                  <td
                    style="padding: 16px 20px; {{ $index < count($order->items) - 1 ? 'border-bottom: 1px solid #f1f5f9;' : '' }}">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="vertical-align: top;">
                          <p style="margin: 0; font-weight: 500; color: #1e293b; font-size: 14px;">{{
                            $item->product_name }}</p>
                          <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">Qty: {{ $item->quantity }}</p>
                        </td>
                        <td style="text-align: right; vertical-align: top;">
                          <p style="margin: 0; font-weight: 600; color: #4361ee; font-size: 14px;">Rp {{
                            number_format((float)$item->subtotal, 0, ',', '.') }}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                @endforeach
              </table>

              <!-- Total -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background: linear-gradient(135deg, #4361ee 0%, #3b5bdb 100%); border-radius: 12px;">
                <tr>
                  <td style="padding: 20px; text-align: center;">
                    <p style="margin: 0 0 4px 0; color: rgba(255,255,255,0.8); font-size: 14px;">Total Pembayaran</p>
                    <p style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">Rp {{
                      number_format((float)$order->total, 0, ',', '.') }}</p>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="margin-top: 32px;">
                <tr>
                  <td style="text-align: center;">
                    <a href="{{ $actionUrl }}"
                      style="display: inline-block; background: linear-gradient(135deg, #4361ee 0%, #3b5bdb 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 600; font-size: 15px;">
                      🔍 Lihat Detail Pesanan
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Thank You -->
              <p style="margin: 32px 0 0 0; color: #475569; font-size: 14px; text-align: center;">
                Terima kasih atas pengertian Anda. Kami berkomitmen untuk memberikan layanan terbaik! 💙
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td
              style="background-color: #f1f5f9; border-radius: 0 0 16px 16px; padding: 24px 40px; text-align: center; border: 1px solid #e2e8f0; border-top: none;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">
                Jika Anda memiliki pertanyaan, silakan hubungi kami.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                © {{ date('Y') }} {{ $storeName }}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>

</html>
