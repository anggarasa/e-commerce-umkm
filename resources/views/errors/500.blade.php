@extends('errors::minimal')

@section('title', __('Kesalahan Server'))
@section('code', '500')
@section('description', 'Mohon maaf, terjadi kesalahan pada server kami. Tim teknis kami sedang bekerja untuk
memperbaikinya. Silakan coba lagi nanti.')

@section('icon')
<svg class="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
  <line x1="12" x2="12" y1="9" y2="13" />
  <line x1="12" x2="12.01" y1="17" y2="17" />
</svg>
@endsection
