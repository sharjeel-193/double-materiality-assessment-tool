import { AboutSection, ContactSection, HeroSection } from '@/sections';
import {
    Box,
} from '@mui/material';


export default function LandingPage() {
    return (
        <Box>
            <HeroSection />
            <AboutSection />
            <ContactSection />
        </Box>
    );
}
