<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ServicePageController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Services/Index');
    }
}
