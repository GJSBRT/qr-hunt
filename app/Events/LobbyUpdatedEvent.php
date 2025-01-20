<?php

namespace App\Events;

use App\Models\Game;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LobbyUpdatedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private Game $game;

    public function __construct(Game $game)
    {
        $this->game = $game;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('game.' . $this->game->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [];
    }
}
