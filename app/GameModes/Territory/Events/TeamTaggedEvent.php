<?php

namespace App\GameModes\Territory\Events;

use App\Models\Game;
use App\Models\Team;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TeamTaggedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        private Game $game,
        private ?Team $byTeam,
        private Team $taggedTeam,
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
            'byTeam' => $this->byTeam,
            'taggedTeam' => $this->taggedTeam,
        ];
    }
}
