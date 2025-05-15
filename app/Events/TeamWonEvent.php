<?php

namespace App\Events;

use App\Class\TeamScore;
use App\Models\Game;
use App\Models\Team;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TeamWonEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        private Game $game,
        private TeamScore $winningTeamScore,
        /** @var TeamScore[] */
        private array $teamScores,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('game.' . $this->game->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'winningTeamScore' => $this->winningTeamScore,
            'teamScores' => $this->teamScores,
        ];
    }
}
