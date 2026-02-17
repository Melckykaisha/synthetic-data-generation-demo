# Contributing to Synthetic Data Generation Demo

Thank you for considering contributing to this project! 🎉

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Screenshots (if applicable)
- Browser and OS information

### Suggesting Enhancements

We welcome feature suggestions! Please open an issue with:
- A clear description of the enhancement
- Why it would be useful
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** with clear, descriptive commits
3. **Test your changes** thoroughly
4. **Update documentation** if needed (README, comments, etc.)
5. **Submit a pull request** with a clear description

## Development Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn package manager
- Git

### Setup Instructions

```bash
# Clone your fork
git clone https://github.com/Melckykaisha/synthetic-data-generation-demo.git
cd synthetic-data-generation-demo

# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# The app will automatically reload when you make changes
```

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

### Making Changes

```bash
# Create a new branch for your feature
git checkout -b feature/your-feature-name

# Make your changes in src/
# Test thoroughly by running npm run dev

# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Add: your feature description"

# Push to your fork
git push origin feature/your-feature-name

# Open a Pull Request on GitHub
```

## Code Style Guidelines

### General Principles
- Use meaningful variable and function names
- Add comments for complex logic
- Follow React best practices and hooks guidelines
- Keep components modular and reusable
- Use functional components with hooks (no class components)

### React/JavaScript Style
```javascript
// ✅ Good: Clear, descriptive names
const [syntheticData, setSyntheticData] = useState([]);
const calculateCorrelation = (data, field1, field2) => { ... }

// ❌ Bad: Unclear, abbreviated names
const [sd, setSd] = useState([]);
const calcCorr = (d, f1, f2) => { ... }
```

### Styling with Tailwind
- Use Tailwind CSS utility classes for styling
- Keep inline styles minimal
- Use the existing color scheme (cyan/blue gradient on dark background)
- Ensure responsive design (use `md:`, `lg:` breakpoints)

```jsx
// ✅ Good: Tailwind utilities
<div className="bg-slate-900/90 rounded-2xl p-6 border border-cyan-500/20">

// ❌ Avoid: Inline styles (unless necessary for dynamic values)
<div style={{ backgroundColor: '#1e293b', padding: '24px' }}>
```

### File Organization
- Place new components in `src/components/` (create if needed)
- Keep utility functions in `src/utils/` (create if needed)
- Update `src/App.jsx` only for main app logic
- Add new styles to `src/index.css` if needed

## Commit Message Guidelines

### Format
```
Type: Brief description (50 chars or less)

More detailed explanation if needed (wrap at 72 chars).
- Use bullet points for multiple changes
- Reference issues with #issue-number

Fixes #123
```

### Types
- `Add:` New feature or functionality
- `Fix:` Bug fix
- `Update:` Changes to existing functionality
- `Refactor:` Code refactoring without behavior change
- `Docs:` Documentation updates
- `Style:` Code style/formatting changes
- `Test:` Adding or updating tests
- `Chore:` Build process, dependencies, etc.

### Examples
```bash
# Good commit messages:
git commit -m "Add: Diffusion model demonstration tab"
git commit -m "Fix: Correlation calculation for edge cases"
git commit -m "Update: Improve distribution histogram performance"
git commit -m "Docs: Add setup instructions for Windows users"

# Bad commit messages:
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "WIP"
```

## Testing Your Changes

Before submitting a pull request:

1. **Run the development server** and test all tabs:
   ```bash
   npm run dev
   ```

2. **Test in multiple browsers**:
   - Chrome/Edge
   - Firefox
   - Safari (if on Mac)

3. **Build and preview**:
   ```bash
   npm run build
   npm run preview
   ```

4. **Check for errors**:
   - Open browser console (F12)
   - Ensure no errors or warnings
   - Test all interactive features

5. **Verify responsiveness**:
   - Test on different screen sizes
   - Use browser DevTools responsive mode

## Priority Areas for Contribution

### High Priority
- [ ] Implement actual neural network models (TensorFlow.js)
- [ ] Add diffusion model demonstration with visualization
- [ ] CSV export functionality for synthetic datasets
- [ ] Unit tests with Vitest
- [ ] Mobile responsiveness improvements

### Medium Priority
- [ ] Include image generation examples (GANs for images)
- [ ] Implement differential privacy techniques
- [ ] Add more statistical tests (KS test, Chi-square, MMD)
- [ ] Dark/light theme toggle
- [ ] Performance optimizations for large datasets (>10k samples)

### Nice to Have
- [ ] Create interactive tutorial/guided tour
- [ ] Add animation library for smoother transitions
- [ ] Support for multiple dataset types (images, text, time series)
- [ ] Integration with popular ML frameworks
- [ ] Comparison with real-world benchmark datasets

## Code Review Process

1. Maintainer will review your PR within 3-5 days
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged in releases

## Getting Help

### Questions?
- Open an issue with the `question` label
- Check existing issues for similar questions
- Reach out to maintainers directly

### Stuck on Setup?
Common issues and solutions:

**Node version issues:**
```bash
# Check your Node version
node --version  # Should be v18 or higher

# Use nvm to install correct version
nvm install 18
nvm use 18
```

**Port already in use:**
```bash
# Vite default port is 5173
# If occupied, Vite will suggest next available port
# Or specify port manually:
npm run dev -- --port 3000
```

**Styling not working:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Code of Conduct

### Our Standards
- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Welcome newcomers and help them learn
- Credit others for their work

### Unacceptable Behavior
- Harassment or discriminatory language
- Personal attacks or insults
- Publishing others' private information
- Spam or off-topic discussions

## Recognition

Contributors will be:
- Listed in release notes
- Mentioned in README acknowledgments
- Given credit in commit history

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🙏

Together we're building something awesome! 🚀
