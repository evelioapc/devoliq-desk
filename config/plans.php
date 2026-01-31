<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Plan limits (single source of truth for backend + UI)
    |--------------------------------------------------------------------------
    */

    'limits' => [
        'free' => [
            'clients' => 50,
            'ops_per_month' => 200,
        ],
        'pro' => [
            'clients' => null,
            'ops_per_month' => null,
        ],
    ],

];
