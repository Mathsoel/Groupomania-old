export async function fetchGet(route) {
  const res = await fetch(route);
  return await res.json();
}

export async function fetchPost(route, payload) {
  const res = await fetch(route, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function fetchPut(route, payload) {
  const res = await fetch(route, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function fetchDelete(route, payload) {
  const res = await fetch(route, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return await res.json();
}
