<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:20'],
            'customer_address' => ['required', 'string', 'max:1000'],
            'notes' => ['nullable', 'string', 'max:500'],
            // Direct product checkout fields
            'product_id' => ['nullable', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'customer_name.required' => 'Nama lengkap wajib diisi.',
            'customer_name.max' => 'Nama maksimal 255 karakter.',
            'customer_email.email' => 'Format email tidak valid.',
            'customer_phone.required' => 'Nomor telepon wajib diisi.',
            'customer_phone.max' => 'Nomor telepon maksimal 20 karakter.',
            'customer_address.required' => 'Alamat pengiriman wajib diisi.',
            'customer_address.max' => 'Alamat maksimal 1000 karakter.',
            'notes.max' => 'Catatan maksimal 500 karakter.',
        ];
    }
}
