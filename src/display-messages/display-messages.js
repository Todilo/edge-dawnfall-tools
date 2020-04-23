import React from "react";
import { Alert } from "antd";

export default function DisplayMessages({ alertMessages }) {
  return alertMessages.map(msg => {
    return (
      <Alert
        message={msg.message}
        type="warning"
        style={{ marginBottom: "20px" }}
      />
    );
  });
}
