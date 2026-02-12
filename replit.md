# Klara's Birthday App

## Overview
A React-based birthday greeting app with animations and confetti effects. Built with Vite, React, Framer Motion, and Tailwind CSS (via CDN).

## Project Architecture
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (CDN), custom fonts (Playfair Display, Montserrat)
- **Animations**: Framer Motion, Canvas Confetti
- **Icons**: Lucide React

## Project Structure
- `index.html` - Entry HTML with import maps and Tailwind CDN
- `index.tsx` - React entry point
- `App.tsx` - Main application component
- `components/` - React components (e.g., MusicToggle)
- `constants.tsx` - App constants
- `types.ts` - TypeScript type definitions
- `vite.config.ts` - Vite configuration (port 5000, all hosts allowed)

## Running
- `npm run dev` - Start dev server on port 5000

## Recent Changes
- Configured for Replit environment (port 5000, allowedHosts: true)
