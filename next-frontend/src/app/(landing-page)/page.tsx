import { Loader } from '@/components';
import {
    Box,
} from '@mui/material';
import { lazy, Suspense } from 'react';

const HeroSection  = lazy(() => 
    import('@/sections').then(module => ({default: module.HeroSection}))
)

const AboutSection  = lazy(() => 
    import('@/sections').then(module => ({default: module.AboutSection}))
)

const ContactSection  = lazy(() => 
    import('@/sections').then(module => ({default: module.ContactSection}))
)


export default function LandingPage() {
    return (
        <Box>
            <Suspense fallback={<Loader variant={'inline'} />}>
                <HeroSection />
            </Suspense>
            <Suspense fallback={<Loader variant={'inline'} />}>
                <AboutSection />
            </Suspense>
            <Suspense fallback={<Loader variant={'inline'} />}>
                <ContactSection />
            </Suspense>
        </Box>
    );
}
