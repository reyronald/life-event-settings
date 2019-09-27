import * as React from 'react'
import * as classnames from 'classnames'
import * as _ from 'lodash'
import { forwardRef, useMemo } from 'react'
import Row from '../Row'
import Select from '../Select'
import Checkbox from '../Checkbox'
import { LifeEventRulesTableObject, EffectiveDateMode } from '../types'
import localize from '../localize'
import ScrollButton from './ScrollButton'

export type Props = {
  variant: 'readonly' | 'edit'
  effectiveTooltip: string
  visibleMemberChangeTypes: string[]
  memberChangeTypes: MemberChangeType[]
  benefitTypes: BenefitType[]
  lifeEventRulesTableObject: LifeEventRulesTableObject
  setEffectiveDateMode(args: {
    memberChangeTypeId: string
    memberChangeTypeName: string
    memberChangeTypeDescription: string
    effectiveDateMode: EffectiveDateMode
  }): void
  setBenefit(args: {
    isEnabled: boolean
    memberChangeTypeId: string
    memberChangeTypeName: string
    memberChangeTypeDescription: string
    benefitTypeName: string
    benefitTypeTitle: string
    effectiveDateMode: EffectiveDateMode
  }): void
}

export type EmployerMatrixTableRef = {
  scrollLeft(): void
  scrollRight(): void
}

const LOCAL_STORAGE_SCROLL_LEFT_KEY = 'EmployerMatrixTable--scrollLeft'
const SCROLL_BY = 200

const EmployerMatrixTable: React.RefForwardingComponent<
  EmployerMatrixTableRef,
  Props
> = (
  {
    variant,
    effectiveTooltip,
    visibleMemberChangeTypes,
    memberChangeTypes,
    benefitTypes,
    lifeEventRulesTableObject,
    setEffectiveDateMode,
    setBenefit,
  },
  ref,
) => {
  const tableRef = React.useRef<HTMLTableElement>(null)
  const [disableLeft, setDisableLeft] = React.useState<boolean>(true)
  const [disableRight, setDisableRight] = React.useState<boolean>(false)
  const [
    scrollButtonsTopPosition,
    setScrollButtonsTopPosition,
  ] = React.useState(0)

  React.useLayoutEffect(() => {
    setScrollButtonsTopPosition(tableRef.current.offsetHeight / 2)
  }, [setScrollButtonsTopPosition])

  const debouncedHandleScroll = _.debounce(
    ({ scrollLeft, offsetWidth, scrollWidth }) => {
      setDisableLeft(scrollLeft === 0)
      setDisableRight(scrollLeft + offsetWidth === scrollWidth)
      writeStorage(LOCAL_STORAGE_SCROLL_LEFT_KEY, scrollLeft)
    },
    15,
  )

  function onScroll(event: React.UIEvent<HTMLTableElement>) {
    const {
      currentTarget: { scrollLeft, offsetWidth, scrollWidth },
    } = event
    debouncedHandleScroll({ scrollLeft, offsetWidth, scrollWidth })
  }

  React.useLayoutEffect(() => {
    const { current } = tableRef
    current.scrollLeft = readStorage<number>(LOCAL_STORAGE_SCROLL_LEFT_KEY, 0)
    return () => {
      writeStorage(LOCAL_STORAGE_SCROLL_LEFT_KEY, current.scrollLeft)
    }
  }, [])

  React.useEffect(() => {
    function handleResize() {
      const { scrollLeft, offsetWidth, scrollWidth } = tableRef.current
      debouncedHandleScroll({ scrollLeft, offsetWidth, scrollWidth })
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      debouncedHandleScroll.cancel()
    }
  }, [debouncedHandleScroll])

  function scrollLeft() {
    tableRef.current.scrollBy({
      left: -SCROLL_BY,
      behavior: 'smooth',
    })
  }

  function scrollRight() {
    tableRef.current.scrollBy({
      left: SCROLL_BY,
      behavior: 'smooth',
    })
  }

  React.useImperativeHandle(ref, () => ({
    scrollLeft,
    scrollRight,
  }))
  const filteredMemberChangeTypes = useMemo(
    () =>
      memberChangeTypes.filter(mct =>
        visibleMemberChangeTypes.includes(mct.name),
      ),
    [memberChangeTypes, visibleMemberChangeTypes],
  )

  return (
    <div className="EmployerMatrixTable">
      <div
        className={classnames('shadow-borders-overlay', {
          left: !disableLeft && disableRight,
          right: !disableRight && disableLeft,
          'left-and-right': !disableLeft && !disableRight,
        })}
      />
      <table ref={tableRef} onScroll={onScroll}>
        <thead>
          <tr>
            <th />
            <th>
              <Row title={effectiveTooltip}>
                Effective
                <HelpIcon />
              </Row>
            </th>

            {benefitTypes.map(benefitType => (
              <th key={benefitType.key}>{benefitType.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredMemberChangeTypes.map(mct => {
            const lifeEventRulesRow = lifeEventRulesTableObject[mct.description]
            const effectiveDateMode = lifeEventRulesRow
              ? lifeEventRulesRow.effectiveDateMode
              : 'event_effective_date'

            return (
              <tr key={mct.description}>
                <td>{mct.description}</td>

                <td>
                  {variant === 'readonly' ? (
                    getEffectiveDateModeText(effectiveDateMode)
                  ) : (
                    <Select
                      id="effectiveDateMode"
                      className="edit-input"
                      disabled={!Boolean(lifeEventRulesRow)}
                      aria-label={`${mct.description} - Effective`}
                      value={effectiveDateMode}
                      style={{ width: 'unset' }}
                      onChange={event => {
                        const {
                          value: selectedEffectiveDateMode,
                        } = event.currentTarget
                        setEffectiveDateMode({
                          memberChangeTypeId: mct.id,
                          memberChangeTypeName: mct.name,
                          memberChangeTypeDescription: mct.description,
                          effectiveDateMode: selectedEffectiveDateMode,
                        })
                      }}
                    >
                      <option value="event_effective_date">
                        {getEffectiveDateModeText('event_effective_date')}
                      </option>
                      <option value="event_effective_date_plus_30days">
                        {getEffectiveDateModeText(
                          'event_effective_date_plus_30days',
                        )}
                      </option>
                      <option value="event_effective_date_plus_60days">
                        {getEffectiveDateModeText(
                          'event_effective_date_plus_60days',
                        )}
                      </option>

                      <option value="first_of_following_month">
                        {getEffectiveDateModeText('first_of_following_month')}
                      </option>
                      <option value="first_of_following_month_plus_30days">
                        {getEffectiveDateModeText(
                          'first_of_following_month_plus_30days',
                        )}
                      </option>
                      <option value="first_of_following_month_plus_60days">
                        {getEffectiveDateModeText(
                          'first_of_following_month_plus_60days',
                        )}
                      </option>
                    </Select>
                  )}
                </td>

                {benefitTypes.map(benefitType => {
                  const benefitIsEnabled =
                    lifeEventRulesRow &&
                    lifeEventRulesRow.benefitTypes[benefitType.key]

                  const inputProps = {
                    'aria-label': `${mct.description} + ${benefitType.title}`,
                  }

                  return variant === 'readonly' ? (
                    <td key={benefitType.key}>
                      {benefitIsEnabled ? <FatCheck /> : <X />}
                    </td>
                  ) : (
                    <td key={benefitType.key}>
                      <Checkbox
                        align="center"
                        name={`employerMatrixItem--${mct.name}-${
                          benefitType.key
                        }`}
                        checked={benefitIsEnabled}
                        title={inputProps['aria-label']}
                        inputProps={inputProps}
                        onChange={event => {
                          const { checked: isEnabled } = event.currentTarget
                          setBenefit({
                            memberChangeTypeId: mct.id,
                            memberChangeTypeName: mct.name,
                            memberChangeTypeDescription: mct.description,
                            benefitTypeName: benefitType.key,
                            benefitTypeTitle: benefitType.title,
                            isEnabled,
                            effectiveDateMode,
                          })
                        }}
                      />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="scroll-button" style={{ top: scrollButtonsTopPosition }}>
        <ScrollButton
          disableLeft={disableLeft}
          onClickLeft={scrollLeft}
          disableRight={disableRight}
          onClickRight={scrollRight}
        />
      </div>
    </div>
  )
}

export default forwardRef<EmployerMatrixTableRef, Props>(EmployerMatrixTable)

function getEffectiveDateModeText(
  effectiveDateMode: EffectiveDateMode,
): string {
  if (effectiveDateMode === 'event_effective_date') {
    return localize('dateOfLifeEvent')
  }
  if (effectiveDateMode === 'event_effective_date_plus_30days') {
    return localize('dateOfLifeEventPlus30days')
  }
  if (effectiveDateMode === 'event_effective_date_plus_60days') {
    return localize('dateOfLifeEventPlus60days')
  }

  if (effectiveDateMode === 'first_of_following_month') {
    return localize('firstOfMonthFollowingLifeEventDate')
  }
  if (effectiveDateMode === 'first_of_following_month_plus_30days') {
    return localize('firstOfMonthFollowingLifeEventDatePlus30days')
  }
  if (effectiveDateMode === 'first_of_following_month_plus_60days') {
    return localize('firstOfMonthFollowingLifeEventDatePlus60days')
  }

  exhaustiveCheckFail(effectiveDateMode)
}

function writeStorage<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function readStorage<T>(key: string, defaultValue: T): T {
  try {
    return JSON.parse(window.localStorage.getItem(key)) as T
  } catch (error) {
    return defaultValue
  }
}

function FatCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="18"
      height="18"
      viewBox="0 0 24 24"
    >
      <defs>
        <path
          id="fat-check-path-id"
          d="M18.94 5.94a1.5 1.5 0 0 1 2.12 2.12l-11 11a1.5 1.5 0 0 1-2.12 0l-5-5a1.5 1.5 0 0 1 2.12-2.12L9 15.878l9.94-9.94z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="fat-check-mask-id" fill="#fff">
          <use href="#fat-check-path-id" />
        </mask>
        <use fill="#000" fillRule="nonzero" href="#fat-check-path-id" />
        <g fill="#1b6376" mask="url(#fat-check-mask-id)">
          <path d="M0 0h24v24H0z" />
        </g>
      </g>
    </svg>
  )
}
function HelpIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g fill="none" fillRule="evenodd">
        <path fill="#5DB9D1" d="M19 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0" />
        <g fill="#FFF">
          <path d="M11.78 8c-1.278 0-2.093.538-2.732 1.494a.282.282 0 0 0 .063.381l.814.617c.122.093.295.07.39-.05.419-.53.706-.839 1.343-.839.479 0 1.071.308 1.071.773 0 .35-.29.531-.762.796-.552.31-1.281.694-1.281 1.656v.094c0 .155.126.281.281.281h1.313a.281.281 0 0 0 .28-.281v-.031c0-.667 1.95-.695 1.95-2.5C14.51 9.03 13.1 8 11.78 8zM11.623 14.5a1.08 1.08 0 0 0 0 2.156 1.08 1.08 0 0 0 0-2.156z" />
        </g>
      </g>
    </svg>
  )
}

function X() {
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
          id="x-path"
          d="M13.414 12l5.293 5.293a1 1 0 0 1-1.414 1.414L12 13.414l-5.293 5.293a1 1 0 1 1-1.414-1.414L10.586 12 5.293 6.707a1 1 0 0 1 1.414-1.414L12 10.586l5.293-5.293a1 1 0 0 1 1.414 1.414L13.414 12z"
        />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="x-mask" fill="#fff">
          <use href="#x-path" />
        </mask>
        <use fill="#000" fillRule="nonzero" href="#x-path" />
        <g fill="#cccfd8" mask="url(#x-mask)">
          <path d="M0 0h24v24H0z" />
        </g>
      </g>
    </svg>
  )
}
