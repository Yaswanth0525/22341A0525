import axios from 'axios';
const TEST_SERVER_URL = 'http://localhost:5000/log';
export function Log(stack, level, pkg, message) {
  const payload = { stack, level, package: pkg, message };
  axios.post(TEST_SERVER_URL, payload).catch(() => {});
}