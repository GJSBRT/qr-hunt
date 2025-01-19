import DataTable from "@/Components/DataTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { PaginatedData } from "@/types";
import { Game } from "@/types/game";
import { QRCode } from "@/types/qr_code";
import { router } from "@inertiajs/react";
import { Container } from "react-bootstrap";
import { TableColumnType } from "react-bs-datatable";
import CreateQRCodeButton from "./Partials/CreatePowerButton";
import { Power } from "@/types/power";

interface Props {
    game: Game
    powers: PaginatedData<Power>;
};

const headers: TableColumnType<Power>[] = [
    {
        prop: "id",
        title: "ID",
    },
    {
        prop: "description",
        title: "Beschrijving",
        cell: (row) => row.description ?? <small className="italic">Geen beschrijving</small>
    },
    {
        prop: "power_up",
        title: "Power up",
        cell: (row) => row.power_up ? 'Power up' : 'Power down'
    },
    {
        prop: "related_to_other_team",
        title: "Gerelateerd aan andere teams",
        cell: (row) => row.power_up ? 'Ja' : 'Nee'
    },
    {
        prop: "type",
        title: "Type",
        cell: (row) => {
            switch (row.type) {
                case 'message':
                    return 'Bericht';
            }
        }
    },
    {
        prop: "created_at",
        title: "Aangemaakt op",
        cell: (row) => new Date(row.created_at).toLocaleString()
    },
];

export default function Powers({game, powers}: Props) {
    return (
        <DashboardLayout 
            title={`${game.name} - Powers`} 
            headerSlot={<CreateQRCodeButton game={game}/>}
            breadcrumbs={[
                { label: 'Spellen', href: route('dashboard.games.index') },
                { label: game.name, href: route('dashboard.games.view', game.id) },
                { label: 'Powers', href: route('dashboard.games.powers.index', game.id) },
            ]}
        >
            <Container>
                <DataTable data={powers.data} headers={headers} searchable onRowClick={(row) => {
                    router.visit(route('dashboard.games.powers.view', {
                        id: game.id,
                        powerId: row.id,
                    }));
                }}/>
            </Container>
        </DashboardLayout>
    );
};
