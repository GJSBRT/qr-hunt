<?php

namespace App\Console\Commands;

use App\Events\GameStartedEvent;
use App\Models\Game;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GameTickCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:game-tick';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run a game tick';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $games = Game::whereNot('status', Game::STATUS_DRAFT)->whereNot('status', Game::STATUS_ENDED)->get();

        foreach($games as $game) {
            $this->doGameTick($game);
        }
    }

    private function doGameTick(Game $game) {
        // Start game
        if ($game->status == Game::STATUS_STARTING) {
            $game->status = Game::STATUS_STARTED;
            $game->started_at = Carbon::now();
            $game->save();

            GameStartedEvent::dispatch($game);

            return;
        }
    }
}
