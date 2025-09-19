export const theme = {
  colors: {
    // Pastel & vivid oranges with off-white surfaces
    primary: 'orange',
    primaryDark: '#E76F51',
    primaryLight: '#F4A26120',
    background: '#FFFFFF',
    surface: '#FFF7F0',
    surfaceLight: '#FFEAD6',
    text: '#000000ff',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    border: '#F3D8BF',
    success: '#2FBF71',
    warning: '#FFB703',
    error: '#E63946',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 8,
    md: 10,
    lg: 12,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
    },
    h2: {
      fontSize: 20,
      fontWeight: '800' as const,
    },
    h3: {
      fontSize: 18,
      fontWeight: '700' as const,
    },
    h4: {
      fontSize: 16,
      fontWeight: '700' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
    },
    bodyBold: {
      fontSize: 16,
      fontWeight: '600' as const,
    },
    caption: {
      fontSize: 14,
      fontWeight: '600' as const,
    },
    button: {
      fontSize: 16,
      fontWeight: '700' as const,
    },
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
};

export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.card,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.body.fontSize,
    backgroundColor: theme.colors.background,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center' as const,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center' as const,
  },
  buttonText: {
    color: theme.colors.background,
    fontWeight: theme.typography.button.fontWeight,
    fontSize: theme.typography.button.fontSize,
  },
  buttonTextSecondary: {
    color: theme.colors.text,
    fontWeight: theme.typography.button.fontWeight,
    fontSize: theme.typography.button.fontSize,
  },
  sectionTitle: {
    fontSize: theme.typography.h3.fontSize,
    fontWeight: theme.typography.h3.fontWeight,
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  listItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
};
