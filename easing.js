export const Linear = {
  None: (amount) => {
    return amount
  },
};
export const Quadratic = {
  In: (amount) => {
    return amount * amount
  },
  Out: (amount) => {
    return amount * (2 - amount)
  },
  InOut: (amount) => {
    if ((amount *= 2) < 1) {
      return 0.5 * amount * amount
    }

    return -0.5 * (--amount * (amount - 2) - 1)
  },
};

export const Cubic = {
  In: (amount) => {
    return amount * amount * amount
  },
  Out: (amount) => {
    return --amount * amount * amount + 1
  },
  InOut: (amount) => {
    if ((amount *= 2) < 1) {
      return 0.5 * amount * amount * amount
    }
    return 0.5 * ((amount -= 2) * amount * amount + 2)
  },
};

export const Quartic = {
  In: (amount) => {
    return amount * amount * amount * amount
  },
  Out: (amount) => {
    return 1 - --amount * amount * amount * amount
  },
  InOut: (amount) => {
    if ((amount *= 2) < 1) {
      return 0.5 * amount * amount * amount * amount
    }

    return -0.5 * ((amount -= 2) * amount * amount * amount - 2)
  },
};

export const Quintic = {
  In: (amount) => {
    return amount * amount * amount * amount * amount
  },
  Out: (amount) => {
    return --amount * amount * amount * amount * amount + 1
  },
  InOut: (amount) => {
    if ((amount *= 2) < 1) {
      return 0.5 * amount * amount * amount * amount * amount
    }

    return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2)
  },
};

export const Sinusoidal = {
  In: (amount) => {
    return 1 - Math.sin(((1.0 - amount) * Math.PI) / 2)
  },
  Out: (amount) => {
    return Math.sin((amount * Math.PI) / 2)
  },
  InOut: (amount) => {
    return 0.5 * (1 - Math.sin(Math.PI * (0.5 - amount)))
  },
};

export const Exponential = {
  In: (amount) => {
    return amount === 0 ? 0 : Math.pow(1024, amount - 1)
  },
  Out: (amount) => {
    return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount)
  },
  InOut: (amount) => {
    if (amount === 0) {
      return 0
    }

    if (amount === 1) {
      return 1
    }

    if ((amount *= 2) < 1) {
      return 0.5 * Math.pow(1024, amount - 1)
    }

    return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2)
  },
};

export const Circular = {
  In: (amount) => {
    return 1 - Math.sqrt(1 - amount * amount)
  },
  Out: (amount) => {
    return Math.sqrt(1 - --amount * amount)
  },
  InOut: (amount) => {
    if ((amount *= 2) < 1) {
      return -0.5 * (Math.sqrt(1 - amount * amount) - 1)
    }
    return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1)
  },
};

export const Elastic = {
  In: (amount) => {
    if (amount === 0) {
      return 0
    }

    if (amount === 1) {
      return 1
    }

    return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI)
  },
  Out: (amount) => {
    if (amount === 0) {
      return 0
    }

    if (amount === 1) {
      return 1
    }
    return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1
  },
  InOut: (amount) => {
    if (amount === 0) {
      return 0
    }

    if (amount === 1) {
      return 1
    }

    amount *= 2

    if (amount < 1) {
      return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI)
    }

    return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1
  },
};

export const Back = {
  In: (amount) => {
    const s = 1.70158
    return amount === 1 ? 1 : amount * amount * ((s + 1) * amount - s)
  },
  Out: (amount) => {
    const s = 1.70158
    return amount === 0 ? 0 : --amount * amount * ((s + 1) * amount + s) + 1
  },
  InOut: (amount) => {
    const s = 1.70158 * 1.525
    if ((amount *= 2) < 1) {
      return 0.5 * (amount * amount * ((s + 1) * amount - s))
    }
    return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2)
  },
};

export const Bounce = {
  In: (amount) => {
    return 1 - Bounce.Out(1 - amount)
  },
  Out: (amount) => {
    if (amount < 1 / 2.75) {
      return 7.5625 * amount * amount
    } else if (amount < 2 / 2.75) {
      return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75
    } else if (amount < 2.5 / 2.75) {
      return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375
    } else {
      return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375
    }
  },
  InOut: (amount) => {
    if (amount < 0.5) {
      return Bounce.In(amount * 2) * 0.5
    }
    return Bounce.Out(amount * 2 - 1) * 0.5 + 0.5
  },
};

export const generatePow = (power = 4,) => {
  power = power < Number.EPSILON ? Number.EPSILON : power
  power = power > 10000 ? 10000 : power
  return {
    In: (amount) => {
      return amount ** power
    },
    Out: (amount) => {
      return 1 - (1 - amount) ** power
    },
    InOut: (amount) => {
      if (amount < 0.5) {
        return (amount * 2) ** power / 2
      }
      return (1 - (2 - amount * 2) ** power) / 2 + 0.5
    },
  }
};
