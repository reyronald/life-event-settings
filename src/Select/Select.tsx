import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export default class Select extends React.Component {
  static displayName = 'Select'

  static propTypes = {
    children: PropTypes.node,
    autoResize: PropTypes.bool,
  }

  static defaultProps = {
    autoResize: false,
  }

  node = null

  componentDidMount() {
    this.autoResize()
  }

  onChange = (...args) => {
    const { onChange } = this.props

    if (typeof onChange === 'function') {
      onChange(...args)
    }

    this.autoResize()
  }

  autoResize = () => {
    const { autoResize } = this.props

    if (autoResize) {
      const checkedOption = this.node.querySelector(':checked')

      if (checkedOption) {
        const select = document.createElement('select')
        const option = document.createElement('option')
        option.appendChild(document.createTextNode(checkedOption.innerHTML))
        select.appendChild(option)

        select.className = this.node.className
        select.style.cssText = getComputedStyle(this.node).cssText
        select.style.width = 'auto'
        select.style.position = 'absolute'
        select.style.top = '-9999px'
        select.style.left = '-9999px'

        document.body.appendChild(select)

        this.node.style.width = `${select.offsetWidth}px`

        document.body.removeChild(select)
      } else {
        this.node.style.width = 'auto'
      }
    }
  }

  setRef = el => (this.node = el)

  render() {
    const { children, autoResize, ...otherProps } = this.props
    const className = classnames('mui-select', otherProps.className)

    return (
      <select
        {...otherProps}
        className={className}
        ref={this.setRef}
        onChange={this.onChange}
      >
        {children}
      </select>
    )
  }
}
