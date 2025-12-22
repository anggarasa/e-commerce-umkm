<?php

namespace App\Http\Requests\Admin\Product;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'exists:categories,id'],
            'slug' => ['required', 'string', 'max:255', 'unique:products,slug,'.$this->route('product')->id],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'new_media' => ['nullable', 'array'],
            'new_media.*.file' => ['required', 'file', 'mimes:jpeg,png,jpg,gif,mp4,mov,avi', 'max:50240'],
            'new_media.*.type' => ['required', 'string', 'in:image,video'],
            'new_media.*.is_primary' => ['boolean'],
            'deleted_media' => ['nullable', 'array'],
            'deleted_media.*' => ['uuid', 'exists:product_media,id'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nama produk',
            'category_id' => 'kategori',
            'slug' => 'slug',
            'price' => 'harga',
            'stock' => 'stok',
            'description' => 'deskripsi',
            'is_active' => 'status aktif',
            'new_media' => 'media',
            'new_media.*.file' => 'file media',
            'new_media.*.type' => 'tipe media',
            'new_media.*.is_primary' => 'media utama',
            'deleted_media' => 'media yang dihapus',
            'deleted_media.*' => 'ID media',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
            'name.string' => 'Nama produk harus berupa teks.',
            'name.max' => 'Nama produk maksimal 255 karakter.',
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'slug.required' => 'Slug wajib diisi.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.max' => 'Slug maksimal 255 karakter.',
            'slug.unique' => 'Slug sudah digunakan oleh produk lain.',
            'price.required' => 'Harga wajib diisi.',
            'price.numeric' => 'Harga harus berupa angka.',
            'price.min' => 'Harga tidak boleh kurang dari 0.',
            'stock.required' => 'Stok wajib diisi.',
            'stock.integer' => 'Stok harus berupa bilangan bulat.',
            'stock.min' => 'Stok tidak boleh kurang dari 0.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'is_active.boolean' => 'Status aktif harus berupa boolean.',
            'new_media.array' => 'Media harus berupa array.',
            'new_media.*.file.required' => 'File media wajib diunggah.',
            'new_media.*.file.file' => 'Media harus berupa file yang valid.',
            'new_media.*.file.mimes' => 'Format media harus jpeg, png, jpg, gif, mp4, mov, atau avi.',
            'new_media.*.file.max' => 'Ukuran file media maksimal 50MB.',
            'new_media.*.type.required' => 'Tipe media wajib diisi.',
            'new_media.*.type.string' => 'Tipe media harus berupa teks.',
            'new_media.*.type.in' => 'Tipe media harus image atau video.',
            'new_media.*.is_primary.boolean' => 'Status media utama harus berupa boolean.',
            'deleted_media.array' => 'Media yang dihapus harus berupa array.',
            'deleted_media.*.uuid' => 'ID media harus berupa UUID yang valid.',
            'deleted_media.*.exists' => 'Media yang dipilih untuk dihapus tidak ditemukan.',
        ];
    }
}
