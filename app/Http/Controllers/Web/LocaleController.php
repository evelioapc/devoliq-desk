<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function __invoke(Request $request, string $locale): RedirectResponse
    {
        if (! in_array($locale, ['es', 'pt', 'en'])) {
            $locale = 'es';
        }

        return redirect()->back()->cookie('locale', $locale, 60 * 24 * 365);
    }
}
