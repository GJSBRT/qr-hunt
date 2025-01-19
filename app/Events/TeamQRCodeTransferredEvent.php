<?php

namespace App\Events;

use App\Models\TeamQRCode;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TeamQRCodeTransferredEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    private TeamQRCode $teamQRCode;

    public function __construct(TeamQRCode $teamQRCode)
    {
        $this->teamQRCode = $teamQRCode;
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('team.' . $this->teamQRCode->team_id),
            new PrivateChannel('team.' . $this->teamQRCode->transferred_from_team_id),
        ];
    }

    public function broadcastWith(): array
    {
        return [
            "from_team_id"  => $this->teamQRCode->transferred_from_team_id,
            "to_team_id"    => $this->teamQRCode->team_id,
        ];
    }
}
