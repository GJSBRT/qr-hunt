<?php

namespace App\Console\Commands;

use App\GameModes\Territory\Models\TerritoryArea;
use App\GameModes\Territory\Models\TerritoryAreaPoint;
use Illuminate\Console\Command;

class ImportFromGoogleMapsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-from-google-maps {file}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import areas from google maps';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $file = fopen($this->argument('file'), "r");
        while (($row = fgetcsv($file)) !== false) {
            if (!str_contains($row[0], "POLYGON")) continue;

            $area = TerritoryArea::create([
                'territory_id' => 1,
                'name' => $row[1],
            ]);

            $dataPointsString = str_replace('POLYGON ((', '', $row[0]);
            $dataPointsString = str_replace('))', '', $dataPointsString);
            $dataPoints = explode(', ', $dataPointsString);

            foreach ($dataPoints as $dataPointString) {
                $points = explode(' ', $dataPointString);
                TerritoryAreaPoint::create([
                    'territory_area_id' => $area->id,
                    'lat' => $points[1],
                    'lng' => $points[0],
                ]);
            }
        }
        fclose($file);
    }
}
