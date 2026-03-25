const BASE_URL = 'http://localhost:5207/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// Auth
export const registerUser = (data) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(res => res.json());

export const loginUser = (data) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(res => res.json());

// Threads
export const getThreads = (page = 1, search = '') =>
  fetch(`${BASE_URL}/threads?page=${page}&pageSize=20&search=${encodeURIComponent(search)}`, {
    headers: headers(),
  }).then(res => res.json());

export const getThread = (id) =>
  fetch(`${BASE_URL}/threads/${id}`, {
    headers: headers(),
  }).then(res => res.json());

export const createThread = (data) =>
  fetch(`${BASE_URL}/threads`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(res => res.json());

export const markThreadSolved = (id) =>
  fetch(`${BASE_URL}/threads/${id}/solve`, {
    method: 'PATCH',
    headers: headers(),
  }).then(res => res.json());

// Replies
export const createReply = (data) =>
  fetch(`${BASE_URL}/replies`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  }).then(res => res.json());

export const voteReply = (id, direction) =>
  fetch(`${BASE_URL}/replies/${id}/vote?direction=${direction}`, {
    method: 'POST',
    headers: headers(),
  }).then(res => res.json());

export const acceptReply = (id) =>
  fetch(`${BASE_URL}/replies/${id}/accept`, {
    method: 'PATCH',
    headers: headers(),
  }).then(res => res.json());

// Categories
export const getCategories = () =>
  fetch(`${BASE_URL}/categories`, {
    headers: headers(),
  }).then(res => res.json());


export const getThreadsByCategory = (categoryId, page = 1) =>
  fetch(`${BASE_URL}/threads?categoryId=${categoryId}&page=${page}&pageSize=20`, {
    headers: headers(),
  }).then(res => res.json());


// Tags
export const getTags = () =>
  fetch(`${BASE_URL}/tags`, {
    headers: headers(),
  }).then(res => res.json());

  export const getThreadsByTag = (tag, page = 1) =>
  fetch(`${BASE_URL}/threads?tag=${encodeURIComponent(tag)}&page=${page}&pageSize=20`, {
    headers: headers(),
  }).then(res => res.json());

