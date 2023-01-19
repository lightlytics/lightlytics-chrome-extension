type DOMMessage = {
  type: 'GET_DOM'
}

type AWSResponse = {
  awsAccountId: string | undefined
}

chrome.runtime.onMessage.addListener(
  (
    msg: DOMMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: AWSResponse) => void,
  ) => {
    sendResponse(getResponse())
  },
)

export function getResponse() {
  return {
    awsAccountId: window.top?.document
      .querySelector(
        '#menu--account > div.globalNav-0335 > div > div:nth-child(1) > span:nth-child(2)',
      )
      ?.textContent?.replace(/-/g, ''),
  }
}

const win = window.top || window
win.getAWSResponse = getResponse

declare global {
  interface Window {
    getAWSResponse?: () => AWSResponse
  }
}

export function getCustomerByAwsAccountId(awsAccountId: string) {}
