<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOperationRequest extends FormRequest
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
        $companyId = $this->user()?->company_id;

        return [
            'client_id' => ['required', 'integer', Rule::exists('clients', 'id')->where('company_id', $companyId)],
            'service_id' => ['required', 'integer', Rule::exists('services', 'id')->where('company_id', $companyId)],
            'amount' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'in:done,pending,canceled'],
            'performed_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
