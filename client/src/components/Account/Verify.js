import React, { useState, useEffect } from "react";
import * as API from "api/API";

export default function AccountVerify(props) {
  const [message, setMessage] = useState("");
  useEffect(() => {
    API.request(`/api/users/verify/${props.match.params.hash}`)
      .then((res) => {
        setMessage(res.data.message);
      })
      .catch((err) => {
        setMessage(err.response.data.message);
      });
  }, [props.match.params.hash]);

  return <div>{message}</div>;
}
