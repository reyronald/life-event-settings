import * as React from 'react'
import * as classnames from 'classnames'
import './Checkbox.scss'

export type Props = {
  align: 'left' | 'center'
  notAllowed?: boolean
  disabled?: boolean
  noBorder?: boolean
  name: string
  checked: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  label?: React.ReactNode
  secondaryLabel?: React.ReactNode
  className?: string
  inputProps?: {}
}

Checkbox.defaultProps = {
  align: 'left',
  checked: false,
}

Checkbox.displayName = 'Checkbox'

export default function Checkbox({
  align,
  notAllowed,
  disabled,
  noBorder,
  name,
  checked,
  onChange,
  label,
  secondaryLabel,
  className,
  inputProps,
  ...rest
}: Props) {
  return (
    <div
      className={classnames(
        'mui-checkbox-v2',
        {
          'mui-checkbox__align-center': align === 'center',
          'mui-checkbox__not-allowed-pointer': notAllowed,
          'mui-checkbox__disabled': disabled,
          'mui-checkbox__no-border': noBorder,
        },
        className,
      )}
      {...rest}
    >
      <label htmlFor={name}>
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={disabled || notAllowed ? () => {} : onChange}
          disabled={disabled}
          {...inputProps}
        />
        <span className="mui-checkbox--checkmark" />
        {Boolean(label || secondaryLabel) && (
          <div className="mui-checkbox--labels-container">
            <div className="mui-checkbox--primary-label">{label}</div>
            {secondaryLabel && (
              <div
                className={classnames('mui-checkbox--secondary-label', {
                  'mui-checkbox--secondary-label__visible': checked,
                })}
              >
                {secondaryLabel}
              </div>
            )}
          </div>
        )}
      </label>
    </div>
  )
}
