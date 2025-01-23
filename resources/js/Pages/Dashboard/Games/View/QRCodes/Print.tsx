import { Col, Row } from "react-bootstrap";

import { Game } from "@/types/game";
import DashboardLayout from "@/Layouts/DashboardLayout";

interface Props {
    game: Game;
    images: Array<{
        image: string;
        label: string;
    }>;
};

export default function Print({ game, images }: Props) {
    return (
        <DashboardLayout
            title={`${game.name} - QR Codes`}
            breadcrumbs={[
                { label: 'Spellen', href: route('dashboard.games.index') },
                { label: game.name, href: route('dashboard.games.view', game.id) },
                { label: 'QR Codes', href: route('dashboard.games.qr-codes.index', game.id) },
                { label: 'Print', href: route('dashboard.games.qr-codes.print', game.id) },
            ]}
        >
            <Row className="text-center">
                <p className="print:hidden text-3xl font-bold text-red-500">Print met CTRL + P</p>
            </Row>

            <Row className='gap-8'>
                {(images.length > 0) &&
                    <Col style={{ pageBreakInside: 'avoid' }} sm={4} className="mb-16 text-center">
                        <img src={'data:image/png;base64,' + images[0].image} />
                        <label className="text-xl font-bold mt-2">Onderdeel van Scouting spel. Graag laten hangen aub :)</label><br />
                        <label className="text-xl font-bold mt-2">Voorbeeld voor tijdens uitleg</label>
                    </Col>
                }

                {images.map(image => (
                    <Col style={{ pageBreakInside: 'avoid' }} key={image.label} sm={4} className="mb-16 text-center">
                        <img src={'data:image/png;base64,' + image.image} />
                        <label className="text-xl font-bold mt-2">Onderdeel van Scouting spel. Graag laten hangen aub :)</label><br />
                        <label className="text-xl font-bold mt-2">{image.label}</label>
                    </Col>
                ))}
            </Row>
        </DashboardLayout>
    );
}