# Luxe Cleanings

A modern Next.js application with Vercel Blob storage integration and Shadcn UI components.

## Features

- ⚡ Next.js 14 with App Router
- 🎨 Shadcn UI components with Tailwind CSS
- 📁 Vercel Blob storage integration
- 🔧 TypeScript support
- 🚀 Ready for deployment on Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory and add your Vercel Blob token:

```env
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token_here"
```

**Note:** The token is already configured in `vercel.json` for deployment, but you'll need to set it locally for development.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Test Vercel Blob Integration

Visit [http://localhost:3000/demo](http://localhost:3000/demo) to test the Vercel Blob storage functionality.

## Project Structure

```
├── app/
│   ├── api/upload/          # Vercel Blob upload API route
│   ├── demo/               # Demo page for testing blob storage
│   ├── globals.css         # Global styles with Tailwind
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Home page
├── components/
│   └── ui/                 # Shadcn UI components
├── lib/
│   └── utils.ts            # Utility functions
├── vercel.json             # Vercel configuration with environment variables
└── package.json            # Dependencies and scripts
```

## Vercel Blob Integration

The application includes a working example of Vercel Blob storage:

- **API Route**: `/api/upload` - Handles file uploads to Vercel Blob
- **Demo Page**: `/demo` - Interactive demo to test blob storage
- **Token Configuration**: Set in `vercel.json` for deployment

### Example Usage

```typescript
import { put } from "@vercel/blob";

const { url } = await put('filename.txt', 'Hello World!', { access: 'public' });
```

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. The environment variables are already configured in `vercel.json`
4. Deploy!

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Beautiful, accessible UI components
- **Vercel Blob** - File storage solution
- **Lucide React** - Icon library

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT