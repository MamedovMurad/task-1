import { useEffect, useState } from "react";
import { IMockData } from "../Models/mock";

export function useMapData() {
    const [data, setData] = useState<IMockData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setlimit] = useState(window.innerHeight < 1200 ? 10 : 20);
    const [insidePoints, setInsidePoints] = useState<{ lng: number; lat: number }[]>([]);

    const paginatedData: IMockData[] = data.slice((page - 1) * limit, page * limit);


    
    async function filterData(values: any) {
        setLoading(true);
        try {
            const response = await fetch("/MOCK_DATA.json");
            const result: IMockData[] = await response.json();
            const filteredData = result.filter((item) => {
                const { firstName, lastName, phone, gpsCode, created_date, birth_year_from, birth_year_to } = values;
                const [startDate, endDate] = created_date;

                // Convert the item date into a Date object
                const itemDate = new Date(item.datetime); // Assuming the item has a `created_date` field

                // Only apply filters for non-empty fields

                const itemBirthYear = item.birth_year;
      
                return (
                    (firstName ? item.first_name.toLowerCase().includes(firstName.toLowerCase()) : true) &&
                    (lastName ? item.last_name.toLowerCase().includes(lastName.toLowerCase()) : true) &&
                    (phone ? item.phone_number.includes(phone) : true) &&
                    (gpsCode.length > 0 ? gpsCode.includes(item.gps_code) : true) &&

                    // Filter based on date range if both startDate and endDate are present
                    (created_date.length > 0
                        ? itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
                        : true
                    ) &&
                    (birth_year_from ? (birth_year_from >= Number(itemBirthYear)) : true) &&
                    (birth_year_to ? (itemBirthYear <= Number(birth_year_to)) : true)


                );
            });

            setSelectedId(null);
            setPage(1);
            setInsidePoints([]);
            setData(filteredData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    }
    async function reset() {
        setLoading(true);
        try {
            const response = await fetch("/MOCK_DATA.json");
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);

        setSelectedId(null);
        setPage(1);
        setInsidePoints([]);

    }

    function filterDataForMap(params: { lng: number, lat: number }[]) {
        const commonElements = data.filter(a1 =>
            params.some(a2 => a1.longitude === a2.lng && a1.latitude === a2.lat)
        );
        setData(commonElements)
    }
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch("/MOCK_DATA.json");
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    function handleInsidePoints(params: { lng: number, lat: number }[]) {
        setInsidePoints(params)
    }


    return () => ({
        data,
        loading,
        page,
        limit,
        setlimit,
        setPage,
        paginatedData,
        selectedId,
        setSelectedId,
        filterData,
        insidePoints,
        setInsidePoints: handleInsidePoints,
        filterDataForMap,
        reset
    })
}