<?php

namespace App\GameModes\Territory\Events;

use App\Class\GameMapArea;
use App\Models\Team;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MissionAnswerIncorrectEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        private Team $team,
        private GameMapArea $area,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('team.' . $this->team->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'area' => $this->area,
        ];
    }
}
