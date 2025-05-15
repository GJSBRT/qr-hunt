<?php

namespace App\Class\GameModes\Territory\Events;

use App\Models\Game;
use App\Models\Team;
use App\Models\TerritoryKoth;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class KothClaimedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        private Game $game,
        private Team $team,
        private TerritoryKoth $koth,
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
            'game' => $this->game,
            'team' => $this->team,
            'koth' => $this->koth,
        ];
    }
}
