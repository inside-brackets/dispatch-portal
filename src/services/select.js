export const transformArrayToObjectArray = (array) => {
  return array.map((item) => ({
    label: `${item.charAt(0).toUpperCase() + item.slice(1)} `,
    value: item.trim(),
  }));
};
