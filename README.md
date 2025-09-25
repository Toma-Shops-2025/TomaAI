# TomaAI - AI Image Generator

A modern, responsive AI image generation application built with React, TypeScript, Vite, and Supabase. Create stunning visuals from text prompts with multiple style presets and user authentication.

## Features

- 🎨 **AI Image Generation**: Generate images from text prompts with multiple style presets
- 🔐 **User Authentication**: Sign up/sign in with Supabase authentication
- 💾 **Image Gallery**: Save and manage your generated images
- 🎯 **Style Presets**: Choose from Photorealistic, Abstract, Anime, and Artistic styles
- ⚙️ **Customization**: Adjust aspect ratio, quality, and number of images
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🌙 **Dark Theme**: Modern dark theme with gradient accents

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: ShadCN UI, Radix UI, Tailwind CSS
- **Backend**: Supabase (Database, Authentication, Storage)
- **State Management**: React Context, React Query
- **Routing**: React Router DOM

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Toma-Shops-2025/TomaAI.git
cd TomaAI
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://irzzehvrytkunrxqniuo.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# OpenAI Configuration (for AI image generation)
VITE_OPENAI_API_KEY=your-openai-api-key-here

# Stripe Configuration (for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key-here
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-here
```

#### Getting API Keys:

**Supabase:**
1. Go to [Supabase](https://supabase.com) and create a new project
2. In your Supabase project dashboard, go to Settings > API
3. Copy your project URL and anon key

**OpenAI (for AI image generation):**
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create an API key in the API Keys section
3. Add credits to your account (DALL-E 3 costs $0.040 per image)

**Stripe (for payments):**
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your publishable and secret keys from the API section
3. Set up webhooks for payment processing

### 4. Database Setup

1. In your Supabase project, go to the SQL Editor
2. Copy and paste the contents of `database-schema.sql` 
3. Run the SQL to create the necessary tables and policies

### 5. Update Supabase Configuration

Update the Supabase URL in `src/lib/supabase.ts` with your actual project URL:

```typescript
const supabaseUrl = 'https://your-project-url.supabase.co'
```

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── AppLayout.tsx   # Main layout component
│   ├── AuthModal.tsx   # Authentication modal
│   ├── ImageCard.tsx   # Image display component
│   └── ...
├── contexts/           # React contexts
│   ├── AppContext.tsx  # App state management
│   └── SupabaseContext.tsx # Supabase integration
├── lib/               # Utility functions
│   └── supabase.ts    # Supabase client configuration
├── pages/             # Page components
│   ├── Index.tsx      # Home page
│   └── NotFound.tsx   # 404 page
└── hooks/             # Custom React hooks
```

## Key Features Implementation

### Authentication
- User registration and login with Supabase Auth
- Protected routes and user-specific data
- Automatic user profile creation

### Image Generation
- Text-to-image generation with style presets
- Customizable generation parameters
- Real-time generation status

### Data Persistence
- Save generated images to Supabase database
- User-specific image galleries
- Image metadata storage (prompt, style, settings)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Schema

The application uses the following Supabase tables:

- `generated_images`: Stores user-generated images with metadata
- `users`: Extended user profiles
- Row Level Security (RLS) policies for data protection

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@tomaai.com or create an issue on GitHub.

---

Built with ❤️ by the TomaAI team