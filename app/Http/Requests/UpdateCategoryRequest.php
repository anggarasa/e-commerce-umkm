<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
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
        $categoryId = $this->route('category')?->id;

        return [
            'parent_id' => [
                'nullable',
                'uuid',
                Rule::exists('categories', 'id'),
                Rule::notIn([$categoryId]), // Prevent self-parenting
            ],
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('categories', 'slug')->ignore($categoryId),
            ],
            'icon' => ['nullable', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
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
            'parent_id' => 'kategori induk',
            'name' => 'nama kategori',
            'slug' => 'slug',
            'icon' => 'ikon',
            'description' => 'deskripsi',
            'is_active' => 'status aktif',
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
            'parent_id.uuid' => 'Format ID kategori induk tidak valid.',
            'parent_id.exists' => 'Kategori induk yang dipilih tidak ditemukan.',
            'parent_id.not_in' => 'Kategori tidak dapat menjadi induk dari dirinya sendiri.',
            'name.required' => 'Nama kategori wajib diisi.',
            'name.string' => 'Nama kategori harus berupa teks.',
            'name.max' => 'Nama kategori maksimal 255 karakter.',
            'slug.string' => 'Slug harus berupa teks.',
            'slug.max' => 'Slug maksimal 255 karakter.',
            'slug.unique' => 'Slug sudah digunakan oleh kategori lain.',
            'icon.string' => 'Ikon harus berupa teks.',
            'icon.max' => 'Ikon maksimal 100 karakter.',
            'description.string' => 'Deskripsi harus berupa teks.',
            'is_active.boolean' => 'Status aktif harus berupa boolean.',
        ];
    }
}
