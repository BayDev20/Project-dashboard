# Amazon Warehouse Mission Control

## Overview

Amazon Warehouse Mission Control is a sophisticated web application designed to monitor and manage Amazon's warehouse network across the United States. This project provides real-time weather data, warehouse statistics, and interactive maps to help logistics managers make informed decisions.

## Features

- Interactive US map with warehouse locations
- Real-time weather data for each warehouse
- Detailed state-level warehouse information
- User authentication and authorization
- Responsive design for various devices
- Dynamic data visualization with charts and graphs

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Firebase](https://firebase.google.com/) - Authentication and real-time database
- [D3.js](https://d3js.org/) - Data visualization library
- [React Simple Maps](https://www.react-simple-maps.io/) - React components for creating maps
- [Recharts](https://recharts.org/) - Charting library built on React components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library for React

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/baydev20/Project-dashboard.git
   ```

2. Navigate to the project directory
   ```bash
   cd Project-dashboard
   ```

3. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

4. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your Firebase configuration and other necessary API keys.

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
amazon-warehouse-mission-control/
├── app/
│   ├── components/
│   ├── lib/
│   ├── types/
│   ├── dashboard.tsx
│   ├── login.tsx
│   └── ...
├── public/
├── styles/
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Configuration

Ensure you have set up the following environment variables in your `.env.local` file:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## Deployment

This project is set up for easy deployment on [Vercel](https://vercel.com/). Simply connect your GitHub repository to Vercel for automatic deployments on every push to the main branch.

For other deployment options, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Contributing

We welcome contributions to this project. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Amazon for inspiration
- OpenWeatherMap API for weather data
- Google Maps API for mapping services

## Contact

Cody Beggs 

Project Link: [https://amazon-dashboard-indol.vercel.app](https://github.com/BayDev20/Project-dashboard)
