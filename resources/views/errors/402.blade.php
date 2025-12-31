@extends('errors::minimal')

@section('title', __('Pembayaran Diperlukan'))
@section('code', '402')
@section('description', 'Maaf, Anda perlu menyelesaikan pembayaran untuk mengakses layanan ini. Silakan periksa status
pembayaran Anda.')

@section('icon')
<svg class="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect width="20" height="14" x="2" y="5" rx="2" />
  <line x1="2" x2="22" y1="10" y2="10" />
</svg>
@endsection
