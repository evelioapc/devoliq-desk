<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class OperationPageController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Operations/Index');
    }
}
