import { AboutSection, ContactSection, HeroSection } from '@/sections';
import {
    Box,
    Typography
} from '@mui/material';


export default function LandingPage() {
    return (
        <Box>
            <HeroSection />
            <AboutSection />
            <ContactSection />
                <Typography>
                    THIS IS THE LANDING PAGE
                </Typography>
        </Box>
    );
}
