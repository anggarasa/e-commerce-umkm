@extends('errors::minimal')

@section('title', __('Halaman Tidak Ditemukan'))
@section('code', '404')
@section('description', 'Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman ini telah dipindahkan,
dihapus, atau alamat URL yang Anda masukkan salah.')

@section('icon')
<svg class="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8" />
  <path d="m21 21-4.3-4.3" />
  <path d="M8 8l6 6" />
</svg>
@endsection
