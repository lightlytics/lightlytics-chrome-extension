import React from "react";
import { DOMMessage, DOMMessageResponse } from "../types";

function useContent() {
  const [awsAccountId, setAWSAccouuntId] = React.useState<string | undefined>();
  const [resourceIds, setResourceIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs &&
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          setResourceIds([]);
          setAWSAccouuntId("");
          chrome.tabs.sendMessage(
            tabs[0].id || 0,
            { type: "GET_DOM" } as DOMMessage,
            (response: DOMMessageResponse) => {
              setResourceIds(response.resourceIds);
              setAWSAccouuntId(response.awsAccountId);
            }
          );
        }
      );
  }, []);

  return {
    resourceIds,
    awsAccountId,
  };
}

export default useContent;
