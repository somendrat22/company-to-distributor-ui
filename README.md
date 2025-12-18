# B2B FMCG Supplier–Distributor Platform

## Company Onboarding Flow

A professional, enterprise-grade onboarding experience for manufacturing companies and suppliers.

### Features

- 🎯 **Multi-step Onboarding**: 6-step guided process
- ✅ **Form Validation**: Real-time validation with Zod
- 💾 **Auto-save**: Form progress persists on refresh
- 📱 **Responsive Design**: Desktop-first, mobile-friendly
- 🎨 **Modern UI**: Built with Tailwind CSS and Lucide icons
- 🔄 **Mock API**: Ready for backend integration

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React

### Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── page.tsx           # Landing page
│   ├── onboarding/        # Onboarding flow
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Reusable UI components
│   ├── onboarding/        # Onboarding-specific components
│   └── layout/            # Layout components
├── lib/
│   ├── validations/       # Zod schemas
│   ├── utils.ts           # Utility functions
│   └── api.ts             # Mock API calls
└── types/                 # TypeScript types

```

### Onboarding Flow

1. **Landing Screen** - Platform introduction
2. **Company Registration** - Basic company info
3. **Business Address** - Address details
4. **Contact Person** - Contact information
5. **Banking Details** - Financial information
6. **Document Upload** - KYC documents
7. **Review & Submit** - Final review
8. **Success Screen** - Completion confirmation

### Form Persistence

Form data is automatically saved to `localStorage` and restored on page refresh, ensuring users never lose their progress.

### Mock API

All API calls are mocked and simulate realistic delays. Replace the mock functions in `src/lib/api.ts` with actual API endpoints.

### Build for Production

```bash
npm run build
npm start
```

---

**Ready for backend integration** - All components are modular and API-ready.
