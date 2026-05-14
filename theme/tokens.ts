export const SPACING_UNIT = 4;

export const spacing = {
  none: 0,
  xxs: SPACING_UNIT,
  xs: SPACING_UNIT * 2,
  sm: SPACING_UNIT * 3,
  md: SPACING_UNIT * 4,
  lg: SPACING_UNIT * 6,
  xl: SPACING_UNIT * 8,
  xxl: SPACING_UNIT * 12,
} as const;

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const typography = {
  fontFamily: {
    regular: "System",
    medium: "System",
    semibold: "System",
    bold: "System",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
  },
  lineHeight: {
    tight: 1.15,
    normal: 1.35,
    relaxed: 1.5,
  },
  letterSpacing: {
    tight: -0.2,
    normal: 0,
    wide: 0.3,
  },
} as const;

export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
} as const;

export const layout = {
  maxContentWidth: 720,
  tabBarHeight: 56,
  headerMinHeight: 48,
  touchTargetMin: 44,
} as const;

export const animation = {
  durationFast: 150,
  durationNormal: 250,
  durationSlow: 400,
} as const;
