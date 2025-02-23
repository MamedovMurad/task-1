import { Table, Pagination, Loader, ActionIcon, Select } from "@mantine/core";
import { IMockData } from "../../Models/mock";
import { CancelIcon, SearchIcon } from "../../svg";

export default function PaginatedTable({
    data, page, limit, loading, setPage, paginatedData, setSelectedId, selectedId, insidePoints, setlimit
}:
    {
        data: IMockData[],
        paginatedData: IMockData[],
        page: number,
        limit: number,
        loading: boolean,
        selectedId: number | null,
        insidePoints: { lng: number; lat: number }[],
        setSelectedId: (param: number | null) => void,
        setPage: (param: number) => void,
        setlimit: (param: number) => void,
    }) {

    console.log(insidePoints, 'in');

    // Handle dynamic limit change
    const handleLimitChange = (value: string | null) => {
        if (value !== null) {
            setlimit(Number(value)); // Update limit state
            setPage(1); // Reset page to 1 when limit changes
        }
    };

    return (
        <div className="shadow-2xl pb-5">
            {loading ? (
                <Loader />
            ) : (
                <>
                    {/* Limit selection dropdown */}
                    <div className="mb-4 flex justify-end">
                        <Select
                            label="Items per page"
                            value={String(limit)} // Ensure value is a string
                            onChange={handleLimitChange} // Ensure value passed to onChange is string or null
                            data={[10, 15, 20, 30, 50, 100].map(String)}  // Available options for limit
                            style={{ width: 150 }}
                        />
                    </div>

                    <Table
                        striped
                        highlightOnHover
                        withRowBorders={false}

                    >
                        <Table.Thead>
                            <Table.Tr className="text-xs">
                                <Table.Th>ID</Table.Th>
                                <Table.Th>First Name</Table.Th>
                                <Table.Th>Last Name</Table.Th>
                                <Table.Th>Phone</Table.Th>
                                <Table.Th>Birth Year</Table.Th>
                                <Table.Th>Location</Table.Th>
                                <Table.Th>Gps code</Table.Th>
                                <Table.Th>Date time</Table.Th>
                                <Table.Th>Action</Table.Th>
                            </Table.Tr>
                        </Table.Thead>

                        <Table.Tbody>
                            {paginatedData.map((item) => (
                                <Table.Tr bg={(item.id === selectedId) ? "#7ab8f9" : ""} key={item.id}>
                                    <Table.Td>{item.id}</Table.Td>
                                    <Table.Td>{item.first_name}</Table.Td>
                                    <Table.Td>{item.last_name}</Table.Td>
                                    <Table.Td>{item.phone_number}</Table.Td>
                                    <Table.Td>{item.birth_year}</Table.Td>
                                    <Table.Td>{item.latitude}, {item.longitude}</Table.Td>
                                    <Table.Td>{item.gps_code}</Table.Td>
                                    <Table.Td>{item.datetime}</Table.Td>
                                    <Table.Td>
                                        <a href="#main-area">            <ActionIcon
                                            color={item.id === selectedId ? "#fa5252" : "#228be6"}
                                            variant="filled"
                                            aria-label="Settings"
                                            onClick={() => { setSelectedId(item.id === selectedId ? null : item.id); }}
                                        >
                                            {selectedId === item.id ? <CancelIcon color="white" /> : <SearchIcon color="white" />}
                                        </ActionIcon></a>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>

                    {/* Pagination */}
                    {limit < data.length && (
                        <div className="flex justify-center">
                            <Pagination
                                total={Math.ceil(data.length / limit)}  // Calculate total pages
                                value={page}
                                onChange={setPage}
                                mt="md"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
