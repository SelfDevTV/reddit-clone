export const fetchData = async (url) => {
  const res = await fetch(url);
  const response = await res.json();
  return response;
};

export const postData = async (url, body) => {
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};
