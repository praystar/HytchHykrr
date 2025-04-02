# HitchHiking App Frontend

A modern, secure, and user-friendly frontend for a hitchhiking application built with React, TypeScript, and Material-UI.

## Features

### Core Safety Features
- Emergency SOS System with one-tap activation
- Real-time location sharing
- Discreet activation via voice command or hidden gesture
- Rigorous identity verification
- Live GPS tracking
- Vehicle verification system

### Trust & Community Building
- Comprehensive profile system
- Ratings and reviews
- Trust badges for verified users
- Pre-ride transparency
- Shared preferences

### Ride Matching & Logistics
- Smart matching algorithm
- Route optimization
- Time-based filters
- Public pickup/drop-off zones
- In-app messaging with masked phone numbers

## Tech Stack

- React 18
- TypeScript
- Material-UI (MUI)
- Redux Toolkit
- React Router
- Leaflet Maps
- Axios
- Formik & Yup
- Socket.IO Client

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   └── layout/
│   ├── pages/
│   ├── store/
│   │   └── slices/
│   ├── theme.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
└── README.md
```

## Key Components

- `Layout`: Main application layout with navigation
- `Home`: Landing page with features showcase
- `Map`: Real-time location tracking and ride visualization
- `Profile`: User profile management
- `Emergency`: SOS system and emergency features
- `RideRequest`: Ride matching and booking system
- `Login/Register`: Authentication components

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=your_api_url
VITE_MAPS_API_KEY=your_maps_api_key
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Material-UI for the component library
- Leaflet for the maps integration
- Redux Toolkit for state management
- React Router for navigation
