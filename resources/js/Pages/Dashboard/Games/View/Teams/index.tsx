import { router } from "@inertiajs/react";
import { Container } from "react-bootstrap";
import { TableColumnType } from "react-bs-datatable";

import { Game } from "@/types/game";
import { Team } from "@/types/team";
import { PaginatedData } from "@/types";
import DataTable from "@/Components/DataTable";
import DashboardLayout from "@/Layouts/DashboardLayout";

interface Props {
    game: Game
    teams: PaginatedData<Team>;
};

const headers: TableColumnType<Team>[] = [
    {
        prop: "id",
        title: "ID",
    },
    {
        prop: "name",
        title: "Naam",
    },
    {
        prop: "created_at",
        title: "Aangemaakt op",
        cell: (row) => new Date(row.created_at).toLocaleString()
    },
];

export default function Teams({game, teams}: Props) {
    return (
        <DashboardLayout 
            title={`${game.name} - Teams`} 
            breadcrumbs={[
                { label: 'Spellen', href: route('dashboard.games.index') },
                { label: game.name, href: route('dashboard.games.view', game.id) },
                { label: 'Teams', href: route('dashboard.games.teams.index', game.id) },
            ]}
        >
            <Container>
                <DataTable data={teams.data} headers={headers} searchable onRowClick={(row) => {
                    router.visit(route('dashboard.games.teams.view', {
                        id: game.id,
                        teamId: row.id,
                    }));
                }}/>
            </Container>
        </DashboardLayout>
    );
};
