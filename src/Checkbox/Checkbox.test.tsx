import * as React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Checkbox, { Props } from './Checkbox'

describe('Checkbox', () => {
  const defaultProps: Props = {
    name: 'name',
    label: 'label',
    align: 'left',
    checked: false,
  }

  it('input should be unchecked with defaultChecked={undefined}', () => {
    const { getByLabel } = render(<Checkbox {...defaultProps} />)
    expect(getByLabel('label').checked).toBe(false)
  })

  it('input should be checked with checked={true}', () => {
    const { getByLabel } = render(
      <Checkbox {...defaultProps} checked={true} onChange={() => {}} />,
    )
    expect(getByLabel('label').checked).toBe(true)
  })

  it('should call onChange when input is checked', () => {
    const onChange = jest.fn()
    const { getByLabel } = render(
      <Checkbox {...defaultProps} onChange={onChange} />,
    )

    fireEvent.change(getByLabel('change'))

    expect(onChange).toHaveBeenCalled()
  })

  it('should not call onChange when input is disabled', () => {
    const onChange = jest.fn()
    const { getByLabel } = render(
      <Checkbox {...defaultProps} disabled onChange={onChange} />,
    )

    fireEvent.change(getByLabel('change'))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('should not call onChange when notAllowed={true}', () => {
    const onChange = jest.fn()
    const { getByLabel } = render(
      <Checkbox {...defaultProps} notAllowed onChange={onChange} />,
    )

    fireEvent.change(getByLabel('change'))

    expect(onChange).not.toHaveBeenCalled()
  })
})
