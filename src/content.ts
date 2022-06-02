import { DOMMessage, DOMMessageResponse } from "./types";

const AWS_ID_REGEXP = new RegExp("[\\w]*-[\\w]{17}");

const messagesFromReactAppListener = (
  msg: DOMMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: DOMMessageResponse) => void
) => {
  const response: DOMMessageResponse = {
    awsAccountId: document
      .querySelector(
        "#menu--account > div.globalNav-0335 > div > div:nth-child(1) > span:nth-child(2)"
      )
      ?.textContent?.replace(/-/g, ""),
    resourceIds: textContentsUnder(document.body).filter(
      (textContent) => textContent?.match(AWS_ID_REGEXP)?.[0] === textContent
    ),
  };

  sendResponse(response);
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

function textContentsUnder(el: Node) {
  var n,
    a = [],
    walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);

  while ((n = walk.nextNode())) if (n.textContent) a.push(n.textContent);

  return a;
}
