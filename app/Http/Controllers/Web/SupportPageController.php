<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupportPageController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('Support/Index');
    }
}
