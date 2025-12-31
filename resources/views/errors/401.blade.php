@extends('errors::minimal')

@section('title', __('Tidak Diizinkan'))
@section('code', '401')
@section('description', 'Maaf, Anda harus login terlebih dahulu untuk mengakses halaman ini. Silakan login dengan akun
Anda.')

@section('icon')
<svg class="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
  <circle cx="12" cy="7" r="4" />
  <line x1="2" x2="22" y1="2" y2="22" stroke="currentColor" stroke-width="1.5" />
</svg>
@endsection
