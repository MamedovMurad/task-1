import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';

export function Date() {

  return (
    <DatePickerInput
      type="range"
      label="Pick dates range"
      placeholder="Pick dates range"
   
    />
  );
}