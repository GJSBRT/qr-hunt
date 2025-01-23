import DataTable from "@/Components/DataTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { PaginatedData } from "@/types";
import { Game } from "@/types/game";
import { QRCode } from "@/types/qr_code";
import { Link, router } from "@inertiajs/react";
import { Button, Container, Row } from "react-bootstrap";
import { TableColumnType } from "react-bs-datatable";
import CreateQRCodeButton from "./Partials/CreateQRCodeButton";
import { Quartet } from "@/types/quartet";
import { Power, POWER_TYPE_LANGUAGE } from "@/types/power";

type rowType = QRCode & {
    quartet: Quartet;
    power: Power;
};

interface Props {
    game: Game
    qrCodes: PaginatedData<rowType>;
};

const headers: TableColumnType<rowType>[] = [
    {
        prop: "uuid",
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
        prop: "description",
        title: "Beschrijving",
        cell: (row) => row.description ?? <small className="italic">Geen beschrijving</small>
    },
    {
        prop: "max_scans",
        title: "Maximale scans",
        cell: (row) => row.max_scans ?? <small className="italic">Onbeperkt</small>
    },
    {
        prop: "created_at",
        title: "Aangemaakt op",
        cell: (row) => new Date(row.created_at).toLocaleString()
    },
];

export default function QRCodes({ game, qrCodes }: Props) {
    return (
        <DashboardLayout
            title={`${game.name} - QR Codes`}
            headerSlot={
                <div className="flex gap-2">
                    {/* 
                    @ts-ignore */}
                    <Button variant='secondary' as={Link} href={route('dashboard.games.qr-codes.print', game.id)}>Printen</Button>
                    <CreateQRCodeButton game={game} />
                </div>
            }
            breadcrumbs={[
                { label: 'Spellen', href: route('dashboard.games.index') },
                { label: game.name, href: route('dashboard.games.view', game.id) },
                { label: 'QR Codes', href: route('dashboard.games.qr-codes.index', game.id) },
            ]}
        >
            <Container>
                <DataTable
                    data={qrCodes.data}
                    headers={headers}
                    searchable
                    onRowClick={(row) => {
                        router.visit(route('dashboard.games.qr-codes.view', {
                            id: game.id,
                            qrCodeUuid: row.uuid,
                        }));
                    }}
                />
            </Container>
        </DashboardLayout>
    );
};
