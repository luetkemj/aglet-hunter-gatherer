/* eslint-disable */
export const game = {
  size: {
    12: 'small',
    24: 'medium',
    30: 'large',
  },
  count: {
    small: {
      3: {
        min: 1,
        max: 3,
      },
      6: {
        min: 1,
        max: 6,
      },
      9: {
        min: 1,
        max: 8,
      },
      12: {
        min: 1,
        max: 12,
      }
    },
    medium: {
      3: {
        min: 1,
        max: 2,
      },
      6: {
        min: 1,
        max: 3,
      },
      9: {
        min: 1,
        max: 6,
      },
      12: {
        min: 2,
        max: 8,
      }
    },
    large: {
      3: {
        min: 1,
        max: 2,
      },
      6: {
        min: 1,
        max: 3,
      },
    },
  },
  distance: {
    small: {
      min: 10,
      max: 20,
    },
    medium: {
      min: 20,
      max: 30,
    },
    large: {
      min: 20,
      max: 60,
    }
  }
}
