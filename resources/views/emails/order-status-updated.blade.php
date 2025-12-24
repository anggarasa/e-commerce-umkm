<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update Status Pesanan - {{ config('app.name') }}</title>
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
              style="background: linear-gradient(135deg, #4361ee 0%, #3b5bdb 100%); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                {{ $storeName }}
              </h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                Notifikasi Pesanan
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
                Kami ingin memberitahukan bahwa status pesanan Anda telah diperbarui.
              </p>

              <!-- Status Change Box -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 16px 0; color: #64748b; font-size: 14px;">Perubahan Status</p>
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td
                          style="padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; background-color: {{ $oldStatusColor['bg'] }}; color: {{ $oldStatusColor['text'] }};">
                          {{ $oldStatusLabel }}
                        </td>
                        <td style="padding: 0 12px; color: #94a3b8; font-size: 20px;">→</td>
                        <td
                          style="padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; background-color: {{ $newStatusColor['bg'] }}; color: {{ $newStatusColor['text'] }};">
                          {{ $newStatusLabel }}
                        </td>
                      </tr>
                    </table>
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
                  </td>
                </tr>
              </table>

              <!-- Status Message -->
              @if($statusMessage)
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%"
                style="background-color: {{ $statusMessageBg }}; border-radius: 10px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; color: {{ $statusMessageColor }};">
                      {{ $statusEmoji }} <strong>{{ $statusMessageTitle }}</strong>
                    </p>
                    <p style="margin: 8px 0 0 0; color: {{ $statusMessageColor }}; font-size: 14px;">
                      {{ $statusMessage }}
                    </p>
                  </td>
                </tr>
              </table>
              @endif

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
              Terima kasih telah berbelanja di <strong style="color: #4361ee;">{{ $storeName }}</strong>! 💙
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