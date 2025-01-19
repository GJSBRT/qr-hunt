import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { router } from "@inertiajs/react";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { DatatableWrapper, Pagination, PaginationOptions, SortType, TableBody, TableColumnType, TableHeader, TableRowType } from "react-bs-datatable";
import { HtmlTrProps } from "react-bs-datatable/lib/esm/components/TableBody";

interface Props<T extends object> extends React.HTMLAttributes<HTMLTableElement> {
    headers: TableColumnType<T>[];
    data: T[];
    searchable?: boolean;
    rowProps?: (row: T) => HtmlTrProps
    onRowClick?: (row: T) => void;
}

export default function DataTable<T extends object>({ headers, data, searchable, rowProps, onRowClick, ...props }: Props<T>) {
    const urlParams = new URLSearchParams(import.meta.env.SSR ? '' : window.location.search);

    const [searchQuery, setSearchQuery] = useState<string>(urlParams.get('search') ?? '');
    const [sortingState, setSortingState] = useState<SortType | undefined>(undefined);
    // const [paginationState, setPaginationState] = useState<PaginationState>({
    //     pageIndex: urlParams.has('page') ? parseInt(urlParams.get('page') ?? '') - 1 : 0,
    //     pageSize: urlParams.has('size') ? parseInt(urlParams.get('size') ?? '') : 50,
    // })

    return (
        <DatatableWrapper
            {...props}
            body={data}
            headers={headers}
            paginationOptionsProps={{
                initialState: {
                    rowsPerPage: 50,
                    options: [10, 25, 50, 100, 250]
                }
            }}
        >
            {searchable &&
                <Row className="mb-4 p-2">
                    <Col
                        xs={12}
                        lg={4}
                    >
                        <form onSubmit={(e) => {
                            e.preventDefault();

                            if (searchQuery == '') {
                                urlParams.delete('search');

                                const path = window.location.href.split('?')[0];
                                const newURL = `${path}?${urlParams}`;

                                router.visit(newURL);
                                return;
                            }

                            urlParams.set('search', searchQuery);

                            const path = window.location.href.split('?')[0];
                            const newURL = `${path}?${urlParams}`;

                            router.visit(newURL);
                        }}>
                            <InputGroup>
                                <InputGroup.Text id="basic-addon1">
                                    <FontAwesomeIcon icon={faSearch} />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Zoeken..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.currentTarget.value);
                                    }}
                                />
                            </InputGroup>
                        </form>
                    </Col>
                </Row>
            }

            <Table hover striped>
                <TableHeader controlledProps={{
                    onSortChange: (nextProp) => {
                        setSortingState(sortingState);
                    },
                    sortState: sortingState
                }} />

                <TableBody rowProps={rowProps} classes={{ tr: (onRowClick) && 'cursor-pointer' }} onRowClick={(row) => {
                    if (!onRowClick) return;

                    onRowClick(row as T);
                }} />
            </Table>

            <Row className="mb-4 p-2 items-end justify-between gap-2">
                <Col
                    xs={12}
                    sm={6}
                    lg={2}
                >
                    <PaginationOptions />
                </Col>

                <Col
                    xs={12}
                    sm={6}
                    lg={2}
                >
                    <Pagination />
                </Col>
            </Row>
        </DatatableWrapper>
    );
}
