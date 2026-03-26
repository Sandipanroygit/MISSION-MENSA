# Finwit Kids 🌟

> **Raising Generations Empowered for Life, Balanced in Mind, Money & Mission**

A comprehensive holistic education platform designed to empower children ages 4-18 across 12 essential life domains including financial literacy, spiritual growth, STEM education, creative arts, and more.

## 🎯 Mission

Finwit Kids provides faith-based, holistic education that nurtures children in wisdom, values, and smart decision-making. Our platform combines interactive lessons with parent-child co-learning to develop well-rounded individuals prepared for life's challenges.

## ✨ Features

### 12 Domains of Development
- 💰 **Financial Literacy** - Money management and economic understanding
- 🙏 **Spiritual Growth** - Faith-based character development
- 🧠 **Emotional Intelligence** - Self-awareness and empathy
- 🎨 **Creative Arts** - Artistic expression and creativity
- 🔬 **Science & Innovation** - STEM education and critical thinking
- 🎵 **Music & Media** - Musical skills and media literacy
- 💻 **Technology Skills** - Digital literacy and coding
- 🥗 **Nutrition & Health** - Healthy living and wellness
- 🌱 **Agriculture & Nature** - Environmental awareness
- 🏃 **Physical Wellness** - Fitness and sports
- 👑 **Leadership Skills** - Communication and teamwork
- 🌍 **Cultural Identity** - Heritage and global awareness

### Platform Capabilities
- 📚 Modular, age-appropriate programs (4-18 years)
- 🎮 Interactive lessons and activities
- 👨‍👩‍👧 Parent-child collaborative learning
- 📊 Progress tracking and personalized learning plans
- 🎯 Flexible pricing packages (Single Domain, Midi, Full Thrive)
- 📱 Responsive design for all devices

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Icons**: Lucide React
- **Animations**: react-countup
- **Linting**: ESLint with TypeScript support

## 📁 Project Structure

```
finwit-kids/
├── src/
│   ├── components/          # Feature-based components
│   │   ├── Landing/         # Landing page sections
│   │   ├── Domains/         # Domain-specific components
│   │   ├── AboutUs/         # About page components
│   │   ├── ContactUs/       # Contact form
│   │   ├── Pricing/         # Pricing plans
│   │   ├── Resources/       # Learning resources
│   │   ├── community/       # Community features
│   │   ├── programs/        # Program listings
│   │   ├── LearningPlan/    # Personalized learning paths
│   │   ├── UI/              # Reusable UI components
│   │   ├── common/          # Shared components
│   │   └── layouts/         # Layout wrappers
│   ├── pages/               # Page-level components
│   ├── assets/              # Images and static files
│   ├── utils/               # Utility functions
│   ├── routes.tsx           # Application routes
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Public assets
├── index.html               # HTML template with SEO meta tags
└── package.json             # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finwit-kids
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🗺️ Application Routes

| Route | Description |
|-------|-------------|
| `/` | Home/Landing page |
| `/programs` | Browse educational programs |
| `/about-us` | Learn about Finwit Kids |
| `/resources` | Access learning resources |
| `/contact-us` | Contact form |
| `/community` | Community features and forums |
| `/pricing` | View pricing plans |
| `/domains-of-development/:domain` | Specific domain details |
| `/learning-plans` | Personalized learning paths |

## 🎨 Development Guidelines

### Path Aliases

The project uses `@/` as an alias for the `src/` directory:

```typescript
// Instead of: import Home from '../../components/Home'
import Home from '@/components/Home'
```

### Component Organization

- **Feature-based structure**: Components are organized by feature/domain
- **Reusable components**: Generic UI components go in `components/UI/`
- **Shared utilities**: Common components in `components/common/`
- **Page components**: Top-level pages in `pages/` directory

### Styling

- Uses **Tailwind CSS v4** for utility-first styling
- Custom styles in `src/index.css`
- Component-specific styles in `src/App.css`

## 🌍 SEO & Meta Tags

The application includes comprehensive SEO optimization:
- Open Graph tags for social media sharing
- Twitter Card meta tags
- Structured data (Schema.org) for rich snippets
- Geographic targeting for Kenya
- Mobile-optimized meta tags

## 📦 Key Dependencies

### Production
- `react` & `react-dom` (v19.1.1) - UI framework
- `react-router-dom` (v7.8.0) - Client-side routing
- `tailwindcss` (v4.1.11) - Utility-first CSS
- `lucide-react` (v0.539.0) - Icon library
- `react-countup` (v6.5.3) - Animated counters

### Development
- `typescript` (v5.8.3) - Type safety
- `vite` (v7.1.0) - Build tool
- `eslint` (v9.32.0) - Code linting
- `@vitejs/plugin-react` (v4.7.0) - React support for Vite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary to Finwit Kids.

## 📞 Contact

- **Website**: [Update with actual domain]
- **Email**: [Update with contact email]
- **Social Media**: 
  - Twitter: [@finwitkids](https://twitter.com/finwitkids)
  - Facebook: [finwitkids](https://facebook.com/finwitkids)
  - Instagram: [@finwitkids](https://instagram.com/finwitkids)
  - YouTube: [@finwitkids](https://youtube.com/@finwitkids)

---

**Built with ❤️ for empowering the next generation**
