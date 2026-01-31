<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class UserPageController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Users/Index');
    }
}
