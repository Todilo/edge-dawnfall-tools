import { Alert } from "antd";

import type { AlertMessage } from "../types";

interface DisplayMessagesProps {
  alertMessages: AlertMessage[];
}

export default function DisplayMessages({
  alertMessages,
}: DisplayMessagesProps) {
  return (
    <>
      {alertMessages.map((message) => (
        <Alert
          key={message.key}
          message={message.message}
          type="warning"
          style={{ marginBottom: "20px" }}
        />
      ))}
    </>
  );
}
