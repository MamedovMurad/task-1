import { useForm } from '@mantine/form';

export function useFormHook({ filterData }: { filterData: (param: any) => void }) {
    const form = useForm({
        initialValues: {
            firstName: '',
            lastName: '',
            phone: '',
            gpsCode: [] as string[], // Ensuring it's an array of strings
            created_date: [null, null] as [Date | null, Date | null], // Proper default for date range
            birth_year_from: null,
            birth_year_to: null,
        },
    });
    function handleSubmit(values: typeof form.values) {
        // Transform birth years to numbers if they are valid Date objects
        const formattedValues = {
            ...values,
            birth_year_from: values.birth_year_from ? new Date(values.birth_year_from).getFullYear() : null,
            birth_year_to: values.birth_year_to ? new Date(values.birth_year_to).getFullYear() : null,
            created_date: values.created_date.filter(Boolean), // Remove null values from date range
        };
    
        console.log("Submitted Values:", formattedValues);
        filterData(formattedValues); // Send formatted data
    }
    

    return { form, handleSubmit };
}
