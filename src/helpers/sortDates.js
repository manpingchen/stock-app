export const sortDatesDesc = (key) => (a, b) => {
  if (key) {
    return new Date(b[key]) - new Date(a[key]);
  } else {
    return new Date(b) - new Date(a);
  }
};


export const sortDatesAsc = (key) => (a, b) => {
  if (key) {
    return new Date(a[key]) - new Date(b[key]);
  } else {
    return new Date(a) - new Date(b);
  }
};

