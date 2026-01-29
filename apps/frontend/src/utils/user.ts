const KEY = "whiteboard:username";

export const getUsername = () => {
  return localStorage.getItem(KEY);
};

export const setUsername = (username: string) => {
  localStorage.setItem(KEY, username);
};
