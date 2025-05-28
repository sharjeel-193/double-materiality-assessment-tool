import React from 'react';
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { companyInfoFields, CompanyInfoFieldType } from '@/data';
import { CompanyCharacteristics } from '@/lib/types';
import moment, { Moment } from 'moment';


interface CompanyInfoFormProps {
  data: CompanyCharacteristics;
  onChange: (field: string, value: string) => void;
}

export function CompanyInfoForm({ data, onChange }: CompanyInfoFormProps) {
    const renderField = (field: CompanyInfoFieldType) => {
        const value = data[field.name as keyof CompanyCharacteristics] || '';

        if (field.type === 'text') {
            return (
                <TextField
                    label={field.label}
                    type={field.type}
                    value={value}
                    onChange={e => onChange(field.name, e.target.value)}
                    fullWidth
                    variant="outlined"
                    multiline={field.multiline}
                    rows={4}
                />
            );
        }

        if (field.type === 'date') {
            return (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        label={field.label}
                        value={value ? moment(value) : null}
                        onChange={(newValue: Moment | null) => 
                            onChange(field.name, newValue ? newValue.format('YYYY-MM-DD') : '')
                        }
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                variant: 'outlined'
                            }
                        }}
                    />
                </LocalizationProvider>
            );
        }

        if (field.type === 'select') {
            return (
                <FormControl fullWidth>
                    <InputLabel>{field.label}</InputLabel>
                    <Select
                        value={value}
                        onChange={e => onChange(field.name, e.target.value)}
                        label={field.label}
                    >
                        {field.options?.map(option => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        }

        return null;
    };

    return (
        <Grid container spacing={3}>
            {companyInfoFields.map(field => (
                <Grid size={field.multiline ? {xs: 12, sm: 8} : {xs: 12, sm: 6, md: field.type === 'select' ? 4 : 6}} key={field.name}>
                    {renderField(field)}
                </Grid>
            ))}
        </Grid>
    );
}
