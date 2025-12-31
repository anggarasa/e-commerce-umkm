@extends('errors::minimal')

@section('title', __('Halaman Kedaluwarsa'))
@section('code', '419')
@section('description', 'Maaf, sesi halaman Anda telah kedaluwarsa karena tidak ada aktivitas. Silakan muat ulang
halaman dan coba lagi.')

@section('icon')
<svg class="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10" />
  <polyline points="12 6 12 12 16 14" />
</svg>
@endsection
