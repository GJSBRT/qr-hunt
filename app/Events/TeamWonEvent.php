<?php

namespace App\Events;

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

    private Game $game;
    private Team $team;

    public function __construct(Game $game, Team $team)
    {
        $this->game = $game;
        $this->team = $team;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('game.' . $this->game->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'winningTeam'   => $this->team,
            'results'       => $this->game->show_results ? $this->game->getResults() : null
        ];
    }
}
