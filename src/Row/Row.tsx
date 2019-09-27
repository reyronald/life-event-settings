import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default function Row(props) {
  const {
    distribution,
    align,
    valign,
    children,
    className,
    ...otherProps
  } = props

  otherProps.className = classnames('mui-row', className, {
    [`mui-row__${distribution}`]: distribution,
    [`mui-row__${align}`]: align,
    [`mui-row__${valign}`]: valign,
  })

  return <div {...otherProps}>{children}</div>
}

Row.displayName = 'Row'

Row.propType = {
  distribution: PropTypes.oneOf(['around', 'between']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  valign: PropTypes.oneOf(['top', 'middle', 'bottom']),
}

Row.Cell = function(props) {
  const { as, grow, shrink, children, className, ...otherProps } = props

  otherProps.className = classnames('mui-row--cell', className, {
    'mui-row--cell__grow': grow,
    'mui-row--cell__shrink': shrink,
  })

  const Component = as || 'div'

  return <Component {...otherProps}>{children}</Component>
}

Row.Cell.displayName = 'Row.Cell'

Row.Cell.propTypes = {
  as: PropTypes.func,
  grow: PropTypes.bool,
  shrink: PropTypes.bool,
  children: PropTypes.node,
}
