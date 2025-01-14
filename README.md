# Network Dashboard 🌐

A real-time network monitoring dashboard built with React, WebSocket, and modern web technologies.

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![WebSocket](https://img.shields.io/badge/WebSocket-black?style=for-the-badge&logo=socket.io&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![i18next](https://img.shields.io/badge/i18next-26A69A?style=for-the-badge&logo=i18next&logoColor=white)](https://www.i18next.com/)

A powerful real-time network monitoring dashboard built with modern web technologies. Monitor your network devices, track bandwidth usage, and manage network activities all in one place.

![Network Dashboard Preview](./public/assets/dashboard-preview.png)

## ✨ Features

- **Real-time Monitoring**: Track device status and network performance in real-time
- **Bandwidth Management**: Monitor and control bandwidth usage across devices
- **Multi-language Support**: Full internationalization with English and Indonesian languages
- **Theme Customization**: Toggle between dark and light themes
- **Activity Logging**: Comprehensive logging of all network activities
- **Data Export**: Export network data to CSV format for analysis

## 🎯 Use Cases

- **Network Operations Centers**: Monitor enterprise network infrastructure
- **IT Administration**: Track device connectivity and bandwidth usage
- **System Administration**: Log and analyze network activities
- **Bandwidth Management**: Implement and monitor bandwidth priorities
- **Performance Analysis**: Track and export network performance metrics

## Technologies Used

- React
- WebSocket
- i18next
- TailwindCSS
- Vite
- React-Toastify

## 🏗️ Project Structure

```
project/
│
├── public/              # Static assets
│   ├── index.html       # Entry point untuk React
│   ├── favicon.ico
│   └── assets/          # Image atau assets lainnya
│
├── src/                 # Source code utama
│   ├── components/      # Semua komponen React
│   │   ├── ui/          # Komponen UI kecil
│   │   ├── BandwidthPriorityControl.jsx
│   │   ├── DeviceFilter.jsx
│   │   ├── BandwidthHistory.jsx
│   │   └── ActivityLogger.jsx
│   │
│   ├── context/         # Context untuk state management
│   │   └── ThemeContext.jsx
│   │
│   ├── hooks/           # Custom React hooks
│   │   └── useWebSocket.jsx
│   │
│   ├── i18n/            # File untuk internasionalisasi
│   │   ├── en.json
│   │   ├── id.json
│   │   └── i18next.js
│   │
│   ├── utils/           # Helper functions
│   │   ├── sanitize.js
│   │   └── csvExport.js
│   │
│   ├── App.jsx          # Root komponen React
│   ├── index.js         # Entry point React
│   └── styles.css       # Global styles
│
├── backend/             # Server WebSocket
│   └── server.js
│
├── package.json
├── .gitignore
├── README.md
└── vite.config.js       # Config untuk Vite (atau gunakan CRA jika perlu)
```

## 🚀 Getting Started

### Prerequisites

- Node.js v14 or higher
- npm or yarn
- Git (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd network-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=8080
VITE_WS_URL=ws://localhost:8080
```

4. Start the WebSocket server:
```bash
npm run start:server
```

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to view the dashboard.

## 📝 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run start:server`: Start WebSocket server
- `npm run build:css`: Rebuild Tailwind CSS

## 🛠️ Development Guide

### Adding New Features

1. Create new components in `src/components/`
2. Add translations to `src/i18n/en.json` and `src/i18n/id.json`
3. Update WebSocket handlers in `NetworkDashboard.jsx`
4. Add UI components to `src/components/ui/`

### Code Style

- Follow React best practices and hooks guidelines
- Use meaningful component and variable names
- Add JSDoc comments for complex functions
- Follow the existing project structure

## 🚢 Deployment

1. Build the frontend:
```bash
npm run build
```

2. Configure production environment variables
3. Deploy static files from the `dist` directory
4. Set up WebSocket server with proper security measures

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 🔧 Troubleshooting

### Common Issues

- **WebSocket Connection Fails**:
  - Verify backend server is running
  - Check WebSocket URL configuration
  - Ensure no firewall blocking
  
- **Styling Issues**:
  - Run `npm run build:css`
  - Clear browser cache
  - Check TailwindCSS configuration

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [i18next Documentation](https://www.i18next.com/overview/getting-started)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- TailwindCSS team for the utility-first CSS framework
- All contributors who have helped this project grow

---

Made with ❤️ by the Network Dashboard Team
