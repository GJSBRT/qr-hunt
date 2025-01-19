<?php

use App\Broadcasting\GameChannel;
use App\Broadcasting\TeamChannel;
use App\Broadcasting\TeamPlayerChannel;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('game.{gameId}', GameChannel::class, [ 'guards' => ['guest'] ]);
Broadcast::channel('team.{teamId}', TeamChannel::class, [ 'guards' => ['guest'] ]);
Broadcast::channel('team-player.{teamPlayerId}', TeamPlayerChannel::class, [ 'guards' => ['guest'] ]);
