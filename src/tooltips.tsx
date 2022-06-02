import React from "react";
import ReactDOM from "react-dom";
import tippy from "tippy.js";

import Tooltip from "./components/Tooltip";
import ContextProvider from "./components/ContextProvider";
import { InMemoryCache } from "@apollo/client";

import "tippy.js/dist/tippy.css";
import "./tooltips.css";

const AWS_ID_REGEXP = new RegExp("[\\w]*-[\\w]{17}");
const cache = new InMemoryCache();

const HIGHLIGHT_CLASS = "ll-highlight";
const HOVER_DELAY_MS = 500;

let target: HTMLElement | null,
  id: String | null,
  timeout: NodeJS.Timeout,
  tooltipInstance: any;

const indicator = initIndicator();

function initIndicator() {
  const indicator = createIndicator();
  indicator.classList.add("hide");
  document.body.appendChild(indicator);
  return indicator;
}

document.addEventListener("mousemove", function (event) {
  const evenTarget = event.target as HTMLElement;

  if (evenTarget.childNodes) {
    for (const child of evenTarget.childNodes) {
      if (
        child.nodeName === "#text" &&
        child.textContent?.match(AWS_ID_REGEXP)?.[0] === child.textContent
      ) {
        if (child.textContent !== id) {
          id = child.textContent;
          hover(event);
        }
        return;
      }
    }
  }

  stop();
  id = null;
  target = null;
});

function hover(event: MouseEvent) {
  stop();
  timeout = setTimeout(() => {
    target = event.target as HTMLElement;
    targetIn();
  }, HOVER_DELAY_MS);
}

function stop() {
  clearTimeout(timeout);
  targetOut();
}

function targetIn() {
  if (!target) return;
  stop();
  target.classList.add(HIGHLIGHT_CLASS);
  target.addEventListener("click", click);

  const content = document.createElement("div");

  ReactDOM.render(
    <React.StrictMode>
      <ContextProvider cache={cache}>
        <Tooltip resourceId={id} />
      </ContextProvider>
    </React.StrictMode>,
    content
  );

  tooltipInstance = tippy(target, {
    arrow: true,
    interactive: true,
    trigger: "click",
    appendTo: () => document.body,
    content,
  });

  indicator.classList.remove("hide");
  const targetRect = target.getBoundingClientRect();
  const indicatorRect = indicator.getBoundingClientRect();
  indicator.style.left = `${targetRect.left - indicatorRect.width - 5}px`;
  indicator.style.top = `${
    targetRect.top + targetRect.height / 2 - indicatorRect.height / 2
  }px`;
}

function targetOut() {
  target?.classList.remove(HIGHLIGHT_CLASS);
  target?.removeEventListener("click", click);
  indicator?.classList.add("hide");

  if (!tooltipInstance?.state?.isVisible) {
    tooltipInstance?.destroy();
  }
}

function createIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "ll-indicator";
  indicator.textContent = "ϟ";
  return indicator;
}

function click(e: Event) {
  e.stopPropagation();
  e.preventDefault();
}
