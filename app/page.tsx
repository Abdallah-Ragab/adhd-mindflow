'use client';

import React from 'react';
import { CssBaseline, Button, Container, Typography, Grid, Card, CardContent, Link, Box, AspectRatio } from '@mui/joy';
import Layout from './components/Layout';
import Header from './components/Header';
import Image from 'next/image';

const LandingPage = () => {
  return (
    <Layout.LandingRootWithMobileNav>
      <Layout.Header>
        <Header />
      </Layout.Header>
      <CssBaseline />
      <Container maxWidth="lg">
        {/* Intro Section */}
        <Box
          sx={{
            height: '100vh',
            backgroundImage: 'url("/path-to-your-cover-image.jpg")', // replace with your cover image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: '#fff',
          }}
        >
          <Typography level="h1" fontSize="4rem">
            MindFlow
          </Typography>
          <Typography level="h3" fontSize="1.5rem" sx={{ mt: 2 }}>
            Enhancing Productivity for ADHD Minds
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button variant="solid" size="lg" component={Link} href="/app">
              Start Using MindFlow
            </Button>
          </Box>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Link href="#features" sx={{ mx: 2 }}>Features</Link>
          <Link href="#about" sx={{ mx: 2 }}>About</Link>
        </Box>

        {/* Feature Section */}
        <Box id="features" sx={{ mt: 8 }}>
          <Typography level="h2" fontSize="3rem" textAlign="center">
            Key Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {/* Feature 1: Task & Habit Tracking */}
            <Grid item xs={12} md={4}>
              <Card>
                <AspectRatio ratio="16/9">
                  <Image
                    src="/landing-happy.jpeg"
                    alt="Task & Habit Tracking"
                    width={300}
                    height={300}
                  />
                </AspectRatio>
                <CardContent>
                  <Typography level="h5"  fontWeight='bold' marginBottom='5px'>Task & Habit Tracking</Typography>
                  <Typography>
                    Track your tasks, habits, and long-term goals with personalized task types: time-based, count-based, or simple checklists.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Feature 2: Progress Reporting */}
            <Grid item xs={12} md={4}>
              <Card>
                <AspectRatio ratio="16/9">
                  <Image
                    src="/landing-time.jpeg"
                    alt="Progress Reporting"
                    width={300}
                    height={300}
                  />
                </AspectRatio>
                <CardContent>
                  <Typography level="h5"  fontWeight='bold' marginBottom='5px'>Progress Reporting</Typography>
                  <Typography>
                    Get detailed insights on your progress and stay motivated with reports that track task completion and goal progress.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Feature 3: Focus Sessions & Task Recommendations */}
            <Grid item xs={12} md={4}>
              <Card>
                <AspectRatio ratio="16/9">
                  <Image
                    src="/landing-study.jpeg"
                    alt="Focus Sessions"
                    width={300}
                    height={300}
                  />
                </AspectRatio>
                <CardContent>
                  <Typography level="h5"  fontWeight='bold' marginBottom='5px'>Focus Sessions & Task Recommendations</Typography>
                  <Typography>
                    Enter focused sessions where MindFlow suggests tasks based on novelty, urgency, interest, and challenge, ideal for ADHD minds.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* About Section */}
        <Box id="about" sx={{ mt: 8, mb: 8 }}>
          <Typography level="h2" fontSize="3rem" textAlign="center">
            About MindFlow
          </Typography>
          <Typography sx={{ mt: 4 }}>
            MindFlow was born from a personal journey of managing ADHD in a world filled with distractions. We wanted to create a tool that is tailored to how ADHD minds work—prioritizing not just importance, but novelty, interest, urgency, and challenge.
          </Typography>

          {/* Team Links */}
          <Box sx={{ mt: 4 }}>
            <Typography level="h4">Developer</Typography>
            <Typography>
              <Link href="https://linkedin.com" target="_blank">LinkedIn</Link> | <Link href="https://github.com" target="_blank">GitHub</Link> | <Link href="https://twitter.com" target="_blank">Twitter</Link>
            </Typography>
          </Box>

          {/* GitHub Repository Link */}
          <Box sx={{ mt: 4 }}>
            <Button variant="solid" component={Link} href="https://github.com/your-repo-link" target="_blank">
              View on GitHub
            </Button>
          </Box>
        </Box>
      </Container>
    </Layout.LandingRootWithMobileNav>
  );
};

export default LandingPage;
