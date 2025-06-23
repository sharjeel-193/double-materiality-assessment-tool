// components/NoReportPrompt.tsx
import React from 'react';
import { Box, Typography, Button, Paper, Stack } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Link from 'next/link';


export function NoReportPrompt() {
    return (
        <Box
            sx={{
                py: 6,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 320,
            }}
        >
            <Paper
                elevation={2}
                sx={{
                    p: { xs: 3, sm: 5 },
                    borderRadius: 3,
                    maxWidth: 420,
                    width: '100%',
                    textAlign: 'center',
                }}
            >
                <Stack spacing={3} alignItems="center">
                    <AssignmentIcon color="primary" sx={{ fontSize: 56 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        No Report Found
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        You haven&apos;t created any report yet. To access this section, please create a new report first.
                    </Typography>
                    <Link href={'/dashboard/'}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 2, minWidth: 180 }}
                        >
                            Create Report
                        </Button>
                    </Link>
                </Stack>
            </Paper>
        </Box>
    );
}
