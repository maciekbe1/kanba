import axios from "axios";
import { isNil } from "lodash";

export function request(url, data, method = "post") {
  if (isNil(data))
    return axios({
      method: method,
      url: url,
      headers: {
        "Content-Type": "application/json"
      }
    });
  return axios({
    method: method,
    url: url,
    headers: {
      "Content-Type": "application/json"
    },
    data: data
  });
}

export function sendFile(url, data) {
  return axios.post(url, data, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
}
