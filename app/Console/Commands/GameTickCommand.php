<?php

namespace App\Console\Commands;

use App\Events\GameEndedEvent;
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
                GameStartedEvent::dispatch($game);
                return;
            case Game::STATUS_STARTED:
                // Has game timer expired?
                if ($game->play_duration && Carbon::parse($game->started_at)->addSeconds($game->play_duration)->isAfter(Carbon::now())) {
                    $game->status = Game::STATUS_ENDED;
                    $game->ended_at = Carbon::now();
                    $game->save();
                    GameEndedEvent::dispatch($game);
                    return;
                }

                // Check if a team has won
                $teamsWon = [];
                foreach($game->teams()->get() as $team) {
                    $teamQrCodes = $team->team_qr_codes()->get();

                    $categoryCount = [];
                    foreach($teamQrCodes as $teamQrCode) {
                        $qrCode = $teamQrCode->qr_code()->first();
                        if (!$qrCode) continue;

                        $quartet = $qrCode->quartet()->first();
                        if (!$quartet) continue;

                        if (isset($categoryCount[$quartet->category])) {
                            $categoryCount[$quartet->category]++;
                        } else {
                            $categoryCount[$quartet->category] = 1;
                        }
                    }

                    if (count($categoryCount) < $game->quartet_categories) {
                        return;
                    }

                    foreach($categoryCount as $count) {
                        if ($count < $game->quartet_values) {
                            return;
                        }
                    }

                    $teamsWon[] = $team;
                }

                if (count($teamsWon) > 0) {
                    $teamsWonPoints = [];
                    foreach($teamsWon as $team) {
                        // Add a point for each card and add two points for each completed set.
                        $points = ($game->quartet_categories * $game->quartet_values) + ($game->quartet_categories * 2);

                        $pointsModifiers = $team->team_points_modifiers()->get();
                        foreach($pointsModifiers as $pointsModifier) {
                            $points = $pointsModifier->modifyPoints($points);
                        }

                        $teamsWonPoints[$points] = [
                            'team'      => $team,
                            'points'    => $points
                        ];
                    }

                    ksort($teamsWonPoints);

                    $winningTeam = $teamsWonPoints[0];
                    $game->status = Game::STATUS_ENDED;
                    $game->ended_at = Carbon::now();
                    TeamWonEvent::dispatch($winningTeam);
                    return;
                }

                break;
        }
    }
}
