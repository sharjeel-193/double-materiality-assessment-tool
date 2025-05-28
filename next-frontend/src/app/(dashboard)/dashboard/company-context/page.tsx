"use client"
import React, {useState} from 'react';
import { Box, Typography, Button } from '@mui/material';
import { MdEdit as EditIcon, MdClose as CloseIcon, MdSave as SaveIcon } from 'react-icons/md';
import { CompanyCharacteristics, SupplyChain } from '@/sections';

export default function CompanyContextPage() {
    const [isEditMode, setIsEditMode] = useState(false)
    const handleEditToggle = () => {
        setIsEditMode(!isEditMode);
    };

    const handleSave = () => {
        // Save logic here
        console.log('Saving all changes...');
        setIsEditMode(false);
    };

    const handleCancel = () => {
        // Cancel logic - could revert changes
        setIsEditMode(false);
    };
    return (
        <Box>
            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
            >
                <Typography
                    className='gradient-color-heading'
                    variant="h2"
                    component="h2"
                    sx={{ mb: 3 }} // Fixed: Use sx instead of direct prop
                >
                    Company Context
                </Typography>
                {
                    isEditMode?
                    <Button
                        variant="outlined"
                        startIcon={<CloseIcon />}
                        onClick={handleCancel}
                        sx={{ borderRadius: 2 }}
                    >
                        Cancel
                    </Button>:
                    <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={handleEditToggle}
                        sx={{ borderRadius: 2 }}
                    >
                        Edit
                    </Button>   
                }
            </Box>
            

            <CompanyCharacteristics isEditMode={isEditMode} />
            <SupplyChain isEditMode={isEditMode} />
            {isEditMode &&
            <Box
                sx={{
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 4,
                    pt: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ borderRadius: 3 }}
                >
                    Save All Changes
                </Button>  
            </Box>}
        </Box>
    );
}
