import { MultiSelect, TextInput, Button } from '@mantine/core';
import { useFormHook } from './useFormHook';

import '@mantine/dates/styles.css';
import { DatePickerInput, YearPickerInput } from '@mantine/dates';

type Props = {
    gps_codes?: string[];
    filterData: (param: any) => void;
    reset: () => void;
};

function FormContainer({ gps_codes, filterData, reset }: Props) {
    const uniq = [...new Set(gps_codes?.filter(Boolean))]; // Ensure no empty values
    const { form, handleSubmit } = useFormHook({ filterData });

    return (
        <div className="flex justify-center items-end mb-10 shadow-2xl py-3">
            <form onSubmit={form.onSubmit((handleSubmit))}>
                <div className="flex gap-3">
                    <TextInput
                        label="First name"
                        {...form.getInputProps('firstName')}
                        placeholder="First name"
                    />
                    <TextInput
                        label="Last name"
                        {...form.getInputProps('lastName')}
                        placeholder="Last name"
                    />
                    <TextInput
                        label="Phone"
                        {...form.getInputProps('phone')}
                        placeholder="Phone"
                    />
                    <div>
                        {uniq.length > 0 && (
                            <MultiSelect
                                label="GPS code"
                                placeholder="Select or add new..."
                                data={uniq}
                                searchable
                                clearable
                                maxDropdownHeight={200} // Max height for the dropdown
                                styles={{
                                    input: {
                                        height: '36px',
                                        overflowY: 'auto', // Fixed height for the input area
                                    },
                                    dropdown: {
                                        maxHeight: '200px', // Max height for the dropdown
                                        overflowY: 'auto', // Make dropdown scrollable
                                    },
                                    root: {
                                        width: '250px', // Width of the MultiSelect component
                                    },
                                }}
                            />
                        )}
                    </div>
                    <div className=' flex gap-x-2'>
                        <YearPickerInput
                            label="Birth day from"
                            placeholder="Pick date"
                            {...form.getInputProps('birth_year_from')}
                        />
                        <YearPickerInput
                            label="Birth day to"
                            placeholder="Pick date"
                            {...form.getInputProps('birth_year_to')}
                        />
                    </div>
                    <div>
                        <DatePickerInput
                            size='sm'
                            type="range"
                            label="Date time range"
                            placeholder="Pick dates range"
                            {...form.getInputProps('created_date')}

                        />
                    </div>
                    <div className="flex items-end gap-x-2">
                        <Button type="submit" className="mt-4 flex  items-center gap-x-4"> Search</Button>
                        <Button onClick={() => { form.reset(); reset() }} type="button" className="mt-4 flex justify-between items-center" color='#777'><span className=' '>Clear</span></Button>
                    </div>
                </div>

            </form>
        </div>
    );
}

export default FormContainer;
