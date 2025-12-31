@extends('errors::minimal')

@section('title', __('Akses Ditolak'))
@section('code', '403')
@section('description', 'Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Silakan hubungi administrator jika
Anda yakin ini adalah kesalahan.')

@section('icon')
<svg class="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  <circle cx="12" cy="16" r="1" />
</svg>
@endsection
