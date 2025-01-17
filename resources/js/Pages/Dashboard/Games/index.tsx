import { router } from "@inertiajs/react";
import { Container } from "react-bootstrap";
import { TableColumnType } from "react-bs-datatable";

import { PaginatedData } from "@/types";
import DataTable from "@/Components/DataTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Game, GAME_STATUS_LANGUAGE } from "@/types/game";

const headers: TableColumnType<Game>[] = [
    {
        prop: "name",
        title: "Name",
    },
    {
        prop: "code",
        title: "Code",
    },
    {
        prop: "status",
        title: "Status",
        cell: (row) => GAME_STATUS_LANGUAGE[row.status]
    },
    {
        prop: "created_at",
        title: "Aangemaakt op",
        cell: (row) => new Date(row.created_at).toLocaleString()
    },
];

export default function Dashboard({ games }: { games: PaginatedData<Game> }) {
    return (
        <DashboardLayout title='Spellen'>
            <Container>
                <DataTable data={games.data} headers={headers} searchable onRowClick={(row) => {
                    router.visit(route('dashboard.games.view', row.id));
                }}/>
            </Container>
        </DashboardLayout>
    );
};
