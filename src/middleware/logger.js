import axios from 'axios';
export async function Log(stack, level, packageName, message) {
  try {
    await axios.post('http://localhost:3000/api/log', {
      stack,
      level,
      package: packageName,
      message,
    });
  } catch {
    //this i was taken
  }
}

