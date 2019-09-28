import * as React from 'react'
import classnames from 'classnames'
import Row from '../Row'

import './ScrollButton.scss'

export type Props = {
  disableLeft: boolean
  onClickLeft: React.MouseEventHandler<HTMLButtonElement>
  disableRight: boolean
  onClickRight: React.MouseEventHandler<HTMLButtonElement>
  className?: string
}

export default function ScrollButton({
  disableLeft,
  onClickLeft,
  disableRight,
  onClickRight,
  className,
}: Props) {
  return (
    <Row
      distribution="around"
      className={classnames('ScrollButton', className)}
    >
      <button
        onClick={onClickLeft}
        disabled={disableLeft}
        style={{ opacity: disableLeft ? 0.5 : 1 }}
        aria-label="Scroll left"
        title="Scroll left"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={onClickRight}
        disabled={disableRight}
        style={{ opacity: disableRight ? 0.5 : 1 }}
        aria-label="Scroll right"
        title="Scroll right"
      >
        <ChevronRight />
      </button>
    </Row>
  )
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <defs>
        <path
          id="chevron-right-path"
          d="M13.586 12l-5.293 5.293a1 1 0 0 0 1.414 1.414l6-6a1 1 0 0 0 0-1.414l-6-6a1 1 0 0 0-1.414 1.414L13.586 12z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="chevron-right-mask" fill="#fff">
          <use href="#chevron-right-path" />
        </mask>
        <use fill="white" fillRule="nonzero" href="#chevron-right-path" />
        <g fill="white" mask="url(#chevron-right-mask)">
          <path d="M0 0h24v24H0z" />
        </g>
      </g>
    </svg>
  )
}

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <defs>
        <path
          id="chevron-left-path"
          d="M10.414 12l5.293-5.293a1 1 0 1 0-1.414-1.414l-6 6a1 1 0 0 0 0 1.414l6 6a1 1 0 0 0 1.414-1.414L10.414 12z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="chevron-left-mask" fill="#fff">
          <use href="#chevron-left-path" />
        </mask>
        <use fill="white" fillRule="nonzero" href="#chevron-left-path" />
        <g fill="white" mask="url(#chevron-left-mask)">
          <path d="M0 0h24v24H0z" />
        </g>
      </g>
    </svg>
  )
}
