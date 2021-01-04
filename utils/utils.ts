export const fetchData = async (url) => {
  const res = await fetch(url);
  const response = await res.json();
  return response;
};
