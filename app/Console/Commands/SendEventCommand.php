<?php

namespace App\Console\Commands;

use App\Events\LobbyUpdatedEvent;
use App\Events\TeamWonEvent;
use App\Models\Game;
use App\Models\Team;
use Illuminate\Console\Command;

class SendEventCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-event';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send a event for development';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        LobbyUpdatedEvent::dispatch(Game::where('id', 2)->first());
    }
}
