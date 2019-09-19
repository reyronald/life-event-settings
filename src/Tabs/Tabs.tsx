import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import './Tabs.scss'

type Props = {
  defaultActiveKey: string
  className?: string
  variant: 'primary' | 'secondary'
}

export default class Tabs extends React.Component<Props> {
  static displayName = 'Tabs'

  static Tab = Tab

  static propTypes = {
    defaultActiveKey: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    variant: PropTypes.oneOf(['primary', 'secondary', 'unstyled']),
  }

  static defaultProps = {
    variant: 'primary',
  }

  state = {
    activeKey: this.props.defaultActiveKey,
  }

  handleTabClick = activeKey => () => this.setState({ activeKey })

  render() {
    const { activeKey } = this.state
    const {
      children,
      className,
      variant,
      defaultActiveKey,
      ...rest
    } = this.props
    const classes = classnames('mui-Tabs', `Tabs--${variant}`, className)
    return (
      <div className={classes} {...rest}>
        <div className="Tabs--tabs">
          {React.Children.map(children, (child, index) => {
            return React.cloneElement(child, {
              ...{ active: activeKey === child.key, tabIndex: index },
              onClick: this.handleTabClick(child.key),
            })
          })}
        </div>

        {React.Children.map(children, child => {
          if (child.key === activeKey) {
            const { className, title, ...rest } = child.props
            const classes = classnames('Tabs--tab-content', className)
            return (
              <div className={classes} {...rest} role="tabpanel">
                {child.props.children}
              </div>
            )
          }
        })}
      </div>
    )
  }
}

type TabProps = {
  active?: boolean
  title: string
  subtitle?: string
  className?: string
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  children: React.ReactNode
}

function Tab({
  active,
  title,
  subtitle,
  onClick,
  className,
  ...rest
}: TabProps) {
  const classes = classnames(
    'Tabs--tab',
    {
      'Tabs--tab--active': active,
    },
    className,
  )
  return (
    <div
      {...rest}
      className={classes}
      onClick={onClick}
      title={title}
      role="tab"
      aria-selected={active}
    >
      <div className="Tabs--tab-title">{title}</div>
      <div className="Tabs--tab-subtitle">{subtitle}</div>
    </div>
  )
}

Tab.displayName = 'Tabs.Tab'
