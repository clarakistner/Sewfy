<?php

use App\Jobs\GerarParcelasRecorrentes;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('sanctum:prune-expired --hours=24')->daily();

// Gera parcelas recorrentes de contas a pagar todo dia à meia-noite
Schedule::job(new GerarParcelasRecorrentes)->dailyAt('00:00');