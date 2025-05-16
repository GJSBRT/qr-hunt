<?php

namespace App\Console\Commands;

use App\Class\GameMode;
use App\Events\GameStartedEvent;
use App\Events\TeamWonEvent;
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
        switch ($game->status) {
            case Game::STATUS_STARTING:
                $game->status = Game::STATUS_STARTED;
                $game->started_at = Carbon::now();
                $game->save();

                $gameMode = $game->getGameMode();
                if ($gameMode) {
                    $gameMode->onGameStart();
                }

                GameStartedEvent::dispatch($game);
                return;
            case Game::STATUS_STARTED:
                $this->handleStarted($game);
                break;
        }
    }

    private function handleStarted(Game $game) {
        $gameMode = $game->getGameMode();

        switch ($game->end_type) {
            case GameMode::END_TYPE_WINNER:
                $winningTeam = $gameMode->getWinner();
                if (!$winningTeam) break;

                $game->status = Game::STATUS_ENDED;
                $game->ended_at = Carbon::now();
                $game->save();

                TeamWonEvent::dispatch($game, $winningTeam, $gameMode->getResults());
                break;
            case GameMode::END_TYPE_DURATION:
                if (!$game->play_duration) break;
                if (!$game->started_at) break;
                if ($game->started_at->addSeconds($game->play_duration)->isAfter(Carbon::now())) break;

                $results = $gameMode->getResults();

                $game->status = Game::STATUS_ENDED;
                $game->ended_at = Carbon::now();
                $game->save();

                TeamWonEvent::dispatch($game, $results[0], $results);
                break;
        }
    }
}
