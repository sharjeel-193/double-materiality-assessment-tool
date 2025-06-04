"use client"
import React, { useEffect } from 'react';
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Box,
    Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contextInfoFields, ContextInfoFieldType } from '@/data';
import { Context } from '@/types';
import { contextSchema, ContextFormData } from '@/formValidations';

interface CompanyInfoFormProps {
    data: Partial<Context> | null;
    onChange: (field: string, value: string) => void;
}

export function CompanyInfoForm({ data, onChange }: CompanyInfoFormProps) {
    const {
        control,
        formState: { errors, isValid },
        setValue,
    } = useForm<ContextFormData>({
        resolver: zodResolver(contextSchema),
        mode: 'onChange',
        defaultValues: {
            location: data?.location || undefined, // ✅ Use undefined instead of ''
            type: data?.type || undefined,
            form: data?.form || undefined,
            size_employees: data?.size_employees || undefined,
            size_revenue: data?.size_revenue || undefined,
            customer_scope: data?.customer_scope || undefined,
            supply_chain_scope: data?.supply_chain_scope || undefined,
            extra_details: data?.extra_details || undefined
        }
    });

    // Watch all form values and notify parent of changes
    // const watchedValues = watch();
    
    // useEffect(() => {
    //     Object.entries(watchedValues).forEach(([field, value]) => {
    //         if (value !== undefined && value !== null) {
    //             onChange(field, value);
    //         }
    //     });
    // }, [watchedValues, onChange]);

    // Update form when data prop changes
    useEffect(() => {
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    setValue(key as keyof ContextFormData, value);
                }
            });
        }
    }, [data, setValue]);

    const renderField = (field: ContextInfoFieldType) => {
        const fieldError = errors[field.name as keyof ContextFormData];

        if (field.type === 'text') {
            return (
                <Controller
                    name={field.name as keyof ContextFormData}
                    control={control}
                    render={({ field: { onChange: fieldOnChange, value, ...fieldProps } }) => (
                        <TextField
                            {...fieldProps}
                            label={field.label}
                            value={value || ''}
                            onChange={(e) => {
                                fieldOnChange(e.target.value);
                                onChange(field.name, e.target.value);
                            }}
                            fullWidth
                            variant="outlined"
                            multiline={field.multiline}
                            rows={field.multiline ? 4 : 1}
                            required={field.required}
                            error={!!fieldError}
                            helperText={fieldError?.message}
                            placeholder={field.multiline ? 'Enter additional details...' : ''}
                        />
                    )}
                />
            );
        }

        if (field.type === 'select') {
            return (
                <Controller
                    name={field.name as keyof ContextFormData}
                    control={control}
                    render={({ field: { onChange: fieldOnChange, value, ...fieldProps } }) => (
                        <FormControl fullWidth error={!!fieldError}>
                            <InputLabel required={field.required}>
                                {field.label}
                            </InputLabel>
                            <Select
                                {...fieldProps}
                                value={value || ''}
                                onChange={(e) => {
                                    fieldOnChange(e.target.value);
                                    onChange(field.name, e.target.value);
                                }}
                                label={field.label}
                            >
                                <MenuItem value="">
                                    <em>Select {field.label}</em>
                                </MenuItem>
                                {field.options?.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {fieldError && (
                                <FormHelperText>{fieldError.message}</FormHelperText>
                            )}
                        </FormControl>
                    )}
                />
            );
        }

        return null;
    };

    const hasErrors = Object.keys(errors).length > 0;

    return (
        <Box>
            {hasErrors && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    Please fix the validation errors below before saving.
                </Alert>
            )}

            <Grid container spacing={3}>
                {contextInfoFields.map(field => (
                    <Grid 
                        size={
                            field.multiline 
                                ? { xs: 12 } 
                                : { xs: 12, sm: 6, md: 4 }
                        } 
                        key={field.name}
                    >
                        {renderField(field)}
                    </Grid>
                ))}
            </Grid>

            {/* Form Status */}
            <Box sx={{ mt: 2 }}>
                <Alert severity={isValid ? 'success' : 'warning'} variant="outlined">
                    Form is {isValid ? 'valid' : 'incomplete'}. 
                    {!isValid && ' Please fill in all required fields.'}
                </Alert>
            </Box>
        </Box>
    );
}
