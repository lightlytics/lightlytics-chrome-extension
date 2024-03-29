import 'tippy.js/dist/tippy.css'
import './tooltips.css'

import React from 'react'
import ReactDOM from 'react-dom'
import tippy from 'tippy.js'

import { ContextProvider } from '../context'
import ResourceDetails from '../components/ResourceDetails'
import { getCustomerByAccount } from './shared'
import { createClient, ClientOptions, getClient } from '../client'
import { NoAccountFoundMessage } from './NoAccountFoundMessage'

const AWS_ID_REGEXP = new RegExp('[\\w]*-[\\w]{17}')

const HIGHLIGHT_CLASS = 'll-highlight'
const HOVER_DELAY_MS = 500

let target: HTMLElement | null,
  id: String | null,
  timeout: NodeJS.Timeout,
  tooltipInstance: any

const indicator = initIndicator()

function initIndicator() {
  const indicator = createIndicator()
  indicator.classList.add('hide')
  document.body.appendChild(indicator)
  return indicator
}

document.addEventListener('mousemove', function (event) {
  const evenTarget = event.target as HTMLElement

  if (evenTarget.childNodes) {
    for (const child of evenTarget.childNodes) {
      if (
        child.nodeName === '#text' &&
        child.textContent?.match(AWS_ID_REGEXP)?.[0] === child.textContent
      ) {
        if (child.textContent !== id) {
          id = child.textContent
          hover(event)
        }
        return
      }
    }
  }

  stop()
  id = null
  target = null
})

function hover(event: MouseEvent) {
  stop()
  timeout = setTimeout(() => {
    target = event.target as HTMLElement
    targetIn()
  }, HOVER_DELAY_MS)
}

function stop() {
  clearTimeout(timeout)
  targetOut()
}

let singletonClient: ReturnType<typeof createClient> | undefined

const getSingletonClient = async (
  options?: ClientOptions,
  override?: boolean,
) => {
  if (!override && singletonClient) return singletonClient
  return (singletonClient = await getClient(options))
}

let activeTarget: HTMLElement | null

async function targetIn() {
  if (!target) return
  stop()
  target.classList.add(HIGHLIGHT_CLASS)

  const content = document.createElement('div')

  const awsResponse = (window.top || window).getAWSResponse?.()

  let customer,
    client = await getSingletonClient()

  if (awsResponse?.awsAccountId) {
    customer = await getCustomerByAccount({
      client,
      aws_account_id: awsResponse.awsAccountId,
    })
    if (customer) {
      client = await getSingletonClient({ customer }, true)
    }
  }

  ReactDOM.render(
    <React.StrictMode>
      <ContextProvider client={client}>
        {customer ? (
          <ResourceDetails resourceId={id} />
        ) : (
          <NoAccountFoundMessage awsAccountId={awsResponse?.awsAccountId} />
        )}
      </ContextProvider>
    </React.StrictMode>,
    content,
  )

  tooltipInstance = tippy(target, {
    arrow: true,
    interactive: true,
    appendTo: () => document.body,
    onHide() {
      ReactDOM.unmountComponentAtNode(content)
      resetTarget(activeTarget)
      hideIndicator()
      activeTarget = null
    },
    content,
  })
  resetTarget(activeTarget)
  activeTarget = target

  tooltipInstance.show()

  moveIndicator(target)
}

function moveIndicator(t: HTMLElement) {
  indicator.classList.remove('hide')
  const targetRect = t.getBoundingClientRect()
  const indicatorRect = indicator.getBoundingClientRect()
  indicator.style.left = `${targetRect.left - indicatorRect.width - 5}px`
  indicator.style.top = `${
    targetRect.top + targetRect.height / 2 - indicatorRect.height / 2
  }px`
}

function resetTarget(t: HTMLElement | null) {
  t?.classList.remove(HIGHLIGHT_CLASS)
}

function hideIndicator() {
  indicator?.classList.add('hide')
}

function targetOut() {
  if (target !== activeTarget) {
    resetTarget(target)
  }

  if (activeTarget) {
    moveIndicator(activeTarget)
  } else {
    hideIndicator()
  }

  if (!tooltipInstance?.state?.isVisible) {
    tooltipInstance?.destroy()
  }
}

function createIndicator() {
  const indicator = document.createElement('div')
  indicator.className = 'll-indicator'
  indicator.textContent = 'ϟ'
  return indicator
}
