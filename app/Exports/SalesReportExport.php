<?php

namespace App\Exports;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class SalesReportExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping, WithStyles
{
    public function __construct(
        private Carbon $startDate,
        private Carbon $endDate,
    ) {}

    public function collection(): Collection
    {
        return Order::with('items')
            ->whereBetween('created_at', [$this->startDate, $this->endDate])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * @return array<int, string>
     */
    public function headings(): array
    {
        return [
            'No. Pesanan',
            'Tanggal',
            'Pelanggan',
            'Email',
            'Telepon',
            'Alamat',
            'Jumlah Item',
            'Subtotal',
            'Ongkir',
            'Total',
            'Status',
            'Catatan',
        ];
    }

    /**
     * @param  Order  $order
     * @return array<int, mixed>
     */
    public function map($order): array
    {
        return [
            $order->order_number,
            $order->created_at->format('Y-m-d H:i:s'),
            $order->customer_name,
            $order->customer_email,
            $order->customer_phone,
            $order->customer_address,
            $order->items->count(),
            $order->subtotal,
            $order->shipping_cost,
            $order->total,
            Order::STATUSES[$order->status] ?? $order->status,
            $order->notes,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['argb' => 'FFFFFFFF'],
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FF4F46E5'],
                ],
            ],
        ];
    }
}
