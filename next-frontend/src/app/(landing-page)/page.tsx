import { AboutSection, HeroSection } from '@/sections';
import {
    Box,
    Typography
} from '@mui/material';


export default function LandingPage() {
    return (
        <Box>
            <HeroSection />
            <AboutSection />
                <Typography>
                    THIS IS THE LANDING PAGE
                </Typography>
        </Box>
    );
}
