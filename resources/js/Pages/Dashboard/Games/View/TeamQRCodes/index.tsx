import { router } from "@inertiajs/react";
import { Container } from "react-bootstrap";
import { TableColumnType } from "react-bs-datatable";

import { Game } from "@/types/game";
import { Team, TeamPlayer } from "@/types/team";
import { PaginatedData } from "@/types";
import DataTable from "@/Components/DataTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { QRCode, TeamQRCode } from "@/types/qr_code";
import { Power, POWER_TYPE_LANGUAGE } from "@/types/power";
import { Quartet } from "@/types/quartet";

interface Props {
    game: Game;
    teamQRCodes: PaginatedData<TeamQRCode & {
        power: Power;
        quartet: Quartet;
        qr_code: QRCode;
        team: Team;
        transferred_from_team: Team;
        team_player: TeamPlayer;
    }>;
};

const headers: TableColumnType<TeamQRCode & {
    power: Power;
    quartet: Quartet;
    qr_code: QRCode;
    team: Team;
    transferred_from_team: Team;
    team_player: TeamPlayer;
}>[] = [
    {
        prop: "id",
        title: "QR Code",
        cell: (row) => {
            if (row.power) {
                return POWER_TYPE_LANGUAGE[row.power.type] ?? 'Onbekende power'
            }

            if (row.quartet) {
                return `${row.quartet.category} - ${row.quartet.value}`
            }

            return 'Lege QR code';
        },
        cellProps: {
            style: (row) => (row.quartet ? {
                background: row.quartet.color
            } : {})
        }
    },
    {
        prop: "team_id",
        title: "Team",
        cell: (row) => {
            return row.team?.name ?? '-'
        }
    },
    {
        prop: "transferred_from_team",
        title: "Transferred from",
        cell: (row) => {
            return row.transferred_from_team?.name ?? '-'
        }
    },
    {
        prop: "power_used_at",
        title: "Power toegepast op",
        cell: (row) => row.power_used_at ? new Date(row.power_used_at).toLocaleString() : '-'
    },
    {
        prop: "team_player_id",
        title: "Gescanned door",
        cell: (row) => row.team_player?.name ?? '-'
    },
    {
        prop: "created_at",
        title: "Aangemaakt op",
        cell: (row) => new Date(row.created_at).toLocaleString()
    },
];

export default function QRCodes({game, teamQRCodes}: Props) {
    return (
        <DashboardLayout 
            title={`${game.name} - Gevonden QR codes`} 
            breadcrumbs={[
                { label: 'Spellen', href: route('dashboard.games.index') },
                { label: game.name, href: route('dashboard.games.view', game.id) },
                { label: 'QR Codes', href: route('dashboard.games.team-qr-codes', game.id) },
            ]}
        >
            <Container>
                <DataTable data={teamQRCodes.data} headers={headers}/>
            </Container>
        </DashboardLayout>
    );
};
