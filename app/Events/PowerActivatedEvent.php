<?php

namespace App\Events;

use App\Models\Game;
use App\Models\Power;
use App\Models\Team;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PowerActivatedEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private Game $game;
    private Team $team;
    private Power $power;
    private ?Team $fromTeam = null;

    public function __construct(Game $game, Team $team, Power $power, ?Team $fromTeam = null)
    {
        $this->game = $game;
        $this->team = $team;
        $this->power = $power;
        $this->fromTeam = $fromTeam;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('team.' . $this->team->id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'power'     => $this->power,
            'fromTeam'  => $this->fromTeam,
        ];
    }
}
